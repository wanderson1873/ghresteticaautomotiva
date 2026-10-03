/* =============================================================================
   GHR ESTÉTICA AUTOMOTIVA — CONTEÚDO DAS SEÇÕES DA HOME
   -----------------------------------------------------------------------------
   Listas usadas pelos componentes da página inicial. Os títulos e parágrafos
   grandes ficam no próprio index.html (melhor para SEO); aqui ficam só os
   blocos repetidos, para você editar em um lugar só.

   TODOS OS TEXTOS ABAIXO SÃO PROVISÓRIOS e podem ser reescritos à vontade.
   ========================================================================== */

window.GHR = window.GHR || {};

/* Seção com rolagem sticky — "Cuidado em cada etapa".
   Desde 10/2026 as quatro fotos são da GHR (cenário novo, tiradas dos vídeos
   por ferramentas/extrair-quadros.py) — nenhuma imagem de banco no site.
   O campo legenda continua: o rótulo aparece na tela. */
GHR.etapas = [
  {
    n: '01',
    titulo: 'Limpeza',
    texto: 'Tudo começa com a sujeira fora do caminho: pré-lavagem, lavagem em etapas e limpeza dos pontos que ficam escondidos.',
    imagem: 'ghr-v16-q.jpg',
    alt: 'SUV azul limpo no box da GHR, com piso quadriculado e luzes de LED',
    legenda: 'Trabalho da GHR'
  },
  {
    n: '02',
    titulo: 'Correção',
    /* Antes: 'riscos ... saem no polimento'. Absoluto demais — o que sai
       depende do estado e da espessura do verniz. */
    texto: 'Com a superfície limpa dá para ver o que precisa de trabalho. Sob luz de inspeção avaliamos riscos finos, marcas de lavagem e opacidade, e corrigimos o que o estado do verniz permite.',
    /* A foto de banco anterior (banco-etapa-02.jpg) mostrava uma pessoa com
       borrifador e pano, o que não é correção de pintura — e ainda com
       uniforme de outra operação. Esta é a comparação real antes/depois sob
       luz de inspeção, feita pela GHR. */
    imagem: 'ghr-210.jpg',
    alt: 'Lataria antes e depois da correção, comparada sob a mesma luz de inspeção',
    legenda: 'Trabalho da GHR — antes e depois sob luz de inspeção'
  },
  {
    n: '03',
    titulo: 'Proteção',
    texto: 'A pintura corrigida recebe a camada de proteção — mais brilho, menos sujeira aderindo e resultado que se mantém por mais tempo com a manutenção combinada.',
    imagem: 'ghr-v12-q.jpg',
    alt: 'Sedã azul com a pintura brilhando sob o teto de LED da GHR',
    legenda: 'Trabalho da GHR'
  },
  {
    n: '04',
    titulo: 'Acabamento',
    texto: 'Revisão item por item antes da entrega: vidros, frisos, plásticos, rodas e interior conferidos de perto.',
    imagem: 'ghr-v21-q.jpg',
    alt: 'Forro de porta e soleira limpos, conferidos antes da entrega',
    legenda: 'Trabalho da GHR'
  }
];

/* Diferenciais — "Por que escolher a GHR" */
GHR.diferenciais = [
  {
    icone: 'zoom',
    titulo: 'Atenção aos detalhes',
    texto: 'Frisos, soleiras, grades e cantos recebem o mesmo cuidado das áreas que todo mundo vê.'
  },
  {
    icone: 'brush',
    titulo: 'Produto certo para cada superfície',
    texto: 'Pintura, plástico, couro, tecido e vidro pedem produtos diferentes — e é assim que são tratados.'
  },
  {
    icone: 'spark',
    titulo: 'Revisão antes da entrega',
    texto: 'Vidros, frisos, plásticos, rodas e interior são conferidos item por item antes de o veículo sair.'
  },
  {
    icone: 'shield',
    titulo: 'Cuidado com seu veículo',
    texto: 'Processos pensados para preservar pintura e acabamentos, sem atalho que compromete o carro.'
  }
];

/* "Buscamos seu carro" não entra aqui de propósito: já tem faixa própria na
   home e aparece na etapa 03 do processo. Repetir pela terceira vez na mesma
   página enfraquece o destaque em vez de reforçar. */

/* Processo — "Como funciona" */
GHR.processo = [
  { n: '01', titulo: 'Escolha o serviço', texto: 'Veja o que faz sentido para o seu veículo — ou pergunte, que a gente indica.' },
  { n: '02', titulo: 'Entre em contato',  texto: 'Pelo WhatsApp você combina o serviço, o prazo e o melhor horário.' },
  { n: '03', titulo: 'Traga ou peça a busca', texto: 'No dia combinado você deixa o veículo na oficina — ou a GHR busca no seu endereço.' },
  { n: '04', titulo: 'Retire renovado',   texto: 'Você recebe o veículo pronto, com orientação de como conservar o resultado.' }
];

/* Seção de destaque — limpeza de estofado.
   Fotos reais de antes/depois. A primeira aparece em tamanho grande. */
GHR.estofado = [
  { src: 'ghr-063.jpg', alt: 'Banco de tecido antes e depois da limpeza de estofado na GHR' },
  { src: 'ghr-168.jpg', alt: 'Banco de couro antes e depois da higienização na GHR' },
  { src: 'ghr-027.jpg', alt: 'Encosto e assento de tecido recuperados após a limpeza' },
  { src: 'ghr-212.jpg', alt: 'Banco esportivo antes e depois da higienização' },
  { src: 'ghr-160.jpg', alt: 'Banco traseiro de couro claro antes e depois da limpeza' }
];

/* O que entra na limpeza de estofado (marcado como provisório). */
GHR.estofadoItens = [
  'Bancos de tecido',
  'Bancos de couro',
  'Forro de teto',
  'Carpete e tapetes',
  'Cintos de segurança',
  'Porta-malas'
]; // TEXTO PROVISÓRIO

/* Prévia da galeria na home — a primeira foto é a grande do mosaico.
   Critério de seleção (auditoria de 09/2026): horizonte nivelado, veículo
   inteiro e serviço legível. Saíram daqui ghr-097 e ghr-186 (traseira e frente
   cortadas na diagonal) e ghr-213 deixou de ser a principal, porque a rua e a
   fachada ocupavam mais quadro que o carro. As três continuam em /fotos/. */
GHR.galleryHome = [
  /* 10/2026: só o cenário novo (parede azul, teto de LED), em recortes 4:5
     que o mosaico mostra inteiros. As fotos antigas continuam em /fotos/. */
  { src: 'ghr-v18-q.jpg', alt: 'SUV preto finalizado no box da GHR, sob o teto de LED' },
  { src: 'ghr-v10-q.jpg', alt: 'Sedã preto polido refletindo as luzes de LED' },
  { src: 'ghr-v11-q.jpg', alt: 'Capô azul-escuro espelhado refletindo o teto de LED' },
  { src: 'ghr-v19-q.jpg', alt: 'SUV preto de frente com a pintura brilhando' },
  { src: 'ghr-v16-q.jpg', alt: 'SUV azul limpo no box da GHR' }
];
