# syntax=docker/dockerfile:1
#
# Portfolio `home` — construction Astro dans un espace de travail pnpm.
#
# Le contexte de construction est la RACINE du depot, pas ce dossier : le
# lockfile et pnpm-workspace.yaml y vivent, et `pnpm install --frozen-lockfile`
# echouerait sans eux. Voir containers/local/web.yml.

ARG NODE_VERSION=24
ARG NGINX_VERSION=1.27-alpine

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /monorepo

# CI=true : pnpm ne demande jamais de confirmation interactive, et
# COREPACK_ENABLE_DOWNLOAD_PROMPT=0 lui evite d'attendre un accord pour
# telecharger la version de pnpm declaree par `packageManager`.
ENV CI=true
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

# `pnpm fetch` ne lit QUE le lockfile et remplit le magasin. La couche n'est
# donc invalidee que si une dependance change — pas a chaque modification du
# code, ni a chaque ajout d'un projet a l'espace de travail.
#
# pnpm-workspace.yaml accompagne le lockfile parce qu'il porte desormais TOUS
# les reglages (nodeLinker, allowBuilds, overrides), et non plus seulement la
# liste des projets : pnpm 11 ne lit plus .npmrc.
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

COPY . .

# `--filter home...` installe `home` ET ses dependances d'espace de travail
# (les trois points), donc @portfolio/design-tokens, et rien d'autre.
# `--offline` garantit qu'aucun paquet absent du magasin n'est telecharge ici :
# une divergence avec le lockfile echoue au lieu de passer inapercue.
RUN pnpm install --offline --frozen-lockfile --filter home...

RUN pnpm --filter home build

# Echoue tot et avec un message clair si la construction n'a rien produit.
# Sans ce controle, on obtiendrait une image nginx qui repond 403 sans
# expliquer pourquoi.
RUN test -d home/dist \
      || { echo "ERREUR: home/dist absent apres 'astro build'." >&2; exit 1; } \
 && test -n "$(ls -A home/dist)" \
      || { echo "ERREUR: home/dist est vide." >&2; exit 1; } \
 && test -f home/dist/index.html \
      || { echo "ERREUR: home/dist/index.html absent." >&2; exit 1; } \
 && test -f home/dist/404.html \
      || { echo "ERREUR: home/dist/404.html absent — la page 404 est requise" \
                "par la configuration nginx (error_page)." >&2; exit 1; } \
 && mv home/dist /sortie

FROM nginx:${NGINX_VERSION} AS web-production

RUN apk add --no-cache curl

COPY home/nginx/nginx.conf   /etc/nginx/nginx.conf
COPY home/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /sortie    /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/_nginx-sante || exit 1
