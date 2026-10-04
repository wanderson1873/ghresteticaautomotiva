# -*- coding: utf-8 -*-
"""Configuração compartilhada pelas ferramentas do site.

Existe para o domínio ter UM lugar só. Antes, `definir-dominio.py` trocava o
endereço em todos os HTML e no sitemap, mas o template de
`gerar-paginas-servicos.py` continuava com o domínio antigo escrito no código:
bastava regerar as páginas de serviço para o domínio voltar atrás em oito
arquivos, sem aviso.

Para trocar o domínio, rode:

    python ferramentas/definir-dominio.py https://www.seudominio.com.br

O script atualiza os arquivos publicados E o valor de DOMINIO aqui embaixo.
"""
import os
import re

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# --- domínio do site (sem barra no fim) -------------------------------------
# PROVISÓRIO enquanto o domínio definitivo não estiver contratado.
DOMINIO = 'https://ghresteticaautomotiva.com.br'

# --- modo demonstração -------------------------------------------------------
# True enquanto o site roda no endereço PROVISÓRIO, para mostrar ao cliente.
# Nesse modo o preparar-publicacao.py aceita os preços de exemplo, mas o pacote
# sai marcado para o Google NÃO indexar (noindex em todas as páginas e
# robots.txt bloqueando tudo) — nada de preço inventado nem página provisória
# na busca. No domínio definitivo: False, e a trava dos preços volta a valer.
DEMONSTRACAO = True

# --- medição (ver medicao.py) ------------------------------------------------
# Vazio = a ferramenta não entra no site. Depois de preencher, rode
# gerar-paginas-servicos.py e aplicar-medicao.py.
GTM_ID = ''          # Google Tag Manager, ex.: 'GTM-XXXXXXX'
CLARITY_ID = ''      # Microsoft Clarity, ex.: 'abcd1234ef'
PAINEL_CHAVE = ''    # chave do site na tabela `sites` do painel-trafego

# Rotas públicas do site, na ordem em que entram no sitemap.
# As páginas de serviço são acrescentadas a partir de data/services.js.
ROTAS_FIXAS = ['/', '/servicos/', '/fotos/', '/parcerias/', '/contato/']


def versao():
    """Mesmo número de ?v= usado por assets/js/site.js."""
    caminho = os.path.join(RAIZ, 'assets', 'js', 'site.js')
    with open(caminho, encoding='utf-8') as f:
        m = re.search(r"var VERSAO = '([^']+)';", f.read())
    return m.group(1) if m else '1'


def slugs_de_servicos():
    """Slugs dos serviços, na ordem de ferramentas/servicos.py (fonte única)."""
    from servicos import SERVICOS
    return [s['slug'] for s in SERVICOS]


def rotas():
    """Todas as rotas públicas: as fixas mais uma por serviço."""
    return ROTAS_FIXAS + ['/servicos/%s/' % s for s in slugs_de_servicos()]
