# -*- coding: utf-8 -*-
"""Ajuste automatico dos 4 cantos da placa dentro de uma caixa aproximada."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi
from scipy.spatial import ConvexHull


def quad_auto(caminho, caixa, *, limiar=0.55, sat_max=0.45, escuro=False, inclinacao=0.0):
    """caixa = (x0,y0,x1,y1) folgada em volta da placa.
    Devolve [(x,y)] em SUP-ESQ, SUP-DIR, INF-DIR, INF-ESQ."""
    im = Image.open(caminho).convert('RGB')
    x0, y0, x1, y1 = [int(v) for v in caixa]
    a = np.asarray(im.crop((x0, y0, x1, y1)), np.float32) / 255.0
    g = a.mean(axis=2)
    mx = a.max(axis=2); mn = a.min(axis=2)
    sat = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)

    lo, hi = np.percentile(g, 4), np.percentile(g, 96)
    corte = lo + limiar * (hi - lo)
    m = (g < corte) if escuro else (g > corte)
    m &= (sat < sat_max)
    # a tarja azul do padrao Mercosul tambem faz parte da placa
    azul = (a[..., 2] > a[..., 0] + 0.10) & (a[..., 2] > 0.18)
    m |= azul
    H, W = m.shape
    kh = max(3, int(H * 0.22)) | 1
    kw = max(3, int(W * 0.10)) | 1
    m = ndi.binary_closing(m, np.ones((kh, kw)))
    m = ndi.binary_fill_holes(m)
    lab, n = ndi.label(m)
    if n == 0:
        raise ValueError('nada encontrado em ' + str(caixa))
    tam = ndi.sum(m, lab, range(1, n + 1))
    m = lab == (int(np.argmax(tam)) + 1)

    ys, xs = np.nonzero(m)
    if len(xs) < 30:
        raise ValueError('mascara pequena demais em ' + str(caixa))

    def _reta(P, Q, frac=0.15):
        """Ajusta reta robusta (descarta pontas e outliers)."""
        P = np.asarray(P, float); Q = np.asarray(Q, float)
        k = np.argsort(P); P, Q = P[k], Q[k]
        n = len(P); ini = int(n * frac); fim = n - ini
        if fim - ini < 4:
            ini, fim = 0, n
        P, Q = P[ini:fim], Q[ini:fim]
        for _ in range(3):
            A = np.stack([P, np.ones_like(P)], 1)
            coef, *_ = np.linalg.lstsq(A, Q, rcond=None)
            r = Q - A @ coef
            manter = np.abs(r) <= max(1.0, 2.0 * np.std(r))
            if manter.sum() < 4:
                break
            P, Q = P[manter], Q[manter]
        return coef

    pts = np.stack([xs, ys], 1).astype(float)
    c = pts.mean(axis=0)
    if inclinacao == 'auto':
        # menor retangulo que envolve a mancha — bom para placas fotografadas tortas
        h = ConvexHull(pts); hp = pts[h.vertices]
        melhor = None
        for i in range(len(hp)):
            d = hp[(i + 1) % len(hp)] - hp[i]
            a = np.arctan2(d[1], d[0])
            cc, ss = np.cos(-a), np.sin(-a)
            rr_ = hp @ np.array([[cc, -ss], [ss, cc]]).T
            area = np.ptp(rr_[:, 0]) * np.ptp(rr_[:, 1])
            if melhor is None or area < melhor[0]:
                melhor = (area, a, rr_)
        _, a, rr_ = melhor
        u0, u1 = rr_[:, 0].min(), rr_[:, 0].max()
        v0, v1 = rr_[:, 1].min(), rr_[:, 1].max()
        cc, ss = np.cos(a), np.sin(a)
        Rb = np.array([[cc, -ss], [ss, cc]])
        cantos = [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
        if (u1 - u0) < (v1 - v0):                      # lado maior deve ser o "de cima"
            cantos = [(u1, v0), (u1, v1), (u0, v1), (u0, v0)]
        q = [tuple(np.array(pt) @ Rb.T + [x0, y0]) for pt in cantos]
        if q[1][0] < q[0][0]:                          # 0->1 tem de apontar para a direita
            q = q[2:] + q[:2]
        if q[3][1] < q[0][1]:                          # 0->3 tem de apontar para baixo
            q = [q[0], q[3], q[2], q[1]]
        return q
    if inclinacao is None:
        # eixo principal da mancha — acompanha placas fotografadas tortas
        _, _, V = np.linalg.svd(pts - c, full_matrices=False)
        ang = float(np.arctan2(V[0][1], V[0][0]))
        if abs(np.degrees(ang)) > 60:
            ang = 0.0
    else:
        ang = float(np.radians(inclinacao))
    co, si = np.cos(-ang), np.sin(-ang)
    R = np.array([[co, -si], [si, co]])
    r = (pts - c) @ R.T
    u = np.round(r[:, 0]).astype(int); v = r[:, 1]

    cols = np.unique(u)
    topo = np.array([v[u == k].min() for k in cols], float)
    base = np.array([v[u == k].max() for k in cols], float)
    lin = np.round(v).astype(int); linhas = np.unique(lin)
    esq = np.array([r[:, 0][lin == k].min() for k in linhas], float)
    dire = np.array([r[:, 0][lin == k].max() for k in linhas], float)

    rt = _reta(cols, topo); rb = _reta(cols, base)
    rl = _reta(linhas, esq); rr = _reta(linhas, dire)

    def _cruza(rh, rv):
        a, b = rh; cc, d = rv           # v = a*u + b ; u = cc*v + d
        vv = (a * d + b) / (1 - a * cc)
        return np.array([cc * vv + d, vv])

    Rin = np.array([[co, si], [-si, co]])
    q = [tuple((pp @ Rin) + c + [x0, y0])
         for pp in (_cruza(rt, rl), _cruza(rt, rr), _cruza(rb, rr), _cruza(rb, rl))]
    # ordena em SUP-ESQ, SUP-DIR, INF-DIR, INF-ESQ
    q = sorted(q, key=lambda p: p[1])
    cima = sorted(q[:2], key=lambda p: p[0])
    baixo = sorted(q[2:], key=lambda p: p[0])
    return [cima[0], cima[1], baixo[1], baixo[0]]
