/* =============================================================================
   GHR ESTÉTICA AUTOMOTIVA — PARCERIAS (B2B)
   -----------------------------------------------------------------------------
   Conteúdo da página /parcerias/, voltada a empresas que querem atendimento
   recorrente para os veículos delas.

   NADA AQUI PROMETE NÚMERO, DESCONTO OU PRAZO — a página fala do processo e
   abre a conversa. Condições comerciais são combinadas caso a caso, porque
   dependem de volume e frequência. Se um dia a GHR definir uma tabela para
   empresas, é aqui que ela entra.
   ========================================================================== */

window.GHR = window.GHR || {};

/* Perfis de empresa atendidos. Editar/duplicar os blocos abaixo é suficiente:
   a página se monta sozinha a partir desta lista.
   icone: chave em components/icons.js                                        */
GHR.partnerPerfis = [
  {
    icone: 'car',
    titulo: 'Frotas',
    texto: 'Empresas com veículos próprios que precisam manter a apresentação ' +
           'em dia sem parar a operação.'
  },
  {
    icone: 'tag',
    titulo: 'Revendas e lojas de veículos',
    texto: 'Preparação de veículos para exposição e para entrega ao comprador — ' +
           'carro pronto vende mais rápido.'
  },
  {
    icone: 'key',
    titulo: 'Locadoras',
    texto: 'Higienização e limpeza entre uma locação e outra, com rotina ' +
           'combinada e previsível.'
  },
  {
    icone: 'wrench',
    titulo: 'Oficinas e funilarias',
    texto: 'Acabamento e polimento depois do reparo, para o veículo voltar ao ' +
           'cliente no padrão certo.'
  },
  {
    icone: 'wheel',
    titulo: 'Motoristas de aplicativo',
    texto: 'Quem roda o dia inteiro e precisa do carro limpo por dentro — ' +
           'atendimento por frequência.'
  },
  {
    icone: 'building',
    titulo: 'Outros negócios',
    texto: 'Condomínios, transportadoras, hotéis e qualquer empresa que dependa ' +
           'da aparência dos veículos.'
  }
];

/* Como a parceria é montada, do primeiro contato à rotina. */
GHR.partnerEtapas = [
  {
    n: '01',
    titulo: 'Você chama',
    texto: 'Pelo formulário desta página ou direto no WhatsApp. Conte o segmento ' +
           'da empresa e quantos veículos são.'
  },
  {
    n: '02',
    titulo: 'A gente avalia',
    texto: 'Entendemos o tipo de veículo, o estado em que costumam chegar e com ' +
           'que frequência o serviço é necessário.'
  },
  {
    n: '03',
    titulo: 'Condições combinadas',
    texto: 'Valor e prazo são definidos conforme volume e frequência — proposta ' +
           'fechada antes de qualquer serviço.'
  },
  {
    n: '04',
    titulo: 'Rotina em andamento',
    texto: 'Agenda reservada para a empresa, com horários previsíveis e ' +
           'atendimento direto com a equipe.'
  }
];

/* Segmentos oferecidos no formulário (o primeiro é o texto neutro). */
GHR.partnerSegmentos = [
  'Frota própria',
  'Revenda / loja de veículos',
  'Locadora',
  'Oficina / funilaria',
  'Motorista de aplicativo',
  'Concessionária',
  'Outro'
];

/* Faixas de volume — ajudam a GHR a dimensionar antes mesmo de responder. */
GHR.partnerVolumes = [
  'Até 5 veículos',
  'De 6 a 15 veículos',
  'De 16 a 40 veículos',
  'Mais de 40 veículos'
];
