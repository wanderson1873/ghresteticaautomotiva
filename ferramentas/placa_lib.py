# -*- coding: utf-8 -*-
"""
placa_lib.py — aplica a arte da placa GHR sobre a placa real das fotos.

A ideia nao e "colar um adesivo": a arte e deformada em perspectiva para os 4
cantos da placa da foto e depois recebe a mesma iluminacao, o mesmo desfoque e
o mesmo grao do trecho original, de forma que o resultado nao pareca montagem.

Uso tipico (ver aplicar-placas.py):
    from placa_lib import aplicar
    aplicar('ghr-108', [(503,797),(869,791),(872,903),(505,910)])
"""
from PIL import Image, ImageFilter
import numpy as np
import os

RAIZ  = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTE  = os.path.join(RAIZ, 'assets', 'img', 'placa-ghr.png')


# --------------------------------------------------------------------------
def _homografia(dst, src):
    """Coeficientes PIL (mapeiam saida -> entrada) do quadrilatero dst para src."""
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.asarray(A, float), np.asarray(B, float))


def _gauss(a, sigma):
    """Desfoque gaussiano separavel em float (o Pillow nao aceita modo F)."""
    if sigma <= 0.05:
        return a.astype(np.float32)
    r = max(1, int(round(sigma * 3)))
    x = np.arange(-r, r + 1, dtype=np.float32)
    k = np.exp(-(x ** 2) / (2 * sigma * sigma)); k /= k.sum()
    out = a.astype(np.float32)
    for eixo in (0, 1):
        pad = [(0, 0)] * out.ndim
        pad[eixo] = (r, r)
        t = np.pad(out, pad, mode='edge')
        acc = np.zeros_like(out)
        for i, w in enumerate(k):
            sl = [slice(None)] * out.ndim
            sl[eixo] = slice(i, i + out.shape[eixo])
            acc += w * t[tuple(sl)]
        out = acc
    return out


def _blur_mascarado(canal, mascara, sigma):
    """Desfoque que so considera pixels dentro da mascara (evita puxar o fundo)."""
    m = mascara.astype(np.float32)
    return _gauss(canal * m, sigma) / np.maximum(_gauss(m, sigma), 1e-4)


# --------------------------------------------------------------------------
def aplicar(origem, cantos, destino=None, *,
            branco=None,       # cor do "branco" da placa; None = medir da foto
            luz=0.85,          # 0..1  quanto da iluminacao original e transferida
            desfoque=None,     # sigma do blur; None = estimar pela largura da placa
            grao=None,         # desvio do ruido; None = medir da foto
            pena=1.2,          # suavizacao da borda, em pixels
            brilho=1.0,        # ajuste fino de exposicao da placa
            margem=-0.03,      # <0 alarga o quadrilatero (garante que nada da placa antiga sobre)
            remendos=(),       # retangulos a reconstruir fora da placa (sobras da edicao antiga)
            borda=0.10,        # escurecimento sutil da moldura da placa (0 = sem)
            recorte=None,      # (x0,y0,x1,y1): so pinta dentro deste retangulo
            arte=ARTE):
    """cantos = [(x,y)] em SUP-ESQ, SUP-DIR, INF-DIR, INF-ESQ, em pixels da foto."""
    im = Image.open(origem).convert('RGB')
    W, H = im.size
    q = np.asarray(cantos, float)

    if margem:
        c = q.mean(axis=0)
        q = c + (q - c) * (1.0 - margem)

    art = Image.open(arte).convert('RGB')
    aw, ah = art.size

    # --- recorte de trabalho: so a vizinhanca da placa -----------------------
    pad = int(max(12, 0.25 * np.ptp(q[:, 0])))
    x0 = max(0, int(q[:, 0].min()) - pad); x1 = min(W, int(q[:, 0].max()) + pad)
    y0 = max(0, int(q[:, 1].min()) - pad); y1 = min(H, int(q[:, 1].max()) + pad)
    rw, rh = x1 - x0, y1 - y0
    ql = q - [x0, y0]

    # --- deformacao em perspectiva da arte ---------------------------------
    coef = _homografia(ql, [(0, 0), (aw, 0), (aw, ah), (0, ah)])
    warp = art.transform((rw, rh), Image.PERSPECTIVE, coef, Image.BICUBIC)
    msk = Image.new('L', (aw, ah), 255).transform((rw, rh), Image.PERSPECTIVE, coef, Image.BICUBIC)

    if recorte:
        cx0, cy0, cx1, cy1 = recorte
        corte = np.zeros((rh, rw), np.float32)
        corte[max(0, int(cy0 - y0)):max(0, int(cy1 - y0)),
              max(0, int(cx0 - x0)):max(0, int(cx1 - x0))] = 1.0
        msk = Image.fromarray((np.asarray(msk, np.float32) * corte).astype(np.uint8), 'L')

    reg = np.asarray(im.crop((x0, y0, x1, y1)), np.float32)
    art_f = np.asarray(warp, np.float32) / 255.0
    m = np.asarray(msk, np.float32) / 255.0
    dentro = m > 0.75
    if dentro.sum() < 20:
        raise ValueError('quadrilatero pequeno demais em ' + str(origem))

    lado = float(np.hypot(*(q[1] - q[0])))

    # --- cor do branco da placa (a placa original ja e clara) ---------------
    if branco is None:
        lum = reg[..., :3].mean(axis=2)
        alvo = np.percentile(lum[dentro], 88)
        sel = dentro & (lum >= alvo * 0.94)
        branco = reg[sel].mean(axis=0) if sel.sum() > 10 else np.array([210., 210., 210.])
    branco = np.asarray(branco, np.float32) * brilho

    # --- campo de luz: baixa frequencia do trecho original ------------------
    lum = reg[..., :3].mean(axis=2)
    base = _blur_mascarado(lum, dentro, max(2.0, lado * 0.16))
    ref = np.percentile(base[dentro], 70)
    campo = np.clip(base / max(ref, 1e-3), 0.45, 1.5)
    campo = 1.0 + (campo - 1.0) * luz

    # --- aresta da placa: as placas reais tem a borda levemente rebaixada ----
    if borda > 0:
        e = np.ones((ah, aw), np.float32)
        b1 = max(1, int(ah * 0.045)); b2 = max(1, int(ah * 0.015))
        e[:b1, :] = e[-b1:, :] = 1 - borda * 0.45
        e[:, :int(aw * 0.012)] = e[:, -int(aw * 0.012):] = 1 - borda * 0.45
        e[:b2, :] = e[-b2:, :] = 1 - borda
        e[:, :b2] = e[:, -b2:] = 1 - borda
        e = _gauss(e, max(1.0, ah * 0.012))
        eimg = Image.fromarray((e * 255).astype(np.uint8), 'L')
        ew = np.asarray(eimg.transform((rw, rh), Image.PERSPECTIVE, coef, Image.BICUBIC), np.float32) / 255.0
        ew = np.where(dentro, ew, 1.0)
    else:
        ew = 1.0

    novo = art_f * branco[None, None, :] * campo[..., None] * (ew[..., None] if borda > 0 else 1.0)

    # --- desfoque igual ao da foto -----------------------------------------
    if desfoque is None:
        desfoque = float(np.clip(lado / 260.0, 0.35, 2.2))
    if desfoque > 0.05:
        novo = np.asarray(Image.fromarray(np.clip(novo, 0, 255).astype(np.uint8))
                          .filter(ImageFilter.GaussianBlur(desfoque)), np.float32)

    # --- grao medido no trecho original ------------------------------------
    if grao is None:
        suave = _gauss(lum, 1.4)
        grao = float(np.clip(np.std((lum - suave)[dentro]), 0.6, 6.0))
    if grao > 0:
        rng = np.random.default_rng(abs(hash(str(origem))) % (2 ** 31))
        novo = novo + rng.normal(0, grao, novo.shape)

    # --- borda suave e composicao ------------------------------------------
    if pena > 0:
        m = np.asarray(Image.fromarray((m * 255).astype(np.uint8))
                       .filter(ImageFilter.GaussianBlur(pena)), np.float32) / 255.0
    a = m[..., None]
    saida = np.clip(reg * (1 - a) + np.clip(novo, 0, 255) * a, 0, 255).astype(np.uint8)

    im.paste(Image.fromarray(saida), (x0, y0))
    if remendos:
        im = remendar(im, remendos, semente=abs(hash(str(origem))) % (2 ** 31))
    if destino:
        im.save(destino, quality=95, subsampling=0)
    return im


# --------------------------------------------------------------------------
def remendar(im, rects, *, largura=8, pena=2.0, grao=None, semente=0):
    """Apaga sobras (sombra/letra da edicao antiga) que ficaram FORA da placa.

    Cada retangulo e reconstruido interpolando horizontalmente as colunas
    limpas a esquerda e a direita — funciona bem em para-choques, onde os
    detalhes correm na horizontal.
    """
    a = np.asarray(im.convert('RGB'), np.float32)
    H, W, _ = a.shape
    rng = np.random.default_rng(semente)
    for (x0, y0, x1, y1) in rects:
        x0, y0, x1, y1 = int(x0), int(y0), int(x1), int(y1)
        le = max(0, x0 - largura); ri = min(W, x1 + largura)
        if le >= x0 or ri <= x1:
            continue
        esq = a[y0:y1, le:x0].mean(axis=1, keepdims=True)
        dir_ = a[y0:y1, x1:ri].mean(axis=1, keepdims=True)
        n = x1 - x0
        t = np.linspace(0, 1, n, dtype=np.float32)[None, :, None]
        novo = esq * (1 - t) + dir_ * t

        alvo = a[y0:y1, x0:x1]
        s_ = grao if grao is not None else float(np.clip(np.std(a[y0:y1, le:x0]) * 0.5, 0.8, 5.0))
        novo = novo + rng.normal(0, s_, novo.shape)

        m = np.ones((y1 - y0, n), np.float32)
        if pena > 0:
            m = _gauss(np.pad(m, int(pena * 3) + 1), pena)[int(pena * 3) + 1: int(pena * 3) + 1 + (y1 - y0),
                                                           int(pena * 3) + 1: int(pena * 3) + 1 + n]
            m = np.clip(m / max(m.max(), 1e-6), 0, 1)
        a[y0:y1, x0:x1] = alvo * (1 - m[..., None]) + np.clip(novo, 0, 255) * m[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
