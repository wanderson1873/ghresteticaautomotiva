# -*- coding: utf-8 -*-
"""Monta a pasta `publicar/` com APENAS o que vai para o servidor.

    python ferramentas/preparar-publicacao.py

Por que existe
--------------
A pasta do projeto tem, além do site, material que não deve ficar acessível
publicamente:

  ghr_esteticaautomotiva/            237 MB do acervo bruto do Instagram
  assets/img/gallery/_originais/     versões ANTERIORES à anonimização de placas
  ferramentas/                       scripts e caches
  logo - GHR.pdf                     arquivo de arte

Publicar a raiz inteira deixa tudo isso em endereços adivinháveis. `robots.txt`
não impede acesso — só pede para o buscador não indexar; quem digitar a URL
baixa o arquivo do mesmo jeito. A única garantia é não subir os arquivos.

Este script funciona por LISTA DE PERMISSÃO: nada entra sem estar previsto
aqui. Se um arquivo novo do site não aparecer em `publicar/`, é porque a regra
precisa ser acrescentada — o inverso (vazar sem querer) não acontece.

Depois de rodar, suba o conteúdo de `publicar/` — e só ele.
"""
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

ROOT = config.RAIZ
DESTINO = os.path.join(ROOT, 'publicar')

# ---------------------------------------------------------------- permitido --
ARQUIVOS_RAIZ = ['index.html', 'robots.txt', 'sitemap.xml']

PASTAS = [
    'assets/css',
    'assets/js',
    'assets/img',
    'assets/video',
    'contato',
    'fotos',
    'parcerias',
    'privacidade',
    'servicos',
]

# Dentro das pastas acima, nada disso entra.
PASTAS_PROIBIDAS = {'_originais', '__pycache__', '.git'}
EXTENSOES_PROIBIDAS = {'.py', '.pyc', '.pdf', '.md', '.psd', '.mp4', '.zip'}


def video_do_site(caminho_rel, nome):
    """Os clipes curtos de assets/video/ (gerar-clipes.py) são os únicos .mp4
    publicados — os vídeos brutos continuam proibidos em qualquer outro lugar."""
    return (caminho_rel.replace(os.sep, '/') == 'assets/video'
            and nome.lower().endswith('.mp4'))


def permitido(caminho_rel, nome):
    partes = caminho_rel.replace(os.sep, '/').split('/')
    if any(p in PASTAS_PROIBIDAS for p in partes):
        return False
    if video_do_site(caminho_rel, nome):
        return True
    if os.path.splitext(nome)[1].lower() in EXTENSOES_PROIBIDAS:
        return False
    if nome.startswith('.'):
        return False
    return True


def marcar_demonstracao():
    """Endereço provisório: nenhuma página entra no Google. Só o pacote é
    alterado — os arquivos do projeto continuam prontos para o domínio real."""
    import re
    with open(os.path.join(DESTINO, 'robots.txt'), 'w', encoding='utf-8', newline='\n') as f:
        f.write('# Site em demonstração (endereço provisório): nada deve ser indexado.\n'
                'User-agent: *\nDisallow: /\n')
    paginas = 0
    for dirpath, _, arquivos in os.walk(DESTINO):
        for nome in arquivos:
            if not nome.endswith('.html'):
                continue
            caminho = os.path.join(dirpath, nome)
            with open(caminho, encoding='utf-8') as f:
                html = f.read()
            html = re.sub(r'<meta name="robots"[^>]*>\n?', '', html)
            html = html.replace('<meta charset="utf-8">',
                                '<meta charset="utf-8">\n<meta name="robots" content="noindex, nofollow">', 1)
            with open(caminho, 'w', encoding='utf-8', newline='\n') as f:
                f.write(html)
            paginas += 1
    print('Demonstração: %d páginas com noindex e robots.txt bloqueando tudo.' % paginas)


def main():
    # Preço de exemplo não vai ao ar: o site mostraria um valor inventado.
    # Exceção: modo demonstração (endereço provisório, tudo com noindex).
    from servicos import PRECOS_PROVISORIOS
    if PRECOS_PROVISORIOS and config.DEMONSTRACAO:
        print('MODO DEMONSTRAÇÃO (config.DEMONSTRACAO = True): preços de exemplo liberados;\n'
              'o pacote sai com noindex e robots.txt bloqueando tudo.\n')
    elif PRECOS_PROVISORIOS and '--aceitar-precos-de-exemplo' not in sys.argv:
        sys.exit('ERRO: os preços em ferramentas/servicos.py ainda são de EXEMPLO '
                 '(PRECOS_PROVISORIOS = True).\n'
                 'Preencha os valores reais, troque para False '
                 'e rode gerar-paginas-servicos.py antes de publicar.')

    if os.path.exists(DESTINO):
        shutil.rmtree(DESTINO)
    os.makedirs(DESTINO)

    copiados = 0
    bytes_totais = 0

    for nome in ARQUIVOS_RAIZ:
        origem = os.path.join(ROOT, nome)
        if not os.path.exists(origem):
            print('  AVISO: %s não existe' % nome)
            continue
        shutil.copy2(origem, os.path.join(DESTINO, nome))
        copiados += 1
        bytes_totais += os.path.getsize(origem)

    ignorados = []
    for pasta in PASTAS:
        base = os.path.join(ROOT, pasta.replace('/', os.sep))
        if not os.path.isdir(base):
            print('  AVISO: pasta %s não existe' % pasta)
            continue
        for dirpath, dirnames, arquivos in os.walk(base):
            dirnames[:] = [d for d in dirnames if d not in PASTAS_PROIBIDAS]
            rel = os.path.relpath(dirpath, ROOT)
            for nome in arquivos:
                if not permitido(rel, nome):
                    ignorados.append(os.path.join(rel, nome))
                    continue
                destino_dir = os.path.join(DESTINO, rel)
                os.makedirs(destino_dir, exist_ok=True)
                origem = os.path.join(dirpath, nome)
                shutil.copy2(origem, os.path.join(destino_dir, nome))
                copiados += 1
                bytes_totais += os.path.getsize(origem)

    print('%d arquivos — %.1f MB em publicar/' % (copiados, bytes_totais / 1048576))
    if ignorados:
        print('%d arquivo(s) deixados de fora por regra:' % len(ignorados))
        for i in ignorados[:12]:
            print('  ' + i)
        if len(ignorados) > 12:
            print('  ... e mais %d' % (len(ignorados) - 12))

    # conferência final: o que não pode existir no pacote, de jeito nenhum
    proibidos = []
    for dirpath, _, arquivos in os.walk(DESTINO):
        for nome in arquivos:
            caminho = os.path.relpath(os.path.join(dirpath, nome), DESTINO)
            baixo = caminho.replace(os.sep, '/').lower()
            if '_originais' in baixo or 'ghr_esteticaautomotiva/' in baixo \
               or baixo.endswith('.py') or baixo.endswith('.pdf'):
                proibidos.append(caminho)
    if proibidos:
        print('\nERRO: material que não deveria estar no pacote:')
        for c in proibidos:
            print('  ' + c)
        sys.exit(1)

    if config.DEMONSTRACAO:
        marcar_demonstracao()

    print('\nConferido: sem originais, sem acervo bruto, sem scripts.')
    print('Suba o conteúdo de publicar/ — e só ele.')


if __name__ == '__main__':
    main()
