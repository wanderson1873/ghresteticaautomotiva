# -*- coding: utf-8 -*-
"""Gera as páginas de serviço a partir de ferramentas/servicos.py.

    python ferramentas/gerar-paginas-servicos.py

Saem prontas, em HTML completo (o Google lê tudo sem depender de JavaScript):
    servicos/index.html            lista por blocos, com seletor de porte P/M/G
    servicos/<slug>/index.html     página de cada serviço
    assets/js/data/services.js     cópia dos dados para menu, rodapé, home e
                                   formulário (gerado — não edite à mão)

Endereço, telefone e cidade vêm de assets/js/data/business.js (a mesma fonte
dos componentes JS); domínio, versão e IDs de medição, de config.py.
Rode de novo depois de editar servicos.py, business.js ou config.py.
Depois de trocar fotos: gerar-webp.py antes deste.
"""
import html
import json
import os
import re
import sys
from urllib.parse import quote

from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config
import medicao
from servicos import BLOCOS, FAQ_BUSCA, PORTES, PRECOS_PROVISORIOS, SERVICOS

RAIZ = config.RAIZ
D = config.DOMINIO
V = config.versao()
GALERIA = os.path.join(RAIZ, 'assets', 'img', 'gallery')
TITULO_BLOCO = dict(BLOCOS)
ESC = html.escape


# ------------------------------------------------------------- dados da empresa
def _empresa():
    src = open(os.path.join(RAIZ, 'assets', 'js', 'data', 'business.js'), encoding='utf-8').read()

    def g(chave):
        m = re.search(r"\b" + chave + r":\s*'([^']*)'", src)
        return m.group(1) if m else ''

    geo = re.search(r"geo:\s*\{\s*lat:\s*([-\d.]+),\s*lng:\s*([-\d.]+)", src)
    area = re.search(r"areaAtendida:\s*\[([^\]]*)\]", src)
    return {
        'nome': g('nome'), 'whatsapp': g('whatsapp'), 'telefone': g('telefone'),
        'rua': g('rua'), 'bairro': g('bairro'), 'cidade': g('cidade'), 'uf': g('uf'),
        'cep': g('cep'), 'instagram': g('instagram'), 'placeId': g('placeId'),
        'lat': geo.group(1) if geo else '', 'lng': geo.group(2) if geo else '',
        'area': re.findall(r"'([^']+)'", area.group(1)) if area else [],
    }


E = _empresa()
CIDADE = E['cidade']
MAPA = ('https://www.google.com/maps/search/?api=1&query=%s&query_place_id=%s'
        % (quote(E['nome'] + ' ' + E['rua'] + ', ' + E['cidade']), E['placeId']))


def wa(msg):
    return 'https://wa.me/%s?text=%s' % (E['whatsapp'], quote(msg, safe=''))


def msg_servico(nome):
    return 'Olá! Vim pelo site da GHR e tenho interesse em %s. Pode me passar mais informações?' % nome


MSG_PADRAO = 'Olá! Vim pelo site da GHR e gostaria de mais informações.'


# ----------------------------------------------------------------------- fotos
_dims = {}


def dims(arquivo):
    if arquivo not in _dims:
        with Image.open(os.path.join(GALERIA, arquivo)) as im:
            _dims[arquivo] = im.size
    return _dims[arquivo]


def pic(B, arquivo, alt, sizes, eager=False, cls=''):
    """<picture> com WebP 720 (e 1440 quando existir) e o JPG como fallback."""
    w, h = dims(arquivo)
    webp = arquivo[:-4] + '.webp'
    fontes = ['%sassets/img/gallery/w720/%s 720w' % (B, webp)]
    if os.path.exists(os.path.join(GALERIA, 'w1440', webp)):
        fontes.append('%sassets/img/gallery/w1440/%s 1440w' % (B, webp))
    carga = 'fetchpriority="high" decoding="async"' if eager else 'loading="lazy" decoding="async"'
    return ('<picture><source type="image/webp" srcset="%s" sizes="%s">'
            '<img src="%sassets/img/gallery/%s" alt="%s" width="%d" height="%d" %s%s></picture>'
            % (', '.join(fontes), sizes, B, arquivo, ESC(alt), w, h, carga,
               ' class="%s"' % cls if cls else ''))


# ---------------------------------------------------------------------- preços
def numero(preco):
    """'R$ 1.100' -> 1100.0 ; 'a partir de R$ 250' -> 250.0"""
    m = re.search(r'R\$\s*([\d.]+(?:,\d+)?)', preco or '')
    return float(m.group(1).replace('.', '').replace(',', '.')) if m else None


def preco_txt(s, porte):
    return s['precos'].get(porte) or 'sob consulta'


TARJA = '<span class="tarja-exemplo">valor de exemplo</span>'


def precos_pmg(s):
    """Os três portes lado a lado (página do serviço)."""
    itens = ''.join('<li><span>%s</span><b>%s</b></li>' % (rot, ESC(preco_txt(s, k)))
                    for k, rot in PORTES)
    return ('<div class="pmg"><ul class="pmg__lista" aria-label="Preço por porte do veículo">%s</ul>%s</div>'
            % (itens, TARJA if PRECOS_PROVISORIOS else ''))


def oferta_ld(s):
    if PRECOS_PROVISORIOS:
        return None
    valores = [numero(v) for v in s['precos'].values() if numero(v) is not None]
    if not valores:
        return None
    return {'@type': 'AggregateOffer', 'priceCurrency': 'BRL',
            'lowPrice': '%g' % min(valores), 'highPrice': '%g' % max(valores)}


# --------------------------------------------------------------------- JSON-LD
NEGOCIO_ID = D + '/#negocio'


def negocio_ld():
    ld = {
        '@type': 'AutoWash',
        '@id': NEGOCIO_ID,
        'name': E['nome'],
        'url': D + '/',
        'telephone': '+' + E['whatsapp'],
        'image': D + '/assets/img/gallery/ghr-v18-q.jpg',
        'logo': D + '/assets/img/logo.svg',
        'priceRange': '$$',
        'paymentAccepted': 'Cartão de crédito, Pix, Dinheiro',
        'address': {'@type': 'PostalAddress', 'streetAddress': E['rua'] + ' - ' + E['bairro'],
                    'addressLocality': E['cidade'], 'addressRegion': E['uf'],
                    'postalCode': E['cep'], 'addressCountry': 'BR'},
        'areaServed': [{'@type': 'City', 'name': c} for c in E['area']],
        'hasMap': MAPA,
        'sameAs': [E['instagram']],
        'openingHoursSpecification': [{
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            'opens': '08:00', 'closes': '18:00'}],
    }
    if E['lat']:
        ld['geo'] = {'@type': 'GeoCoordinates', 'latitude': float(E['lat']), 'longitude': float(E['lng'])}
    return ld


def faq_ld(perguntas):
    return {'@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': p, 'acceptedAnswer': {'@type': 'Answer', 'text': r}}
        for p, r in perguntas]}


def migalhas_ld(itens):
    return {'@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': D + u}
        for i, (n, u) in enumerate(itens)]}


def ld_script(grafo):
    texto = json.dumps({'@context': 'https://schema.org', '@graph': grafo},
                       ensure_ascii=False, indent=1)
    return '<script type="application/ld+json">\n%s\n</script>' % texto.replace('</', '<\\/')


# --------------------------------------------------------------------- moldura
def pagina(B, titulo, descricao, url, imagem_og, preload, ld, corpo):
    return '''<!DOCTYPE html>
<html lang="pt-BR" data-base="{B}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{med_head}
<script>document.documentElement.className += ' js';</script>

<!-- Página GERADA por ferramentas/gerar-paginas-servicos.py a partir de
     ferramentas/servicos.py. Edite lá e rode o script; mudanças feitas aqui
     somem na próxima geração. -->
<title>{titulo}</title>
<meta name="description" content="{descricao}">
<link rel="canonical" href="{D}{url}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="geo.region" content="BR-MG">
<meta name="geo.placename" content="{cidade}">
<meta name="theme-color" content="#07090c">
<link rel="icon" href="{B}assets/img/logo.svg" type="image/svg+xml">

<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="GHR Estética Automotiva">
<meta property="og:title" content="{titulo}">
<meta property="og:description" content="{descricao}">
<meta property="og:url" content="{D}{url}">
<meta property="og:image" content="{D}/assets/img/gallery/{imagem_og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{titulo}">
<meta name="twitter:description" content="{descricao}">
<meta name="twitter:image" content="{D}/assets/img/gallery/{imagem_og}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{B}assets/css/style.css?v={V}">
{preload}
{ld}
</head>

<body data-page="servicos">
<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
<div class="progress" data-progress></div>

<noscript>
  <nav class="noscript-nav" aria-label="Navegação sem JavaScript">
    <a href="{B}">Home</a>
    <a href="{B}servicos/">Serviços</a>
    <a href="{B}fotos/">Fotos</a>
    <a href="{B}parcerias/">Parcerias</a>
    <a href="{B}contato/">Contato</a>
    <a href="https://wa.me/{zap}" target="_blank" rel="noopener"><strong>Falar no WhatsApp</strong></a>
    <span>{nome_emp} &middot; {rua}, {bairro} &middot; {cidade} - {uf} &middot; {tel}</span>
  </nav>
</noscript>

<div data-c="header"></div>

<main id="conteudo">
{corpo}
</main>

<div data-c="footer"></div>

<script src="{B}assets/js/site.js?v={V}"></script>
{med_body}
</body>
</html>
'''.format(B=B, D=D, V=V, url=url, titulo=ESC(titulo), descricao=ESC(descricao),
           imagem_og=imagem_og, preload=preload, ld=ld, corpo=corpo,
           cidade=CIDADE, uf=E['uf'], rua=E['rua'], bairro=E['bairro'], tel=E['telefone'],
           nome_emp=E['nome'], zap=E['whatsapp'],
           med_head=medicao.head(), med_body=medicao.body())


def preload_capa(B, arquivo):
    webp = arquivo[:-4] + '.webp'
    pasta = 'w1440' if os.path.exists(os.path.join(GALERIA, 'w1440', webp)) else 'w720'
    return ('<link rel="preload" as="image" type="image/webp" href="%sassets/img/gallery/%s/%s" fetchpriority="high">'
            % (B, pasta, webp))


SETA = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" '
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>')
CHECK = ('<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>')
ZAP = ('<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4a.5.5 0 0 0 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>')
CARRO = ('<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
         'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 16v-3l2-4h10l2 4v3"/>'
         '<path d="M3.5 16h17"/><circle cx="7" cy="17.6" r="1.3"/><circle cx="17" cy="17.6" r="1.3"/></svg>')


def faixa_busca():
    return ('<p class="busca-entrega">%s<span><b>Buscamos e entregamos</b> em todo o Vale do Aço. '
            'Taxa conforme a distância.</span></p>' % CARRO)


# ------------------------------------------------------------------------ card
def card(B, s, h='h3', eager=False):
    """Card com foto 4:5. Preço com data-p/m/g para o seletor de porte."""
    dados = ' '.join('data-%s="%s"' % (k.lower(), ESC(preco_txt(s, k))) for k, _ in PORTES)
    return '''<article class="scard">
  <a class="scard__link" href="{B}servicos/{slug}/">
    <div class="scard__foto">{foto}</div>
    <div class="scard__corpo">
      <span class="scard__bloco">{bloco}</span>
      <{h} class="scard__nome">{nome}</{h}>
      <p class="scard__preco"><span class="scard__porte" data-porte-rotulo>Pequeno</span> <b data-preco {dados}>{preco}</b>{tarja}</p>
      <p class="scard__curto">{curto}</p>
      <span class="scard__mais">Ver detalhes {seta}</span>
    </div>
  </a>
</article>'''.format(
        B=B, slug=s['slug'], h=h, nome=ESC(s['nome']), curto=ESC(s['curto']),
        bloco=TITULO_BLOCO[s['bloco']], dados=dados, preco=ESC(preco_txt(s, 'P')),
        tarja=TARJA if PRECOS_PROVISORIOS else '', seta=SETA,
        foto=pic(B, s['capa'], s['capa_alt'], '(min-width:1100px) 400px, (min-width:700px) 46vw, 92vw',
                 eager=eager))


def seletor_porte():
    botoes = ''.join('<button type="button" data-porte="%s" aria-pressed="%s">%s</button>'
                     % (k.lower(), 'true' if k == 'P' else 'false', rot) for k, rot in PORTES)
    return ('<div class="porte" data-seletor-porte>'
            '<span class="porte__rotulo" id="porte-rotulo">Porte do veículo</span>'
            '<div class="porte__caixa" role="group" aria-labelledby="porte-rotulo">%s</div></div>' % botoes)


def faq_html(perguntas):
    return '<div class="faq">%s</div>' % ''.join(
        '<details class="faq__item"><summary>%s</summary><p>%s</p></details>' % (ESC(p), ESC(r))
        for p, r in perguntas)


def cta_final(B, titulo, texto, msg):
    return '''<section class="section section--tight bg-paper">
  <div class="wrap">
    <div class="cta-ghr">
      <h2>{titulo}</h2>
      <p>{texto}</p>
      <div class="cta-ghr__acoes">
        <a class="btn btn--lg btn--wa" href="{wa}" target="_blank" rel="noopener">{zap} Falar no WhatsApp</a>
        <a class="btn btn--lg btn--ghost" href="{mapa}" target="_blank" rel="noopener">Como chegar</a>
      </div>
      <p class="cta-ghr__end">{rua} – {bairro}, {cidade} - {uf}</p>
    </div>
  </div>
</section>'''.format(titulo=titulo, texto=texto, wa=ESC(wa(msg)), zap=ZAP, mapa=ESC(MAPA),
                     rua=E['rua'], bairro=E['bairro'], cidade=CIDADE, uf=E['uf'])


# ------------------------------------------------------------ /servicos/ (lista)
FAQ_GERAL = [
    FAQ_BUSCA,
    ('Como faço o orçamento?', 'Chame no WhatsApp com o modelo do carro e o que precisa. '
     'Se puder, mande uma foto: a equipe responde com valor e prazo.'),
    ('Quais as formas de pagamento?', 'Cartão de crédito, Pix e dinheiro.'),
    ('Qual o horário de atendimento?', 'De segunda a sábado, das 8h às 18h.'),
    ('Por que o preço muda com o porte?', 'Carro maior tem mais pintura e mais interior para '
     'trabalhar. Pequeno é hatch e sedã compacto; médio, sedã e SUV compacto; grande, SUV e picape.'),  # CONFIRMAR
]


def gerar_lista():
    B = '../'
    blocos = []
    primeiro = True
    for chave, titulo in BLOCOS:
        itens = [s for s in SERVICOS if s['bloco'] == chave]
        if not itens:
            continue
        cards = []
        for s in itens:
            cards.append(card(B, s, eager=primeiro))
            primeiro = False
        blocos.append('<section class="sbloco" aria-labelledby="bloco-%s">'
                      '<h2 class="sbloco__titulo" id="bloco-%s">%s</h2>'
                      '<div class="sgrid">%s</div></section>' % (chave, chave, titulo, ''.join(cards)))

    corpo = '''
  <section class="lhero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está aqui"><a href="../">Home</a> <span aria-hidden="true">/</span> <span>Serviços</span></nav>
      <h1>Serviços de estética automotiva em {cidade}</h1>
      <p class="lhero__lead">Lavagem, polimento, vitrificação e higienização. Escolha o porte e veja o valor.</p>
      {busca}
    </div>
  </section>

  <section class="section section--servicos bg-paper">
    <div class="wrap">
      {seletor}
      {blocos}
    </div>
  </section>

  <section class="section bg-soft">
    <div class="wrap wrap--estreito">
      <h2>Dúvidas frequentes</h2>
      {faq}
    </div>
  </section>

  {cta}
'''.format(cidade=CIDADE, busca=faixa_busca(), seletor=seletor_porte(), blocos='\n'.join(blocos),
           faq=faq_html(FAQ_GERAL),
           cta=cta_final(B, 'Não sabe qual escolher?', 'Mande uma foto do carro no WhatsApp. A gente indica o serviço certo.', MSG_PADRAO))

    lista_ld = {'@type': 'ItemList', 'name': 'Serviços da GHR Estética Automotiva',
                'itemListElement': [{'@type': 'ListItem', 'position': i + 1,
                                     'url': '%s/servicos/%s/' % (D, s['slug']), 'name': s['nome']}
                                    for i, s in enumerate(SERVICOS)]}
    ld = ld_script([negocio_ld(),
                    migalhas_ld([('Home', '/'), ('Serviços', '/servicos/')]),
                    lista_ld, faq_ld(FAQ_GERAL)])
    capa = SERVICOS[0]['capa']
    html_ = pagina(B, 'Serviços de Estética Automotiva em %s | GHR' % CIDADE,
                   'Lavagem, polimento técnico, vitrificação, cristalização e higienização em %s. '
                   'Preços por porte do carro. Buscamos e entregamos no Vale do Aço.' % CIDADE,
                   '/servicos/', 'ghr-v18-q.jpg', preload_capa(B, capa), ld, corpo)
    grava(os.path.join(RAIZ, 'servicos', 'index.html'), html_)


# --------------------------------------------------------- /servicos/<slug>/
def item_galeria(B, arquivo, alt, i):
    return ('<figure class="carrossel__item">%s</figure>'
            % pic(B, arquivo, alt, '(min-width:900px) 300px, 62vw'))


def item_video(B, slug, nome):
    return ('<figure class="carrossel__item carrossel__item--video">'
            '<video class="clipe" muted loop playsinline preload="none" width="540" height="960" '
            'poster="{B}assets/video/{slug}.jpg" data-src="{B}assets/video/{slug}.mp4" '
            'aria-label="Vídeo curto do trabalho de {nome} na GHR, sem som"></video>'
            '<figcaption>Vídeo · sem som</figcaption></figure>').format(B=B, slug=slug, nome=ESC(nome))


def gerar_servico(s):
    B = '../../'
    nome = s['nome']
    outros = [o for o in SERVICOS if o['slug'] != s['slug']]
    # primeiro os do mesmo bloco, depois o resto na ordem do arquivo
    outros.sort(key=lambda o: o['bloco'] != s['bloco'])

    galeria = []
    if s.get('video'):
        galeria.append(item_video(B, s['video'], nome))
    galeria += [item_galeria(B, a, alt, i) for i, (a, alt) in enumerate(s['galeria'])]

    passos = ''.join(
        '<li class="passos__item">%s<div><h3>%s</h3><p>%s</p></div></li>'
        % (('<div class="passos__foto">%s</div>' % pic(B, foto, titulo, '120px')) if foto else '',
           ESC(titulo), ESC(texto))
        for titulo, texto, foto in s['passos'])

    faq = s['faq'] + [FAQ_BUSCA]

    corpo = '''
  <section class="shero">
    <div class="wrap shero__grade">
      <nav class="crumbs shero__crumbs" aria-label="Você está aqui">
        <a href="{B}">Home</a> <span aria-hidden="true">/</span>
        <a href="{B}servicos/">Serviços</a> <span aria-hidden="true">/</span>
        <span>{nome}</span>
      </nav>
      <div class="shero__foto">{capa}</div>
      <div class="shero__texto">
        <span class="shero__bloco">{bloco}</span>
        <h1>{nome} em {cidade}</h1>
        <p class="shero__curto">{curto}</p>
        {precos}
        <a class="btn btn--lg btn--wa shero__btn" href="{wa}" target="_blank" rel="noopener">{zap} Pedir orçamento</a>
        {busca}
      </div>
    </div>
  </section>

  <section class="section section--tight bg-paper">
    <div class="wrap">
      <h2 class="sec-titulo">O que está incluso</h2>
      <ul class="inclui">{inclui}</ul>
    </div>
  </section>

  <section class="section section--tight bg-paper section--galeria">
    <div class="wrap">
      <h2 class="sec-titulo">Trabalhos na GHR</h2>
      <p class="sec-dica">Arraste para o lado</p>
    </div>
    <div class="carrossel" tabindex="0" aria-label="Fotos de {nome} na GHR">
      {galeria}
    </div>
  </section>

  <section class="section section--tight bg-soft">
    <div class="wrap">
      <h2 class="sec-titulo">Como funciona</h2>
      <ol class="passos">{passos}</ol>
    </div>
  </section>

  <section class="section section--tight bg-paper">
    <div class="wrap wrap--estreito">
      <h2 class="sec-titulo">Dúvidas sobre {nome_min}</h2>
      {faq}
    </div>
  </section>

  <section class="section section--tight bg-soft">
    <div class="wrap">
      <h2 class="sec-titulo">Outros serviços</h2>
    </div>
    <div class="carrossel carrossel--cards">{outros}</div>
  </section>

  {cta}
'''.format(B=B, nome=ESC(nome), nome_min=ESC(nome.lower() if nome != nome.upper() else nome),
           cidade=CIDADE, bloco=TITULO_BLOCO[s['bloco']], curto=ESC(s['curto']),
           capa=pic(B, s['capa'], s['capa_alt'], '(min-width:900px) 520px, 100vw', eager=True),
           precos=precos_pmg(s), wa=ESC(wa(msg_servico(nome))), zap=ZAP, busca=faixa_busca(),
           inclui=''.join('<li>%s%s</li>' % (CHECK, ESC(i)) for i in s['inclui']),
           galeria='\n      '.join(galeria), passos=passos, faq=faq_html(faq),
           outros=''.join(card(B, o) for o in outros),
           cta=cta_final(B, 'Quer %s no seu carro?' % ESC(nome.lower()),
                         'Mande o modelo no WhatsApp e receba o valor e o prazo.', msg_servico(nome)))

    servico_ld = {
        '@type': 'Service',
        '@id': '%s/servicos/%s/#servico' % (D, s['slug']),
        'name': nome,
        'serviceType': nome,
        'description': s['descricao'],
        'url': '%s/servicos/%s/' % (D, s['slug']),
        'image': ['%s/assets/img/gallery/%s' % (D, s['capa'])] +
                 ['%s/assets/img/gallery/%s' % (D, a) for a, _ in s['galeria'][:3]],
        'provider': {'@id': NEGOCIO_ID},
        'areaServed': [{'@type': 'City', 'name': c} for c in E['area']],
    }
    oferta = oferta_ld(s)
    if oferta:
        servico_ld['offers'] = oferta
    ld = ld_script([negocio_ld(), servico_ld,
                    migalhas_ld([('Home', '/'), ('Serviços', '/servicos/'),
                                 (nome, '/servicos/%s/' % s['slug'])]),
                    faq_ld(faq)])

    html_ = pagina(B, '%s em %s | GHR Estética Automotiva' % (nome, CIDADE), s['descricao'],
                   '/servicos/%s/' % s['slug'], s['capa'], preload_capa(B, s['capa']), ld, corpo)
    grava(os.path.join(RAIZ, 'servicos', s['slug'], 'index.html'), html_)


# ------------------------------------- JSON-LD da home e da página de contato
def atualizar_ld_paginas():
    """Os dados da empresa no JSON-LD da home e do contato saem da mesma
    função das páginas de serviço — nome, endereço e telefone iguais em todo
    o site (e iguais ao Perfil da Empresa no Google)."""
    for rel in ('index.html', 'contato/index.html'):
        caminho = os.path.join(RAIZ, rel)
        texto = open(caminho, encoding='utf-8').read()
        novo = re.sub(r'<script type="application/ld\+json">.*?</script>',
                      lambda m: ld_script([negocio_ld()]), texto, count=1, flags=re.S)
        if novo != texto:
            grava(caminho, novo)


# --------------------------------------------- assets/js/data/services.js
def gerar_js():
    itens = []
    for s in SERVICOS:
        itens.append({
            'slug': s['slug'], 'nome': s['nome'], 'categoria': TITULO_BLOCO[s['bloco']],
            'bloco': s['bloco'], 'resumo': s['curto'], 'descricao': s['descricao'],
            'imagem': s['capa'], 'altImagem': s['capa_alt'],
            # preço provisório não vai para os componentes JS (home, menu)
            'preco': None if PRECOS_PROVISORIOS else (s['precos'].get('P') and 'a partir de ' + s['precos']['P']),
            'destaque': s['destaque'],
        })
    js = '''/* =============================================================================
   SERVIÇOS — ARQUIVO GERADO. NÃO EDITE.
   -----------------------------------------------------------------------------
   Fonte: ferramentas/servicos.py  →  python ferramentas/gerar-paginas-servicos.py
   Usado pelo menu, rodapé, cards da home e formulário de contato. As páginas
   /servicos/ já saem em HTML pronto do mesmo script.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.services = %s;

GHR.blocos = %s;

GHR.getService = (slug) => GHR.services.find(s => s.slug === slug) || null;
GHR.destaques  = () => GHR.services.filter(s => s.destaque);
GHR.categorias = () => [...new Set(GHR.services.map(s => s.categoria))];
''' % (json.dumps(itens, ensure_ascii=False, indent=2),
       json.dumps([{'id': k, 'titulo': t} for k, t in BLOCOS], ensure_ascii=False))
    grava(os.path.join(RAIZ, 'assets', 'js', 'data', 'services.js'), js)


def grava(caminho, texto):
    os.makedirs(os.path.dirname(caminho), exist_ok=True)
    with open(caminho, 'w', encoding='utf-8', newline='\n') as f:
        f.write(texto)
    print('  ' + os.path.relpath(caminho, RAIZ).replace(os.sep, '/'))


def main():
    faltando = sorted({a for s in SERVICOS for a in [s['capa']] + [g for g, _ in s['galeria']]
                       if not os.path.exists(os.path.join(GALERIA, a))})
    if faltando:
        sys.exit('Fotos que não existem em assets/img/gallery/: ' + ', '.join(faltando) +
                 '\n(rode extrair-quadros.py antes)')
    gerar_lista()
    for s in SERVICOS:
        gerar_servico(s)
    gerar_js()
    atualizar_ld_paginas()
    if PRECOS_PROVISORIOS:
        print('\nATENÇÃO: preços de EXEMPLO (PRECOS_PROVISORIOS = True em servicos.py).')


if __name__ == '__main__':
    main()
