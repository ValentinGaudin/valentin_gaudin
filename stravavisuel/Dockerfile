# syntax=docker/dockerfile:1
#
# Strava Visuel — export web Expo dans un espace de travail pnpm.
#
# Le contexte de construction est la RACINE du depot, pas ce dossier : le
# lockfile et pnpm-workspace.yaml y vivent, et `pnpm install --frozen-lockfile`
# echouerait sans eux. Voir containers/local/web.yml.
#
# L'app native ne passe PAS par ici : EAS Build la compile et la publie sur
# les stores. Seule la cible web est conteneurisee.

ARG NODE_VERSION=24
ARG NGINX_VERSION=1.27-alpine

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /monorepo

ENV CI=true
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

RUN corepack enable

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm fetch

COPY . .

RUN pnpm install --offline --frozen-lockfile --filter stravavisuel...

RUN pnpm --filter stravavisuel build

# Empreinte du script d'hydratation injecte par Expo Router, autorisee nommement
# dans la CSP du service. Si une montee de version d'Expo change ce script, la
# verification ci-dessous echoue ICI plutot qu'en production, ou le navigateur
# bloquerait le JavaScript sans laisser de trace serveur.
ARG EMPREINTE_SCRIPT_HYDRATATION=sha256-67fhrP0+BkBqmgGGXTtgiVO/9EQs3QruYNU/7fnRkI8=

RUN node stravavisuel/scripts/verifier-scripts-en-ligne.mjs \
      stravavisuel/dist "${EMPREINTE_SCRIPT_HYDRATATION}"

RUN test -d stravavisuel/dist \
      || { echo "ERREUR: stravavisuel/dist absent apres 'expo export'." >&2; exit 1; } \
 && test -f stravavisuel/dist/index.html \
      || { echo "ERREUR: index.html absent." >&2; exit 1; } \
 && test -f "stravavisuel/dist/+not-found.html" \
      || { echo "ERREUR: '+not-found.html' absent — requis par la configuration" \
                "nginx (error_page)." >&2; exit 1; } \
 && test -d stravavisuel/dist/_expo \
      || { echo "ERREUR: dossier _expo absent : le bundle n'a pas ete produit." >&2; exit 1; } \
 && mv stravavisuel/dist /sortie

FROM nginx:${NGINX_VERSION} AS web-production

RUN apk add --no-cache curl

COPY stravavisuel/nginx/nginx.conf   /etc/nginx/nginx.conf
COPY stravavisuel/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /sortie            /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -fsS http://localhost/_nginx-sante || exit 1
