/* =============================================================================
   PARCERIAS (B2B)
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="partner-perfis"></div>   quem a GHR atende
     <div data-c="partner-etapas"></div>   como a parceria é montada
     <div data-c="partner-form"></div>     formulário curto → WhatsApp

   Mesma regra do formulário de contato: não existe backend. O formulário monta
   a mensagem e abre a conversa no WhatsApp — o empresário confere o texto antes
   de mandar. O site não finge que envia nada para servidor nenhum.
   ========================================================================== */

window.GHR = window.GHR || {};

/* ---------------------------- perfis atendidos --------------------------- */
GHR.initPartnerPerfis = function () {
  const mount = document.querySelector('[data-c="partner-perfis"]');
  if (!mount) return;

  mount.classList.add('perfis');
  mount.innerHTML = GHR.partnerPerfis.map((p, i) => `
    <article class="perfil" data-reveal style="--d:${(i * 0.06).toFixed(2)}s">
      <span class="perfil__ico">${GHR.icon(p.icone, 22)}</span>
      <h3>${p.titulo}</h3>
      <p>${p.texto}</p>
    </article>`).join('');
};

/* -------------------------- etapas da parceria --------------------------- */
GHR.initPartnerEtapas = function () {
  const mount = document.querySelector('[data-c="partner-etapas"]');
  if (!mount) return;

  mount.classList.add('passos');
  mount.innerHTML = GHR.partnerEtapas.map((e, i) => `
    <div class="passo" data-reveal style="--d:${(i * 0.08).toFixed(2)}s">
      <span class="passo__n">${e.n}</span>
      <h3>${e.titulo}</h3>
      <p>${e.texto}</p>
    </div>`).join('');
};

/* ----------------------------- formulário B2B ---------------------------- */
GHR.initPartnerForm = function () {
  const mount = document.querySelector('[data-c="partner-form"]');
  if (!mount) return;

  const segmentos = GHR.partnerSegmentos
    .map(s => `<option value="${s}">${s}</option>`).join('');
  const volumes = GHR.partnerVolumes
    .map(v => `<option value="${v}">${v}</option>`).join('');

  mount.innerHTML = `
    <form class="form" novalidate>
      <div class="form__row">
        <div class="field">
          <label for="p-empresa">Empresa</label>
          <input id="p-empresa" name="empresa" type="text" required
                 autocomplete="organization" aria-describedby="p-empresa-erro"
                 placeholder="Nome da empresa">
          <span class="field__erro" id="p-empresa-erro" role="alert"></span>
        </div>
        <div class="field">
          <label for="p-nome">Responsável</label>
          <input id="p-nome" name="nome" type="text" required
                 autocomplete="name" aria-describedby="p-nome-erro"
                 placeholder="Com quem falamos">
          <span class="field__erro" id="p-nome-erro" role="alert"></span>
        </div>
      </div>

      <div class="form__row">
        <div class="field">
          <label for="p-tel">Telefone</label>
          <input id="p-tel" name="telefone" type="tel" autocomplete="tel"
                 inputmode="tel" placeholder="(00) 00000-0000">
        </div>
        <div class="field">
          <label for="p-segmento">Segmento</label>
          <select id="p-segmento" name="segmento">
            <option value="">Selecione</option>
            ${segmentos}
          </select>
        </div>
      </div>

      <div class="form__row">
        <div class="field">
          <label for="p-volume">Quantos veículos</label>
          <select id="p-volume" name="volume">
            <option value="">Selecione</option>
            ${volumes}
          </select>
        </div>
        <div class="field">
          <label for="p-freq">Frequência desejada</label>
          <input id="p-freq" name="frequencia" type="text"
                 placeholder="Ex.: semanal, quinzenal, sob demanda">
        </div>
      </div>

      <div class="field">
        <label for="p-msg">O que a empresa precisa</label>
        <textarea id="p-msg" name="mensagem"
                  placeholder="Conte o tipo de veículo e o serviço que interessa (opcional)"></textarea>
      </div>

      <div>
        <button class="btn btn--wa btn--lg" type="submit">
          ${GHR.icon('wa', 18)} Solicitar proposta no WhatsApp
        </button>
        <p class="form__note" style="margin-top:.9rem">
          O botão abre o WhatsApp com a mensagem já escrita, para você conferir
          e enviar. O site não guarda os dados preenchidos — eles vão apenas
          junto com a conversa que abre no WhatsApp.
        </p>
      </div>
    </form>`;

  const form = mount.querySelector('form');

  /* mesma regra do formulário de contato: erro precisa de texto, não só de foco */
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

  const MENSAGENS = {
    empresa: 'Informe o nome da empresa.',
    nome:    'Informe com quem a GHR deve falar.'
  };

  ['empresa', 'nome'].forEach(campo => {
    form[campo].addEventListener('input', () => {
      if (form[campo].value.trim()) erro(form[campo], '');
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    /* empresa e responsável são o mínimo para a conversa fazer sentido */
    for (const campo of ['empresa', 'nome']) {
      if (!form[campo].value.trim()) {
        erro(form[campo], MENSAGENS[campo]);
        return;
      }
      erro(form[campo], '');
    }

    const v = (n) => form[n].value.trim();
    const linhas = [`Olá! Sou ${v('nome')}, da ${v('empresa')}.`];

    if (v('segmento'))   linhas.push(`Segmento: ${v('segmento')}.`);
    if (v('volume'))     linhas.push(`Veículos: ${v('volume')}.`);
    if (v('frequencia')) linhas.push(`Frequência: ${v('frequencia')}.`);
    linhas.push('Gostaria de conversar sobre uma parceria com a GHR.');
    if (v('mensagem'))   linhas.push(v('mensagem'));
    if (v('telefone'))   linhas.push(`Meu telefone: ${v('telefone')}.`);
    linhas.push('Vim pela página de parcerias do site.');

    window.open(GHR.waLink(linhas.join('\n')), '_blank', 'noopener');
  });
};
