# =============================================================================
# GHR Estética Automotiva — imagem do site
# -----------------------------------------------------------------------------
# Site estático servido por nginx. Duas etapas:
#
#   1. build   roda ferramentas/preparar-publicacao.py, que monta a pasta
#              publicar/ por LISTA DE PERMISSÃO — só entra o que está previsto.
#   2. runtime copia apenas publicar/ para dentro do nginx.
#
# Por que duas etapas em vez de um COPY direto: o repositório contém
# assets/img/gallery/_originais/ (fotos ANTES da troca de placa, com placa real
# de cliente), além dos scripts Python. Um `COPY . .` colocaria tudo isso em
# endereços públicos do site. Com a etapa de build, o que sobra na imagem final
# é apenas o site — e o script ainda falha de propósito se encontrar material
# proibido no pacote, então um engano derruba o build em vez de ir ao ar.
#
# Construir e rodar localmente:
#   docker build -t ghr-site .
#   docker run --rm -p 8080:80 ghr-site      → http://localhost:8080
# =============================================================================

# ------------------------------- 1. build ------------------------------------
FROM python:3.13-alpine AS build

WORKDIR /projeto
COPY . .

# O script usa só a biblioteca padrão do Python — nada a instalar.
# Ele apaga e recria publicar/, então o resultado nunca traz sobra de um build
# anterior que por acaso tenha vindo no contexto.
RUN python ferramentas/preparar-publicacao.py

# ------------------------------ 2. runtime -----------------------------------
FROM nginx:1.27-alpine

# Fora o conteúdo de exemplo do nginx, para não sobrar nada servido por engano.
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /projeto/publicar/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# O Easypanel (Traefik) faz o TLS e encaminha para esta porta.
EXPOSE 80

# Verificação de saúde: se o nginx parar de responder, o painel reinicia.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
