# -*- coding: utf-8 -*-
"""Medição do site: Google Tag Manager (GA4), Microsoft Clarity e o contador
próprio (painel-trafego, s.derson.cloud). Mesmo modelo do Lava Jato Beira Rio.

Os IDs ficam em config.py. Com o ID vazio, a ferramenta correspondente
simplesmente não entra na página — dá para publicar antes de criá-los.

Em cada página há dois blocos marcados, preenchidos por este módulo:
    <!-- medicao:head -->  ... <!-- /medicao:head -->   logo após o <meta viewport>
    <!-- medicao:body -->  ... <!-- /medicao:body -->   logo antes do </body>

As páginas de serviço já saem prontas de gerar-paginas-servicos.py. Nas
páginas escritas à mão, rode depois de mudar um ID:

    python ferramentas/aplicar-medicao.py
"""
import re

import config


def head():
    gtm = config.GTM_ID
    linhas = [
        '<!-- medicao:head -->',
        '<script>',
        '  // Medição liberada desde o primeiro carregamento, sem aviso de cookies (LGPD:',
        '  // legítimo interesse, explicado em /privacidade/). Fica desligada só se o',
        '  // visitante tocou em "Parar de medir este aparelho".',
        '  window.dataLayer = window.dataLayer || [];',
        '  function gtag(){dataLayer.push(arguments);}',
        "  try { window.ghrMedicaoParada = localStorage.getItem('ghr-medicao') === 'parado'; } catch (e) {}",
        "  gtag('consent', 'default', {",
        "    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',",
        "    analytics_storage: window.ghrMedicaoParada ? 'denied' : 'granted'",
        '  });',
        "  window.GHR_CLARITY = '%s';" % config.CLARITY_ID,
        '</script>',
    ]
    if gtm:
        linhas += [
            "<script>if(!window.ghrMedicaoParada)(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':",
            "new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],",
            "j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=",
            "'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);",
            "})(window,document,'script','dataLayer','%s');</script>" % gtm,
        ]
    linhas.append('<!-- /medicao:head -->')
    return '\n'.join(linhas)


def body():
    linhas = ['<!-- medicao:body -->']
    if config.GTM_ID:
        linhas.append('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=%s" '
                      'height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>'
                      % config.GTM_ID)
    if config.PAINEL_CHAVE:
        # O coletor descarta visitas de endereço diferente do domínio cadastrado:
        # testes locais e o endereço provisório do Easypanel não contam.
        linhas.append('<script src="https://s.derson.cloud/s.js" data-site="%s" defer></script>'
                      % config.PAINEL_CHAVE)
    linhas.append('<!-- /medicao:body -->')
    return '\n'.join(linhas)


def aplicar(html):
    """Põe (ou atualiza) os dois blocos numa página."""
    if '<!-- medicao:head -->' in html:
        html = re.sub(r'<!-- medicao:head -->.*?<!-- /medicao:head -->', lambda m: head(), html, flags=re.S)
    else:
        html = re.sub(r'(<meta name="viewport"[^>]*>\n)', lambda m: m.group(1) + head() + '\n', html, count=1)
    if '<!-- medicao:body -->' in html:
        html = re.sub(r'<!-- medicao:body -->.*?<!-- /medicao:body -->', lambda m: body(), html, flags=re.S)
    else:
        html = html.replace('</body>', body() + '\n</body>', 1)
    return html
