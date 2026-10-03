/* =============================================================================
   FOOTER + BOTÃO FLUTUANTE DO WHATSAPP + DADOS ESTRUTURADOS (SEO)
   -----------------------------------------------------------------------------
   Renderiza dentro de  <div data-c="footer"></div>
   Campos vazios em business.js simplesmente não aparecem.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.initFooter = function () {
  const mount = document.querySelector('[data-c="footer"]');
  if (!mount) return;

  const b = GHR.base;
  const biz = GHR.business;
  const end = biz.endereco;

  const navLinks = GHR.nav
    .map(n => `<li><a href="${b}${n.href}">${n.label}</a></li>`).join('');

  /* todos os serviços: cortar em 5 escondia justamente vitrificação e
     higienização, que aparecem como destaque na home */
  const svcLinks = GHR.services
    .map(s => `<li><a href="${b}servicos/${s.slug}/">${s.nome}</a></li>`).join('');

  const contatoItems = [
    biz.telefone  ? `<li><a href="${GHR.waLink()}" target="_blank" rel="noopener">${biz.telefone}</a></li>` : '',
    biz.email     ? `<li><a href="mailto:${biz.email}">${biz.email}</a></li>` : '',
    biz.instagram ? `<li><a href="${biz.instagram}" target="_blank" rel="noopener">${biz.instagramHandle}</a></li>` : '',
    end.rua       ? `<li><span>${GHR.enderecoLinha()}</span></li>` : ''
  ].join('');

  const socials = [
    biz.instagram ? `<a href="${biz.instagram}" target="_blank" rel="noopener" aria-label="Instagram da GHR">${GHR.icon('ig', 19)}</a>` : '',
    `<a href="${GHR.waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp da GHR">${GHR.icon('wa', 19)}</a>`,
    biz.facebook ? `<a href="${biz.facebook}" target="_blank" rel="noopener" aria-label="Facebook da GHR">${GHR.icon('fb', 19)}</a>` : ''
  ].join('');

  mount.outerHTML = `
    <footer class="ftr">
      <div class="wrap">
        <div class="ftr__grid">
          <div class="ftr__brand">
            <img src="${b}assets/img/logo.svg" alt="GHR Estética Automotiva" width="44" height="44" loading="lazy">
            <p>${biz.descricao}</p>
            <div class="socials">${socials}</div>
          </div>
          <div>
            <h4>Navegação</h4>
            <ul>${navLinks}</ul>
          </div>
          <div>
            <h4>Serviços</h4>
            <ul>${svcLinks}</ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul>${contatoItems}</ul>
          </div>
        </div>
        <div class="ftr__bottom">
          <span>© <span data-ano></span> ${biz.nome}. Todos os direitos reservados.</span>
          <a href="${b}privacidade/">Privacidade</a>
        </div>
      </div>
    </footer>

    <a class="wa-float" data-wa-float href="${GHR.waLink()}"
       target="_blank" rel="noopener" aria-label="Falar no WhatsApp">
      ${GHR.icon('wa', 26)}
    </a>

    <button type="button" class="topo-float" data-topo-float aria-label="Voltar ao topo da página">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>
    </button>`;

  const ano = document.querySelector('[data-ano]');
  if (ano) ano.textContent = new Date().getFullYear();

  /* botão flutuante aparece depois do hero */
  const float = document.querySelector('[data-wa-float]');
  if (float) {
    const show = () => float.classList.toggle('is-visible', window.scrollY > 520);
    window.addEventListener('scroll', show, { passive: true });
    show();
  }

  /* "voltar ao topo": aparece depois de rolar mais ou menos uma tela e meia */
  const topo = document.querySelector('[data-topo-float]');
  if (topo) {
    const mostrar = () => topo.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.5);
    window.addEventListener('scroll', mostrar, { passive: true });
    mostrar();
    topo.addEventListener('click', () => {
      const reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduzir ? 'auto' : 'smooth' });
      /* quem navega por teclado continua do topo: foco no primeiro link do header */
      const alvo = document.querySelector('[data-hdr] a');
      if (alvo) alvo.focus({ preventScroll: true });
    });
  }

  GHR.injectSchema();
};

/* ---------------------------------------------------------------------------
   JSON-LD (AutoWash / LocalBusiness). Só publica o que existe de fato:
   nada de avaliações, horários ou preços inventados.
--------------------------------------------------------------------------- */
GHR.injectSchema = function () {
  const biz = GHR.business, end = biz.endereco;

  /* a URL e a imagem saem das próprias meta tags da página —
     assim o schema acompanha o domínio configurado no HTML */
  const meta = (sel) => {
    const el = document.querySelector(sel);
    return el ? (el.content || el.href) : '';
  };

  /* A home e a página de contato já trazem a entidade completa em JSON-LD.
     Nesse caso não vale publicar uma segunda: duas descrições do mesmo negócio
     com dados diferentes é pior que uma só. */
  const jaTemEntidade = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .some(tag => /"@type"\s*:\s*"(AutoWash|LocalBusiness|AutoDetailing)"/.test(tag.textContent));
  if (jaTemEntidade) return;

  /* O @id precisa ser o mesmo em todas as páginas: é ele que diz ao Google que
     é o mesmo negócio, e não um por URL. */
  const origem = (meta('link[rel="canonical"]') || location.href).replace(/(\/\/[^/]+).*/, '$1');

  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    '@id': origem + '/#negocio',
    name: biz.nome,
    description: biz.descricao
  };

  const url = meta('link[rel="canonical"]');
  const img = meta('meta[property="og:image"]');
  if (url) data.url = origem + '/';
  if (img) data.image = img;

  if (biz.whatsapp) data.telephone = '+' + biz.whatsapp;
  if (biz.instagram) data.sameAs = [biz.instagram];
  if (end.rua || end.cidade) {
    data.address = { '@type': 'PostalAddress', addressCountry: 'BR' };
    const rua = [end.rua, end.bairro].filter(Boolean).join(' — ');
    if (rua)        data.address.streetAddress = rua;
    if (end.cidade) data.address.addressLocality = end.cidade;
    if (end.uf)     data.address.addressRegion = end.uf;
    if (end.cep)    data.address.postalCode = end.cep;
  }
  /* Horários. O modelo de dados é { dias: [{ nome, abre, fecha }] } começando
     no domingo — o código anterior ainda esperava um array de { dia, horario }
     e por isso nunca escrevia nada aqui. Dias com o mesmo horário são
     agrupados numa única OpeningHoursSpecification, como o Google espera. */
  const SEMANA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dias = (biz.horarios && biz.horarios.dias) || [];
  if (dias.length) {
    const grupos = new Map();
    dias.forEach((d, i) => {
      if (!d.abre || !d.fecha) return;                 // fechado não entra
      const chave = d.abre + '-' + d.fecha;
      if (!grupos.has(chave)) grupos.set(chave, { abre: d.abre, fecha: d.fecha, dias: [] });
      grupos.get(chave).dias.push(SEMANA[i]);
    });
    if (grupos.size) {
      data.openingHoursSpecification = [...grupos.values()].map(g => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: g.dias,
        opens: g.abre,
        closes: g.fecha
      }));
    }
  }

  const tag = document.createElement('script');
  tag.type = 'application/ld+json';
  tag.textContent = JSON.stringify(data);
  document.head.appendChild(tag);
};
