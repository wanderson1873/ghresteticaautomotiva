/* =============================================================================
   GHR ESTÉTICA AUTOMOTIVA — GALERIA
   -----------------------------------------------------------------------------
   Fotos reais da empresa (pasta ghr_esteticaautomotiva/), já selecionadas:
   fotos repetidas do mesmo trabalho e o card de divulgação foram deixados de
   fora. Vídeos não entram nesta versão do site.

   Campos:
     src   nome do arquivo dentro de assets/img/gallery/
     cat   categoria usada nos filtros da página /fotos/
           exterior | interior | pintura | motos | detalhes
     fase  o que a foto mostra — e é isto que impede o site de chamar de
           "finalizado" um veículo que está visivelmente em processo:
             'depois'      resultado entregue
             'antes'       estado em que o veículo chegou
             'processo'    execução (espuma, desmontagem, aplicação)
             'comparativo' montagem antes/depois na mesma imagem
           Sem o campo, o ALT não afirma fase nenhuma.
     alt   texto alternativo (acessibilidade e SEO). Quando ausente, é
           montado a partir de cat + fase por GHR.galleryAlt().
     data  data da publicação original
     top   true = entra na prévia da home

   Para acrescentar fotos: copie o arquivo para assets/img/gallery/ e adicione
   uma linha nesta lista.
   ========================================================================== */

window.GHR = window.GHR || {};

/* Rótulos dos filtros da galeria. A ordem aqui é a ordem dos botões. */
GHR.galleryFilters = [
  { id: 'todos',    label: 'Todos' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'pintura',  label: 'Pintura' },
  { id: 'motos',    label: 'Motos' },
  { id: 'detalhes', label: 'Detalhes' }
];


/* ALT montado a partir de categoria + fase.
   Antes, todas as fotos de uma categoria recebiam a mesma frase — e uma delas
   dizia "veículo finalizado" sobre uma foto de interior, outra sobre um motor
   coberto de espuma. Aqui o texto acompanha o que a foto mostra de fato.
   Fotos com `alt` próprio ignoram esta função. */
GHR.galleryAlt = function (g) {
  if (g.alt) return g.alt;

  const assunto = {
    exterior: 'Veículo',
    interior: 'Interior de veículo',
    pintura:  'Pintura de veículo',
    motos:    'Moto',
    detalhes: 'Detalhe de veículo'
  }[g.cat] || 'Veículo';

  const fase = {
    depois:      'após o serviço',
    antes:       'no estado em que chegou, antes do serviço',
    processo:    'durante a execução do serviço',
    comparativo: 'antes e depois do serviço, lado a lado'
  }[g.fase] || 'atendido';

  return `${assunto} ${fase} na GHR Estética Automotiva`;
};

GHR.gallery = [
  { src: 'ghr-001.jpg', cat: 'detalhes', fase: 'comparativo', data: '2020-11-14' },
  { src: 'ghr-002.jpg', cat: 'detalhes', fase: 'comparativo', data: '2020-12-02' },
  { src: 'ghr-003.jpg', cat: 'detalhes', fase: 'comparativo', data: '2020-12-02' },
  { src: 'ghr-004.jpg', cat: 'detalhes', data: '2020-12-02' },
  { src: 'ghr-005.jpg', cat: 'detalhes', fase: 'comparativo', data: '2020-12-22' },
  { src: 'ghr-006.jpg', cat: 'detalhes', fase: 'comparativo', data: '2020-12-22' },
  { src: 'ghr-007.jpg', cat: 'interior', fase: 'comparativo', data: '2020-12-22' },
  { src: 'ghr-008.jpg', cat: 'interior', fase: 'comparativo', data: '2020-12-22' },
  { src: 'ghr-015.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-016.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-017.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-018.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-019.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-020.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-021.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-022.jpg', cat: 'exterior', fase: 'depois', data: '2020-12-22' },
  { src: 'ghr-025.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-08' },
  { src: 'ghr-026.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-08' },
  { src: 'ghr-027.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-08' },
  { src: 'ghr-028.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-08' },
  { src: 'ghr-029.jpg', cat: 'exterior', fase: 'depois', data: '2021-01-21' },
  { src: 'ghr-030.jpg', cat: 'exterior', fase: 'depois', data: '2021-01-21' },
  { src: 'ghr-031.jpg', cat: 'exterior', fase: 'processo', data: '2021-01-21' },
  { src: 'ghr-032.jpg', cat: 'exterior', fase: 'depois', data: '2021-01-21' },
  { src: 'ghr-033.jpg', cat: 'detalhes', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-034.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-035.jpg', cat: 'interior', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-036.jpg', cat: 'exterior', fase: 'depois', alt: 'Lateral e rodas de veículo após a lavagem detalhada na GHR', data: '2021-01-21' },
  { src: 'ghr-037.jpg', cat: 'exterior', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-038.jpg', cat: 'exterior', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-039.jpg', cat: 'exterior', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-044.jpg', cat: 'motos', data: '2021-01-21' },
  { src: 'ghr-045.jpg', cat: 'motos', data: '2021-01-21' },
  { src: 'ghr-046.jpg', cat: 'motos', data: '2021-01-21' },
  { src: 'ghr-047.jpg', cat: 'detalhes', fase: 'comparativo', alt: 'Faróis antes e depois da revitalização na GHR, lado a lado', data: '2021-01-21' },
  { src: 'ghr-048.jpg', cat: 'motos', fase: 'comparativo', data: '2021-01-21' },
  { src: 'ghr-050.jpg', cat: 'exterior', data: '2021-02-06' },
  { src: 'ghr-051.jpg', cat: 'exterior', data: '2021-02-06' },
  { src: 'ghr-052.jpg', cat: 'exterior', data: '2021-02-06' },
  { src: 'ghr-053.jpg', cat: 'exterior', data: '2021-02-06' },
  { src: 'ghr-054.jpg', cat: 'motos', data: '2021-02-15' },
  { src: 'ghr-055.jpg', cat: 'motos', data: '2021-02-15' },
  { src: 'ghr-056.jpg', cat: 'motos', data: '2021-02-15' },
  { src: 'ghr-057.jpg', cat: 'motos', data: '2021-02-15' },
  { src: 'ghr-062.jpg', cat: 'detalhes', data: '2021-02-15', top: true },
  { src: 'ghr-063.jpg', cat: 'interior', fase: 'comparativo', data: '2021-03-01' },
  { src: 'ghr-064.jpg', cat: 'interior', fase: 'comparativo', data: '2021-03-01' },
  { src: 'ghr-065.jpg', cat: 'interior', fase: 'comparativo', data: '2021-03-01' },
  { src: 'ghr-066.jpg', cat: 'interior', fase: 'comparativo', data: '2021-03-01' },
  { src: 'ghr-072.jpg', cat: 'detalhes', fase: 'processo', data: '2021-03-07' },
  { src: 'ghr-073.jpg', cat: 'detalhes', fase: 'processo', data: '2021-03-07' },
  { src: 'ghr-074.jpg', cat: 'exterior', fase: 'processo', data: '2021-03-07' },
  { src: 'ghr-075.jpg', cat: 'exterior', fase: 'processo', data: '2021-03-07' },
  { src: 'ghr-078.jpg', cat: 'exterior', data: '2021-03-07', top: true },
  { src: 'ghr-079.jpg', cat: 'detalhes', data: '2021-03-10' },
  { src: 'ghr-080.jpg', cat: 'detalhes', data: '2021-03-10' },
  { src: 'ghr-081.jpg', cat: 'exterior', fase: 'depois', data: '2021-03-23' },
  { src: 'ghr-082.jpg', cat: 'exterior', fase: 'depois', data: '2021-03-23' },
  { src: 'ghr-083.jpg', cat: 'exterior', fase: 'depois', data: '2021-03-23' },
  { src: 'ghr-084.jpg', cat: 'interior', fase: 'comparativo', data: '2021-03-23' },
  { src: 'ghr-088.jpg', cat: 'exterior', fase: 'depois', data: '2021-03-27' },
  { src: 'ghr-089.jpg', cat: 'exterior', fase: 'processo', data: '2021-03-27' },
  { src: 'ghr-090.jpg', cat: 'pintura', fase: 'comparativo', data: '2021-03-27', top: true },
  { src: 'ghr-091.jpg', cat: 'pintura', fase: 'comparativo', data: '2021-03-27' },
  { src: 'ghr-093.jpg', cat: 'pintura', fase: 'comparativo', data: '2021-03-27', top: true },
  { src: 'ghr-095.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-15' },
  { src: 'ghr-096.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-15' },
  { src: 'ghr-097.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-15' },
  { src: 'ghr-098.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-15' },
  { src: 'ghr-099.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-15' },
  { src: 'ghr-104.jpg', cat: 'detalhes', fase: 'processo', data: '2021-04-20' },
  { src: 'ghr-105.jpg', cat: 'detalhes', fase: 'processo', data: '2021-04-20' },
  { src: 'ghr-106.jpg', cat: 'detalhes', fase: 'depois', data: '2021-04-20' },
  { src: 'ghr-107.jpg', cat: 'detalhes', fase: 'comparativo', data: '2021-04-20' },
  { src: 'ghr-108.jpg', cat: 'exterior', fase: 'depois', data: '2021-04-20', top: true },
  { src: 'ghr-110.jpg', cat: 'exterior', fase: 'comparativo', data: '2021-05-05' },
  { src: 'ghr-111.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-05', top: true },
  { src: 'ghr-112.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-05' },
  { src: 'ghr-113.jpg', cat: 'exterior', fase: 'processo', data: '2021-05-05' },
  { src: 'ghr-118.jpg', cat: 'interior', fase: 'depois', alt: 'Interior de veículo com bancos, painel e soleira limpos após a higienização na GHR', data: '2021-05-05', top: true },
  { src: 'ghr-120.jpg', cat: 'detalhes', data: '2021-05-05', top: true },
  { src: 'ghr-121.jpg', cat: 'interior', fase: 'comparativo', data: '2021-05-05' },
  { src: 'ghr-122.jpg', cat: 'interior', fase: 'comparativo', data: '2021-05-05' },
  { src: 'ghr-123.jpg', cat: 'interior', fase: 'comparativo', data: '2021-05-05' },
  { src: 'ghr-127.jpg', cat: 'detalhes', fase: 'comparativo', data: '2021-05-12' },
  { src: 'ghr-128.jpg', cat: 'motos', fase: 'depois', data: '2021-05-13' },
  { src: 'ghr-129.jpg', cat: 'motos', fase: 'depois', data: '2021-05-13' },
  { src: 'ghr-130.jpg', cat: 'motos', fase: 'comparativo', data: '2021-05-13' },
  { src: 'ghr-131.jpg', cat: 'motos', fase: 'comparativo', data: '2021-05-13' },
  { src: 'ghr-134.jpg', cat: 'detalhes', fase: 'comparativo', data: '2021-05-23' },
  { src: 'ghr-135.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23', top: true },
  { src: 'ghr-136.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-137.jpg', cat: 'exterior', fase: 'processo', data: '2021-05-23' },
  { src: 'ghr-138.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-143.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23', top: true },
  { src: 'ghr-144.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-145.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-146.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-147.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-23' },
  { src: 'ghr-148.jpg', cat: 'detalhes', fase: 'comparativo', data: '2021-05-23', top: true },
  { src: 'ghr-151.jpg', cat: 'detalhes', fase: 'comparativo', alt: 'Frisos e plásticos externos antes e depois da revitalização na GHR', data: '2021-05-23' },
  { src: 'ghr-154.jpg', cat: 'exterior', fase: 'processo', data: '2021-05-26' },
  { src: 'ghr-155.jpg', cat: 'exterior', fase: 'depois', data: '2021-05-26' },
  { src: 'ghr-156.jpg', cat: 'detalhes', fase: 'processo', data: '2021-05-26' },
  { src: 'ghr-157.jpg', cat: 'detalhes', fase: 'depois', data: '2021-05-26' },
  { src: 'ghr-159.jpg', cat: 'interior', fase: 'comparativo', data: '2021-05-26' },
  { src: 'ghr-163.jpg', cat: 'detalhes', fase: 'processo', alt: 'Motor e vão do capô cobertos de espuma durante a lavagem na GHR', data: '2021-05-27' },
  { src: 'ghr-164.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-01' },
  { src: 'ghr-165.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-01' },
  { src: 'ghr-166.jpg', cat: 'interior', fase: 'comparativo', data: '2021-09-01' },
  { src: 'ghr-167.jpg', cat: 'interior', fase: 'comparativo', data: '2021-09-01' },
  { src: 'ghr-168.jpg', cat: 'interior', fase: 'comparativo', data: '2021-09-01', top: true },
  { src: 'ghr-174.jpg', cat: 'motos', fase: 'depois', data: '2021-09-02' },
  { src: 'ghr-175.jpg', cat: 'motos', fase: 'depois', data: '2021-09-02' },
  { src: 'ghr-176.jpg', cat: 'motos', fase: 'comparativo', data: '2021-09-02' },
  { src: 'ghr-177.jpg', cat: 'motos', fase: 'comparativo', data: '2021-09-02' },
  { src: 'ghr-184.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-04' },
  { src: 'ghr-185.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-04' },
  { src: 'ghr-186.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-04' },
  { src: 'ghr-187.jpg', cat: 'exterior', fase: 'depois', data: '2021-09-04', top: true },
  { src: 'ghr-189.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-10', top: true },
  { src: 'ghr-190.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-10' },
  { src: 'ghr-191.jpg', cat: 'exterior', fase: 'comparativo', data: '2022-02-10' },
  { src: 'ghr-192.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-10' },
  { src: 'ghr-195.jpg', cat: 'detalhes', data: '2022-02-10', top: true },
  { src: 'ghr-199.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-17', top: true },
  { src: 'ghr-200.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-17' },
  { src: 'ghr-201.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-17' },
  { src: 'ghr-202.jpg', cat: 'exterior', fase: 'depois', data: '2022-02-17' },
  { src: 'ghr-205.jpg', cat: 'pintura', fase: 'comparativo', data: '2022-02-17', top: true },
  { src: 'ghr-208.jpg', cat: 'exterior', fase: 'depois', data: '2022-09-29', top: true },
  { src: 'ghr-209.jpg', cat: 'exterior', fase: 'depois', data: '2022-09-29', top: true },
  { src: 'ghr-210.jpg', cat: 'pintura', fase: 'comparativo', data: '2022-09-29' },
  { src: 'ghr-211.jpg', cat: 'pintura', fase: 'comparativo', data: '2022-09-29' },
  { src: 'ghr-212.jpg', cat: 'interior', fase: 'comparativo', data: '2022-09-29' },
  { src: 'ghr-213.jpg', cat: 'exterior', alt: 'Veículo finalizado na GHR Estética Automotiva', data: '2022-09-29', top: true }
];
