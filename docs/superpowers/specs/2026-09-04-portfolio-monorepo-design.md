# Portfolio + Strava Visuel — conception

Date : 2026-09-04
Dépôt cible : `ValentinGaudin/portfolio`

Deux sites, un dépôt, deux domaines, deux projets Compose sur le socle
`docker-deploy`. Les maquettes de référence sont `Portfolio.dc.html` et
`Projet Strava.dc.html` du projet Claude Design
`ea2e4ac5-a391-4359-8c21-5bd95fea9314`.

## Objectif

| Site | Domaine | Nature |
|---|---|---|
| `home` | `valentingaudin.com` | one-page éditorial, deux canvas animés |
| `stravavisuel` | `stravavisuel.valentingaudin.com` | générateur de visuels depuis un GPX |

`stravavisuel` doit aussi partir sur les stores iOS et Android peu après la
mise en ligne web. Cette contrainte, énoncée d'emblée, décide de sa stack et
de la forme de son domaine métier.

## Périmètre

Dans le périmètre :

- les deux fronts, fidèles aux maquettes, contenu français
- le domaine métier du générateur : lecture GPX, métriques, tracés de démo,
  projection cartographique, quatre mises en page, export
- la pile Docker des deux sites et les workflows CI/CD
- les tests du domaine métier

Hors périmètre, explicitement :

- **l'application native** — le domaine métier est conçu pour l'accueillir,
  mais aucun build EAS n'est mis en place ici
- **la version anglaise** — le contenu est externalisé pour qu'elle coûte un
  fichier, le routage `/en` n'est pas posé
- **la connexion à l'API Strava** — les maquettes n'importent que des GPX
  locaux ; aucun OAuth, donc aucun secret, donc aucune API serveur
- **les contenus manquants** — les deux emplacements « À REMPLIR » des
  expérimentations et la capture « À FOURNIR » 1080 × 1920 restent des
  placeholders, tels que la maquette les porte
- **le VPS** — bootstrap, DNS et délivrance des certificats appartiennent au
  socle et se font une fois par machine

## Ce que les maquettes imposent

### Système visuel, commun aux deux sites

Palette `paper` / `ink` / `accent` avec une échelle d'opacité de l'encre à
vingt-deux paliers (`--ink-a055` à `--ink-a75`), entièrement recalculée en
thème sombre. Deux familles : Bodoni Moda pour les titres, Space Mono pour le
reste.

Cette échelle n'est pas décorative : c'est ce qui permet à toute la
hiérarchie visuelle de basculer en modifiant `--paper` et `--ink`. Elle est
donc la raison d'être du paquet partagé.

### `Portfolio.dc.html`

Cinq sections (`#top`, `#projet`, `#experimentations`, `#stack`, `#contact`),
un dock de navigation fixe dont l'état suit le défilement, un rail horizontal
à `scroll-snap` avec pastilles synchronisées, et deux canvas :

- `ridge` — relief en fil de fer, projection perspective écrite à la main,
  parallaxe au pointeur
- `torus` — tore dont la rotation et le rayon suivent `window.scrollY`

`Portfolio - Mobile.dc.html` n'apporte aucune décision de mise en page : c'est
un harnais de prévisualisation qui charge `Portfolio.dc.html` dans quatre
iframes de 390 × 844. Le responsive vit dans les `clamp()` et le
`@media (max-width:760px)` du fichier principal.
`Portfolio - Directions.dc.html` est l'exploration dont `Portfolio.dc.html`
est l'aboutissement. Ni l'un ni l'autre n'est implémenté.

### `Projet Strava.dc.html`

| Bloc | Contenu |
|---|---|
| Lecture GPX | `trkpt` puis repli `rtept`, sous-échantillonnage à 1200 points, Haversine, dénivelé positif à hystérésis, durée depuis les horodatages, profil rééchantillonné sur 180 points |
| Activités de démo | cinq entrées, tracés générés par un générateur congruentiel linéaire déterministe, quatre formes (`loop`, `out`, `track`, `city`), reprojetées en coordonnées réelles |
| Cartographie | projection Web Mercator, choix du zoom pour faire tenir la trace, fenêtre de tuiles, cache, filtres par style — OpenStreetMap, OpenTopoMap, ArcGIS World Imagery |
| Mises en page | `crete`, `fiche`, `profil`, `plein` |
| Export | PNG ou JPG, facteurs 1, 1,5 et 2, quatre passes de rendu pour attendre les tuiles |

Tout se passe dans le navigateur. La maquette l'affirme dans son propre
texte : « rien n'est envoyé ».

## Architecture

```
portfolio/
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── packages/
│   ├── design-tokens/
│   └── activity-core/
├── home/
└── stravavisuel/
```

### Deux projets Compose, pas un

`WEB_DOMAIN` est une variable unique par projet, et `COMPOSE_PROJECT_NAME`
doit être unique sur la machine — deux routeurs Traefik homonymes s'écrasent
en silence (décision D4 du socle). Deux domaines imposent donc deux projets.

C'est aussi ce qu'on veut : déployer le portfolio ne doit pas recréer le
conteneur du générateur. Le socle est bâti pour ce cas, ce n'est pas une
entorse.

| | `home` | `stravavisuel` |
|---|---|---|
| `COMPOSE_PROJECT_NAME` | `portfolio-home` | `portfolio-strava` |
| `WEB_DOMAIN` | `valentingaudin.com` | `stravavisuel.valentingaudin.com` |
| Briques | `web-static` | `web-static` |

**Ni `node-api`, ni `redis`.** Aucun secret, aucun état serveur, aucune
limitation de débit applicative à poser : les deux sites ne servent que des
fichiers. L'archétype 01 est utilisé partiellement, à dessein — inventer une
API pour respecter un gabarit serait le contraire du KISS demandé.

Cette réduction n'a pas d'effet sur le socle : la limitation de débit du point
d'entrée HTTPS (30/s, pointes à 80) s'applique de toute façon.

### `packages/design-tokens`

Le seul paquet partagé entre les deux sites.

```
design-tokens/
├── src/
│   ├── palette.ts        valeurs des thèmes clair et sombre
│   ├── typography.ts     familles, graisses, échelles
│   └── index.ts
└── tokens.css            les mêmes valeurs en propriétés personnalisées
```

Deux formes du même contenu, et c'est volontaire : `home` consomme le CSS
(les propriétés personnalisées font tout le travail, y compris la bascule de
thème), `stravavisuel` consomme le TypeScript (React Native n'a pas de
propriétés personnalisées, et le rendu canvas a besoin des valeurs comme
données).

Aucun `packages/ui`. Les deux sites partagent un vocabulaire visuel, pas des
composants : le portfolio n'a pas de sélecteurs, le générateur n'a ni dock de
navigation ni rail. Un paquet de composants partagés créerait un couplage
entre deux sites qui n'évolueront pas au même rythme.

### `packages/activity-core`

Le domaine métier du générateur. Aucune dépendance au DOM, à React ou à React
Native : du TypeScript qui s'exécute aussi bien dans Node, dans un navigateur
et sur un téléphone.

```
activity-core/
├── src/
│   ├── domain/
│   │   ├── activity.ts               Activity, ActivityKind
│   │   ├── track.ts                  GeoPoint, Track
│   │   ├── elevation-profile.ts      ElevationProfile
│   │   └── activity-metrics.ts       distance, dénivelé, durée, allure
│   ├── application/
│   │   ├── import-gpx-activity.ts
│   │   ├── list-demo-activities.ts
│   │   └── render-poster.ts
│   ├── ports/
│   │   ├── activity-repository.ts
│   │   ├── tile-repository.ts
│   │   ├── xml-parser.ts
│   │   └── poster-canvas.ts
│   ├── rendering/
│   │   ├── layouts/                  crete, fiche, profil, plein
│   │   ├── text-layout.ts            retour à la ligne ajusté, tracking
│   │   └── web-mercator.ts           projection, choix du zoom, tuilage
│   └── demo/
│       └── synthetic-tracks.ts
└── tests/
```

#### Le port de dessin

C'est la décision structurante de tout le projet, et elle mérite d'être
justifiée.

Les quatre mises en page représentent l'essentiel du travail de rendu :
environ quatre cents lignes d'appels de dessin. Elles sont écrites dans la
maquette contre l'API Canvas 2D du navigateur, qui **n'existe pas en React
Native**. Trois voies étaient possibles :

| Voie | Coût |
|---|---|
| Skia sur les deux plateformes | environ 2,8 Mo de CanvasKit WASM imposés au web, pour une page dont c'est le premier écran |
| Deux moteurs de rendu | les quatre mises en page écrites deux fois, et qui divergeront |
| **Un port, deux adaptateurs** | une douzaine de primitives à implémenter par plateforme |

La troisième est retenue. `PosterCanvas` décrit ce dont les mises en page ont
réellement besoin, et rien de plus :

```ts
interface PosterCanvas {
  fillRect(rect: Rect, color: string): void;
  fillCircle(center: Point, radius: number, color: string): void;
  strokePolyline(points: readonly Point[], strokeWidth: number, color: string): void;
  fillPolygon(points: readonly Point[], color: string): void;
  fillText(text: string, origin: Point, font: FontSpec, color: string): void;
  measureTextWidth(text: string, font: FontSpec): number;
  drawImage(image: TileImage, rect: Rect): void;
  withClip(rect: Rect, draw: () => void): void;
  withImageFilter(filter: ImageFilter, draw: () => void): void;
}
```

`ImageFilter` est **déclaratif**, pas une chaîne CSS :
`{ grayscale: 1, brightness: 1.12, contrast: 0.78 }`. C'est ce qui rend le
port portable — l'adaptateur web sérialise en `ctx.filter`, un futur
adaptateur Skia compose des matrices de couleur. Une chaîne CSS aurait fait
fuir le navigateur dans le domaine.

Le retour à la ligne ajusté et le tracking manuel, que la maquette place dans
`paint()`, sont de la composition au-dessus du port : ils vivent dans
`rendering/text-layout.ts` et n'ont besoin que de `measureTextWidth`.

#### Les autres ports

`XmlParser` existe pour une raison précise : la lecture GPX de la maquette
utilise `DOMParser`, absent de Node comme de React Native. En l'injectant, le
parsing devient testable sans navigateur — et c'est le morceau qui mérite le
plus d'être testé.

`ActivityRepository` a deux implémentations, ce qui est le cas nominal du
motif et non une abstraction spéculative : les activités de démo et les
fichiers importés sont deux sources réelles de la même entité.

`TileRepository` isole le chargement et le cache des tuiles. Le jour où un
fournisseur à clé remplace OpenStreetMap, seule son implémentation change.

### `home` — Astro, sans framework d'interface

En lisant le script de la maquette, le portfolio n'a besoin d'aucun
framework à l'exécution :

- les deux canvas sont de la logique impérative (`requestAnimationFrame` et
  appels de dessin) — un framework ne leur apporte rien
- l'état actif du dock est un écouteur de défilement
- le rail est du `scroll-snap` CSS ; seule la synchronisation des pastilles
  demande un écouteur
- les `style-hover` de la maquette, qui auraient demandé du JavaScript en
  React, redeviennent un simple `:hover`

Le site est donc du HTML pré-rendu avec quelques modules TypeScript. Pour une
page qui annonce « FREELANCE — DISPONIBLE », le pré-rendu et les aperçus de
partage ne sont pas un détail de performance.

```
home/
├── src/
│   ├── content/
│   │   └── fr.ts                 tout le texte de la page, typé
│   ├── components/
│   │   ├── atoms/                Tag, SectionNumber, StatValue, TechChip
│   │   ├── molecules/            SectionHeading, ProjectStep, PhoneMockup, DockLink
│   │   └── organisms/            HeroSection, ProjectSection, LabSection,
│   │                             StackSection, ContactFooter, NavigationDock
│   ├── scripts/
│   │   ├── ridge-canvas.ts
│   │   ├── torus-canvas.ts
│   │   ├── dock-active-section.ts
│   │   └── rail-pagination.ts
│   ├── layouts/
│   │   └── BaseLayout.astro
│   └── pages/
│       └── index.astro
├── nginx/
└── Dockerfile
```

Le contenu est **externalisé dès maintenant** dans `content/fr.ts`. La
version anglaise est hors périmètre, mais l'écrire coûtera un second fichier
et l'activation du routage i18n d'Astro, au lieu d'une réécriture du markup.
Le sélecteur FR/EN de la maquette reste visible et inactif, ce qu'il est déjà.

L'Atomic Design s'applique aux composants Astro. Les scripts ne sont pas des
composants : ce sont des comportements attachés à des éléments, et les ranger
dans la hiérarchie atomique brouillerait les deux notions.

### `stravavisuel` — Expo, web livré d'abord

`expo export -p web` avec `web.output: "static"` produit un dossier de
fichiers statiques que la brique `web-static` sert tel quel. La brique a été
écrite pour ce cas : le `try_files` gère les routes sans extension, le
`+not-found.html` est documenté, et `/_expo/` est déjà marqué `immutable`.

La maquette décrit **une seule page** : bandeau, générateur, « comment c'est
fait », pied de page. Le routage Expo Router n'a donc qu'une route utile, plus
la page d'erreur. Cela impose d'activer la **variante 404 stricte** de la
configuration nginx : avec le repli `/index.html` livré par défaut, une URL
inexistante renverrait 200 avec la page d'accueil — un faux 404 que rien ne
signale. La brique porte cette variante en commentaire, prête à décommenter.

```
stravavisuel/
├── app/
│   ├── index.tsx                 la page unique
│   └── +not-found.tsx
├── src/
│   ├── adapters/
│   │   ├── canvas2d-poster-canvas.ts
│   │   ├── dom-xml-parser.ts
│   │   ├── gpx-file-activity-repository.ts
│   │   ├── demo-activity-repository.ts
│   │   └── http-tile-repository.ts
│   └── components/
│       ├── atoms/                ChoiceButton, SwatchButton, FieldLabel, TextField
│       ├── molecules/            ActivityRow, LayoutCard, GpxDropZone, ExportControls
│       └── organisms/            ActivityPicker, PosterPreview, GeneratorPanel
├── nginx/
└── Dockerfile
```

Le dépôt de fichier fonctionne par `expo-document-picker`. Le glisser-déposer
de la maquette est spécifique au web : il est branché derrière un test de
plateforme, et son absence sur natif n'est pas une régression — un téléphone
n'a pas de glisser-déposer de fichier.

L'export suit le même principe : `canvas.toBlob` et un lien de
téléchargement sur web, `expo-media-library` ou le partage système sur natif.

## Docker

### Le point d'adaptation

La brique fait `COPY package.json ./` avec `context: ../web`. **Cela ne
fonctionne pas dans un espace de travail pnpm** : `pnpm-workspace.yaml` et le
lockfile sont à la racine du dépôt, donc hors du contexte de construction, et
`pnpm install --frozen-lockfile` échouerait — exactement le mode de
défaillance que la brique documente pour un contexte mal choisi.

Correction retenue : **contexte de construction à la racine du dépôt**, un
Dockerfile par site, copie sélective des manifestes avant le code.

```
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/design-tokens/package.json packages/design-tokens/
COPY packages/activity-core/package.json packages/activity-core/
COPY home/package.json home/
RUN corepack enable && pnpm install --frozen-lockfile --filter home...
COPY . .
RUN pnpm --filter home build
```

L'ordre compte : tant que les manifestes ne changent pas, la couche
d'installation est reprise du cache même après modification de tout le code.
La syntaxe `--filter home...` inclut les dépendances d'espace de travail de
`home`, donc les deux paquets partagés, et rien d'autre.

Les garde-fous de la brique sont conservés à l'identique, parce qu'ils ont
tous une raison établie par test : lockfile obligatoire, `--no-audit
--no-fund` sur npm, vérification que le dossier de sortie existe et n'est pas
vide, étage nginx sans Node.

Un `.dockerignore` à la racine exclut `node_modules`, les `.env`, `.git` et
les dossiers de sortie. Sans lui, `COPY . .` embarquerait les
`node_modules` de la machine — plusieurs centaines de mégaoctets, et des
binaires compilés pour le mauvais système.

### Fragments de composition

Repris de la brique `web-static` sans modification. Les chemins relatifs se
résolvent depuis `containers/`, donc `../web` désigne le dossier du site.
Chaque site a ses `containers/`, son `docker-compose.yml`, son `.env` et son
`Makefile`.

Le service `web` ne rejoint que le réseau `proxy`, jamais un réseau interne :
un front statique n'a personne à joindre.

### Vérification

`make deploy-verif` refuse toute composition de production contenant un
`build:`. À exécuter pour les deux sites avant chaque déploiement.

## CI/CD

Un seul dépôt, donc un seul workflow de construction, avec une matrice à deux
entrées :

| Composant | Contexte | Dockerfile | Étage |
|---|---|---|---|
| `home-web` | `.` | `home/Dockerfile` | `web-production` |
| `strava-web` | `.` | `stravavisuel/Dockerfile` | `web-production` |

Le nommage doit correspondre exactement à ce que la production demande, sinon
le déploiement échoue sur un manifeste introuvable :

```
ghcr.io/valentingaudin/portfolio-home-web:<tag>
ghcr.io/valentingaudin/portfolio-strava-web:<tag>
```

`docker/metadata-action` normalise le nom du dépôt en minuscules ; le `.env`
doit donc porter `REGISTRY_ADDRESS=ghcr.io/valentingaudin/` en minuscules,
faute de quoi le nom construit par Compose ne correspondra pas à l'image
poussée.

Deux étiquettes par image : `main` et `sha-xxxxxxx`. La seconde est ce qui
rend un retour arrière possible.

Un déclenchement par chemins évite de reconstruire les deux sites pour la
modification d'un seul — mais **une modification de `packages/` doit
reconstruire les deux**, puisque les deux en dépendent.

Le workflow de déploiement est repris du socle, avec une différence : il
transfère et démarre **un site à la fois**, choisi en entrée. Déployer le
portfolio ne doit pas toucher au générateur.

## Sécurité

### Politique de sécurité du contenu

Le socle n'en définit aucune, délibérément (décision D7) : générique, elle
serait soit inutile soit cassante. Elle se déclare donc par site, en en-tête
nginx.

`home` n'a besoin que de Google Fonts. `stravavisuel` doit en plus autoriser
`img-src` vers les trois domaines de tuiles :

```
img-src 'self' data: blob:
  https://tile.openstreetmap.org
  https://tile.opentopomap.org
  https://server.arcgisonline.com;
```

Sans cette déclaration, la cartographie fonctionne en local et tombe en
production, ce qui est le pire moment pour s'en apercevoir. À vérifier
explicitement en recette.

`blob:` est nécessaire : c'est la forme que prend l'image exportée.

### Tuiles cartographiques

`crossOrigin = 'anonymous'` est indispensable, et pas pour des raisons de
politesse : sans lui le canvas devient contaminé et `toBlob` échoue. Les
trois fournisseurs renvoient les en-têtes nécessaires.

`tile.openstreetmap.org` est un service bénévole dont la politique d'usage
exclut les usages lourds. Acceptable pour un site vitrine à faible trafic ;
à surveiller. Sur natif, cette politique est plus stricte encore, ce qui
rendra probablement nécessaire un fournisseur à clé — donc un secret, donc un
mandataire. `TileRepository` est le point où cela se branchera, sans toucher
au domaine.

## Tests

`packages/activity-core` est testé avec Vitest. C'est l'endroit où les tests
ont de la valeur : de la logique pure, des cas limites nombreux, et des
règles métier discutables.

| Sujet | Ce qui est vérifié |
|---|---|
| Lecture GPX | `trkpt`, repli `rtept`, XML invalide, trace vide, coordonnées illisibles, altitudes absentes, horodatages absents |
| Métriques | distance Haversine sur des écarts connus, dénivelé avec hystérésis, bascule allure/vitesse de part et d'autre du seuil |
| Profil | rééchantillonnage à 180 points, altitudes toutes absentes |
| Web Mercator | choix du zoom, cadrage d'une trace connue, franchissement de l'antiméridien |
| Mises en page | rendu contre un `PosterCanvas` espion, vérifiant les appels et non des pixels |

Le `PosterCanvas` espion est ce qui rend les mises en page testables sans
navigateur — un bénéfice du port qui n'était pas sa motivation première.

Les deux fronts n'ont pas de tests unitaires : ils ne contiennent que du
markup et du câblage. Leur vérification est la recette manuelle et
`nginx -t`.

## Outillage

| | Version | Remarque |
|---|---|---|
| Node local | 20.19.5 | suffisant pour Astro et Expo |
| Node des images | 22 | défaut de la brique |
| pnpm | via `corepack` | épinglé par le champ `packageManager` |
| Docker | 29.4 | la combinaison sur laquelle le socle a été vérifié |
| Compose | 5.1.2 | `include:` requiert 2.20 minimum |

L'écart Node 20 en local et Node 22 dans les images est assumé et signalé :
le serveur de développement ne construit pas l'image déployée. Passer le
poste en 22 supprime l'écart et reste recommandé.

`corepack` est présent en Node 20 et 22 et lit le champ `packageManager` du
`package.json` racine, ce qui garantit que la machine et la CI installent avec
la même version de pnpm que celle qui a produit le lockfile.

## Décisions

### Le contenu est externalisé avant que l'anglais existe

Le coût aujourd'hui est d'un fichier. Extraire deux cents lignes de texte
d'un markup déjà écrit coûte bien davantage, et se paie une seconde fois en
relecture. La version anglaise reste hors périmètre.

### Le port de dessin est posé maintenant, pas au moment du natif

Le port est du travail immédiat qui ne sert pleinement que plus tard, ce qui
ressemble à de l'anticipation spéculative. Ce n'en est pas : sans lui, les
quatre mises en page seront écrites contre l'API du navigateur, et le passage
au natif ne sera pas un ajout d'adaptateur mais une réécriture — puis deux
versions à maintenir.

Le signe que ce serait de la spéculation serait un port dont aucune seconde
implémentation n'est prévue. Ici elle est prévue, elle est même l'objectif
annoncé.

### Aucune API serveur

Les maquettes n'envoient rien. Ajouter `node-api` et `redis` parce que
l'archétype 01 les prévoit reviendrait à déployer deux conteneurs pour rien.
Le jour où un mandataire de tuiles ou un OAuth Strava apparaît, la brique
s'ajoute — c'est précisément à quoi sert la composition par briques.

### Pas de paquet de composants partagés

Les deux sites partagent la palette et les polices, pas des composants. Un
`packages/ui` prématuré ferait qu'une modification du portfolio pourrait
casser le générateur.

## À vérifier en recette

1. Une visite directe sur une route sans extension renvoie 200 et le HTML
   pré-rendu, pas un repli sur l'accueil.
2. Une URL inexistante renvoie un vrai 404 et non 200 avec la page d'accueil,
   sur les deux sites.
3. Une seule en-tête `Cache-Control` par réponse, et `index.html` en
   `no-store`.
4. Les tuiles se chargent en production, CSP appliquée.
5. Un export en facteur 2 contient bien les tuiles, et pas un fond vide.
6. `make deploy-verif` ne trouve aucun `build:` sur les deux sites.
7. Les deux routeurs Traefik portent des noms distincts et le site répond sur
   les deux domaines.
