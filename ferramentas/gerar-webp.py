# -*- coding: utf-8 -*-
"""Gera as versões WebP usadas pelo site.

    python ferramentas/gerar-webp.py

Cria, para cada foto de assets/img/gallery/:

    assets/img/gallery/w720/<nome>.webp    miniatura (cards, galeria, mosaico)
    assets/img/gallery/w1440/<nome>.webp   só para as fotos grandes (hero,
                                           banner, capas de serviço)

O JPG original continua sendo o fallback e a imagem aberta no lightbox, então
navegadores antigos continuam funcionando normalmente.

Rodar de novo depois de editar uma foto atualiza o WebP correspondente: a
comparação é pela data de modificação do arquivo. Para refazer tudo do zero:

    python ferramentas/gerar-webp.py --rebuild

Requer Pillow:  pip install pillow
"""
import os
import re
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALERIA = os.path.join(ROOT, 'assets', 'img', 'gallery')

# Fotos que aparecem em tamanho grande (hero, banner, capas) — ganham 1440px.
GRANDES = [
    'ghr-143.jpg', 'ghr-209.jpg', 'ghr-093.jpg', 'ghr-120.jpg', 'ghr-187.jpg',
    'ghr-213.jpg', 'ghr-208.jpg', 'ghr-111.jpg', 'ghr-135.jpg', 'ghr-078.jpg',
    'ghr-089.jpg', 'ghr-090.jpg', 'ghr-092.jpg', 'ghr-168.jpg', 'ghr-195.jpg',
    'ghr-148.jpg', 'ghr-109.jpg', 'ghr-063.jpg', 'ghr-054.jpg', 'ghr-017.jpg',
    'ghr-118.jpg', 'ghr-029.jpg', 'ghr-099.jpg', 'ghr-111.jpg', 'ghr-097.jpg',
    'ghr-186.jpg', 'ghr-108.jpg', 'ghr-119.jpg',
    # entraram na curadoria de 09/2026:
    # ghr-210 e a etapa "Correcao" da home; as demais, o mosaico de resultados
    'ghr-210.jpg', 'ghr-017.jpg',
    # as quatro etapas da home entram com grande:true no GHR.pic
    'banco-hero.jpg', 'banco-faixa.jpg',
    'banco-etapa-01.jpg', 'banco-etapa-02.jpg',
    'banco-etapa-03.jpg', 'banco-etapa-04.jpg',
    'banco-vitrificacao.jpg', 'banco-quem-somos.jpg',
]


def capas_da_galeria():
    """Primeira foto de cada filtro de /fotos/.

    A galeria monta o primeiro card de cada filtro com grande=true, ou seja,
    pedindo a versao 1440. Sem isso o navegador leva 404 e cai no JPG cheio.
    Lendo de gallery.js a lista se ajusta sozinha quando a ordem muda.
    """
    caminho = os.path.join(ROOT, 'assets', 'js', 'data', 'gallery.js')
    if not os.path.exists(caminho):
        return []
    with open(caminho, encoding='utf-8') as f:
        texto = f.read()
    itens = re.findall(r"\{ src: '([^']+)', cat: '([^']+)'", texto)
    capas, vistas = [], set()
    for src, cat in itens:
        if cat not in vistas:
            vistas.add(cat)
            capas.append(src)
    return capas[:1] + capas          # a primeira tambem e a capa do filtro "todos"


def gerar(nome, largura, pasta, qualidade, refazer=False):
    """Gera o WebP se ele nao existir OU se o JPG for mais novo que ele.

    A versao anterior parava em `if os.path.exists(destino)`. Depois de editar
    uma foto, o JPG mudava e o WebP antigo continuava no lugar — e o navegador
    recebe o WebP, nao o JPG. O tratamento simplesmente nao chegava a tela.
    """
    destino_dir = os.path.join(GALERIA, pasta)
    os.makedirs(destino_dir, exist_ok=True)
    destino = os.path.join(destino_dir, nome.replace('.jpg', '.webp'))
    origem = os.path.join(GALERIA, nome)

    if os.path.exists(destino) and not refazer:
        if os.path.getmtime(destino) >= os.path.getmtime(origem):
            return 0
        print('  atualizando %s/%s (o JPG mudou)' % (pasta, os.path.basename(destino)))

    with Image.open(origem) as im:
        im = im.convert('RGB')
        if im.width > largura:
            altura = round(im.height * largura / im.width)
            im = im.resize((largura, altura), Image.LANCZOS)
        im.save(destino, 'WEBP', quality=qualidade, method=6)
    return os.path.getsize(destino)


def main():
    # --rebuild refaz tudo, mesmo o que ja esta em dia
    refazer = '--rebuild' in sys.argv

    fotos = sorted(f for f in os.listdir(GALERIA) if f.endswith('.jpg'))
    total = 0
    for nome in fotos:
        total += gerar(nome, 720, 'w720', 76, refazer)
    for nome in dict.fromkeys(GRANDES + capas_da_galeria()):
        if os.path.exists(os.path.join(GALERIA, nome)):
            total += gerar(nome, 1440, 'w1440', 74, refazer)

    if total:
        print('%d fotos verificadas — %.1f MB de WebP novo ou atualizado'
              % (len(fotos), total / 1048576))
    else:
        print('%d fotos verificadas — tudo ja estava em dia' % len(fotos))


if __name__ == '__main__':
    main()
