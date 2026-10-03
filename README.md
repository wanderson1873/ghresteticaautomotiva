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
servicos/index.html           Lista de serviços, com seletor de porte P/M/G (GERADA)
servicos/<slug>/index.html    Página de cada serviço (8 páginas GERADAS)
privacidade/index.html        Política de privacidade (noindex, fora do sitemap)
fotos/index.html              Galeria completa com filtros e lightbox
parcerias/index.html          Atendimento para empresas e frotas
contato/index.html            Contato + formulário que abre o WhatsApp
sitemap.xml  robots.txt       SEO (o sitemap é gerado — ver ferramentas/)
publicar/                     Pacote pronto para subir (gerado)

Dockerfile                    Imagem nginx do site (build em duas etapas)
.dockerignore                 O que não entra no contexto de build
docker/nginx.conf             gzip, cache, cabeçalhos e caminhos recusados

assets/
  css/style.css               Design system inteiro (cores, tipografia, animações)
  js/site.js                  Único <script> das páginas: carrega tudo abaixo
  js/app.js                   Animações de rolagem, parallax, âncoras
  js/data/                    ⭐ CONTEÚDO EDITÁVEL (ver abaixo)
    business.js                 contato, endereço, horários, redes
    services.js                 GERADO a partir de ferramentas/servicos.py
    brands.js                   marcas do carrossel
    gallery.js                  fotos da galeria e categorias
    home.js                     textos das seções da home
  js/components/              Header, footer, galeria, lightbox, formulário…
  img/logo.svg                Logo vetorizada a partir do PDF original
  img/placa-ghr.png/.svg      Arte da placa GHR (padrão carro, 400x130 mm)
  img/placa-ghr-moto.png      Arte da placa GHR (padrão moto, 200x170 mm)
  img/gallery/                fotos reais (136 na galeria — ver gallery.js)
  img/gallery/ghr-vNN.jpg     quadros 9:16 tirados dos vídeos do cenário novo (2024+)
  img/gallery/ghr-vNN-q.jpg   recorte 4:5 desses quadros (capas e cards)
  video/                      vídeos curtos das páginas de serviço (gerar-clipes.py)
  img/gallery/_originais/     fotos originais, antes da troca de placa
  img/gallery/w720/           versões WebP usadas em cards e miniaturas
  img/gallery/w1440/          versões WebP das fotos grandes (hero, banner)
  img/brands/                 logotipos monocromáticos do carrossel de marcas

ferramentas/
  servicos.py                 ⭐ SERVIÇOS: textos, preços P/M/G, fotos, FAQ
  gerar-paginas-servicos.py   * Gera /servicos/ inteiro + data/services.js
  quadros.py / extrair-quadros.py  Fotos tiradas dos vídeos (ffmpeg + Real-ESRGAN)
  gerar-clipes.py             Vídeos curtos (2025/2026) das páginas de serviço
  medicao.py / aplicar-medicao.py  GTM, Clarity e contador próprio
  config.py                   * Domínio, rotas e IDs de medição — fonte única
  preparar-publicacao.py      * Monta publicar/ só com o que vai ao servidor
  gerar-sitemap.py            Gera o sitemap.xml a partir das rotas reais
  gerar-webp.py               Gera/atualiza as versões WebP (compara datas)
  definir-dominio.py          Troca o domínio no site E em config.py
  aplicar-placas.py           Troca a placa dos carros das fotos pela arte GHR
  placas.py                   Onde fica a placa em cada foto (coordenadas)
  placa_lib.py                Motor da troca: perspectiva, luz, grão, borda
  detectar_quad.py            Acha os 4 cantos da placa dentro de uma caixa

../ghr_esteticaautomotiva/    Material bruto original (fotos e vídeos)
../logo - GHR.pdf             Logo original
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

### `ferramentas/servicos.py` — serviços, preços e fotos

**Os serviços não são mais editados em `services.js`.** Tudo sai de
`ferramentas/servicos.py`; depois de editar, rode:

```
python ferramentas/gerar-paginas-servicos.py
```

Ele escreve `/servicos/` e as 8 páginas em **HTML completo** (o Google lê tudo
sem depender de JavaScript, com JSON-LD de empresa, serviço, FAQ e migalhas),
regrava `assets/js/data/services.js` (menu, rodapé, home) e o JSON-LD da home e
do contato — nome, endereço e telefone iguais em todo o site.

- **Preços por porte:** `'precos': {'P': 'R$ 80', 'M': 'R$ 100', 'G': 'R$ 120'}`.
  Hoje são **valores de exemplo** (`PRECOS_PROVISORIOS = True`): aparecem com a
  tarja "valor de exemplo", ficam fora do JSON-LD e o `preparar-publicacao.py`
  **se recusa a montar o pacote**. Com os valores reais, troque para `False`.
- **Texto visível curto** (nome, uma linha, o que inclui, preço). O texto longo,
  para o Google e para IAs, fica no FAQ recolhido de cada página e na
  `descricao` (meta description). Respostas marcadas `# CONFIRMAR` dependem da
  empresa.
- **Fotos:** `capa` é um recorte 4:5 do cenário novo; `galeria` mistura quadros
  9:16 dos vídeos e closes antigos em que o ambiente não aparece. Nenhuma foto é
  recortada pelo CSS — a proporção do arquivo é a que aparece na tela.
- **Serviço novo:** acrescente o bloco e rode o gerador; a pasta é criada sozinha.

### Fotos e vídeos do cenário novo

O ambiente da GHR mudou em 2024 (parede azul, teto de LED em zigue-zague, piso
de placas). Topo das páginas, capas, cards e home usam **só** o cenário novo.

```
python ferramentas/extrair-quadros.py     quadros listados em quadros.py
python ferramentas/gerar-clipes.py        vídeos curtos (CLIPES no próprio script)
python ferramentas/gerar-webp.py
python ferramentas/gerar-paginas-servicos.py
```

`extrair-quadros.py` pega o quadro mais nítido perto do segundo indicado,
amplia com Real-ESRGAN, troca a placa (cadastrada em `placas.py`) e gera o
recorte 4:5. Programas, uma vez só: `winget install Gyan.FFmpeg` e o
Real-ESRGAN ncnn descompactado em `%USERPROFILE%/tools/realesrgan/`.
Vídeos novos: coloque em `../ghr_esteticaautomotiva/` com a data no nome.

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

### Sem imagens de banco

Desde 10/2026 o site não usa nenhuma imagem de banco: os antigos `banco-*.jpg`
foram trocados por fotos do cenário novo da GHR e removidos.

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
- [ ] Revisar as respostas marcadas `# CONFIRMAR` em `ferramentas/servicos.py`
- [ ] Preços reais P/M/G em `servicos.py` e `PRECOS_PROVISORIOS = False`
- [ ] Taxa da busca e entrega (hoje: "conforme a distância")
- [ ] IDs de medição em `config.py` (GTM, Clarity, chave do painel) e
      `python ferramentas/aplicar-medicao.py`
- [ ] Trocar o domínio provisório:
      `python ferramentas/definir-dominio.py https://www.seudominio.com.br`
- [ ] Regerar o que depende do domínio: `gerar-paginas-servicos.py` e `gerar-sitemap.py`
- [ ] Montar o pacote e subir **somente** ele: `preparar-publicacao.py` -> sobe `publicar/`

---

## Hospedagem na VPS (Docker + Easypanel)

O site roda em um container **nginx** construído a partir do `Dockerfile` da
raiz. A imagem tem cerca de 200 MB e serve 541 arquivos.

### Como a imagem é montada

O build tem duas etapas, e a primeira existe por um motivo de segurança:

1. **build** — roda `ferramentas/preparar-publicacao.py`, que monta `publicar/`
   por lista de permissão.
2. **runtime** — copia **apenas** `publicar/` para dentro do nginx.

Um `COPY . .` direto colocaria `assets/img/gallery/_originais/` (fotos antes da
troca de placa, com placa real de cliente) e os scripts Python em endereços
públicos do site. Com a etapa de build isso não acontece, e o script ainda
falha de propósito se encontrar material proibido no pacote — o build quebra em
vez de o material ir ao ar. O `docker/nginx.conf` recusa esses caminhos como
segunda tranca.

### Testar localmente

```
docker build -t ghr-site .
docker run --rm -p 8080:80 ghr-site
```

Depois abra <http://localhost:8080>.

### Configurar no Easypanel

Crie um serviço do tipo **App** e preencha:

| Campo | Valor |
|---|---|
| Source | GitHub → `wanderson1873/ghresteticaautomotiva`, branch `main` |
| Build method | **Dockerfile** (caminho: `Dockerfile`) |
| Port / Proxy port | **80** |
| Domain | o domínio do site, com HTTPS ligado |

O Easypanel (Traefik) cuida do certificado e do redirecionamento http→https —
o container só fala HTTP na porta 80, de propósito. O `HEALTHCHECK` do
Dockerfile faz o painel reiniciar sozinho se o nginx parar de responder.

Não é preciso volume: o site é estático e não grava nada. Para publicar uma
alteração, basta `git push` e mandar o Easypanel reconstruir.

### Antes de apontar o domínio

O site ainda usa o endereço provisório nas tags canonical, Open Graph e no
sitemap. Com o domínio real em mãos:

```
python ferramentas/definir-dominio.py https://www.seudominio.com.br
python ferramentas/gerar-paginas-servicos.py
python ferramentas/gerar-sitemap.py
```

Depois `git commit` e `git push` — o Easypanel reconstrói com os endereços
certos.

### O que o nginx faz

- **gzip** em HTML, CSS, JS, XML e SVG (o CSS cai de 59 KB para 14 KB). JPG,
  WebP e PNG ficam de fora: já são comprimidos.
- **cache** de um ano em CSS e JS, que entram com `?v=` e mudam de URL a cada
  versão; 30 dias em imagens e fontes; e revalidação sempre no HTML, que é
  quem aponta para a versão nova dos outros.
- **cabeçalhos** `X-Content-Type-Options`, `X-Frame-Options` e
  `Referrer-Policy` em todas as respostas.

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
- **Vídeos:** só trechos curtos de 2025/2026, sem som, um por página de serviço,
  baixados quando aparecem na tela. São os únicos `.mp4` publicados
  (`assets/video/`); o nginx e o `preparar-publicacao.py` recusam qualquer outro.
- **Medição** igual à do Lava Jato Beira Rio: Consent Mode + GTM + Clarity sem
  aviso de cookies (legítimo interesse, explicado em `/privacidade/`), com botão
  para parar de medir, e o contador próprio (`s.derson.cloud`), que só conta
  visitas vindas do domínio cadastrado.
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
