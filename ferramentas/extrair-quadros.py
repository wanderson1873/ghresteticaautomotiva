# -*- coding: utf-8 -*-
"""Tira fotos dos vídeos do cenário novo, conforme ferramentas/quadros.py.

    python ferramentas/extrair-quadros.py            todos os quadros
    python ferramentas/extrair-quadros.py ghr-v05    só um

Para cada quadro:
  1. ffmpeg pega o quadro MAIS NÍTIDO entre t-0,3 s e t+0,3 s do vídeo
     (720x1280 do Instagram) — vídeo de celular tem muito quadro tremido;
  2. Real-ESRGAN (x4plus) amplia 4x e o resultado é reduzido para 1440x2560 —
     sai mais nítido e com menos artefato de compressão do que o vídeo;
  3. a placa é trocada pela arte GHR, se o quadro estiver em placas.py;
  4. o recorte 4:5 é feito a partir do quadro já sem placa.

A ampliação (o passo lento, ~15 s por quadro) fica guardada em
assets/img/gallery/_originais/quadros/ — pasta que nunca é publicada — e só é
refeita se o quadro mudar em quadros.py (`video` ou `t`) ou com --rebuild.
Depois rode gerar-webp.py.

Programas (grátis), uma vez só:
    winget install Gyan.FFmpeg
    Real-ESRGAN ncnn: github.com/xinntao/Real-ESRGAN/releases
                      (realesrgan-ncnn-vulkan-*-windows.zip), descompactado em
                      %USERPROFILE%/tools/realesrgan/  ou no caminho de REALESRGAN
"""
import glob
import importlib.util
import json
import os
import shutil
import subprocess
import sys
import tempfile

from PIL import Image, ImageFilter, ImageStat

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from placas import PLACAS
from quadros import QUADROS

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ACERVO = os.path.join(os.path.dirname(RAIZ), 'ghr_esteticaautomotiva')
GALERIA = os.path.join(RAIZ, 'assets', 'img', 'gallery')
CACHE = os.path.join(GALERIA, '_originais', 'quadros')

LARGURA, ALTURA = 1440, 2560
ALTURA_Q = LARGURA * 5 // 4          # 1800: recorte 4:5

REALESRGAN = os.environ.get('REALESRGAN') or os.path.join(
    os.path.expanduser('~'), 'tools', 'realesrgan', 'realesrgan-ncnn-vulkan.exe')


def ffmpeg():
    achado = shutil.which('ffmpeg')
    if achado:
        return achado
    # o winget só põe o ffmpeg no PATH de terminais abertos depois da instalação
    padrao = os.path.join(os.environ.get('LOCALAPPDATA', ''), 'Microsoft', 'WinGet',
                          'Packages', 'Gyan.FFmpeg*', 'ffmpeg-*', 'bin', 'ffmpeg.exe')
    achados = glob.glob(padrao)
    if not achados:
        sys.exit('ffmpeg não encontrado. Instale com: winget install Gyan.FFmpeg')
    return achados[0]


def video_de(trecho):
    achados = sorted(glob.glob(os.path.join(ACERVO, '*%s*.mp4' % trecho)))
    if len(achados) != 1:
        sys.exit('"%s" deveria achar 1 vídeo em %s, achou %d' % (trecho, ACERVO, len(achados)))
    return achados[0]


def nitidez(caminho):
    g = Image.open(caminho).convert('L').resize((360, 640))
    return ImageStat.Stat(g.filter(ImageFilter.FIND_EDGES)).var[0]


def quadro_mais_nitido(q, pasta):
    inicio = max(0.0, q['t'] - 0.3)
    subprocess.run([ffmpeg(), '-v', 'error', '-y', '-ss', str(inicio), '-t', '0.6',
                    '-i', video_de(q['video']), os.path.join(pasta, 'c%03d.png')], check=True)
    candidatos = glob.glob(os.path.join(pasta, 'c*.png'))
    if not candidatos:
        sys.exit('%s: nenhum quadro em t=%s do vídeo %s' % (q['nome'], q['t'], q['video']))
    return max(candidatos, key=nitidez)


def ampliado(q, rebuild):
    """Quadro 1440x2560 ampliado, vindo do cache quando possível."""
    os.makedirs(CACHE, exist_ok=True)
    destino = os.path.join(CACHE, q['nome'] + '.jpg')
    marca = os.path.join(CACHE, q['nome'] + '.json')
    chave = {'video': q['video'], 't': q['t'], 'v': 2}
    if not rebuild and os.path.exists(destino) and os.path.exists(marca):
        with open(marca, encoding='utf-8') as f:
            if json.load(f) == chave:
                return destino

    if not os.path.exists(REALESRGAN):
        sys.exit('Real-ESRGAN não encontrado em %s (veja o topo deste arquivo)' % REALESRGAN)

    with tempfile.TemporaryDirectory() as tmp:
        bruto = quadro_mais_nitido(q, tmp)
        x4 = os.path.join(tmp, 'x4.png')
        # o modelo x4plus só funciona com -s 4; com -s 2 sai em blocos trocados
        subprocess.run([REALESRGAN, '-i', bruto, '-o', x4, '-n', 'realesrgan-x4plus', '-s', '4'],
                       check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        im = Image.open(x4).convert('RGB').resize((LARGURA, ALTURA), Image.LANCZOS)
        im.save(destino, quality=95, subsampling=0)

    with open(marca, 'w', encoding='utf-8') as f:
        json.dump(chave, f)
    return destino


def aplicar_placas(nome):
    caminho = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'aplicar-placas.py')
    spec = importlib.util.spec_from_file_location('aplicar_placas', caminho)
    modulo = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(modulo)
    return modulo.aplicar_foto(nome, PLACAS[nome])


def processar(q, rebuild):
    base = ampliado(q, rebuild)
    inteiro = os.path.join(GALERIA, q['nome'] + '.jpg')
    origem_q = base

    if not q.get('so_q'):
        # aplicar_foto guarda o "original" em _originais/<nome>.jpg uma vez só;
        # renova essa cópia para a placa sempre ser aplicada sobre o quadro atual
        shutil.copy2(base, inteiro)
        guardado = os.path.join(GALERIA, '_originais', q['nome'] + '.jpg')
        if os.path.exists(guardado):
            os.remove(guardado)
        placas = aplicar_placas(q['nome']) if q['nome'] in PLACAS else 0
        origem_q = inteiro
    else:
        placas = 0
        if os.path.exists(inteiro):
            os.remove(inteiro)

    if q.get('y') is not None:
        y = max(0, min(q['y'], ALTURA - ALTURA_Q))
        Image.open(origem_q).crop((0, y, LARGURA, y + ALTURA_Q)).save(
            os.path.join(GALERIA, q['nome'] + '-q.jpg'), quality=92, subsampling=0)

    print('%-8s %s%s%s' % (q['nome'], '' if q.get('so_q') else '9:16 ',
                           '' if q.get('y') is None else '4:5 ',
                           '(%d placa)' % placas if placas else ''))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    rebuild = '--rebuild' in sys.argv
    alvos = [q for q in QUADROS if not args or q['nome'] in args]
    for q in alvos:
        processar(q, rebuild)
    print('\n%d quadros. Agora rode: python ferramentas/gerar-webp.py' % len(alvos))


if __name__ == '__main__':
    main()
