/* =============================================================================
   HEADER + MENU MOBILE
   -----------------------------------------------------------------------------
   Renderiza dentro de  <div data-c="header"></div>
   A página informa:
     <html data-base="../../">   caminho até a raiz do site
     <body data-page="servicos"> qual item do menu fica marcado
     data-header="light"         header escuro sobre fundo claro (páginas sem hero escuro)
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.base = document.documentElement.dataset.base || '';

/* Itens do menu — usados no header, no menu mobile e no footer.
   sub: 'servicos'  acrescenta a setinha que abre a lista de serviços sem sair
   da página atual. O rodapé ignora esse campo e mostra só o link.            */
GHR.nav = [
  { id: 'home',      label: 'Home',      href: '' },
  { id: 'servicos',  label: 'Serviços',  href: 'servicos/', sub: 'servicos' },
  { id: 'fotos',     label: 'Fotos',     href: 'fotos/' },
  { id: 'parcerias', label: 'Parcerias', href: 'parcerias/' },
  { id: 'contato',   label: 'Contato',   href: 'contato/' }
];

/* Painel com todos os serviços, aberto pela seta ao lado de "Serviços".
   ctx separa os ids do header e do menu mobile, que coexistem na página.    */
GHR.navSubmenu = function (ctx) {
  const itens = GHR.services.map(s => `
    <a class="submenu__item" href="${GHR.base}servicos/${s.slug}/">
      <b>${s.nome}</b>
      <span>${s.resumo}</span>
    </a>`).join('');

  /* Sem link de "ver todos": o painel já lista os oito serviços, e a palavra
     "Serviços" ao lado da seta continua levando para a página completa. */
  return `
    <div class="submenu" id="sub-servicos-${ctx}" hidden>
      <div class="submenu__grid">${itens}</div>
    </div>`;
};

/* Um item do menu. Com sub, vira link + botão da seta + painel. */
GHR.navItem = function (n, page, ctx) {
  const b = GHR.base;
  const atual = n.id === page ? ' aria-current="page"' : '';
  const link = `<a href="${b}${n.href}"${atual}>${n.label}</a>`;

  if (!n.sub) return link;

  return `
    <span class="nav-item nav-item--sub">
      ${link}
      <button class="nav-caret" type="button"
              aria-expanded="false" aria-controls="sub-servicos-${ctx}"
              aria-label="Ver lista de serviços">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>
      ${GHR.navSubmenu(ctx)}
    </span>`;
};

GHR.initHeader = function () {
  const mount = document.querySelector('[data-c="header"]');
  if (!mount) return;

  const b = GHR.base;
  const page = document.body.dataset.page || '';
  const light = mount.dataset.header === 'light';
  const wa = GHR.waLink();

  const linksHdr    = GHR.nav.map(n => GHR.navItem(n, page, 'hdr')).join('');
  const linksDrawer = GHR.nav.map(n => GHR.navItem(n, page, 'drawer')).join('');

  mount.outerHTML = `
    <header class="hdr${light ? ' hdr--light' : ''}" data-hdr>
      <div class="hdr__in">
        <a class="hdr__logo" href="${b}" aria-label="GHR Estética Automotiva — página inicial">
          <img src="${b}assets/img/logo.svg" alt="" width="38" height="38">
          <span><b>GHR</b><span>Estética Automotiva</span></span>
        </a>
        <nav class="hdr__nav" aria-label="Menu principal">${linksHdr}</nav>
        <div class="hdr__cta">
          <a class="btn btn--wa btn--desk" href="${wa}" target="_blank" rel="noopener">
            ${GHR.icon('wa', 18)} Falar no WhatsApp
          </a>
          <button class="burger" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="menu-mobile">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>

    <div class="drawer" id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu">
      <nav class="drawer__nav" aria-label="Menu mobile">${linksDrawer}</nav>
      <div class="drawer__foot">
        <a class="btn btn--wa btn--lg" href="${wa}" target="_blank" rel="noopener">
          ${GHR.icon('wa', 18)} Falar no WhatsApp
        </a>
        <p class="drawer__meta">
          ${GHR.business.telefone ? `<a href="tel:+${GHR.business.whatsapp}">${GHR.business.telefone}</a> · ` : ''}
          <a href="${GHR.business.instagram}" target="_blank" rel="noopener">${GHR.business.instagramHandle}</a>
        </p>
      </div>
    </div>`;

  /* ------------------------- comportamento -------------------------- */
  const hdr = document.querySelector('[data-hdr]');
  const burger = hdr.querySelector('.burger');
  const drawer = document.getElementById('menu-mobile');

  /* ---------------------- menu mobile: abrir/fechar ----------------------
     O drawer se declara role="dialog" aria-modal="true"; para a declaração ser
     verdadeira ele precisa (1) receber o foco ao abrir, (2) prender Tab dentro
     dele, (3) esconder o resto da página dos leitores de tela e (4) devolver o
     foco ao botão que o abriu. Antes só a classe do body mudava.            */
  /* O botão que fecha (o hamburger virado em X) mora no <header>, fora do
     drawer. Por isso o header não pode ficar inert inteiro — só as partes
     dele que não são o botão; senão o X aparece na tela mas não recebe toque. */
  const foraDoDrawer = () => [
    ...[...document.body.children].filter(el => el !== drawer && el !== hdr && el.nodeType === 1),
    ...hdr.querySelectorAll('.hdr__logo, .hdr__nav, .btn--desk')
  ];

  /* elementos que podem receber foco, na ordem em que aparecem.
     O botão de fechar entra na lista para o Tab conseguir chegar até ele. */
  const focaveis = () => [burger, ...drawer.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )].filter(el => el.offsetParent !== null || el === document.activeElement);

  const setMenu = (open) => {
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    drawer.setAttribute('aria-hidden', String(!open));

    /* o resto da página some para leitor de tela e para o Tab enquanto abre */
    foraDoDrawer().forEach(el => {
      if (open) { el.setAttribute('inert', ''); el.setAttribute('aria-hidden', 'true'); }
      else      { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); }
    });

    if (open) {
      drawer.scrollTop = 0;                 // sempre abre no topo da lista
      const alvo = focaveis().find(el => el !== burger);
      if (alvo) alvo.focus({ preventScroll: true });
    } else {
      fechaSubmenus();
      burger.focus({ preventScroll: true });
    }
  };

  /* Tab e Shift+Tab circulam dentro do menu enquanto ele está aberto */
  document.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !document.body.classList.contains('menu-open')) return;
    const lista = focaveis();
    if (!lista.length) return;
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    if (e.shiftKey && document.activeElement === primeiro) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primeiro.focus();
    }
  });

  drawer.setAttribute('aria-hidden', 'true');
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  /* fechar pelo link não deve devolver o foco ao hamburger: a navegação segue */
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    drawer.setAttribute('aria-hidden', 'true');
    foraDoDrawer().forEach(el => { el.removeAttribute('inert'); el.removeAttribute('aria-hidden'); });
  }));

  /* ------------------ seta que abre a lista de serviços ------------------
     O link "Serviços" continua indo para a página; quem abre o painel é só
     a seta. Assim dá para ver os serviços sem sair de onde se está.        */
  const setas = document.querySelectorAll('.nav-caret');

  function fechaSubmenus(menos) {
    setas.forEach(seta => {
      if (seta === menos) return;
      seta.setAttribute('aria-expanded', 'false');
      seta.closest('.nav-item').classList.remove('is-open');
      document.getElementById(seta.getAttribute('aria-controls')).hidden = true;
    });
  }

  setas.forEach(seta => {
    const painel = document.getElementById(seta.getAttribute('aria-controls'));
    const item = seta.closest('.nav-item');

    seta.addEventListener('click', e => {
      e.stopPropagation();
      const abrindo = seta.getAttribute('aria-expanded') === 'false';
      fechaSubmenus(seta);
      seta.setAttribute('aria-expanded', String(abrindo));
      item.classList.toggle('is-open', abrindo);
      painel.hidden = !abrindo;
    });

    /* clicar num serviço fecha o painel (e o menu mobile, se estiver aberto) */
    painel.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => fechaSubmenus());
    });

    /* seta para baixo entra na lista */
    seta.addEventListener('keydown', e => {
      if (e.key !== 'ArrowDown') return;
      e.preventDefault();
      if (painel.hidden) seta.click();
      painel.querySelector('a').focus();
    });

    /* dentro da lista: setas navegam, Esc volta para o botão */
    painel.addEventListener('keydown', e => {
      const itens = [...painel.querySelectorAll('a')];
      const i = itens.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && i > -1) {
        e.preventDefault();
        itens[(i + 1) % itens.length].focus();
      } else if (e.key === 'ArrowUp' && i > -1) {
        e.preventDefault();
        itens[(i - 1 + itens.length) % itens.length].focus();
      } else if (e.key === 'Escape') {
        fechaSubmenus();
        seta.focus();
      }
    });
  });

  /* clique fora fecha */
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item--sub')) fechaSubmenus();
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    fechaSubmenus();
    if (document.body.classList.contains('menu-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  /* header ganha fundo ao rolar */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      hdr.classList.toggle('is-stuck', window.scrollY > 40);
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};
