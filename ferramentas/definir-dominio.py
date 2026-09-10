# -*- coding: utf-8 -*-
"""Troca o domínio usado nas tags canonical / OpenGraph e no sitemap.

Enquanto o domínio real não existe, o site usa o endereço provisório
https://ghresteticaautomotiva.com.br/ . Quando o domínio definitivo estiver
contratado, rode:

    python ferramentas/definir-dominio.py https://www.seudominio.com.br

O script atualiza todas as páginas HTML, o sitemap.xml, o robots.txt E o valor
de DOMINIO em ferramentas/config.py — que é de onde o gerador de páginas de
serviço lê o endereço. Sem esse último passo, rodar
`gerar-paginas-servicos.py` depois da troca desfazia o domínio novo em oito
arquivos, sem aviso nenhum.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

ROOT = config.RAIZ

# Pastas que nunca entram: material bruto, ferramentas e caches.
IGNORAR = {'ghr_esteticaautomotiva', '.git', '__pycache__', '_originais', 'publicar'}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)

    novo = sys.argv[1].rstrip('/')
    atual = config.DOMINIO
    if novo == atual:
        print('O domínio já é %s — nada a fazer.' % novo)
        return

    alterados = 0
    for pasta, subpastas, arquivos in os.walk(ROOT):
        subpastas[:] = [d for d in subpastas if d not in IGNORAR]
        for nome in arquivos:
            if not nome.endswith(('.html', '.xml', '.txt')):
                continue
            caminho = os.path.join(pasta, nome)
            texto = open(caminho, encoding='utf-8').read()
            if atual in texto:
                open(caminho, 'w', encoding='utf-8').write(texto.replace(atual, novo))
                alterados += 1
                print('  ' + os.path.relpath(caminho, ROOT))

    # a fonte única do domínio para as ferramentas
    cfg = os.path.join(ROOT, 'ferramentas', 'config.py')
    texto = open(cfg, encoding='utf-8').read()
    texto = re.sub(r"^DOMINIO = '[^']*'", "DOMINIO = '%s'" % novo, texto, flags=re.M)
    open(cfg, 'w', encoding='utf-8').write(texto)
    print('  ferramentas/config.py')

    print('%d arquivo(s) atualizado(s) para %s' % (alterados + 1, novo))
    print('Agora rode:  python ferramentas/gerar-paginas-servicos.py')
    print('             python ferramentas/gerar-sitemap.py')


if __name__ == '__main__':
    main()
