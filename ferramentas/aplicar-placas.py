# -*- coding: utf-8 -*-
"""Troca a placa real das fotos pela arte da placa GHR.

    python ferramentas/aplicar-placas.py            aplica em todas as fotos
    python ferramentas/aplicar-placas.py ghr-108    so numa foto

Os JPGs originais sao guardados uma unica vez em
assets/img/gallery/_originais/ e sao SEMPRE a base do processamento, entao o
script pode ser rodado quantas vezes for preciso sem empilhar edicoes.
Depois de rodar, apague os WebP correspondentes e rode gerar-webp.py.
"""
import os
import shutil
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import placa_lib
from detectar_quad import quad_auto
from placas import PLACAS

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GALERIA = os.path.join(RAIZ, 'assets', 'img', 'gallery')
ORIGINAIS = os.path.join(GALERIA, '_originais')


def aplicar_foto(nome, placas):
    origem = os.path.join(GALERIA, nome + '.jpg')
    guardado = os.path.join(ORIGINAIS, nome + '.jpg')
    os.makedirs(ORIGINAIS, exist_ok=True)
    if not os.path.exists(guardado):
        shutil.copy2(origem, guardado)

    tmp = origem + '.tmp.jpg'
    shutil.copy2(guardado, tmp)
    im = None
    for placa in placas:
        cantos = placa.get('quad') or quad_auto(tmp, placa['box'], **placa.get('det', {}))
        im = placa_lib.aplicar(tmp, [tuple(p) for p in cantos], **placa.get('op', {}))
        im.save(tmp, quality=98, subsampling=0)
    im.save(origem, quality=94, subsampling=0)
    os.remove(tmp)
    return len(placas)


def main():
    alvos = sys.argv[1:] or sorted(PLACAS)
    total = 0
    for nome in alvos:
        if nome not in PLACAS:
            print('  sem placa cadastrada: ' + nome)
            continue
        n = aplicar_foto(nome, PLACAS[nome])
        total += n
        print('%-10s %d placa(s)' % (nome, n))
    print('')
    print('%d fotos, %d placas trocadas.' % (len(alvos), total))
    print('Originais guardados em assets/img/gallery/_originais/')


if __name__ == '__main__':
    main()
