# portfolio

Deux sites, un dépôt, deux domaines. Déployés sur le socle
[`docker-deploy`](../docker-deploy).

Dépôt : `ValentinGaudin/valentin_gaudin`. Il porte encore le nom de l'ancien
portfolio Next.js, dont l'historique est conservé — les 102 commits d'avant
avril 2022 restent consultables, ainsi que les branches `changingStuff` et
`id`.

Le nom du dépôt n'influe sur rien : le préfixe des images de la CI est **fixé**
à `portfolio`, précisément pour ne pas dépendre de lui.

| Site | Domaine | Stack |
|---|---|---|
| `home` | valentingaudin.com | Astro, sans framework d'interface |
| `stravavisuel` | stravavisuel.valentingaudin.com | Expo (web aujourd'hui, stores ensuite) |

## Démarrer

```bash
nvm use                 # Node 24 — Astro 7 et pnpm 11 l'exigent
corepack enable
pnpm install

pnpm dev:home           # portfolio, sur http://localhost:4321
pnpm dev:strava         # générateur, sur http://localhost:8081
```

```bash
pnpm test               # 128 tests, tous dans packages/activity-core
pnpm typecheck
pnpm build
```

## Structure

```
packages/
├── design-tokens/      palette, échelle d'encre, polices — les deux sites
└── activity-core/      domaine du générateur : GPX, métriques, Mercator,
                        4 mises en page. Aucune dépendance au DOM ni à
                        React Native — il tourne dans Node, dans un
                        navigateur et sur un téléphone.
home/                   Astro + TypeScript
stravavisuel/           Expo Router + React Native Web
```

### Pourquoi `activity-core` ne connaît pas le canvas

Les quatre mises en page représentent l'essentiel du travail de rendu. Elles
sont écrites contre un **port**, `PosterCanvas`, d'une douzaine de primitives
(`fillRect`, `strokePolyline`, `fillText`, `measureTextWidth`, `drawTile`…).

Chaque plateforme n'implémente que ces primitives :
`stravavisuel/src/adapters/canvas2d-poster-canvas.ts` pour le web, un
adaptateur Skia le jour du natif. Sans ce port, les quatre mises en page
seraient à écrire deux fois — puis à maintenir en parallèle.

Effet de bord utile : les mises en page se testent contre un `PosterCanvas`
espion, sans navigateur et sans image de référence
(`packages/activity-core/tests/canvas-espion.ts`).

## Déployer

Le socle doit tourner **avant** les projets — c'est lui qui crée le réseau
`proxy` :

```bash
cd ../docker-deploy/socle-machine/traefik-local
cp .env.example .env        # LOCAL_HTTP_PORT si le port 80 est pris
docker compose up -d
```

Puis, par site :

```bash
cd home                     # ou stravavisuel
make up                     # construit et démarre
make ps                     # état de la sonde
make deploy-verif           # refuse toute composition de production avec un build:
make nginx-verif            # nginx -t dans un conteneur réel
```

Le remote passe par l'alias SSH du compte personnel, `git@github-perso:…`,
et non `git@github.com:…` — la clef par défaut est rattachée au compte
professionnel `Valentin-Gaudin`, et GitHub refuse qu'une même clef serve deux
comptes. L'alias est déclaré dans `~/.ssh/config`.

En production, la CI construit les images et le déploiement les tire :

```
ghcr.io/valentingaudin/portfolio-home-web:main
ghcr.io/valentingaudin/portfolio-strava-web:main
```

`Actions → Deployer` prend le site et l'étiquette en entrée. Un retour arrière
consiste à relancer avec l'étiquette `sha-...` précédente.

## Ce qui surprend, et pourquoi

### `.env.deploiement`, pas `.env`

Expo CLI lit automatiquement tout `.env` du dossier de son projet et **refuse
de démarrer** s'il y trouve une variable qu'il juge dangereuse — dont `ENV`,
que l'archétype du socle utilise justement pour choisir `containers/<ENV>/`.

Les deux fichiers sont donc séparés, et le Makefile pose
`--env-file .env.deploiement`. Bénéfice au passage : la configuration de
déploiement n'est plus dans le champ de vision des outils de build front.

### Toute la configuration pnpm vit dans `pnpm-workspace.yaml`

pnpm 11 ne lit plus `.npmrc`. Trois réglages y sont indispensables :

- **`nodeLinker: hoisted`** — Metro ne suit pas les liens symboliques de pnpm.
  Sans lui, `@expo/metro-runtime` est introuvable, et l'erreur n'arrive qu'au
  bundling, longtemps après l'installation.
- **`allowBuilds: esbuild`** — pnpm 11 refuse les scripts `postinstall` par
  défaut, ce qui est une bonne chose : la liste blanche est courte et lisible.
- **`overrides`** du SDK Expo — voir ci-dessous.

### L'épinglage du SDK Expo est temporaire

pnpm 11 refuse tout paquet publié depuis moins de 24 heures
(`minimumReleaseAge`), une protection contre les attaques de chaîne
d'approvisionnement. Le SDK Expo 57.0.20 est sorti pendant la mise en place du
projet : la construction de l'image échouait alors que l'installation locale
passait.

Le bloc `overrides` de `pnpm-workspace.yaml` épingle donc la ligne du
2026-09-01. Il porte la procédure pour le lever.

### La CSP se déclare dans les labels Traefik, pas dans nginx

En nginx, `add_header` **n'est pas cumulatif entre niveaux** : un seul
`add_header` dans un `location` annule tous ceux hérités du bloc `server`.
Comme chaque `location` pose son propre `Cache-Control`, une CSP déclarée au
niveau `server` disparaîtrait de toutes les réponses, sans le moindre message.

Elle vit donc dans `containers/web.yml` — dans le fragment **commun**, pas
dans `production/`, pour qu'une CSP cassante se voie en local.

Les deux CSP ne sont pas identiques, et l'écart est une contrainte, pas un
choix :

| | `home` | `stravavisuel` |
|---|---|---|
| `script-src` | `'self'` | `'self'` + empreinte du script d'hydratation d'Expo Router |
| `style-src` | `'self'` + Google Fonts | idem **+ `'unsafe-inline'`** : React Native Web injecte ses styles à l'exécution |
| `img-src` | `'self' data:` | idem **+ les trois fournisseurs de tuiles** |

Le script d'hydratation d'Expo Router est autorisé par son empreinte SHA-256
plutôt que par `'unsafe-inline'`. `stravavisuel/scripts/verifier-scripts-en-ligne.mjs`,
appelé par le Dockerfile, **fait échouer la construction** si l'export contient
un autre script en ligne — parce qu'un script bloqué par la CSP donne une page
qui s'affiche mais dont aucun bouton ne répond, sans trace côté serveur.

### Le responsive de `stravavisuel` vit en CSS, pas en JavaScript

En Expo web avec `output: "static"`, le HTML est pré-rendu côté Node, où
aucune fenêtre n'existe. `useWindowDimensions()` y renvoie une valeur par
défaut, et **React réutilise le DOM du serveur à l'hydratation sans
réappliquer les attributs divergents** : la mise en page reste figée sur le
pré-rendu, sans le moindre avertissement.

La mise en page est donc indépendante du JavaScript — `flexWrap` + `flexBasis`
pour les colonnes, largeur maximale centrée pour les gouttières, `clamp()` en
CSS (`app/+html.tsx`) pour les titres. Vérifié à 1440 / 1000 / 700 / 390 px.

Corollaire : sur web c'est une `View` qui porte la page, pas un `ScrollView` —
sinon le défilement est confisqué par un conteneur interne et l'ancre
`#generateur`, que le portfolio pointe, devient inopérante.

Ces pièges et ceux de l'outillage sont détaillés dans `tasks/lessons.md`.

### Ni API, ni Redis

L'archétype 01 du socle prévoit `web` + `node_api` + `redis`. Seule la brique
`web-static` est utilisée : le générateur lit le GPX, dessine et exporte
entièrement dans le navigateur. Aucun secret, aucun état serveur.

Le jour où un fournisseur de tuiles à clé remplace OpenStreetMap, le secret ne
pourra pas vivre dans le bundle : `TileRepository` est le point où un
mandataire se branchera, sans toucher au domaine.

## Contenu et langue

Tout le texte est externalisé — `home/src/content/fr.ts` et
`stravavisuel/src/content/fr.ts`. La version anglaise n'est pas faite, mais
elle coûtera un second fichier plus l'activation du routage i18n, pas une
réécriture. Le sélecteur FR/EN du portfolio est visible et inactif.

Deux emplacements « À REMPLIR » dans les expérimentations et une capture
« À FOURNIR » attendent leur contenu, comme dans la maquette.
