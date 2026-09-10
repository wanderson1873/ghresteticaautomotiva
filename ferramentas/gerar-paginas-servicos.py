# -*- coding: utf-8 -*-
"""Gera /servicos/<slug>/index.html para cada serviço de data/services.js.

Rode este script sempre que acrescentar ou renomear um serviço em
assets/js/data/services.js:

    python ferramentas/gerar-paginas-servicos.py

Ele cria a pasta e a página de cada serviço com título, descrição e imagem de
compartilhamento preenchidos. O conteúdo da página continua vindo do
services.js em tempo de execução — o arquivo gerado é apenas a casca.
"""
import os
import re
import sys
from urllib.parse import quote

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import config

ROOT = config.RAIZ
os.chdir(ROOT)

src = open('assets/js/data/services.js', encoding='utf-8').read()

def campos(bloco):
    def g(k):
        m = re.search(k + r":\s*'((?:[^'\\]|\\.)*)'", bloco)
        return m.group(1) if m else ''
    return dict(slug=g('slug'), nome=g('nome'), categoria=g('categoria'),
                resumo=g('resumo'), imagem=g('imagem'))

blocos = re.findall(r"\{\s*slug:.*?\n  \}", src, re.S)
servicos = [campos(b) for b in blocos]
print('%d serviços encontrados' % len(servicos))

# cidade e numero saem de data/business.js — mesma fonte que o site usa
biz = open('assets/js/data/business.js', encoding='utf-8').read()


def _biz(chave, padrao=''):
    m = re.search(chave + r":\s*'([^']*)'", biz)
    return m.group(1) if m else padrao


CIDADE = _biz('cidade', 'Coronel Fabriciano')
ZAP = _biz('whatsapp')


B = '../../'

# Versão do ?v= e domínio saem os dois de ferramentas/config.py. O domínio
# ficava escrito no template: regerar as páginas depois de trocar de domínio
# desfazia a troca em oito arquivos de uma vez.
V = config.versao()
D = config.DOMINIO

TPL = '''<!DOCTYPE html>
<html lang="pt-BR" data-base="{B}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<script>
/* Marca que o JavaScript esta vivo. O CSS so esconde conteudo para animar
   dentro de `.js` — sem esta linha (script bloqueado, erro de rede, navegador
   antigo) o site aparece inteiro, estatico, em vez de ficar em branco. */
document.documentElement.className += ' js';
</script>

<!-- Título e descrição também são atualizados por services.js em tempo de
     execução: editar o serviço lá reflete aqui automaticamente. -->
<title>{nome} em {cidade} | GHR Estética Automotiva</title>
<meta name="description" content="{resumo}">
<link rel="canonical" href="{D}/servicos/{slug}/">

<meta name="theme-color" content="#07090c">
<link rel="icon" href="{B}assets/img/logo.svg" type="image/svg+xml">

<meta property="og:type" content="article">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="GHR Estética Automotiva">
<meta property="og:title" content="{nome} em {cidade} | GHR Estética Automotiva">
<meta property="og:description" content="{resumo}">
<meta property="og:url" content="{D}/servicos/{slug}/">
<meta property="og:image" content="{D}/assets/img/gallery/{imagem}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{nome} em {cidade} | GHR Estética Automotiva">
<meta name="twitter:description" content="{resumo}">
<meta name="twitter:image" content="{D}/assets/img/gallery/{imagem}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap">
<link rel="stylesheet" href="{B}assets/css/style.css?v={V}">
<link rel="preload" as="image" type="image/webp" href="{B}assets/img/gallery/w1440/{webp}" fetchpriority="high">
</head>

<body data-page="servicos">
<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
<div class="progress" data-progress></div>

<noscript>
  <!-- Header, rodape e menu sao montados por JavaScript. Com o script
       desligado, esta e a navegacao do site: links reais, endereco e WhatsApp. -->
  <nav class="noscript-nav" aria-label="Navegacao sem JavaScript">
    <a href="{B}">Home</a>
    <a href="{B}servicos/">Servicos</a>
    <a href="{B}fotos/">Fotos</a>
    <a href="{B}parcerias/">Parcerias</a>
    <a href="{B}contato/">Contato</a>
    <a href="https://wa.me/{zap}" target="_blank" rel="noopener"><strong>Falar no WhatsApp</strong></a>
    <span>GHR Estetica Automotiva &middot; {cidade}</span>
  </nav>
</noscript>

<div data-c="header"></div>

<main id="conteudo">

  <section class="phero">
    <div class="phero__bg">
      <picture>
        <source data-svc-src type="image/webp" srcset="{B}assets/img/gallery/w1440/{webp} 1440w">
        <img data-svc-bg src="{B}assets/img/gallery/{imagem}" alt="" fetchpriority="high" width="1440" height="1440">
      </picture>
    </div>
    <div class="wrap">
      <nav class="crumbs" aria-label="Você está aqui">
        <a href="{B}">Home</a> <span aria-hidden="true">/</span>
        <a href="{B}servicos/">Serviços</a> <span aria-hidden="true">/</span>
        <span>{nome}</span>
      </nav>
      <span class="eyebrow" data-svc-cat>{categoria}</span>
      <h1 style="margin-top:1.1rem" data-svc-titulo>{nome}</h1>
      <p class="lead" data-svc-resumo>{resumo}</p>
    </div>
  </section>

  <section class="section bg-paper">
    <div class="wrap">
      <!-- Conteúdo montado a partir de assets/js/data/services.js -->
      <div data-c="service-detail" data-servico="{slug}"></div>
    </div>
  </section>

  <section class="section section--tight bg-paper" style="padding-top:0">
    <div class="wrap">
      <div class="cta" data-reveal>
        <div class="cta__body">
          <h2>Seu carro merece esse cuidado.</h2>
          <p>Fale com a equipe e combine o melhor horário para o seu veículo.</p>
          <div class="cta__actions">
            <a class="btn btn--lg btn--wa" data-wa data-msg="Olá! Vim pelo site da GHR e tenho interesse em {nome}."
               href="{wa}" target="_blank" rel="noopener">Falar no WhatsApp</a>
            <a class="btn btn--lg btn--ghost" href="{B}servicos/">Ver todos os serviços</a>
          </div>
        </div>
        <div class="cta__media">
          <picture>
            <source type="image/webp" srcset="{B}assets/img/gallery/w720/ghr-208.webp 720w, {B}assets/img/gallery/w1440/ghr-208.webp 1440w" sizes="(max-width:900px) 100vw, 45vw">
            <img src="{B}assets/img/gallery/ghr-208.jpg" alt="Veículo finalizado na GHR Estética Automotiva" loading="lazy" width="1440" height="1440">
          </picture>
        </div>
      </div>
    </div>
  </section>

</main>

<div data-c="footer"></div>

<script src="{B}assets/js/site.js?v={V}"></script>
</body>
</html>
'''

for s in servicos:
    pasta = os.path.join('servicos', s['slug'])
    os.makedirs(pasta, exist_ok=True)
    msg = 'Olá! Vim pelo site da GHR e tenho interesse em %s.' % s['nome']
    wa = 'https://wa.me/%s?text=%s' % (ZAP, quote(msg, safe=''))
    open(os.path.join(pasta, 'index.html'), 'w', encoding='utf-8').write(
        TPL.format(B=B, V=V, D=D, cidade=CIDADE, wa=wa, zap=ZAP,
                   webp=s['imagem'].replace('.jpg', '.webp'), **s))
    print('  /servicos/%s/' % s['slug'])
