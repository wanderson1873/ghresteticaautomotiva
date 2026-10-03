/* =============================================================================
   SERVIÇOS — ARQUIVO GERADO. NÃO EDITE.
   -----------------------------------------------------------------------------
   Fonte: ferramentas/servicos.py  →  python ferramentas/gerar-paginas-servicos.py
   Usado pelo menu, rodapé, cards da home e formulário de contato. As páginas
   /servicos/ já saem em HTML pronto do mesmo script.
   ========================================================================== */

window.GHR = window.GHR || {};

GHR.services = [
  {
    "slug": "lavagem-tradicional",
    "nome": "Lavagem Tradicional",
    "categoria": "Lavagem",
    "bloco": "lavagem",
    "resumo": "Lavagem externa caprichada para o dia a dia.",
    "descricao": "Lavagem tradicional em Coronel Fabriciano: carroceria, rodas, pneus e vidros com produto neutro e secagem sem riscar a pintura.",
    "imagem": "ghr-v16-q.jpg",
    "altImagem": "SUV azul limpo no box da GHR Estética Automotiva, em Coronel Fabriciano",
    "preco": null,
    "destaque": false
  },
  {
    "slug": "lavagem-detalhada",
    "nome": "Lavagem Detalhada",
    "categoria": "Lavagem",
    "bloco": "lavagem",
    "resumo": "Limpeza ponto a ponto, onde a lavagem comum não chega.",
    "descricao": "Lavagem detalhada em Coronel Fabriciano: pré-lavagem, caixas de roda, frisos, soleiras e acabamentos, por dentro e por fora.",
    "imagem": "ghr-v18-q.jpg",
    "altImagem": "SUV preto limpo e brilhando sob as luzes de LED da GHR Estética Automotiva",
    "preco": null,
    "destaque": false
  },
  {
    "slug": "polimento-tecnico",
    "nome": "Polimento Técnico",
    "categoria": "Pintura",
    "bloco": "pintura",
    "resumo": "Tira riscos finos, marcas de lavagem e opacidade.",
    "descricao": "Polimento técnico em Coronel Fabriciano: correção da pintura com máquina, avaliando o verniz antes. Remove riscos finos e devolve o brilho.",
    "imagem": "ghr-v10-q.jpg",
    "altImagem": "Sedã preto polido refletindo as luzes de LED da GHR Estética Automotiva",
    "preco": null,
    "destaque": true
  },
  {
    "slug": "espelhamento",
    "nome": "Espelhamento",
    "categoria": "Pintura",
    "bloco": "pintura",
    "resumo": "Brilho máximo, com reflexo de espelho.",
    "descricao": "Espelhamento de pintura em Coronel Fabriciano: refino que leva o brilho ao máximo e elimina o hologramado de polimentos mal feitos.",
    "imagem": "ghr-v11-q.jpg",
    "altImagem": "Capô azul-escuro espelhado refletindo as luzes de LED da GHR Estética Automotiva",
    "preco": null,
    "destaque": false
  },
  {
    "slug": "cristalizacao",
    "nome": "Cristalização",
    "categoria": "Proteção",
    "bloco": "protecao",
    "resumo": "Realça o brilho e facilita a limpeza.",
    "descricao": "Cristalização de pintura em Coronel Fabriciano: película protetora que deixa a pintura mais lisa, brilhante e fácil de limpar.",
    "imagem": "ghr-v12-q.jpg",
    "altImagem": "Capô de sedã azul brilhando após cristalização na GHR Estética Automotiva",
    "preco": null,
    "destaque": false
  },
  {
    "slug": "vitrificacao",
    "nome": "Vitrificação",
    "categoria": "Proteção",
    "bloco": "protecao",
    "resumo": "Proteção de longa duração, a água escorre.",
    "descricao": "Vitrificação de pintura em Coronel Fabriciano: camada protetora de longa duração com efeito hidrofóbico, aplicada sobre a pintura corrigida.",
    "imagem": "ghr-v19-q.jpg",
    "altImagem": "SUV preto vitrificado brilhando sob as luzes de LED da GHR Estética Automotiva",
    "preco": null,
    "destaque": true
  },
  {
    "slug": "higienizacao",
    "nome": "Higienização",
    "categoria": "Interior",
    "bloco": "interior",
    "resumo": "Bancos, carpete, teto e painel limpos de verdade.",
    "descricao": "Higienização interna em Coronel Fabriciano: bancos, carpete, teto, painel e porta-malas com produto próprio para tecido, couro e plástico.",
    "imagem": "ghr-v22-q.jpg",
    "altImagem": "Banco de couro limpo após higienização interna na GHR Estética Automotiva",
    "preco": null,
    "destaque": true
  },
  {
    "slug": "revitalizacao",
    "nome": "Revitalização",
    "categoria": "Detalhes",
    "bloco": "detalhes",
    "resumo": "Faróis, plásticos e frisos com cara de novos.",
    "descricao": "Revitalização de faróis e plásticos em Coronel Fabriciano: farol amarelado volta a ficar transparente e plástico ressecado recupera a cor.",
    "imagem": "ghr-v03-q.jpg",
    "altImagem": "Farol de hatch branco transparente após revitalização na GHR Estética Automotiva",
    "preco": null,
    "destaque": false
  }
];

GHR.blocos = [{"id": "lavagem", "titulo": "Lavagem"}, {"id": "pintura", "titulo": "Pintura"}, {"id": "protecao", "titulo": "Proteção"}, {"id": "interior", "titulo": "Interior"}, {"id": "detalhes", "titulo": "Detalhes"}];

GHR.getService = (slug) => GHR.services.find(s => s.slug === slug) || null;
GHR.destaques  = () => GHR.services.filter(s => s.destaque);
GHR.categorias = () => [...new Set(GHR.services.map(s => s.categoria))];
