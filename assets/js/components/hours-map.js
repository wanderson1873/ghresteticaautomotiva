/* =============================================================================
   HORÁRIOS E MAPA
   -----------------------------------------------------------------------------
   Uso:
     <div data-c="horarios"></div>   cartão com selo "aberto/fechado" + tabela
     <div data-c="mapa"></div>       mapa incorporado + botão "Como chegar"

   O selo é calculado na hora — sempre no fuso da loja (America/Sao_Paulo),
   não no relógio do visitante — a partir de GHR.business.horarios. Nada é
   chumbado no HTML: mudou o dado, muda a tela.
   ========================================================================== */

window.GHR = window.GHR || {};

/* ------------------------------ utilidades ------------------------------- */

/** '08:00' → 480 (minutos desde a meia-noite). */
function paraMinutos(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/** '08:00' → '8h'   ·   '17:30' → '17h30' */
function formataHora(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

/** Dias abertos com o mesmo horário viram uma linha só? Não — a tabela mostra
    dia a dia, igual ao Google, porque é o formato que as pessoas já conhecem. */
function textoDoDia(d) {
  return d.abre && d.fecha ? `${formataHora(d.abre)} às ${formataHora(d.fecha)}` : 'Fechado';
}

/* Fuso da loja. O selo diz se a GHR está aberta — quem consulta de outro
   estado (ou com o relógio do celular em outro fuso) precisa ver o horário de
   Coronel Fabriciano, não o dele. */
GHR.FUSO = 'America/Sao_Paulo';

/** { diaSemana: 0-6, minutos: 0-1439 } no fuso da loja. */
GHR.agoraNaLoja = function (agora) {
  const d = agora || new Date();
  try {
    const partes = new Intl.DateTimeFormat('en-US', {
      timeZone: GHR.FUSO, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
    }).formatToParts(d).reduce((acc, p) => (acc[p.type] = p.value, acc), {});

    const semana = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const hora = Number(partes.hour) % 24;      // '24' à meia-noite em alguns motores
    return {
      diaSemana: semana[partes.weekday],
      minutos: hora * 60 + Number(partes.minute)
    };
  } catch (e) {
    /* navegador sem suporte a timeZone no Intl: cai para o relógio local */
    return { diaSemana: d.getDay(), minutos: d.getHours() * 60 + d.getMinutes() };
  }
};

/**
 * Situação agora: { aberto, texto }.
 * Calculada no fuso da loja (ver GHR.agoraNaLoja).
 */
GHR.situacaoHorario = function (agora) {
  const dias = (GHR.business.horarios && GHR.business.horarios.dias) || [];
  if (!dias.length) return null;

  const local = GHR.agoraNaLoja(agora);
  const hoje = local.diaSemana;
  const min = local.minutos;
  const d = dias[hoje];

  if (d && d.abre && d.fecha) {
    const abre = paraMinutos(d.abre);
    const fecha = paraMinutos(d.fecha);
    if (min >= abre && min < fecha) {
      return { aberto: true, texto: `Aberto agora · fecha às ${formataHora(d.fecha)}` };
    }
    if (min < abre) {
      return { aberto: false, texto: `Fechado · abre hoje às ${formataHora(d.abre)}` };
    }
  }

  /* procura o próximo dia com expediente */
  for (let i = 1; i <= 7; i++) {
    const prox = dias[(hoje + i) % 7];
    if (prox && prox.abre) {
      const quando = i === 1 ? 'amanhã' : prox.nome.replace('-feira', '').toLowerCase();
      return { aberto: false, texto: `Fechado · abre ${quando} às ${formataHora(prox.abre)}` };
    }
  }
  return { aberto: false, texto: 'Fechado' };
};

/* ---------------------------- cartão de horários -------------------------- */
GHR.initHorarios = function () {
  const montagens = document.querySelectorAll('[data-c="horarios"]');
  if (!montagens.length) return;

  const cfg = GHR.business.horarios || {};
  const dias = cfg.dias || [];
  if (!dias.length) return;                       // sem dado, sem cartão

  if (cfg.confirmado === false) {
    console.warn(
      'GHR: os horários exibidos ainda são provisórios. ' +
      'Confirme em assets/js/data/business.js e mude "confirmado" para true.'
    );
  }

  /* A estrutura é montada uma vez só. O que muda com o relógio (o selo e a
     marcação do dia de hoje) é atualizado depois, sem tocar no resto — se
     recriássemos o HTML, a classe da animação de entrada seria apagada junto. */
  montagens.forEach(mount => {
    mount.classList.add('card-horas');

    const linhas = dias.map(d => `
        <tr data-dia="${d.nome}"${d.abre ? '' : ' class="fechado"'}>
          <th scope="row">${d.nome}</th>
          <td>${textoDoDia(d)}</td>
        </tr>`).join('');

    mount.innerHTML = `
      <h3>Horário de funcionamento</h3>
      <span class="selo" data-selo><i aria-hidden="true"></i><span data-selo-txt></span></span>
      <table class="tabela-horas">
        <caption class="sr-only">Horário de funcionamento por dia da semana</caption>
        <tbody>${linhas}</tbody>
      </table>`;
  });

  const atualiza = () => {
    const sit = GHR.situacaoHorario();
    const hoje = GHR.agoraNaLoja().diaSemana;

    montagens.forEach(mount => {
      const selo = mount.querySelector('[data-selo]');
      selo.classList.toggle('selo--aberto', sit.aberto);
      selo.classList.toggle('selo--fechado', !sit.aberto);
      mount.querySelector('[data-selo-txt]').textContent = sit.texto;

      mount.querySelectorAll('tbody tr').forEach((tr, i) => {
        tr.classList.toggle('hoje', i === hoje);
      });
    });
  };

  atualiza();

  /* o selo envelhece se a aba ficar aberta: recalcula a cada minuto e ao voltar */
  setInterval(atualiza, 60000);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) atualiza();
  });
};

/* --------------------------------- mapa ---------------------------------- */
GHR.initMapa = function () {
  document.querySelectorAll('[data-c="mapa"]').forEach(mount => {
    const e = GHR.business.endereco;
    if (!e.rua && !e.cidade) return;              // sem endereço, sem mapa

    mount.classList.add('mapa-bloco');
    mount.innerHTML = `
      <div class="mapa">
        <iframe
          src="${GHR.mapaEmbed()}"
          title="Localização da ${GHR.business.nome} no mapa"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          allowfullscreen></iframe>
      </div>
      <div class="mapa-pe">
        <p>
          <strong>${GHR.enderecoLinha()}</strong>
          <span class="small">Atendimento com hora marcada — combine antes pelo WhatsApp.</span>
        </p>
        <a class="btn btn--ghost" href="${GHR.mapsLink()}" target="_blank" rel="noopener">
          ${GHR.icon('pin', 18)} Como chegar
        </a>
      </div>`;
  });
};
