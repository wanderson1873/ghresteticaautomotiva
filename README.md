# GHR Estética Automotiva — site

Site institucional estático (HTML + CSS + JavaScript puro).
**Sem backend, sem banco de dados e sem painel administrativo** — hospedagem
estática basta (GitHub Pages, Netlify, Vercel, Hostinger).

> **Não publique a pasta do projeto inteira.** Ela contém 237 MB de acervo
> bruto (`ghr_esteticaautomotiva/`), as fotos **anteriores** à troca de placa
> (`assets/img/gallery/_originais/`), os scripts e o PDF do logo. `robots.txt`
> não impede acesso — só pede para o buscador não indexar. Rode
> `python ferramentas/preparar-publicacao.py` e suba **apenas** `publicar/`.

---

## Rodando localmente

```bash
python -m http.server 8099
```

Depois abra <http://localhost:8099>.

> As páginas internas ficam em pastas (`/servicos/`, `/fotos/`…), então use o
> servidor local acima em vez de abrir o `index.html` direto pelo Explorer.

---

## Estrutura

```
index.html                    Home
servicos/index.html           Lista de serviços
servicos/<slug>/index.html    Página de cada serviço (8 páginas geradas)
fotos/index.html              Galeria completa com filtros e lightbox
parcerias/index.html          Atendimento para empresas e frotas
contato/index.html            Contato + formulário que abre o WhatsApp
sitemap.xml  robots.txt       SEO (o sitemap é gerado — ver ferramentas/)
publicar/                     Pacote pronto para subir (gerado)

assets/
  css/style.css               Design system inteiro (cores, tipografia, animações)
  js/site.js                  Único <script> das páginas: carrega tudo abaixo
  js/app.js                   Animações de rolagem, parallax, âncoras
  js/data/                    ⭐ CONTEÚDO EDITÁVEL (ver abaixo)
    business.js                 contato, endereço, horários, redes
    services.js                 serviços, textos e preços
    brands.js                   marcas do carrossel
    gallery.js                  fotos da galeria e categorias
    home.js                     textos das seções da home
  js/components/              Header, footer, galeria, lightbox, formulário…
  img/logo.svg                Logo vetorizada a partir do PDF original
  img/placa-ghr.png/.svg      Arte da placa GHR (padrão carro, 400x130 mm)
  img/placa-ghr-moto.png      Arte da placa GHR (padrão moto, 200x170 mm)
  img/gallery/                213 fotos reais (136 na galeria — ver gallery.js)
  img/gallery/banco-*.jpg     8 imagens de banco (ver CREDITOS-BANCO-DE-IMAGENS.md)
  img/gallery/_originais/     fotos originais, antes da troca de placa
  img/gallery/w720/           versões WebP usadas em cards e miniaturas
  img/gallery/w1440/          versões WebP das fotos grandes (hero, banner)
  img/brands/                 logotipos monocromáticos do carrossel de marcas

ferramentas/
  config.py                   * Domínio e rotas do site — fonte única
  preparar-publicacao.py      * Monta publicar/ só com o que vai ao servidor
  gerar-sitemap.py            Gera o sitemap.xml a partir das rotas reais
  gerar-paginas-servicos.py   Recria as páginas de /servicos/<slug>/
  gerar-webp.py               Gera/atualiza as versões WebP (compara datas)
  definir-dominio.py          Troca o domínio no site E em config.py
  aplicar-placas.py           Troca a placa dos carros das fotos pela arte GHR
  placas.py                   Onde fica a placa em cada foto (coordenadas)
  placa_lib.py                Motor da troca: perspectiva, luz, grão, borda
  detectar_quad.py            Acha os 4 cantos da placa dentro de uma caixa

ghr_esteticaautomotiva/       Material bruto original (fotos e vídeos)
logo - GHR.pdf                Logo original
```

---

## O que editar

Tudo o que muda com frequência está em **`assets/js/data/`**. Nenhum outro
arquivo precisa ser tocado.

### `business.js` — contato e endereço

| Campo | Observação |
|---|---|
| `whatsapp` | só dígitos, com país e DDD: `5531986926513` |
| `telefone` | como aparece na tela |
| `email` | **vazio = o item não aparece no site** |
| `endereco` | rua, bairro, cidade, UF, CEP |
| `instagram` | link do perfil |
| `horarios` | objeto `{ confirmado, dias: [...] }` com 7 entradas começando no **domingo**; cada uma tem `abre`/`fecha` em `'HH:MM'`, ou `null` nos dois para fechado. `dias: []` esconde o bloco. |
| `pagamentos` | formas de pagamento aceitas — confirmadas pela empresa: cartão de crédito, Pix e dinheiro. `[]` esconde o bloco. |
| `observacoes` | outras frases curtas do bloco de contato. `[]` esconde o bloco. |

> Os dados atuais (WhatsApp, endereço e Instagram) foram lidos do card de
> divulgação da própria empresa (foto `ghr-049.jpg`) e do perfil do Instagram.
> **Confirme antes de publicar** — o material é de 2020/2021.

### `services.js` — serviços e preços

Os oito serviços são os divulgados pela empresa: Lavagem Tradicional, Lavagem
Detalhada, Polimento Técnico, Cristalização, Espelhamento, Vitrificação,
Higienização e Revitalização.

- **Preço:** deixe `preco: null` enquanto não houver valor. Com `null` o site
  não mostra nada — nem "R$ 0", nem "sob consulta". Para exibir, escreva o
  texto exato: `preco: 'R$ 180'` ou `preco: 'a partir de R$ 250'`.
- **Descrições:** todas estão marcadas com `// TEXTO PROVISÓRIO` e devem ser
  substituídas pelos textos reais.
- **Serviço novo:** acrescente o bloco em `services.js` e rode
  `python ferramentas/gerar-paginas-servicos.py` para criar a página dele.

### `gallery.js` — fotos

Cada foto tem `src`, `cat` (filtro), `fase`, `alt` (opcional) e `top`.
Categorias: `exterior`, `interior`, `pintura`, `motos`, `detalhes`.

**`fase`** diz o que a foto mostra: `depois`, `antes`, `processo` ou
`comparativo`. É o que impede o site de chamar de "veículo finalizado" um carro
coberto de espuma ou uma montagem antes/depois — o texto alternativo e a
etiqueta sobre a miniatura saem daí. Sem `alt` próprio, o texto é montado por
`GHR.galleryAlt()` a partir de `cat` + `fase`.

Para acrescentar fotos: copie o arquivo para `assets/img/gallery/`, rode
`python ferramentas/gerar-webp.py` e adicione uma linha na lista.

### Imagens de banco na home

Existem **8 arquivos `banco-*.jpg`** (Pexels, licença livre inclusive
comercial). Em uso na home: o fundo do hero, a faixa "Não é apenas limpeza" e
**três** dos quatro cartões de "Cuidado em cada etapa" — o cartão 02 (Correção)
passou a usar foto real da GHR, porque a imagem de banco mostrava alguém com
borrifador e pano, o que não é correção de pintura. `banco-vitrificacao.jpg` é
a capa do serviço de Vitrificação; `banco-quem-somos.jpg` **não é mais usado**.

Cada etapa declara a origem da própria foto em `home.js`, no campo `legenda`, e
o rótulo aparece na tela ("Imagem ilustrativa da etapa" / "Trabalho da GHR").
Sem esse rótulo o visitante lê as quatro como serviço executado pela empresa.

**Quem somos não usa mais foto de banco.** A imagem anterior mostrava um
profissional de uniforme de outra operação sob o título "Quem somos", com o
cartão de localização da GHR por cima — a composição sugeria equipe e estrutura
que não são da empresa. No lugar dela entrou uma foto real de trabalho entregue
(`ghr-187.jpg`), até existir uma foto da equipe atual.

O resto da home é foto real da empresa, e a galeria em `/fotos/` é 100% real.

A lista de origem de cada imagem está em
`assets/img/gallery/CREDITOS-BANCO-DE-IMAGENS.md`. Ao trocar alguma, baixe de
um banco com licença comercial e atualize esse arquivo.

### Placas dos veículos

Nenhuma foto do site mostra a placa real de um cliente: todas foram
substituídas pela arte `assets/img/placa-ghr.png` (motos usam
`placa-ghr-moto.png`), deformada em perspectiva sobre a placa original e
ajustada à luz, ao desfoque e ao grão de cada foto.

Os JPGs originais ficam em `assets/img/gallery/_originais/` e são sempre a base
do processamento, então dá para refazer tudo a qualquer momento:

```
python ferramentas/aplicar-placas.py            # todas as fotos
python ferramentas/aplicar-placas.py ghr-108    # só uma
```

As coordenadas de cada placa estão em `ferramentas/placas.py`. Ao trocar ou
acrescentar fotos, cadastre a placa nova lá, rode o script, apague os WebP
correspondentes em `w720/` e `w1440/` e rode `gerar-webp.py`.

As artes saem de `python ferramentas/gerar-arte-placa.py`, que rasteriza o PDF
do logo e monta quatro variações: a padrão, a de moto, uma com o logo deslocado
para a esquerda (placas cortadas pela borda do quadro) e uma lisa, sem logo,
para placas vistas quase de perfil — nessas só aparece um filete de poucos
pixels e o logo viraria um borrão.

Duas fotos ficaram de fora de propósito: **ghr-045** e **ghr-162**. Nas duas a
placa já tinha sido coberta pelo editor anterior (rabisco e texto "GHR"), não
há nada legível exposto, e a foto é escura/em ângulo o bastante para que a arte
aplicada ficasse pior do que o original.

### `brands.js` — carrossel de marcas

Apenas exemplos de veículos atendidos — o site deixa isso explícito e **não**
comunica parceria oficial com nenhuma montadora.

Os logotipos em `assets/img/brands/` vieram do projeto
[Simple Icons](https://simpleicons.org) (SVG sob licença CC0); os símbolos em si
seguem sendo marcas registradas de cada fabricante. Para mostrar só o nome
escrito, remova o campo `logo` do item.

### `home.js` — textos das seções

Etapas do processo, diferenciais, passos de "como funciona" e as fotos da seção
de destaque de limpeza de estofado (`GHR.estofado` e `GHR.estofadoItens`).

---

## Antes de publicar

- [ ] Confirmar WhatsApp, endereço e Instagram em `business.js`
- [ ] Conferir os `horarios` (hoje: segunda a sábado, 8h às 18h; domingo fechado)
- [ ] Confirmar área de cobertura e condições de **busca e entrega**
- [ ] Confirmar as condições do atendimento **B2B** em `/parcerias/`
- [ ] Revisar os textos marcados com `// TEXTO PROVISÓRIO` em `services.js`
- [ ] Definir os preços (ou deixar `null`)
- [ ] Trocar o domínio provisório:
      `python ferramentas/definir-dominio.py https://www.seudominio.com.br`
- [ ] Regerar o que depende do domínio: `gerar-paginas-servicos.py` e `gerar-sitemap.py`
- [ ] Montar o pacote e subir **somente** ele: `preparar-publicacao.py` -> sobe `publicar/`

---

## Decisões técnicas

- **Sem framework e sem build.** O site é servido como está; os scripts Python
  em `ferramentas/` só geram arquivos e não são necessários para rodar.
- **Imagens:** as fotos originais têm 1440px. O site serve WebP (cerca de 1/4
  do peso) com o JPG como fallback, tudo com `loading="lazy"` — a galeria
  carrega 24 fotos por vez, não as 136 de uma vez.
- **Nada é inventado.** Números de clientes, anos de mercado, avaliações e
  depoimentos não existem no site porque não havia essa informação no material
  fornecido. Campos vazios simplesmente não são renderizados.
- **Vídeos ignorados** nesta versão, conforme combinado. Os 44 arquivos `.mp4`
  continuam na pasta original.
- **Formulário sem backend:** monta a mensagem e abre o WhatsApp. O site não
  guarda nada e não tem servidor próprio — mas o texto vai junto na URL do
  WhatsApp, então chega ao WhatsApp assim que a conversa abre. Os avisos na
  tela dizem exatamente isso, e não "nada é enviado para nenhum servidor".
- **Funciona sem JavaScript e sobrevive a JavaScript quebrado.** O CSS só
  esconde conteúdo para animar dentro de `.js`, classe que o próprio script
  põe no `<html>`; os botões de WhatsApp têm `href` real no HTML; cada
  componente é iniciado dentro de um `try` (`GHR.boot`), então uma falha
  isolada não derruba o resto da página; e há um `<noscript>` com a
  navegação completa, endereço e telefone.
- **Acessibilidade:** navegação por teclado, foco visível, `alt` em todas as
  imagens e respeito a `prefers-reduced-motion`. O menu mobile tem rolagem
  própria, prende o Tab enquanto aberto, torna o resto da página `inert` e
  devolve o foco ao botão ao fechar. Campos obrigatórios explicam o erro por
  texto ligado ao campo (`aria-describedby` + `role="alert"`), não apenas
  devolvendo o foco. O verde dos botões de WhatsApp é `#12803c` — 5,03:1 com
  o texto branco; o verde anterior (`#1fab54`) dava 2,99:1 e reprovava em AA.
- **Horário no fuso da loja.** O selo "aberto agora" é calculado em
  `America/Sao_Paulo`, não no relógio do visitante, e o mesmo dado alimenta o
  `openingHoursSpecification` do JSON-LD.
