# -*- coding: utf-8 -*-
"""
Sobe a versão dos arquivos estáticos (CSS e JS) em todo o site.

POR QUE ISSO EXISTE
O navegador guarda CSS e JS em cache e costuma reaproveitar sem perguntar ao
servidor se mudou. Resultado: você altera o site, atualiza a página e continua
vendo a versão antiga. Colocando ?v=<numero> no fim de cada URL, uma versão
nova vira um endereço novo — e aí o navegador é obrigado a baixar de novo.

QUANDO RODAR
Depois de mexer em assets/css/style.css ou em qualquer arquivo de assets/js/.

    python ferramentas/bump-versao.py

Não precisa rodar ao mexer só em HTML: o navegador já revalida as páginas.
"""

import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
SITE_JS = RAIZ / 'assets' / 'js' / 'site.js'


def versao_atual():
    texto = SITE_JS.read_text(encoding='utf-8')
    m = re.search(r"var VERSAO = '([^']+)';", texto)
    if not m:
        sys.exit('Não achei "var VERSAO" em assets/js/site.js.')
    return m.group(1)


def paginas():
    """Todo index.html do site, incluindo as páginas de serviço geradas."""
    return sorted(
        p for p in RAIZ.rglob('*.html')
        if 'node_modules' not in p.parts and 'ghr_esteticaautomotiva' not in p.parts
    )


def main():
    atual = versao_atual()
    nova = str(int(atual) + 1) if atual.isdigit() else '1'

    # 1) o número dentro do carregador
    SITE_JS.write_text(
        SITE_JS.read_text(encoding='utf-8')
        .replace(f"var VERSAO = '{atual}';", f"var VERSAO = '{nova}';"),
        encoding='utf-8'
    )

    # 2) o CSS e o próprio site.js, que são chamados direto no HTML
    tocados = 0
    for pag in paginas():
        texto = pag.read_text(encoding='utf-8')
        novo = re.sub(r'(style\.css|site\.js)(\?v=[^"\']*)?', rf'\1?v={nova}', texto)
        if novo != texto:
            pag.write_text(novo, encoding='utf-8')
            tocados += 1

    print(f'Versao {atual} -> {nova}   ({tocados} paginas atualizadas)')
    print('Agora e so recarregar o site: o navegador vai buscar os arquivos novos.')


if __name__ == '__main__':
    main()
