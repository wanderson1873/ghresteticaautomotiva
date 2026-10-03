/* =============================================================================
   PÁGINAS DE SERVIÇO — o pouco de interação que o HTML gerado precisa
   -----------------------------------------------------------------------------
   O conteúdo de /servicos/ já vem pronto no HTML (gerar-paginas-servicos.py).
   Aqui ficam só:
     • seletor de porte P/M/G  — troca o preço dos cards ([data-preco])
     • vídeos curtos           — só baixam quando aparecem na tela
   Sem JavaScript os cards mostram o preço do porte Pequeno e o vídeo fica na
   imagem de capa.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.initPorte = function () {
  const seletores = document.querySelectorAll('[data-seletor-porte]');
  if (!seletores.length) return;

  const rotulos = { p: 'Pequeno', m: 'Médio', g: 'Grande' };

  const aplicar = (porte) => {
    document.querySelectorAll('[data-preco]').forEach(el => {
      const valor = el.getAttribute('data-' + porte);
      if (valor) el.textContent = valor;
    });
    document.querySelectorAll('[data-porte-rotulo]').forEach(el => {
      el.textContent = rotulos[porte];
    });
    document.querySelectorAll('[data-seletor-porte] button[data-porte]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.porte === porte));
    });
  };

  let inicial = 'p';
  try { inicial = localStorage.getItem('ghr-porte') || 'p'; } catch (e) { /* modo anônimo */ }
  if (!rotulos[inicial]) inicial = 'p';
  if (inicial !== 'p') aplicar(inicial);

  seletores.forEach(sel => sel.addEventListener('click', ev => {
    const btn = ev.target.closest('button[data-porte]');
    if (!btn) return;
    aplicar(btn.dataset.porte);
    try { localStorage.setItem('ghr-porte', btn.dataset.porte); } catch (e) { /* modo anônimo */ }
  }));
};

GHR.initClipes = function () {
  const videos = document.querySelectorAll('video[data-src]');
  if (!videos.length) return;

  const reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const carregar = (v) => {
    if (!v.src) v.src = v.dataset.src;
    if (reduzir) { v.controls = true; return; }
    const p = v.play();
    if (p && p.catch) p.catch(() => { v.controls = true; });
  };

  if (!('IntersectionObserver' in window)) { videos.forEach(v => { v.controls = true; v.src = v.dataset.src; }); return; }

  const io = new IntersectionObserver(entradas => {
    entradas.forEach(e => {
      if (e.isIntersecting) carregar(e.target);
      else if (!e.target.paused) e.target.pause();
    });
  }, { rootMargin: '200px 0px' });
  videos.forEach(v => io.observe(v));
};
