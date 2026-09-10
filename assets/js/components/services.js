/* =============================================================================
   SERVIÇOS — cards da home, lista da página /servicos/ e página de cada serviço
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="services" data-mode="destaques"></div>   3 cards visuais (home)
     <div data-c="services" data-mode="lista"></div>       todos os serviços
     <div data-c="service-detail" data-servico="slug"></div>
   Preço só aparece quando  preco  não é null (ver data/services.js).
   ========================================================================== */

window.GHR = window.GHR || {};

/* ------------------------------ card visual ------------------------------ */
GHR.serviceCard = function (s, i) {
  const b = GHR.base;
  return `
    <article class="svc" data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
      <div class="svc__img">
        ${GHR.pic({ src: s.imagem, alt: s.altImagem || (s.nome + ' — GHR Estética Automotiva'), grande: true,
                    sizes: '(max-width:1024px) 100vw, 33vw' })}
      </div>
      <span class="svc__cat">${s.categoria}</span>
      <h3>${s.nome}</h3>
      <p>${s.resumo}</p>
      ${s.preco ? `<p class="svc__preco">${s.preco}</p>` : ''}
      <a class="svc__go" href="${b}servicos/${s.slug}/">
        Saiba mais <i>${GHR.icon('arrow', 16)}</i>
        <span class="sr-only">sobre ${s.nome}</span>
      </a>
    </article>`;
};

/* ------------------------------ linha da lista --------------------------- */
GHR.serviceRow = function (s, i) {
  const b = GHR.base;
  return `
    <article class="svc-row" data-reveal style="--d:${(i * 0.05).toFixed(2)}s">
      <div class="svc-row__img">
        ${GHR.pic({ src: s.imagem, alt: s.altImagem || (s.nome + ' — GHR Estética Automotiva'),
                    sizes: '(max-width:820px) 100vw, 260px' })}
      </div>
      <div>
        <span class="svc-row__cat">${s.categoria}</span>
        <h3>${s.nome}</h3>
        <p>${s.descricao}</p>
      </div>
      <div class="svc-row__side">
        ${s.preco ? `<span class="svc-row__preco">${s.preco}</span>` : ''}
        <a class="link-u" href="${b}servicos/${s.slug}/">
          Ver detalhes <span class="arw">${GHR.icon('arrow', 16)}</span>
        </a>
      </div>
    </article>`;
};

GHR.initServices = function () {
  document.querySelectorAll('[data-c="services"]').forEach(mount => {
    const mode = mount.dataset.mode || 'lista';
    if (mode === 'destaques') {
      mount.className = 'svc-grid svc-grid--3';
      mount.innerHTML = GHR.destaques().map(GHR.serviceCard).join('');
    } else {
      /* A lista corrida de oito itens deixava a comparação por conta do
         visitante: lavagem tradicional x detalhada e cristalização x
         vitrificação apareciam soltas, sem dizer que resolvem a mesma coisa
         de formas diferentes. Agora cada grupo abre com a necessidade e o
         texto que separa os serviços parecidos. */
      mount.className = 'svc-grupos';
      let i = 0;
      mount.innerHTML = GHR.porObjetivo().map(o => `
        <section class="svc-grupo">
          <div class="svc-grupo__head">
            <h2>${o.titulo}</h2>
            <p>${o.texto}</p>
          </div>
          <div class="svc-list">
            ${o.itens.map(s2 => GHR.serviceRow(s2, i++)).join('')}
          </div>
        </section>`).join('');
    }
  });
};

/* --------------------------- página do serviço --------------------------- */
GHR.initServiceDetail = function () {
  const mount = document.querySelector('[data-c="service-detail"]');
  if (!mount) return;

  const b = GHR.base;
  const s = GHR.getService(mount.dataset.servico);

  if (!s) {
    mount.innerHTML = `<p class="lead">Serviço não encontrado. <a class="link-u" href="${b}servicos/">Ver todos os serviços</a></p>`;
    return;
  }

  /* Título e meta da página vêm dos dados — um só lugar para editar.
     Open Graph e Twitter precisam acompanhar: quando só o <title> e a
     description eram atualizados, o link compartilhado continuava mostrando o
     texto antigo do HTML gerado. */
  const cidade = (GHR.business.endereco && GHR.business.endereco.cidade) || '';
  const titulo = cidade
    ? `${s.nome} em ${cidade} | GHR Estética Automotiva`
    : `${s.nome} | GHR Estética Automotiva`;

  document.title = titulo;

  const setMeta = (sel, valor) => {
    const el = document.querySelector(sel);
    if (el && valor) el.setAttribute('content', valor);
  };
  setMeta('meta[name="description"]', s.resumo);
  setMeta('meta[property="og:title"]', titulo);
  setMeta('meta[property="og:description"]', s.resumo);
  setMeta('meta[name="twitter:title"]', titulo);
  setMeta('meta[name="twitter:description"]', s.resumo);
  const h1 = document.querySelector('[data-svc-titulo]');
  if (h1) h1.textContent = s.nome;
  const sub = document.querySelector('[data-svc-resumo]');
  if (sub) sub.textContent = s.resumo;
  const cat = document.querySelector('[data-svc-cat]');
  if (cat) cat.textContent = s.categoria;
  const bg = document.querySelector('[data-svc-bg]');
  if (bg) bg.src = `${b}assets/img/gallery/${s.imagem}`;
  const bgWebp = document.querySelector('[data-svc-src]');
  if (bgWebp) bgWebp.srcset = `${b}assets/img/gallery/w1440/${s.imagem.replace('.jpg', '.webp')} 1440w`;

  const inclui = s.inclui && s.inclui.length
    ? `<h2 class="mt-lg">O que está incluso</h2>
       <ul class="pill-list">${s.inclui.map(i => `<li>${i}</li>`).join('')}</ul>` : '';

  const beneficios = s.beneficios && s.beneficios.length
    ? `<h2 class="mt-lg">Por que fazer</h2>
       <div class="benefits">
         ${s.beneficios.map(x => `<div class="benefit"><h4>${x.titulo}</h4><p>${x.texto}</p></div>`).join('')}
       </div>` : '';

  const galeria = s.galeria && s.galeria.length
    ? `<h2 class="mt-lg">Trabalhos realizados</h2>
       <div class="masonry masonry--preview mt-lg" data-lightbox-group="servico">
         ${s.galeria.map((f, i) => {
           /* o ALT sai da ficha da foto na galeria: é lá que está registrado
              se a imagem é resultado, processo ou comparativo — dizer
              "<serviço> realizado" em todas atribuía entrega a fotos de
              execução e a montagens antes/depois */
           const ficha = GHR.gallery.find(g => g.src === f) || { src: f };
           const texto = GHR.galleryAlt(ficha) + ' — ' + s.nome;
           return `
           <figure class="masonry__item is-in">
             <button type="button" data-lb-index="${i}" aria-label="Ampliar foto ${i + 1} de ${s.galeria.length}: ${texto}">
               ${GHR.pic({ src: f, alt: texto, sizes: '(max-width:820px) 50vw, 30vw' })}
             </button>
           </figure>`;
         }).join('')}
       </div>` : '';

  /* No celular a coluna do orçamento cai depois de todo o conteúdo — a pessoa
     precisa rolar a página inteira para achar o botão. Este atalho aparece
     logo abaixo do resumo e some no desktop, onde o card lateral já está
     visível desde o começo. */
  const ctaCurto = `
    <p class="svc-detail__atalho">
      <a class="btn btn--wa" href="${GHR.waLink(GHR.business.mensagens.servico(s.nome))}"
         target="_blank" rel="noopener">
        ${GHR.icon('wa', 18)} Pedir orçamento de ${s.nome}
      </a>
    </p>`;

  mount.innerHTML = `
    <div class="svc-detail">
      <div>
        <p class="lead">${s.descricao}</p>
        ${ctaCurto}
        ${inclui}
        ${beneficios}
        ${galeria}
      </div>
      <aside class="svc-detail__aside" data-reveal="right">
        <h3>Quer este serviço?</h3>
        ${s.preco
          ? `<p class="svc-detail__preco">${s.preco}</p>`
          : `<p class="muted" style="margin-top:.6rem;font-size:.93rem">Fale com a equipe para saber prazo e valor para o seu veículo.</p>`}
        <a class="btn btn--wa btn--lg" href="${GHR.waLink(GHR.business.mensagens.servico(s.nome))}" target="_blank" rel="noopener">
          ${GHR.icon('wa', 18)} Falar no WhatsApp
        </a>
        <a class="btn btn--ghost" style="width:100%;margin-top:.6rem" href="${b}servicos/">Ver outros serviços</a>
      </aside>
    </div>`;

  /* lightbox da galeria do serviço */
  if (s.galeria && s.galeria.length) {
    GHR.bindLightbox(
      mount.querySelector('[data-lightbox-group="servico"]'),
      s.galeria.map(f => {
        const ficha = GHR.gallery.find(g => g.src === f) || { src: f };
        return { src: f, alt: GHR.galleryAlt(ficha) + ' — ' + s.nome };
      })
    );
  }
};
