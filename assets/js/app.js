/* =============================================================================
   APP — inicialização e microinterações globais
   -----------------------------------------------------------------------------
   Carregado por último. Liga os componentes que existem em cada página e
   respeita  prefers-reduced-motion  em todos os efeitos de rolagem.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------- revelação ao rolar ---------------------------- */
GHR.revealObserver = null;

GHR.initReveal = function () {
  if (GHR.reduzMovimento || !('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-reveal], .masonry__item, .step')
      .forEach(el => el.classList.add('is-in'));
    return;
  }

  GHR.revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      obs.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  document.querySelectorAll('[data-reveal], .step').forEach(el => GHR.revealObserver.observe(el));
};

/** Registra um elemento criado depois (galeria paginada, por exemplo). */
GHR.observe = function (el) {
  if (!GHR.revealObserver) { el.classList.add('is-in'); return; }
  GHR.revealObserver.observe(el);
};

/* ------------------ headline que aparece linha a linha ------------------- */
GHR.initHeadlines = function () {
  document.querySelectorAll('[data-lines]').forEach(el => {
    if (GHR.reduzMovimento) { el.classList.add('is-in'); return; }
    if (!('IntersectionObserver' in window)) { el.classList.add('is-in'); return; }
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting) { el.classList.add('is-in'); io.disconnect(); }
    }, { threshold: 0.25 });
    io.observe(el);
  });
};

/* ----------------------- parallax leve do banner ------------------------- */
GHR.initParallax = function () {
  const alvos = document.querySelectorAll('[data-parallax]');
  if (!alvos.length || GHR.reduzMovimento) return;

  let rodando = false;
  const atualiza = () => {
    alvos.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const meio = r.top + r.height / 2 - innerHeight / 2;
      const f = parseFloat(el.dataset.parallax) || 0.12;
      el.style.transform = `translate3d(0, ${(-meio * f).toFixed(1)}px, 0)`;
    });
    rodando = false;
  };
  addEventListener('scroll', () => {
    if (rodando) return;
    rodando = true;
    requestAnimationFrame(atualiza);
  }, { passive: true });
  atualiza();
};

/* --------------------- barra de progresso da página ---------------------- */
GHR.initProgress = function () {
  const bar = document.querySelector('[data-progress]');
  if (!bar) return;
  const atualiza = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', atualiza, { passive: true });
  addEventListener('resize', atualiza);
  atualiza();
};

/* ------------------ rolagem suave para links internos -------------------- */
GHR.initAnchors = function () {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href === '#') return;
    const alvo = document.querySelector(href);
    if (!alvo) return;
    e.preventDefault();
    alvo.scrollIntoView({ behavior: GHR.reduzMovimento ? 'auto' : 'smooth', block: 'start' });

    /* Só rolar quebra o "Ir para o conteúdo": quem navega por teclado continua
       com o foco no link e o próximo Tab volta para o header. O destino precisa
       receber o foco de fato. tabindex="-1" o torna focável sem entrar na
       ordem de tabulação. */
    if (!alvo.hasAttribute('tabindex')) alvo.setAttribute('tabindex', '-1');
    alvo.focus({ preventScroll: true });

    /* mantém a URL com a âncora, como faria a navegação normal */
    if (history.replaceState) history.replaceState(null, '', href);
  });
};

/* -------------------- links de WhatsApp declarativos --------------------- */
/* <a data-wa data-msg="texto opcional">…</a> vira o link correto do WhatsApp. */
GHR.initWaLinks = function () {
  document.querySelectorAll('[data-wa]').forEach(a => {
    /* O HTML já traz um href de WhatsApp funcionando (para o caso de o JS não
       carregar). Aqui ele é reescrito a partir de data/business.js, que é a
       fonte única do número — assim trocar o número num lugar só continua
       valendo, sem deixar o link morto quando o script falha. */
    a.href = GHR.waLink(a.dataset.msg || '');
    a.target = '_blank';
    a.rel = 'noopener';

    /* data-icon="wa" põe o ícone antes do texto, sem SVG solto no HTML */
    if (a.dataset.icon && !a.querySelector('svg')) {
      a.insertAdjacentHTML('afterbegin', GHR.icon(a.dataset.icon, 18));
    }
  });
};

/* ------------------------------- boot ------------------------------------
   Cada componente é iniciado isoladamente. Antes era uma sequência direta: um
   erro em qualquer ponto (dado faltando, arquivo que não carregou, navegador
   antigo) interrompia tudo o que vinha depois — o menu quebrava e o rodapé, os
   botões de WhatsApp e o conteúdo abaixo simplesmente não apareciam.
   Agora a falha fica contida naquele componente e o resto da página monta.  */
GHR.boot = function () {
  const componentes = [
    'initHeader', 'initFooter', 'initMarquee',
    'initServices', 'initServiceDetail', 'initPorte', 'initClipes',
    'initScrollFeature', 'initDiferenciais', 'initProcesso', 'initEstofado',
    'initGallery',
    'initContactInfo', 'initContactForm', 'initHorarios', 'initMapa',
    'initPartnerPerfis', 'initPartnerEtapas', 'initPartnerForm',
    /* estes vêm por último: dependem do HTML que os anteriores criaram */
    'initWaLinks', 'initReveal', 'initHeadlines',
    'initParallax', 'initProgress', 'initAnchors', 'initMedicao'
  ];

  const falhas = [];
  componentes.forEach(nome => {
    const fn = GHR[nome];
    if (typeof fn !== 'function') { falhas.push(nome + ' (não carregou)'); return; }
    try {
      fn();
    } catch (e) {
      falhas.push(nome);
      console.error('GHR: falha em ' + nome, e);
    }
  });

  if (falhas.length) {
    console.warn('GHR: a página montou sem ' + falhas.join(', ') +
                 '. O restante do site continua funcionando.');
  }
};

/* Os scripts são inseridos por site.js, então o DOMContentLoaded pode já ter
   acontecido quando este arquivo executa — por isso a checagem. */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', GHR.boot);
} else {
  GHR.boot();
}
