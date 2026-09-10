/* =============================================================================
   GHR ESTÉTICA AUTOMOTIVA — SERVIÇOS
   -----------------------------------------------------------------------------
   Os NOMES abaixo são os serviços reais divulgados pela própria empresa
   (card de divulgação — foto ghr-049.jpg). As DESCRIÇÕES são provisórias e
   precisam ser revisadas: estão marcadas com  // TEXTO PROVISÓRIO.

   PREÇOS: use  preco: null  enquanto não houver valor definido.
           Com null o site não mostra nada (nem "sob consulta", nem "R$ 0").
           Para exibir, escreva o texto exato:  preco: 'R$ 180'
                                                preco: 'a partir de R$ 250'

   Cada serviço vira automaticamente:
     • um card na página  /servicos/
     • uma página própria em  /servicos/<slug>/
   Para publicar a página de um serviço novo, copie a pasta de um serviço
   existente e troque o valor de  data-servico  no index.html de dentro dela.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.services = [
  {
    slug: 'lavagem-tradicional',
    objetivo: 'limpar',
    nome: 'Lavagem Tradicional',
    categoria: 'Lavagem',
    resumo: 'Limpeza externa completa para manter o veículo em dia.', // TEXTO PROVISÓRIO
    descricao: 'Rotina de limpeza externa com produtos neutros, cuidado com rodas, pneus e vidros, e secagem feita sem arrastar sujeira sobre a pintura.', // TEXTO PROVISÓRIO
    inclui: ['Lavagem externa', 'Rodas e pneus', 'Vidros', 'Secagem'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Técnica que reduz o risco de marcas', texto: 'Produtos neutros e secagem feita para não arrastar partículas sobre o verniz.' },
      { titulo: 'Rápido e no horário', texto: 'Serviço de manutenção, pensado para quem usa o carro todos os dias.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-089.jpg',
    galeria: ['ghr-089.jpg', 'ghr-088.jpg', 'ghr-199.jpg'],
    preco: null,
    destaque: false
  },
  {
    slug: 'lavagem-detalhada',
    objetivo: 'limpar',
    nome: 'Lavagem Detalhada',
    categoria: 'Lavagem',
    resumo: 'Limpeza ponto a ponto, incluindo o que a lavagem comum não alcança.', // TEXTO PROVISÓRIO
    descricao: 'Processo em etapas: pré-lavagem, lavagem com produto específico, limpeza de caixas de roda, frisos, soleiras e acabamentos, e secagem controlada.', // TEXTO PROVISÓRIO
    inclui: ['Pré-lavagem', 'Lavagem em etapas', 'Caixas de roda e frisos', 'Soleiras e acabamentos', 'Secagem controlada'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Cada detalhe limpo', texto: 'Frisos, grades, soleiras e cantos que ficam de fora da lavagem comum.' },
      { titulo: 'Base para proteção', texto: 'Superfície preparada para receber polimento, cristalização ou vitrificação.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-120.jpg',
    galeria: ['ghr-120.jpg', 'ghr-148.jpg', 'ghr-118.jpg'],
    preco: null,
    destaque: false
  },
  {
    slug: 'polimento-tecnico',
    objetivo: 'brilho',
    nome: 'Polimento Técnico',
    categoria: 'Pintura',
    resumo: 'Correção da pintura conforme o estado do verniz: riscos finos, marcas de lavagem e opacidade.', // TEXTO PROVISÓRIO
    descricao: 'Avaliação da pintura sob luz de inspeção e trabalho com máquina e abrasivos adequados ao tipo e à espessura do verniz. O quanto dá para corrigir depende do estado de cada veículo — isso é avaliado antes, com você.', // TEXTO PROVISÓRIO
    inclui: ['Avaliação da pintura', 'Descontaminação', 'Correção com máquina', 'Refino e realce de brilho'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Reflexo nítido', texto: 'A pintura volta a refletir sem o véu de riscos circulares.' },
      { titulo: 'Valoriza o veículo', texto: 'Diferença visível na apresentação, especialmente em cores escuras.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-109.jpg',
    galeria: ['ghr-093.jpg', 'ghr-090.jpg', 'ghr-205.jpg', 'ghr-210.jpg'],
    preco: null,
    destaque: true
  },
  {
    slug: 'cristalizacao',
    objetivo: 'proteger',
    nome: 'Cristalização',
    categoria: 'Proteção',
    resumo: 'Tratamento que realça o brilho e cria uma camada sobre a pintura.', // TEXTO PROVISÓRIO
    descricao: 'Aplicação de produto que forma uma película protetora sobre o verniz, deixando a superfície mais lisa, mais brilhante e mais fácil de limpar no dia a dia.', // TEXTO PROVISÓRIO
    inclui: ['Preparo da superfície', 'Aplicação do produto', 'Finalização'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Brilho realçado', texto: 'Superfície mais lisa reflete melhor a luz.' },
      { titulo: 'Limpeza mais fácil', texto: 'A sujeira tem menos aderência à pintura tratada.' }
    ], // TEXTO PROVISÓRIO
    /* A capa anterior (ghr-195) traz escrito "Cristalização de vidros" na
       própria foto, enquanto o texto deste serviço fala de pintura. Enquanto
       não houver confirmação de que vidros é um serviço à parte, a capa passa
       a ser pintura tratada. ghr-151 (friso/plástico) foi para revitalização. */
    imagem: 'ghr-092.jpg',
    galeria: ['ghr-092.jpg', 'ghr-091.jpg', 'ghr-093.jpg'],
    preco: null,
    destaque: false
  },
  {
    slug: 'espelhamento',
    objetivo: 'brilho',
    nome: 'Espelhamento',
    categoria: 'Pintura',
    resumo: 'Acabamento de alto brilho, com a pintura trabalhada até o reflexo ficar limpo.', // TEXTO PROVISÓRIO
    descricao: 'Etapa de refino que leva a pintura ao máximo de nitidez possível para o estado do veículo, eliminando o hologramado deixado por polimentos mal executados.', // TEXTO PROVISÓRIO
    inclui: ['Refino da pintura', 'Remoção de hologramas', 'Realce final de brilho'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Reflexo limpo', texto: 'Sem marcas circulares aparecendo sob luz direta.' },
      { titulo: 'Acabamento de vitrine', texto: 'O nível de brilho que se espera de um veículo recém-entregue.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-090.jpg',
    galeria: ['ghr-090.jpg', 'ghr-093.jpg', 'ghr-211.jpg'],
    preco: null,
    destaque: false
  },
  {
    slug: 'vitrificacao',
    objetivo: 'proteger',
    nome: 'Vitrificação',
    categoria: 'Proteção',
    resumo: 'Proteção de longa duração para a pintura, com efeito hidrofóbico.', // TEXTO PROVISÓRIO
    descricao: 'Camada protetora aplicada sobre a pintura já corrigida. Aumenta a resistência do acabamento no uso diário e faz a água escorrer levando parte da sujeira junto.', // TEXTO PROVISÓRIO
    inclui: ['Correção prévia da pintura', 'Descontaminação', 'Aplicação da camada', 'Cura e revisão'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Proteção que dura mais que a cera', texto: 'Barreira sobre o verniz contra sujeira e intempéries do uso diário. A duração depende do uso, da exposição ao sol e da manutenção.' },
      { titulo: 'Efeito hidrofóbico', texto: 'A água escorre em gotas e leva parte da sujeira embora.' },
      { titulo: 'Menos manutenção', texto: 'Lavagens mais rápidas e resultado que se mantém por mais tempo.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'banco-vitrificacao.jpg',
    galeria: ['ghr-209.jpg', 'ghr-208.jpg', 'ghr-213.jpg', 'ghr-135.jpg'],
    preco: null,
    destaque: true
  },
  {
    slug: 'higienizacao',
    objetivo: 'interior',
    nome: 'Higienização',
    categoria: 'Interior',
    resumo: 'Limpeza profunda do interior: bancos, carpete, teto, painel e acabamentos.', // TEXTO PROVISÓRIO
    descricao: 'Higienização do interior com produtos específicos para cada material — tecido, couro, plástico e vidro — para retirar a sujeira acumulada de dentro da trama. Manchas antigas e odores impregnados são avaliados caso a caso: alguns saem por completo, outros reduzem.', // TEXTO PROVISÓRIO
    inclui: ['Bancos', 'Carpete e tapetes', 'Teto e colunas', 'Painel e console', 'Porta-malas'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Ambiente limpo', texto: 'Sujeira removida de dentro do tecido, não apenas da superfície.' },
      { titulo: 'Produto certo', texto: 'Cada material recebe o produto adequado, sem ressecar plástico nem manchar couro.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-118.jpg',
    galeria: ['ghr-168.jpg', 'ghr-212.jpg', 'ghr-159.jpg', 'ghr-118.jpg'],
    preco: null,
    destaque: true
  },
  {
    slug: 'revitalizacao',
    objetivo: 'acabamento',
    nome: 'Revitalização',
    categoria: 'Detalhes',
    resumo: 'Recuperação de plásticos, faróis e acabamentos desgastados pelo tempo.', // TEXTO PROVISÓRIO
    descricao: 'Tratamento de plásticos externos ressecados, faróis amarelados e acabamentos que perderam a cor original, devolvendo aspecto de conservado ao conjunto.', // TEXTO PROVISÓRIO
    inclui: ['Plásticos externos', 'Faróis e lanternas', 'Frisos e grades'], // TEXTO PROVISÓRIO
    beneficios: [
      { titulo: 'Aspecto recuperado', texto: 'Peças que estavam cinzentas e opacas voltam à cor.' },
      { titulo: 'Visibilidade', texto: 'Farol transparente ilumina melhor à noite.' }
    ], // TEXTO PROVISÓRIO
    imagem: 'ghr-148.jpg',
    galeria: ['ghr-148.jpg', 'ghr-151.jpg', 'ghr-107.jpg', 'ghr-134.jpg'],
    preco: null,
    destaque: false
  }
];


/* ---------------------------------------------------------------------------
   AGRUPAMENTO POR NECESSIDADE
   A pessoa que chega ao site sabe o problema ("o banco está encardido", "a
   pintura perdeu o brilho"), não o nome técnico do serviço. A página de
   serviços passa a abrir por necessidade e só depois nomear o serviço.
   Cada serviço aponta um `objetivo`; a ordem dos grupos é a daqui.
--------------------------------------------------------------------------- */
GHR.objetivos = [
  { id: 'limpar',     titulo: 'Manter o carro limpo',
    texto: 'Rotina de limpeza — a diferença entre as duas está no que é desmontado e no que é alcançado.' },
  { id: 'brilho',     titulo: 'Recuperar brilho e aparência',
    texto: 'Trabalho na pintura. O quanto dá para corrigir depende do estado e da espessura do verniz, avaliados antes.' },
  { id: 'proteger',   titulo: 'Conservar a pintura',
    texto: 'Camada de proteção sobre a pintura já corrigida. A duração depende do uso, da exposição ao sol e da manutenção.' },
  { id: 'interior',   titulo: 'Limpar o interior',
    texto: 'Bancos, carpete, teto e acabamentos, com produto próprio para cada material.' },
  { id: 'acabamento', titulo: 'Recuperar acabamentos',
    texto: 'Plásticos ressecados, faróis amarelados e frisos que perderam a cor.' }
];

GHR.porObjetivo = function () {
  return GHR.objetivos
    .map(o => Object.assign({}, o, { itens: GHR.services.filter(s => s.objetivo === o.id) }))
    .filter(o => o.itens.length);
};

/* Helpers usados pelos componentes. */
GHR.getService = (slug) => GHR.services.find(s => s.slug === slug) || null;
GHR.destaques  = () => GHR.services.filter(s => s.destaque);
GHR.categorias = () => [...new Set(GHR.services.map(s => s.categoria))];
