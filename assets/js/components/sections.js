/* =============================================================================
   SEÇÕES DA HOME — etapas com rolagem sticky, diferenciais e processo
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="scroll-feature"></div>   texto fixo + cards que passam ao lado
     <div data-c="diferenciais"></div>
     <div data-c="processo"></div>
   Conteúdo em assets/js/data/home.js.
   ========================================================================== */

window.GHR = window.GHR || {};

/* ------------------- seção com rolagem sticky (desktop) ------------------ */
GHR.initScrollFeature = function () {
  const mount = document.querySelector('[data-c="scroll-feature"]');
  if (!mount) return;

  /* Isto não é um conjunto de abas: os botões rolam a página até o cartão
     correspondente, que continua visível. Declarar role="tablist"/"tab" sem
     tabpanel e sem navegação por setas engana o leitor de tela. São botões de
     atalho — e é assim que são anunciados. */
  mount.innerHTML = `
    <nav class="sticky-index" aria-label="Ir para uma etapa do processo">
      ${GHR.etapas.map((e, i) => `
        <button type="button" data-goto="${i}" aria-controls="etapa-${i}"
                class="${i === 0 ? 'is-active' : ''}"><em>${e.n}</em> ${e.titulo}</button>`).join('')}
    </nav>`;

  const cards = document.querySelector('[data-c="scroll-cards"]');
  if (!cards) return;

  cards.className = 'sticky-cards';
  cards.innerHTML = GHR.etapas.map((e, i) => `
    <article class="sticky-card${i === 0 ? ' is-active' : ''}" id="etapa-${i}" data-card="${i}" data-reveal>
      ${GHR.pic({ src: e.imagem, alt: e.alt || (e.titulo + ' — etapa do processo de estética automotiva'),
                  grande: true, sizes: '(max-width:980px) 100vw, 55vw' })}
      <span class="sticky-card__n">${e.n}</span>
      <h3>${e.titulo}</h3>
      <p>${e.texto}</p>
      ${e.legenda ? `<span class="foto-nota">${e.legenda}</span>` : ''}
    </article>`).join('');

  const botoes = mount.querySelectorAll('[data-goto]');
  const artigos = cards.querySelectorAll('[data-card]');

  /* marca a etapa que está no centro da tela */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const i = Number(en.target.dataset.card);
      artigos.forEach((a, j) => a.classList.toggle('is-active', j === i));
      botoes.forEach((btn, j) => {
        btn.classList.toggle('is-active', j === i);
        btn.setAttribute('aria-current', j === i ? 'true' : 'false');
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  artigos.forEach(a => io.observe(a));

  botoes.forEach(btn => btn.addEventListener('click', () => {
    artigos[Number(btn.dataset.goto)].scrollIntoView({
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });
  }));
};

/* ----------------------------- diferenciais ----------------------------- */
GHR.initDiferenciais = function () {
  const mount = document.querySelector('[data-c="diferenciais"]');
  if (!mount) return;

  mount.className = 'feats';
  mount.innerHTML = GHR.diferenciais.map((d, i) => `
    <div class="feat" data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
      <span class="feat__ico">${GHR.icon(d.icone, 22)}</span>
      <h3>${d.titulo}</h3>
      <p>${d.texto}</p>
    </div>`).join('');
};

/* -------------------------------- processo ------------------------------- */
GHR.initProcesso = function () {
  const mount = document.querySelector('[data-c="processo"]');
  if (!mount) return;

  mount.className = 'steps';
  mount.innerHTML = GHR.processo.map((p, i) => `
    <div class="step" data-reveal style="--d:${(i * 0.1).toFixed(2)}s">
      <span class="step__n">${p.n}</span>
      <div>
        <h3>${p.titulo}</h3>
        <p>${p.texto}</p>
      </div>
    </div>`).join('');
};

/* -------------------- destaque: limpeza de estofado --------------------- */
GHR.initEstofado = function () {
  const mount = document.querySelector('[data-c="estofado"]');
  if (!mount) return;

  const fotos = GHR.estofado;

  mount.className = 'editorial';
  mount.innerHTML = fotos.map((f, i) => `
    <figure class="editorial__item${i === 0 ? ' editorial__item--big' : ''}" data-reveal style="--d:${(i * 0.06).toFixed(2)}s">
      <button type="button" data-lb-index="${i}" aria-label="Ampliar foto ${i + 1} de ${fotos.length}: ${f.alt}">
        ${GHR.pic({ src: f.src, alt: f.alt, grande: i === 0,
                    sizes: i === 0 ? '(max-width:820px) 100vw, 50vw' : '(max-width:820px) 50vw, 25vw' })}
        <span class="editorial__zoom">${GHR.icon('zoom', 18)}</span>
      </button>
    </figure>`).join('');

  GHR.bindLightbox(mount, fotos);

  /* lista do que entra no serviço */
  const itens = document.querySelector('[data-c="estofado-itens"]');
  if (itens) {
    itens.className = 'pill-list';
    itens.innerHTML = GHR.estofadoItens.map(i => `<li>${i}</li>`).join('');
  }
};
