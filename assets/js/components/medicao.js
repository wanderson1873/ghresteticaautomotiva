/* =============================================================================
   MEDIÇÃO — Microsoft Clarity, botões da página de privacidade e cliques de
   contato. Mesmo modelo do Lava Jato Beira Rio.
   -----------------------------------------------------------------------------
   O <head> de cada página (bloco medicao:head, gerado por
   ferramentas/medicao.py) já liga o Consent Mode e, com ID configurado, o
   Google Tag Manager. Aqui:
     • Clarity: carregado se window.GHR_CLARITY tiver ID e o visitante não
       tiver pedido para parar de medir;
     • "Parar de medir este aparelho" e "Não contar minhas visitas"
       (página /privacidade/);
     • cada clique em WhatsApp, telefone ou rota vira evento no dataLayer —
       o Tag Manager transforma em evento do GA4;
     • window.ptgOndeEsta: o contador próprio (s.derson.cloud/s.js) usa os
       mesmos nomes de lugar dos botões.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.initMedicao = function () {
  const parada = window.ghrMedicaoParada === true;

  /* ---------- Microsoft Clarity ---------- */
  if (!parada && window.GHR_CLARITY && !document.getElementById('clarity-ghr')) {
    window.clarity = window.clarity || function () {
      (window.clarity.q = window.clarity.q || []).push(arguments);
    };
    const tag = document.createElement('script');
    tag.id = 'clarity-ghr';
    tag.async = true;
    tag.src = 'https://www.clarity.ms/tag/' + window.GHR_CLARITY;
    document.head.appendChild(tag);
  }

  /* ---------- "Parar de medir este aparelho" ---------- */
  document.querySelectorAll('[data-medicao-parar]').forEach(btn => {
    if (parada) { btn.textContent = 'Este aparelho já não é medido'; btn.disabled = true; }
    btn.addEventListener('click', () => {
      try { localStorage.setItem('ghr-medicao', 'parado'); } catch (e) { /* modo anônimo */ }
      window.ghrMedicaoParada = true;
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied' });
      // apaga os cookies do Analytics (_ga, _ga_XXXX)
      const dominio = location.hostname.replace(/^www\./, '');
      document.cookie.split(';').forEach(par => {
        const nome = par.split('=')[0].trim();
        if (nome.indexOf('_ga') !== 0) return;
        ['', '; domain=' + dominio, '; domain=.' + dominio].forEach(d => {
          document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      });
      if (typeof window.clarity === 'function') { window.clarity('consent', false); window.clarity('stop'); }
      btn.textContent = 'Pronto: este aparelho não é mais medido';
      btn.disabled = true;
    });
  });

  /* ---------- "Não contar minhas visitas" (contador próprio) ---------- */
  document.querySelectorAll('[data-contador-sair]').forEach(btn => {
    let ignorado = false;
    try { ignorado = localStorage.getItem('ptg_ignorar') === '1'; } catch (e) { /* modo anônimo */ }
    if (ignorado) { btn.textContent = 'Suas visitas já não são contadas'; btn.disabled = true; }
    btn.addEventListener('click', () => {
      try { localStorage.setItem('ptg_ignorar', '1'); } catch (e) { /* modo anônimo */ }
      btn.textContent = 'Pronto: suas visitas não são mais contadas';
      btn.disabled = true;
    });
  });

  /* ---------- cliques de contato ---------- */
  const ondeEsta = (el) => {
    if (el.closest('.wa-float, .wa-flutuante')) return 'botao-flutuante';
    if (el.closest('.hdr, .drawer')) return 'menu-topo';
    if (el.closest('.shero, .hero, .phero, .lhero')) return 'topo-da-pagina';
    if (el.closest('.cta-ghr, .cta')) return 'chamada-final';
    if (el.closest('.scard')) return 'cartao-servico';
    if (el.closest('footer, .ftr')) return 'rodape';
    if (el.closest('form')) return 'formulario';
    return 'outro';
  };
  window.ptgOndeEsta = ondeEsta;

  const medir = (evento, dados) => {
    if (!window.dataLayer) return;
    window.dataLayer.push(Object.assign({ event: evento }, dados));
  };

  document.addEventListener('click', ev => {
    const link = ev.target.closest('a[href]');
    if (!link) return;
    const destino = link.getAttribute('href') || '';
    const base = { local: ondeEsta(link), pagina: document.title };
    if (destino.indexOf('wa.me') !== -1) medir('clique_whatsapp', base);
    else if (destino.indexOf('tel:') === 0) medir('clique_telefone', base);
    else if (/google\.[^/]+\/maps|maps\.app\.goo\.gl/.test(destino)) medir('clique_rota', base);
  });

  document.querySelectorAll('[data-seletor-porte]').forEach(sel => {
    sel.addEventListener('click', ev => {
      const btn = ev.target.closest('button[data-porte]');
      if (btn) medir('selecionou_porte', { porte: btn.dataset.porte, pagina: document.title });
    });
  });
};
