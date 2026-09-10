/* =============================================================================
   LIGHTBOX — teclado (← → Esc), swipe no mobile, foco preso no diálogo
   -----------------------------------------------------------------------------
   Uso:  GHR.bindLightbox(container, [{src, alt}, ...])
   O container precisa ter botões com  data-lb-index="n".
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.lightbox = (function () {
  let el, imgEl, countEl, items = [], index = 0, lastFocus = null;

  function build() {
    if (el) return;
    el = document.createElement('div');
    el.className = 'lb';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Foto ampliada');
    el.innerHTML = `
      <button class="lb__btn lb__close" type="button" aria-label="Fechar">${GHR.icon('close', 22)}</button>
      <button class="lb__btn lb__prev" type="button" aria-label="Foto anterior">${GHR.icon('chevL', 22)}</button>
      <img class="lb__img" alt="">
      <button class="lb__btn lb__next" type="button" aria-label="Próxima foto">${GHR.icon('chevR', 22)}</button>
      <p class="lb__count"></p>`;
    document.body.appendChild(el);

    imgEl = el.querySelector('.lb__img');
    countEl = el.querySelector('.lb__count');

    el.querySelector('.lb__close').addEventListener('click', close);
    el.querySelector('.lb__prev').addEventListener('click', () => go(-1));
    el.querySelector('.lb__next').addEventListener('click', () => go(1));
    el.addEventListener('click', e => { if (e.target === el) close(); });

    document.addEventListener('keydown', e => {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'Tab') {                      // mantém o foco dentro do diálogo
        const f = el.querySelectorAll('button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* swipe no mobile */
    let x0 = null;
    el.addEventListener('touchstart', e => { x0 = e.changedTouches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      x0 = null;
    }, { passive: true });
  }

  function render() {
    const it = items[index];
    imgEl.src = GHR.base + 'assets/img/gallery/' + it.src;
    imgEl.alt = (GHR.galleryAlt ? GHR.galleryAlt(it) : it.alt) || '';
    countEl.textContent = `${index + 1} / ${items.length}`;
    const multi = items.length > 1;
    el.querySelector('.lb__prev').hidden = !multi;
    el.querySelector('.lb__next').hidden = !multi;
  }

  function go(step) {
    index = (index + step + items.length) % items.length;
    render();
  }

  function open(list, i) {
    build();
    items = list;
    index = i;
    lastFocus = document.activeElement;
    render();
    el.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    el.querySelector('.lb__close').focus();
  }

  function close() {
    el.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  return { open, close };
})();

/** Liga os botões de um container ao lightbox. */
GHR.bindLightbox = function (container, items) {
  if (!container) return;
  container.addEventListener('click', e => {
    const btn = e.target.closest('[data-lb-index]');
    if (!btn) return;
    GHR.lightbox.open(items, Number(btn.dataset.lbIndex));
  });
};
