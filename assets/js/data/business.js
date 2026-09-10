/* =============================================================================
   GHR ESTÉTICA AUTOMOTIVA — DADOS DA EMPRESA
   -----------------------------------------------------------------------------
   Este é o arquivo que você edita para atualizar contato, endereço e horários.
   Tudo aparece automaticamente em todas as páginas do site.

   ORIGEM DOS DADOS ABAIXO:
   • whatsapp / instagram / endereco  → lidos do card de divulgação da própria
     empresa (foto ghr-049.jpg) e do perfil do Instagram. CONFIRME se continuam
     válidos antes de publicar.
   • Campos com valor "" (vazio) ou null NÃO aparecem no site — nada é inventado.
     Basta preencher para o bloco correspondente surgir sozinho.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.business = {

  /* --------------------------- identidade --------------------------- */
  nome:      'GHR Estética Automotiva',
  nomeCurto: 'GHR',
  descricao: 'Estética automotiva em Coronel Fabriciano — lavagem detalhada, ' +
             'polimento técnico, vitrificação e higienização.',

  /* ---------------------------- contato ----------------------------- */
  // Número internacional só com dígitos: 55 + DDD + número (usado nos links)
  whatsapp:       '5531986926513',      // ← confirmar
  telefone:       '(31) 98692-6513',    // ← como aparece na tela
  email:          '',                   // ← vazio = não aparece no site

  /* ---------------------------- endereço ---------------------------- */
  endereco: {
    rua:    'Rua Caiapós, 143',         // ← confirmar
    bairro: 'Caladinho de Cima',
    cidade: 'Coronel Fabriciano',
    uf:     'MG',
    cep:    ''                          // ← vazio = não aparece
  },

  /* ----------------------------- redes ------------------------------ */
  instagram:       'https://www.instagram.com/ghr_esteticaautomotiva/',
  instagramHandle: '@ghr_esteticaautomotiva',
  facebook:        '',                  // ← vazio = ícone não aparece

  /* --------------------------- horários -----------------------------
     Confirmado pela empresa: segunda a sábado, 8h às 18h; domingo fechado.

     Cada dia usa 24h: abre/fecha como 'HH:MM', ou null nos dois campos
     para marcar fechado. A ordem começa no domingo (padrão do JavaScript).
     Para esconder o cartão inteiro, deixe  dias: []

     ATENÇÃO: este horário também está no JSON-LD (schema.org) de index.html
     e contato/index.html — é o que faz o Google mostrar "aberto/fechado" na
     busca. Se mudar aqui, atualize lá também.                               */
  horarios: {
    confirmado: true,
    dias: [
      { nome: 'Domingo',       abre: null,    fecha: null    },
      { nome: 'Segunda-feira', abre: '08:00', fecha: '18:00' },
      { nome: 'Terça-feira',   abre: '08:00', fecha: '18:00' },
      { nome: 'Quarta-feira',  abre: '08:00', fecha: '18:00' },
      { nome: 'Quinta-feira',  abre: '08:00', fecha: '18:00' },
      { nome: 'Sexta-feira',   abre: '08:00', fecha: '18:00' },
      { nome: 'Sábado',        abre: '08:00', fecha: '18:00' }
    ]
  },

  /* ----------------------- formas de pagamento ----------------------
     Confirmado pela empresa. Deixe [] para ocultar o bloco.              */
  pagamentos: [
    'Cartão de crédito',
    'Pix',
    'Dinheiro'
  ],

  /* ------------------------- observações ----------------------------
     Outras frases curtas do bloco de contato (prazo, formas de agendar…).
     Deixe [] para ocultar.                                               */
  observacoes: [],

  /* --------------------- mensagens do WhatsApp ----------------------- */
  mensagens: {
    padrao:  'Olá! Vim pelo site da GHR e gostaria de mais informações.',
    servico: (nome) => `Olá! Vim pelo site da GHR e tenho interesse em ${nome}. Pode me passar mais informações?`
  }
};

/* Link pronto do WhatsApp — usado por todos os componentes. */
GHR.waLink = function (msg) {
  const n = (GHR.business.whatsapp || '').replace(/\D/g, '');
  const t = encodeURIComponent(msg || GHR.business.mensagens.padrao);
  return `https://wa.me/${n}?text=${t}`;
};

/* Endereço em uma linha (ignora campos vazios). */
GHR.enderecoLinha = function () {
  const e = GHR.business.endereco;
  return [e.rua, e.bairro, [e.cidade, e.uf].filter(Boolean).join(' — ')]
    .filter(Boolean).join(', ');
};

/* Endereço no formato que o Google Maps entende na busca. */
GHR.enderecoBusca = function () {
  const e = GHR.business.endereco;
  return [e.rua, e.bairro, e.cidade && `${e.cidade} - ${e.uf}`]
    .filter(Boolean).join(', ');
};

/* Mapa incorporado — o parâmetro output=embed não exige chave de API. */
GHR.mapaEmbed = function () {
  return 'https://www.google.com/maps?q=' +
         encodeURIComponent(GHR.enderecoBusca()) + '&output=embed';
};

/* Link do Google Maps montado a partir do endereço acima. */
GHR.mapsLink = function () {
  const q = encodeURIComponent(GHR.business.nome + ' ' + GHR.enderecoLinha());
  return 'https://www.google.com/maps/search/?api=1&query=' + q;
};
