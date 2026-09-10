# -*- coding: utf-8 -*-
"""Gera as artes de placa GHR a partir do PDF original do logo.

    python ferramentas/gerar-arte-placa.py

Cria em assets/img/:
    placa-ghr.png        400x130 mm (padrao carro), logo centralizado
    placa-ghr-moto.png   200x170 mm (padrao moto)
    placa-ghr-corte.png  igual a de carro, mas com o logo a 22% da esquerda —
                         usada nas fotos em que a placa e cortada pela borda
                         do quadro e o logo centralizado ficaria de fora
    placa-ghr-lisa.png   placa branca sem logo — para placas vistas quase de
                         perfil, em que so aparece um filete de alguns pixels
    logo-placa.png       o logo sozinho, azul solido com transparencia

Requer: pip install pillow numpy pypdfium2
"""
import os

import numpy as np
from PIL import Image

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(RAIZ, 'logo - GHR.pdf')
IMG = os.path.join(RAIZ, 'assets', 'img')
AZUL = (0, 82, 162)          # cor medida no PDF original


def logo_transparente():
    """Rasteriza o PDF e devolve o logo em azul solido com canal alfa."""
    import pypdfium2 as pdfium
    pagina = pdfium.PdfDocument(PDF)[0]
    im = pagina.render(scale=6).to_pil().convert('RGB')

    a = np.asarray(im)
    dentro = a.min(axis=2) < 240
    ys, xs = np.nonzero(dentro)
    im = im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))

    a = np.asarray(im).astype(np.float32)
    alfa = np.clip(255.0 - a.min(axis=2), 0, 255)
    rgb = np.broadcast_to(np.array(AZUL, np.float32), a.shape)
    return Image.fromarray(np.dstack([rgb, alfa]).astype(np.uint8), 'RGBA')


def placa(logo, largura, altura, destino, altura_logo=0.90, x=0.5):
    """Monta a placa branca com o logo em x (0=esquerda, 0.5=centro)."""
    lh = int(altura * altura_logo)
    lw = int(round(lh * logo.width / logo.height))
    if lw > largura * 0.94:
        lw = int(largura * 0.94)
        lh = int(round(lw * logo.height / logo.width))
    p = Image.new('RGBA', (largura, altura), (255, 255, 255, 255))
    p.alpha_composite(logo.resize((lw, lh), Image.LANCZOS),
                      (int(largura * x - lw / 2), (altura - lh) // 2))
    p.convert('RGB').save(destino, quality=95, subsampling=0)
    print(os.path.basename(destino), (largura, altura), 'logo', (lw, lh))


def main():
    logo = logo_transparente()
    logo.save(os.path.join(IMG, 'logo-placa.png'))
    placa(logo, 3000, 975, os.path.join(IMG, 'placa-ghr.png'))
    placa(logo, 3000, 975, os.path.join(IMG, 'placa-ghr-corte.png'), x=0.22)
    placa(logo, 1600, 1360, os.path.join(IMG, 'placa-ghr-moto.png'), altura_logo=0.86)
    Image.new('RGB', (1200, 390), (255, 255, 255)).save(
        os.path.join(IMG, 'placa-ghr-lisa.png'))
    print('placa-ghr-lisa.png (1200, 390) sem logo')


if __name__ == '__main__':
    main()
