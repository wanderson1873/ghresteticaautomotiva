# -*- coding: utf-8 -*-
"""Gera os vídeos curtos das páginas de serviço (só vídeos de 2025 e 2026).

    python ferramentas/gerar-clipes.py

Para cada item de CLIPES cria em assets/video/:
    <nome>.mp4   H.264, 540 de largura, SEM áudio, poucos segundos (~1 MB)
    <nome>.jpg   primeiro quadro, usado como capa enquanto o vídeo não carrega

A página só baixa o vídeo quando ele aparece na tela (ver app.js).
Refaz um clipe só se ele não existir ou se o trecho mudar aqui (--rebuild
refaz todos). Trechos com legenda gravada por cima ficaram de fora.
"""
import glob
import json
import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACERVO = os.path.join(os.path.dirname(RAIZ), 'ghr_esteticaautomotiva')
DESTINO = os.path.join(RAIZ, 'assets', 'video')

# nome do clipe: (trecho do nome do vídeo, início em s, duração em s, recorte)
#   recorte  None, ou o crop do ffmpeg 'L:A:X:Y' em pixels do vídeo 720x1280 —
#            para tirar faixa preta ou uma placa cortada na borda do quadro.
# Os clipes entram nas páginas por 'videos' em servicos.py e na faixa de vídeos
# da home (VIDEOS_HOME em servicos.py). Conferido quadro a quadro: sem placa
# legível, sem legenda gravada e sem marca de terceiros.
CLIPES = {
    'lavagem-detalhada': ('2025-01-24', 18.0, 3.5, None),
    'polimento-tecnico': ('2025-04-10', 1.0, 7.0, None),
    'espelhamento':      ('2025-08-26', 2.0, 7.0, None),
    'vitrificacao':      ('2026-09-02', 14.0, 5.0, None),
    'cristalizacao':     ('2025-08-26', 9.5, 7.0, None),
    'higienizacao':      ('2026-09-02', 21.0, 8.0, None),
    # placa da traseira cortada no alto do quadro: o recorte tira essa faixa
    'limpeza-chassi':    ('2026-05-07', 14.0, 2.5, '720:1160:0:120'),
    # este trecho do vídeo tem faixas pretas em cima e embaixo: sai horizontal
    'limpeza-motor':     ('2025-04-10', 14.5, 4.0, '720:540:0:370'),
}


def ffmpeg():
    import shutil
    achado = shutil.which('ffmpeg')
    if achado:
        return achado
    padrao = os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Microsoft', 'WinGet',
                          'Packages', 'Gyan.FFmpeg*', 'ffmpeg-*', 'bin', 'ffmpeg.exe')
    achados = glob.glob(padrao)
    if not achados:
        sys.exit('ffmpeg não encontrado. Instale com: winget install Gyan.FFmpeg')
    return achados[0]


def main():
    rebuild = '--rebuild' in sys.argv
    os.makedirs(DESTINO, exist_ok=True)
    # registro do que já foi gerado — numa pasta que nunca é publicada
    marca_arq = os.path.join(RAIZ, 'assets', 'img', 'gallery', '_originais', 'clipes.json')
    os.makedirs(os.path.dirname(marca_arq), exist_ok=True)
    feitos = {}
    if os.path.exists(marca_arq):
        with open(marca_arq, encoding='utf-8') as f:
            feitos = json.load(f)

    for slug, (trecho, ini, dur, recorte) in CLIPES.items():
        mp4 = os.path.join(DESTINO, slug + '.mp4')
        jpg = os.path.join(DESTINO, slug + '.jpg')
        chave = [trecho, ini, dur, recorte]
        if not rebuild and feitos.get(slug) == chave and os.path.exists(mp4) and os.path.exists(jpg):
            print('%-20s em dia' % slug)
            continue
        achados = glob.glob(os.path.join(ACERVO, '*%s*.mp4' % trecho))
        if len(achados) != 1:
            sys.exit('"%s" deveria achar 1 vídeo, achou %d' % (trecho, len(achados)))
        subprocess.run([ffmpeg(), '-v', 'error', '-y', '-ss', str(ini), '-t', str(dur),
                        '-i', achados[0], '-an',
                        '-vf', ('crop=%s,' % recorte if recorte else '') + 'scale=540:-2',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '28',
                        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], check=True)
        subprocess.run([ffmpeg(), '-v', 'error', '-y', '-i', mp4, '-frames:v', '1',
                        '-q:v', '3', jpg], check=True)
        feitos[slug] = chave
        print('%-20s %.1f MB' % (slug, os.path.getsize(mp4) / 1048576))

    with open(marca_arq, 'w', encoding='utf-8') as f:
        json.dump(feitos, f, indent=1)


if __name__ == '__main__':
    main()
