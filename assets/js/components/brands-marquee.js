/* =============================================================================
   CARROSSEL INFINITO DE MARCAS
   -----------------------------------------------------------------------------
   Uso:  <div data-c="marquee"></div>
   A lista sai de assets/js/data/brands.js. O conteúdo é duplicado uma vez para
   que a animação de -50% feche o loop sem salto.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.initMarquee = function () {
  const mount = document.querySelector('[data-c="marquee"]');
  if (!mount) return;

  /* os logotipos são decorativos: o nome de cada marca fica no texto
     alternativo escondido logo abaixo, para leitores de tela */
  const item = (m) => m.logo
    ? `<span class="marquee__item" title="${m.nome}"><img src="${GHR.base}assets/img/brands/${m.logo}"
         alt="" width="40" height="40" loading="lazy" decoding="async"></span>`
    : `<span class="marquee__item marquee__item--txt">${m.nome}</span>`;

  const seq = GHR.brands.map(item).join('');

  mount.innerHTML = `
    <div class="marquee">
      <div class="marquee__track" aria-hidden="true">${seq}${seq}</div>
    </div>
    <p class="sr-only">Marcas atendidas: ${GHR.brands.map(m => m.nome).join(', ')}.</p>`;

  /* velocidade proporcional à quantidade de marcas (movimento sempre igual) */
  const track = mount.querySelector('.marquee__track');
  track.style.animationDuration = Math.max(24, GHR.brands.length * 2.6) + 's';
};
