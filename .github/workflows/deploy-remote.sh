#!/usr/bin/env bash
#
# Execute SUR LE VPS par deploy.yml, via `ssh ... bash -s`.
#
# Adapte du ci/deploy-remote.sh du socle docker-deploy, avec deux differences :
#   - le fichier de configuration s'appelle .env.deploiement (voir le
#     commentaire en tete des docker-compose.yml : Expo CLI refuse de demarrer
#     s'il trouve la variable ENV dans un .env) ;
#   - aucune etape de migration : ces deux sites n'ont pas de base de donnees.
#
# Variables attendues : CIBLE, TAG, REGISTRY_USER, REGISTRY_TOKEN.
set -euo pipefail
cd "$CIBLE"

FICHIER_ENV=.env.deploiement
COMPOSE=(docker compose --env-file "$FICHIER_ENV")

# Le fichier de configuration vit sur le serveur et n'est jamais transfere.
# Son absence doit echouer ICI, avec un message clair : sinon la branche `else`
# du grep plus bas creerait un fichier ne contenant que IMAGE_TAG, et l'echec
# surviendrait bien plus loin sur un message sans rapport avec la cause.
if [ ! -f "$FICHIER_ENV" ]; then
  echo "ECHEC : aucun $FICHIER_ENV dans $CIBLE." >&2
  echo "Copiez le .env.deploiement.example du site sur le serveur et" >&2
  echo "renseignez-le (ENV=production, REGISTRY_ADDRESS, DOMAIN)." >&2
  exit 1
fi

echo "::group::Authentification au registre"
echo "$REGISTRY_TOKEN" | docker login ghcr.io -u "$REGISTRY_USER" --password-stdin
echo "::endgroup::"

# IMAGE_TAG est ecrit dans le fichier du serveur : `docker compose` doit voir
# la meme valeur a chaque appel suivant (pull, up). Le passer en variable
# d'environnement ne suffirait pas — les commandes s'executent dans des shells
# distincts.
if grep -q '^IMAGE_TAG=' "$FICHIER_ENV"; then
  sed -i "s|^IMAGE_TAG=.*|IMAGE_TAG=$TAG|" "$FICHIER_ENV"
else
  echo "IMAGE_TAG=$TAG" >> "$FICHIER_ENV"
fi
echo "Etiquette deployee : $TAG"

echo "::group::Verification de la composition"
# Echoue AVANT de toucher a la production si un fragment est invalide ou une
# variable manquante.
"${COMPOSE[@]}" config > /dev/null
# Garde-fou : un `build:` signifierait que le serveur va compiler, ce que ce
# socle interdit.
if "${COMPOSE[@]}" config | grep -q 'build:'; then
  echo "ECHEC : la composition de production contient un 'build:'." >&2
  echo "Verifiez que ENV=production dans $FICHIER_ENV sur le serveur." >&2
  exit 1
fi
echo "::endgroup::"

echo "::group::Recuperation de l'image"
"${COMPOSE[@]}" pull --quiet
echo "::endgroup::"

echo "::group::Redemarrage"
# PAS de `docker compose down`.
#
# `up -d` recree uniquement les conteneurs dont la definition ou l'image a
# change. Un `down` puis `up` couperait le service plus longtemps sans rien
# apporter ici.
#
# --remove-orphans supprime les conteneurs d'un service retire de la
# composition ; sans lui, ils continueraient de tourner indefiniment,
# invisibles dans `docker compose ps`.
"${COMPOSE[@]}" up -d --remove-orphans
echo "::endgroup::"

echo "::group::Etat du service"
# On attend une DECISION de la sonde, pas un delai fixe : pendant son
# start_period, un service est signale `starting`, jamais `unhealthy`. Un
# `sleep` suivi d'une recherche de "unhealthy" ne se declencherait jamais, et
# un deploiement casse finirait en vert.
fin=$(( $(date +%s) + 180 ))
while :; do
  etats=$("${COMPOSE[@]}" ps --format json)

  if echo "$etats" | grep -q '"Health":"unhealthy"'; then
    echo "ECHEC : le service est malade." >&2
    "${COMPOSE[@]}" ps
    "${COMPOSE[@]}" logs --tail=50
    exit 1
  fi

  echo "$etats" | grep -q '"Health":"starting"' || break

  if [ "$(date +%s)" -ge "$fin" ]; then
    echo "ECHEC : la sonde est encore 'starting' apres 180 s." >&2
    "${COMPOSE[@]}" ps
    "${COMPOSE[@]}" logs --tail=50
    exit 1
  fi
  sleep 5
done
"${COMPOSE[@]}" ps
echo "::endgroup::"

echo "::group::Nettoyage"
# Le jeton reste sinon en clair dans ~/.docker/config.json du serveur, bien
# apres la fin du deploiement.
docker logout ghcr.io > /dev/null 2>&1 || true
# 336h = 14 jours : conserve les images recentes, donc la possibilite de
# revenir en arriere. `docker image prune -af` sans filtre supprimerait
# l'image de la version precedente.
docker image prune -af --filter 'until=336h' || true
echo "::endgroup::"
