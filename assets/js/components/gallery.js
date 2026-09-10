/* =============================================================================
   GALERIA
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="gallery" data-mode="preview"></div>  mosaico editorial da home
     <div data-c="gallery" data-mode="full"></div>     galeria completa + filtros
   As fotos e categorias saem de assets/js/data/gallery.js.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.galleryConfig = {
  lote: 24   // quantas fotos carregam por vez na página /fotos/
};

/* ---------------------------- mosaico da home ---------------------------- */
GHR.galleryPreview = function (mount) {
  /* usa a ordem definida em data/home.js; se ela não existir, cai para as
     fotos marcadas com top:true em data/gallery.js */
  const meta = (f) => GHR.gallery.find(g => g.src === f.src) || {};
  const fotos = (GHR.galleryHome || GHR.gallery.filter(g => g.top).slice(0, 5))
    .map(f => Object.assign({}, meta(f), f));

  mount.className = 'editorial';
  mount.innerHTML = fotos.map((g, i) => `
    <figure class="editorial__item${i === 0 ? ' editorial__item--big' : ''}" data-reveal style="--d:${(i * 0.06).toFixed(2)}s">
      <button type="button" data-lb-index="${i}" aria-label="Ampliar foto ${i + 1} de ${fotos.length}: ${GHR.galleryAlt(g)}">
        ${GHR.pic({ src: g.src, alt: GHR.galleryAlt(g), grande: i === 0, pos: g.pos,
                    sizes: i === 0 ? '(max-width:820px) 100vw, 50vw' : '(max-width:820px) 50vw, 25vw' })}
        <span class="editorial__zoom">${GHR.icon('zoom', 18)}</span>
      </button>
    </figure>`).join('');

  GHR.bindLightbox(mount, fotos);
};

/* --------------------------- galeria completa ---------------------------- */
GHR.galleryFull = function (mount) {
  let filtro = 'todos';
  let visiveis = GHR.galleryConfig.lote;

  const usados = new Set(GHR.gallery.map(g => g.cat));
  const filtros = GHR.galleryFilters.filter(f => f.id === 'todos' || usados.has(f.id));

  mount.innerHTML = `
    <div class="filters" role="group" aria-label="Filtrar fotos por tipo de serviço">
      ${filtros.map(f => `
        <button type="button" data-filtro="${f.id}" aria-pressed="${f.id === 'todos'}">${f.label}</button>`).join('')}
    </div>
    <div class="masonry" data-grid aria-live="polite"></div>
    <div class="gal-more"><button class="btn btn--ghost" type="button" data-mais>Carregar mais fotos</button></div>`;

  const grid = mount.querySelector('[data-grid]');
  const btnMais = mount.querySelector('[data-mais]');
  const rotulo = (id) => (GHR.galleryFilters.find(f => f.id === id) || {}).label || id;

  /* O rótulo sobre a foto passa a dizer também a fase. Sem isso, uma
     montagem antes/depois e um veículo entregue apareciam com a mesma
     etiqueta, e um carro sujo em processo era lido como entrega. */
  const FASE = {
    antes:       'Antes',
    processo:    'Em processo',
    comparativo: 'Antes e depois',
    depois:      ''
  };
  const etiqueta = (g) => {
    const f = FASE[g.fase];
    return f ? `${rotulo(g.cat)} · ${f}` : rotulo(g.cat);
  };

  function lista() {
    return filtro === 'todos' ? GHR.gallery : GHR.gallery.filter(g => g.cat === filtro);
  }

  const cartao = (g, i, total) => `
      <figure class="masonry__item">
        <button type="button" data-lb-index="${i}" aria-label="Ampliar foto ${i + 1} de ${total}: ${GHR.galleryAlt(g)}">
          ${GHR.pic({ src: g.src, alt: GHR.galleryAlt(g),
                      sizes: '(max-width:560px) 50vw, 33vw' })}
          <span class="masonry__tag">${etiqueta(g)}</span>
        </button>
      </figure>`;

  function rodape(mostrados, total) {
    btnMais.hidden = mostrados >= total;
    btnMais.textContent = `Carregar mais fotos (${total - mostrados} restantes)`;
  }

  /** Refaz o grid do zero — usado ao trocar de filtro. */
  function render() {
    const all = lista();
    const mostra = all.slice(0, visiveis);

    grid.innerHTML = mostra.map((g, i) => cartao(g, i, all.length)).join('');
    rodape(mostra.length, all.length);

    grid.querySelectorAll('.masonry__item').forEach((el, i) => {
      el.style.transitionDelay = ((i % GHR.galleryConfig.lote) * 0.03).toFixed(2) + 's';
      GHR.observe(el);
    });
  }

  /** Acrescenta só o lote novo.
      Recriar o grid inteiro a cada "Carregar mais" refazia todas as fotos já
      na tela: elas voltavam a ser baixadas/decodificadas, perdiam a animação
      de entrada já concluída e o foco do teclado ia para o começo da página. */
  function acrescenta() {
    const all = lista();
    const de = grid.children.length;
    const ate = Math.min(de + GHR.galleryConfig.lote, all.length);
    if (ate <= de) return;

    const lote = document.createDocumentFragment();
    const molde = document.createElement('div');
    molde.innerHTML = all.slice(de, ate).map((g, i) => cartao(g, de + i, all.length)).join('');
    [...molde.children].forEach((el, i) => {
      el.style.transitionDelay = (i * 0.03).toFixed(2) + 's';
      lote.appendChild(el);
    });
    grid.appendChild(lote);

    /* rótulo "x de y" das fotos anteriores muda quando o total já era o mesmo?
       Não: o total da lista filtrada não muda ao carregar mais. Nada a refazer. */
    grid.querySelectorAll('.masonry__item').forEach((el, i) => {
      if (i >= de) GHR.observe(el);
    });

    visiveis = ate;
    rodape(ate, all.length);

    /* o foco fica no botão, mas ele pode ter sumido ao acabar a lista */
    if (btnMais.hidden) {
      const primeiroNovo = grid.children[de];
      if (primeiroNovo) primeiroNovo.querySelector('button').focus({ preventScroll: true });
    }
  }

  /* um único listener para o grid inteiro — a lista é lida no momento do clique */
  grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-lb-index]');
    if (btn) GHR.lightbox.open(lista(), Number(btn.dataset.lbIndex));
  });

  mount.querySelectorAll('[data-filtro]').forEach(btn => {
    btn.addEventListener('click', () => {
      filtro = btn.dataset.filtro;
      visiveis = GHR.galleryConfig.lote;
      mount.querySelectorAll('[data-filtro]').forEach(b2 =>
        b2.setAttribute('aria-pressed', String(b2 === btn)));
      render();
    });
  });

  btnMais.addEventListener('click', acrescenta);

  render();
};

GHR.initGallery = function () {
  document.querySelectorAll('[data-c="gallery"]').forEach(mount => {
    if (mount.dataset.mode === 'preview') GHR.galleryPreview(mount);
    else GHR.galleryFull(mount);
  });
};
