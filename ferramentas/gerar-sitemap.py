# -*- coding: utf-8 -*-
"""Gera o sitemap.xml a partir das rotas reais do site.

    python ferramentas/gerar-sitemap.py

O sitemap era escrito à mão e ficou desatualizado: /parcerias/ existia no menu,
no rodapé e como página publicada, mas não estava listado. Agora as rotas saem
de ferramentas/config.py (fixas + uma por serviço de ferramentas/servicos.py), então
acrescentar um serviço já entra no sitemap sozinho.

lastmod usa a data de modificação de cada index.html — não a data de hoje.
Carimbar tudo com a data atual a cada execução é sinal falso de atualização.
"""
import datetime
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

ROOT = config.RAIZ


def arquivo_da_rota(rota):
    return os.path.join(ROOT, rota.strip('/').replace('/', os.sep), 'index.html')


def main():
    linhas = ['<?xml version="1.0" encoding="UTF-8"?>',
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    faltando = []
    for rota in config.rotas():
        caminho = arquivo_da_rota(rota)
        if not os.path.exists(caminho):
            faltando.append(rota)
            continue
        data = datetime.date.fromtimestamp(os.path.getmtime(caminho)).isoformat()
        linhas += ['  <url>',
                   '    <loc>%s%s</loc>' % (config.DOMINIO, rota),
                   '    <lastmod>%s</lastmod>' % data,
                   '  </url>']

    linhas.append('</urlset>')
    linhas.append('')

    destino = os.path.join(ROOT, 'sitemap.xml')
    open(destino, 'w', encoding='utf-8').write('\n'.join(linhas))

    print('%d rotas no sitemap.xml' % (len(config.rotas()) - len(faltando)))
    for r in faltando:
        print('  AVISO: %s está nas rotas mas não tem index.html' % r)


if __name__ == '__main__':
    main()
