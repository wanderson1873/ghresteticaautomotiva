/* =============================================================================
   CONTATO — bloco de informações e formulário que abre o WhatsApp
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="contact-info"></div>   endereço, telefone e Instagram
     (o horário tem cartão próprio — ver components/hours-map.js)
     <div data-c="contact-form"></div>   formulário → mensagem pronta no WhatsApp

   Não existe backend: o formulário monta o texto e abre a conversa no WhatsApp.
   O site não guarda nada e não envia nada para um servidor próprio — mas a
   mensagem vai junto na URL do WhatsApp, ou seja, chega ao WhatsApp assim que
   a conversa abre. O texto na tela precisa dizer exatamente isso.
   ========================================================================== */

window.GHR = window.GHR || {};

/* ------------------------- informações de contato ------------------------ */
GHR.initContactInfo = function () {
  document.querySelectorAll('[data-c="contact-info"]').forEach(mount => {
    const biz = GHR.business;
    const end = biz.endereco;
    const blocos = [];

    if (biz.telefone) blocos.push(`
      <div class="contact-item" data-reveal>
        <h4>WhatsApp</h4>
        <a href="${GHR.waLink()}" target="_blank" rel="noopener">${biz.telefone}</a>
        <span class="small">Atendimento pelo WhatsApp</span>
      </div>`);

    if (end.rua || end.cidade) blocos.push(`
      <div class="contact-item" data-reveal style="--d:.08s">
        <h4>Endereço</h4>
        <a href="${GHR.mapsLink()}" target="_blank" rel="noopener">${GHR.enderecoLinha()}</a>
        <span class="small">Abrir no Google Maps</span>
      </div>`);

    if (biz.instagram) blocos.push(`
      <div class="contact-item" data-reveal style="--d:.16s">
        <h4>Instagram</h4>
        <a href="${biz.instagram}" target="_blank" rel="noopener">${biz.instagramHandle}</a>
        <span class="small">Trabalhos publicados no perfil</span>
      </div>`);

    if (biz.email) blocos.push(`
      <div class="contact-item" data-reveal style="--d:.2s">
        <h4>E-mail</h4>
        <a href="mailto:${biz.email}">${biz.email}</a>
      </div>`);

    /* Horário resumido. Só entra quando a página não tem o cartão completo
       (data-c="horarios") — caso da home, onde o horário estava faltando e o
       visitante precisava ir até /contato/ para saber se estava aberto. */
    const dias = (biz.horarios && biz.horarios.dias) || [];
    if (dias.length && !document.querySelector('[data-c="horarios"]')) {
      const sit = GHR.situacaoHorario ? GHR.situacaoHorario() : null;
      const abertos = dias.filter(d => d.abre && d.fecha);
      const mesmo = abertos.length && abertos.every(d => d.abre === abertos[0].abre && d.fecha === abertos[0].fecha);
      const faixa = mesmo
        ? `${abertos[0].nome.replace('-feira', '')} a ${abertos[abertos.length - 1].nome.replace('-feira', '')}, ${abertos[0].abre.replace(':00', 'h')} às ${abertos[0].fecha.replace(':00', 'h')}`
        : 'Ver horário completo';

      blocos.push(`
      <div class="contact-item" data-reveal style="--d:.24s">
        <h4>Horário</h4>
        <p>${faixa}</p>
        ${sit ? `<span class="small">${sit.texto}</span>` : ''}
        <a class="link-u" style="margin-top:.5rem" href="${GHR.base}contato/">Horário dia a dia e como chegar <span class="arw">→</span></a>
      </div>`);
    }

    if (biz.pagamentos && biz.pagamentos.length) blocos.push(`
      <div class="contact-item" data-reveal style="--d:.28s">
        <h4>Formas de pagamento</h4>
        <p>${biz.pagamentos.join(' · ')}</p>
      </div>`);

    /* observações gerais — só aparecem se houver alguma escrita */
    if (biz.observacoes && biz.observacoes.length) blocos.push(`
      <div class="contact-item" data-reveal style="--d:.32s">
        <h4>Observações</h4>
        <p>${biz.observacoes.join(' · ')}</p>
      </div>`);

    mount.classList.add('contact-grid');
    mount.innerHTML = blocos.join('');
  });
};

/* ------------------------------- formulário ------------------------------ */
GHR.initContactForm = function () {
  const mount = document.querySelector('[data-c="contact-form"]');
  if (!mount) return;

  const opcoes = GHR.services
    .map(s => `<option value="${s.nome}">${s.nome}</option>`).join('');

  mount.innerHTML = `
    <form class="form" novalidate>
      <div class="form__row">
        <div class="field">
          <label for="f-nome">Nome</label>
          <input id="f-nome" name="nome" type="text" autocomplete="name" required
                 aria-describedby="f-nome-erro" placeholder="Como podemos te chamar">
          <span class="field__erro" id="f-nome-erro" role="alert"></span>
        </div>
        <div class="field">
          <label for="f-tel">Telefone</label>
          <input id="f-tel" name="telefone" type="tel" autocomplete="tel" inputmode="tel" placeholder="(00) 00000-0000">
        </div>
      </div>
      <div class="form__row">
        <div class="field">
          <label for="f-veiculo">Veículo</label>
          <input id="f-veiculo" name="veiculo" type="text" placeholder="Modelo e ano">
        </div>
        <div class="field">
          <label for="f-servico">Serviço de interesse</label>
          <select id="f-servico" name="servico">
            <option value="">Não sei ainda — quero uma indicação</option>
            ${opcoes}
          </select>
        </div>
      </div>
      <div class="field">
        <label for="f-msg">Mensagem</label>
        <textarea id="f-msg" name="mensagem" placeholder="Conte o que o veículo precisa (opcional)"></textarea>
      </div>
      <div>
        <button class="btn btn--wa btn--lg" type="submit">
          ${GHR.icon('wa', 18)} Continuar no WhatsApp
        </button>
        <p class="form__note" style="margin-top:.9rem">
          O botão abre o WhatsApp com a mensagem já escrita, para você conferir
          e enviar. O site não guarda os dados preenchidos — eles vão apenas
          junto com a conversa que abre no WhatsApp.
        </p>
      </div>
    </form>`;

  const form = mount.querySelector('form');

  /* Devolver o foco ao campo sem dizer o que está errado não resolve para
     ninguém — e para quem usa leitor de tela não resolve mesmo. O texto fica
     ligado ao campo por aria-describedby e é anunciado por role="alert". */
  const erro = (campo, texto) => {
    const cx = form.querySelector('#' + campo.id + '-erro');
    if (texto) {
      campo.setAttribute('aria-invalid', 'true');
      if (cx) { cx.textContent = texto; cx.classList.add('is-on'); }
      campo.focus();
    } else {
      campo.removeAttribute('aria-invalid');
      if (cx) { cx.textContent = ''; cx.classList.remove('is-on'); }
    }
  };

  /* o erro some assim que a pessoa começa a corrigir */
  form.nome.addEventListener('input', () => {
    if (form.nome.value.trim()) erro(form.nome, '');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    if (!nome) {
      erro(form.nome, 'Informe seu nome para a gente saber com quem está falando.');
      return;
    }
    erro(form.nome, '');

    const veiculo  = form.veiculo.value.trim();
    const servico  = form.servico.value;
    const telefone = form.telefone.value.trim();
    const extra    = form.mensagem.value.trim();

    const linhas = [`Olá, meu nome é ${nome}.`];
    if (veiculo)  linhas.push(`Tenho um ${veiculo}.`);
    if (servico)  linhas.push(`Tenho interesse em ${servico}.`);
    else          linhas.push('Gostaria de uma indicação de serviço para o meu veículo.');
    if (extra)    linhas.push(extra);
    if (telefone) linhas.push(`Meu telefone: ${telefone}.`);
    linhas.push('Vim pelo site.');

    window.open(GHR.waLink(linhas.join('\n')), '_blank', 'noopener');
  });
};
