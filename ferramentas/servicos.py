# -*- coding: utf-8 -*-
"""SERVIÇOS DA GHR — fonte única.

Daqui saem, rodando  python ferramentas/gerar-paginas-servicos.py :
    servicos/index.html            lista com seletor de porte P/M/G
    servicos/<slug>/index.html     página de cada serviço (HTML completo,
                                   lido pelo Google sem depender de JavaScript)
    assets/js/data/services.js     cópia para os componentes JS (home, menu,
                                   rodapé, formulário). NÃO edite esse arquivo.

PREÇOS
    'precos': {'P': 'R$ 80', 'M': 'R$ 100', 'G': 'R$ 120'}
    Qualquer texto vale ('a partir de R$ 250'). None num porte = "sob consulta".
    PRECOS_PROVISORIOS = True marca TODOS como valor de exemplo: aparecem com
    tarja no site, ficam fora do JSON-LD, e preparar-publicacao.py se recusa a
    montar o pacote. Com os valores reais, troque para False.

FOTOS
    passos   (título, frase, foto ou None) — foto só quando mostra a etapa de fato
    capa     recorte 4:5 (ghr-vNN-q.jpg) do cenário novo — card e topo da página
    galeria  carrossel: quadros 9:16 do cenário novo + closes antigos onde o
             ambiente não aparece. Cada item: (arquivo, alt).
    video    trecho curto (2025/2026), sem som — ver CLIPES em gerar-clipes.py

TEXTOS marcados  # CONFIRMAR  dependem de informação da empresa.
"""

PRECOS_PROVISORIOS = True

# Ordem e títulos dos blocos da página /servicos/
BLOCOS = [
    ('lavagem',  'Lavagem'),
    ('pintura',  'Pintura'),
    ('protecao', 'Proteção'),
    ('interior', 'Interior'),
    ('detalhes', 'Detalhes'),
]

PORTES = [('P', 'Pequeno'), ('M', 'Médio'), ('G', 'Grande')]

# Pergunta que entra no FAQ de todos os serviços
FAQ_BUSCA = ('Vocês buscam o carro?',
             'Sim. A GHR busca e entrega o veículo em todo o Vale do Aço — Coronel '
             'Fabriciano, Ipatinga, Timóteo e Santana do Paraíso. Dependendo da '
             'distância pode haver uma taxa, informada junto com o orçamento.')

SERVICOS = [
    # ------------------------------------------------------------------ LAVAGEM
    {
        'slug': 'lavagem-tradicional',
        'bloco': 'lavagem',
        'nome': 'Lavagem Tradicional',
        'curto': 'Lavagem externa caprichada para o dia a dia.',
        'descricao': 'Lavagem tradicional em Coronel Fabriciano: carroceria, rodas, pneus e '
                     'vidros com produto neutro e secagem sem riscar a pintura.',
        'inclui': ['Carroceria', 'Rodas e pneus', 'Vidros', 'Secagem'],
        'passos': [
            ('Pré-lavagem', 'Espuma solta a sujeira antes do contato.', None),
            ('Lavagem', 'Shampoo neutro, luva macia, rodas à parte.', None),
            ('Secagem', 'Toalha de microfibra, sem arrastar sujeira.', None),
        ],
        'capa': 'ghr-v16-q.jpg',
        'capa_alt': 'SUV azul limpo no box da GHR Estética Automotiva, em Coronel Fabriciano',
        'galeria': [
            ('ghr-v16.jpg', 'SUV azul limpo no box da GHR, com piso quadriculado e luzes de LED'),
            ('ghr-v05.jpg', 'Hatch branco limpo no box da GHR'),
            ('ghr-v04.jpg', 'Lateral de hatch branco brilhando após a lavagem na GHR'),
        ],
        'faq': [
            ('Qual a diferença para a lavagem detalhada?',
             'A tradicional cuida do que aparece: carroceria, rodas, pneus e vidros. A '
             'detalhada vai nos cantos — frisos, soleiras, caixas de roda e acabamentos.'),
            ('Lava por dentro também?', 'A tradicional é externa. Para o interior, peça a '
             'lavagem detalhada ou a higienização.'),  # CONFIRMAR
            ('Precisa agendar?', 'É melhor: chame no WhatsApp e combine o horário.'),
        ],
        'precos': {'P': 'R$ 50', 'M': 'R$ 60', 'G': 'R$ 70'},
        'destaque': False,
    },
    {
        'slug': 'lavagem-detalhada',
        'bloco': 'lavagem',
        'nome': 'Lavagem Detalhada',
        'curto': 'Limpeza ponto a ponto, onde a lavagem comum não chega.',
        'descricao': 'Lavagem detalhada em Coronel Fabriciano: pré-lavagem, caixas de roda, '
                     'frisos, soleiras e acabamentos, por dentro e por fora.',
        'inclui': ['Pré-lavagem', 'Caixas de roda', 'Frisos e soleiras', 'Acabamentos', 'Secagem'],
        'passos': [
            ('Pré-lavagem', 'Espuma e pincel em grades, emblemas e cantos.', None),
            ('Detalhes', 'Caixas de roda, soleiras e frisos, um a um.', None),
            ('Acabamento', 'Secagem e revisão sob a luz do box.', None),
        ],
        'capa': 'ghr-v18-q.jpg',
        'capa_alt': 'SUV preto limpo e brilhando sob as luzes de LED da GHR Estética Automotiva',
        'galeria': [
            ('ghr-v18.jpg', 'SUV preto finalizado no box da GHR, sob o teto de LED'),
            ('ghr-v21.jpg', 'Porta aberta com forro e soleira limpos'),
            ('ghr-v08.jpg', 'Moto azul limpa no cavalete, no box da GHR'),
        ],
        'video': 'lavagem-detalhada',
        'faq': [
            ('Atende moto?', 'Sim, a GHR também faz a limpeza detalhada de motos.'),
            ('Inclui o interior?', 'Inclui acabamentos internos de porta e soleira. Para '
             'bancos, carpete e teto, o serviço indicado é a higienização.'),  # CONFIRMAR
            ('É a preparação para polimento?', 'Sim. A pintura precisa estar bem limpa antes '
             'de polimento, cristalização ou vitrificação.'),
        ],
        'precos': {'P': 'R$ 120', 'M': 'R$ 150', 'G': 'R$ 180'},
        'destaque': False,
    },
    # ------------------------------------------------------------------ PINTURA
    {
        'slug': 'polimento-tecnico',
        'bloco': 'pintura',
        'nome': 'Polimento Técnico',
        'curto': 'Tira riscos finos, marcas de lavagem e opacidade.',
        'descricao': 'Polimento técnico em Coronel Fabriciano: correção da pintura com máquina, '
                     'avaliando o verniz antes. Remove riscos finos e devolve o brilho.',
        'inclui': ['Avaliação da pintura', 'Descontaminação', 'Correção com máquina', 'Refino do brilho'],
        'passos': [
            ('Avaliação', 'A pintura é vista sob a luz do box, com você.', None),
            ('Correção', 'Máquina e abrasivo certos para o verniz.', None),
            ('Refino', 'Acabamento até o reflexo ficar limpo.', None),
        ],
        'capa': 'ghr-v10-q.jpg',
        'capa_alt': 'Sedã preto polido refletindo as luzes de LED da GHR Estética Automotiva',
        'galeria': [
            ('ghr-v10.jpg', 'Sedã preto polido refletindo as luzes de LED do box da GHR'),
            ('ghr-v09.jpg', 'Lateral de sedã preto com reflexo nítido após o polimento'),
            ('ghr-v06-q.jpg', 'Capô de SUV grafite polido refletindo as luzes de LED'),
            ('ghr-v02.jpg', 'Hatch branco polido de frente, no box da GHR'),
            ('ghr-205.jpg', 'Antes e depois do polimento: riscos sumindo da pintura'),
            ('ghr-210.jpg', 'Antes e depois do polimento em pintura clara'),
        ],
        'video': 'polimento-tecnico',
        'faq': [
            ('Polimento tira todo risco?', 'Tira riscos finos, marcas de lavagem e opacidade. '
             'Risco que passou do verniz não sai só com polimento — isso é avaliado antes.'),
            ('Desgasta a pintura?', 'Remove uma camada mínima de verniz. Por isso a correção '
             'é feita conforme o estado e a espessura de cada pintura.'),
            ('Quanto tempo leva?', 'Depende do porte e do estado da pintura. O prazo é '
             'passado no orçamento.'),  # CONFIRMAR
            ('Depois do polimento, preciso proteger?', 'É o recomendado: cristalização ou '
             'vitrificação mantêm o brilho por mais tempo.'),
        ],
        'precos': {'P': 'R$ 450', 'M': 'R$ 550', 'G': 'R$ 650'},
        'destaque': True,
    },
    {
        'slug': 'espelhamento',
        'bloco': 'pintura',
        'nome': 'Espelhamento',
        'curto': 'Brilho máximo, com reflexo de espelho.',
        'descricao': 'Espelhamento de pintura em Coronel Fabriciano: refino que leva o brilho '
                     'ao máximo e elimina o hologramado de polimentos mal feitos.',
        'inclui': ['Refino da pintura', 'Remoção de hologramas', 'Realce final de brilho'],
        'passos': [
            ('Correção', 'Base sem riscos para o refino.', None),
            ('Refino', 'Etapas finas até sumir o hologramado.', None),
            ('Espelho', 'Reflexo limpo sob qualquer luz.', None),
        ],
        'capa': 'ghr-v11-q.jpg',
        'capa_alt': 'Capô azul-escuro espelhado refletindo as luzes de LED da GHR Estética Automotiva',
        'galeria': [
            ('ghr-v11.jpg', 'Capô azul-escuro espelhado refletindo o teto de LED da GHR'),
            ('ghr-v13.jpg', 'Frente de sedã azul com brilho espelhado no box da GHR'),
            ('ghr-v14.jpg', 'Sedã azul com reflexo das luzes na lateral e no capô'),
            ('ghr-211.jpg', 'Antes e depois do refino da pintura'),
            ('ghr-090.jpg', 'Antes e depois: reflexo da luz na pintura'),
        ],
        'video': 'espelhamento',
        'faq': [
            ('Qual a diferença para o polimento técnico?', 'O polimento corrige. O '
             'espelhamento é o refino depois da correção, para o brilho máximo.'),
            ('O que é hologramado?', 'Marcas circulares que aparecem na luz direta, deixadas '
             'por polimento mal executado. O espelhamento remove.'),
            ('Vale para carro antigo?', 'Vale, se o verniz permitir — é avaliado antes.'),
        ],
        'precos': {'P': 'R$ 600', 'M': 'R$ 700', 'G': 'R$ 800'},
        'destaque': False,
    },
    # ----------------------------------------------------------------- PROTEÇÃO
    {
        'slug': 'cristalizacao',
        'bloco': 'protecao',
        'nome': 'Cristalização',
        'curto': 'Realça o brilho e facilita a limpeza.',
        'descricao': 'Cristalização de pintura em Coronel Fabriciano: película protetora que '
                     'deixa a pintura mais lisa, brilhante e fácil de limpar.',
        'inclui': ['Preparo da superfície', 'Aplicação do produto', 'Finalização'],
        'passos': [
            ('Preparo', 'Pintura limpa e descontaminada.', None),
            ('Aplicação', 'Produto aplicado painel por painel.', None),
        ],
        'capa': 'ghr-v12-q.jpg',
        'capa_alt': 'Capô de sedã azul brilhando após cristalização na GHR Estética Automotiva',
        'galeria': [
            ('ghr-v12.jpg', 'Sedã azul de frente com a pintura brilhando no box da GHR'),
            ('ghr-v01.jpg', 'Capô e farol de hatch branco refletindo as luzes de LED'),
            ('ghr-092.jpg', 'Antes e depois do brilho em pintura clara'),
            ('ghr-091.jpg', 'Antes e depois da proteção na lateral de carro branco'),
        ],
        'faq': [
            ('Qual a diferença para a vitrificação?', 'A cristalização é mais simples e dura '
             'menos. A vitrificação forma uma camada mais resistente, de longa duração.'),
            ('Quanto tempo dura?', 'Depende do uso, do sol e das lavagens. A equipe orienta '
             'a manutenção na entrega.'),  # CONFIRMAR
            ('Faz em vidro também?', 'Pergunte no WhatsApp.'),  # CONFIRMAR
        ],
        'precos': {'P': 'R$ 250', 'M': 'R$ 300', 'G': 'R$ 350'},
        'destaque': False,
    },
    {
        'slug': 'vitrificacao',
        'bloco': 'protecao',
        'nome': 'Vitrificação',
        'curto': 'Proteção de longa duração, a água escorre.',
        'descricao': 'Vitrificação de pintura em Coronel Fabriciano: camada protetora de longa '
                     'duração com efeito hidrofóbico, aplicada sobre a pintura corrigida.',
        'inclui': ['Correção da pintura', 'Descontaminação', 'Aplicação da camada', 'Cura e revisão'],
        'passos': [
            ('Correção', 'A camada sela o que estiver embaixo: a pintura é corrigida antes.', None),
            ('Aplicação', 'Vitrificador aplicado e nivelado painel por painel.', None),
            ('Cura', 'Revisão final sob a luz antes da entrega.', None),
        ],
        'capa': 'ghr-v19-q.jpg',
        'capa_alt': 'SUV preto vitrificado brilhando sob as luzes de LED da GHR Estética Automotiva',
        'galeria': [
            ('ghr-v19.jpg', 'SUV preto de frente com a pintura brilhando no box da GHR'),
            ('ghr-v20.jpg', 'Lateral de SUV preto refletindo o ambiente do box'),
            ('ghr-v15.jpg', 'Lateral de sedã azul com reflexo limpo na pintura'),
            ('ghr-093.jpg', 'Antes e depois: reflexo da luz no capô branco'),
        ],
        'video': 'vitrificacao',
        'faq': [
            ('Quanto tempo dura a vitrificação?', 'Bem mais que cera ou cristalização. A '
             'duração depende do produto, do uso e da manutenção — informada no orçamento.'),  # CONFIRMAR
            ('Precisa polir antes?', 'Sim. A vitrificação sela a pintura como ela está; por '
             'isso a correção vem antes.'),
            ('Como lavar depois?', 'Com shampoo neutro e sem produtos abrasivos. A equipe '
             'explica os cuidados na entrega.'),
        ],
        'precos': {'P': 'R$ 900', 'M': 'R$ 1.100', 'G': 'R$ 1.300'},
        'destaque': True,
    },
    # ----------------------------------------------------------------- INTERIOR
    {
        'slug': 'higienizacao',
        'bloco': 'interior',
        'nome': 'Higienização',
        'curto': 'Bancos, carpete, teto e painel limpos de verdade.',
        'descricao': 'Higienização interna em Coronel Fabriciano: bancos, carpete, teto, painel '
                     'e porta-malas com produto próprio para tecido, couro e plástico.',
        'inclui': ['Bancos', 'Carpete e tapetes', 'Teto e colunas', 'Painel e console', 'Porta-malas'],
        'passos': [
            ('Aspiração', 'Retira a sujeira solta de cada canto.', None),
            ('Limpeza profunda', 'Produto certo para cada material.', None),
            ('Acabamento', 'Portas, painel e console revisados.', None),
        ],
        'capa': 'ghr-v22-q.jpg',
        'capa_alt': 'Banco de couro limpo após higienização interna na GHR Estética Automotiva',
        'galeria': [
            ('ghr-v22.jpg', 'Banco dianteiro de couro limpo após a higienização'),
            ('ghr-v23.jpg', 'Painel e console limpos por dentro do carro'),
            ('ghr-v21.jpg', 'Forro de porta e soleira limpos'),
            ('ghr-168.jpg', 'Antes e depois da higienização de banco de couro'),
            ('ghr-159.jpg', 'Antes e depois da limpeza de banco claro'),
            ('ghr-212.jpg', 'Antes e depois da higienização de banco de tecido'),
        ],
        'faq': [
            ('Tira mancha e cheiro?', 'Na maioria dos casos sim. Manchas muito antigas e '
             'odores impregnados são avaliados antes: alguns saem, outros reduzem.'),
            ('Limpa banco de couro?', 'Sim, com produto próprio para couro, que limpa sem '
             'ressecar.'),
            ('O banco fica molhado?', 'O carro é entregue seco ou com orientação de quanto '
             'tempo deixar arejar.'),  # CONFIRMAR
        ],
        'precos': {'P': 'R$ 250', 'M': 'R$ 300', 'G': 'R$ 350'},
        'destaque': True,
    },
    # ----------------------------------------------------------------- DETALHES
    {
        'slug': 'revitalizacao',
        'bloco': 'detalhes',
        'nome': 'Revitalização',
        'curto': 'Faróis, plásticos e frisos com cara de novos.',
        'descricao': 'Revitalização de faróis e plásticos em Coronel Fabriciano: farol amarelado '
                     'volta a ficar transparente e plástico ressecado recupera a cor.',
        'inclui': ['Faróis e lanternas', 'Plásticos externos', 'Frisos e grades'],
        'passos': [
            ('Farol', 'Lixamento, polimento e proteção da lente.', None),
            ('Plásticos', 'Recuperação da cor de frisos e para-choques.', None),
        ],
        'capa': 'ghr-v03-q.jpg',
        'capa_alt': 'Farol de hatch branco transparente após revitalização na GHR Estética Automotiva',
        'galeria': [
            ('ghr-v03.jpg', 'Farol de hatch branco limpo e transparente, no box da GHR'),
            ('ghr-107.jpg', 'Antes e depois da revitalização de faróis'),
            ('ghr-134.jpg', 'Antes e depois: farol amarelado e farol recuperado'),
            ('ghr-151.jpg', 'Antes e depois da revitalização de frisos e plásticos'),
        ],
        'faq': [
            ('Farol amarelado tem jeito?', 'Na maioria dos casos sim: a lente é lixada, polida '
             'e recebe proteção. Farol trincado ou com umidade por dentro não se resolve assim.'),
            ('Volta a amarelar?', 'Com o tempo e o sol, sim. A proteção aplicada no final '
             'atrasa esse processo.'),
            ('Faz só um farol?', 'Pergunte no WhatsApp.'),  # CONFIRMAR
        ],
        'precos': {'P': 'R$ 150', 'M': 'R$ 150', 'G': 'R$ 180'},
        'destaque': False,
    },
]
