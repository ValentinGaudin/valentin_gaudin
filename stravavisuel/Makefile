# Strava Visuel — raccourcis d'exploitation.
#
# `docker compose` lit ENV depuis .env : aucune option -f a passer, la
# composition est declaree dans docker-compose.yml.
COMPOSE := $(COMPOSE) --env-file .env.deploiement

.DEFAULT_GOAL := help
.PHONY: help up down restart build logs ps sante nginx-verif deploy-verif

help: ## Affiche cette aide
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
	  | awk 'BEGIN{FS=":.*?## "}{printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

up: ## Demarre la pile (construit si necessaire)
	$(COMPOSE) up -d --build

down: ## Arrete la pile
	$(COMPOSE) down

restart: ## Redemarre sans reconstruire (suffit pour un changement nginx)
	$(COMPOSE) restart

build: ## Reconstruit l'image sans demarrer
	$(COMPOSE) build

logs: ## Suit les journaux
	$(COMPOSE) logs -f --tail=100

ps: ## Etat du service et de sa sonde
	$(COMPOSE) ps

sante: ## Interroge la sonde nginx
	@$(COMPOSE) exec -T web curl -fsS http://localhost/_nginx-sante

nginx-verif: ## Valide la syntaxe nginx dans un conteneur reel
	@docker run --rm \
	  -v "$(CURDIR)/nginx/nginx.conf:/etc/nginx/nginx.conf:ro" \
	  -v "$(CURDIR)/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro" \
	  nginx:1.27-alpine nginx -t

deploy-verif: ## Verifie la configuration de PRODUCTION sans rien deployer
	@echo "Resolution de la composition avec ENV=production :"
	@ENV=production $(COMPOSE) config | grep -E "image:|restart:|entrypoints|certresolver" || true
	@echo ""
	@echo "Aucun 'build:' ne doit apparaitre ci-dessus : le serveur ne compile jamais."
	@ENV=production $(COMPOSE) config | grep -q "build:" \
	  && { echo "ECHEC : le service se construirait en production."; exit 1; } \
	  || echo "OK : le service tire une image du registre."
