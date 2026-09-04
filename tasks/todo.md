# Mission — Portfolio + Strava Visuel en ligne

Spec : `docs/superpowers/specs/2026-09-04-portfolio-monorepo-design.md`
Mode : enchaînement complet validé le 2026-09-04, sans phase line, sans Mode Contribution.

- [x] T1 — Socle monorepo : pnpm workspaces, tsconfig, design-tokens, ignores
- [x] T2 — Portfolio : contenu externalisé, composants Atomic Design, responsive
- [x] T3 — Portfolio : canvas ridge et torus
- [x] T4 — Docker + nginx + CSP pour `home`
- [x] T5 — activity-core : domaine, métriques, lecture GPX, tests
- [x] T6 — activity-core : Web Mercator, port de dessin, 4 mises en page
- [x] T7 — stravavisuel Expo : adaptateurs, composants, câblage
- [x] T8 — Docker stravavisuel + CI/CD

## Revue

### Écarts par rapport à la spec

| Écart | Raison |
|---|---|
| Pas de port `XmlParser` | `fast-xml-parser` est portable Node / navigateur / React Native. Le port n'existait que pour contourner l'absence de `DOMParser` en Node ; une bibliothèque portable règle le problème à la racine. Une abstraction en moins. |
| Pas de `GpxDropZone.native.tsx` | Le natif est hors périmètre. Un stub à moitié écrit vaut moins qu'une erreur de résolution immédiate et lisible le jour du premier bundle natif. |
| `.env.deploiement` au lieu de `.env` | Expo CLI refuse de démarrer s'il trouve `ENV` dans un `.env`, variable dont l'archétype a besoin. Écart au socle assumé et documenté. |
| Node 24 au lieu de 22 | Astro 7 exige ≥ 22.12, pnpm 11 ne démarre pas sous 22. Node 24 était déjà installé via nvm ; `.nvmrc` le déclare. |
| TypeScript 6 au lieu de 7 | `astro check` dépend d'une API programmatique que le compilateur natif de TS 7 n'expose pas encore. Contrainte mesurée, pas un choix. |

### Décisions métier prises seules

Le Mode Contribution était désactivé pour cette mission. Ces trois points
étaient les candidats identifiés au découpage — ils sont ouverts à révision.

1. **Lissage des altitudes avant le calcul du D+.** La maquette applique une
   hystérésis de 1 m, qui ne filtre que le bruit inférieur à 1 m. Sur du GPS
   réel (±5 à ±10 m), le test `e - last > 1` compte le bruit comme du
   dénivelé. Retenu : moyenne glissante sur 5 points, puis hystérésis à 3 m.
   Deux tests encadrent l'arbitrage — l'un montre que le bruit non lissé
   produit plus de 500 m fantômes, l'autre qu'une vraie montée de 1000 m
   traverse le lissage intacte.

2. **Bascule allure / vitesse.** La maquette bascule à 150 s/km (24 km/h), sur
   la seule vitesse. Un cycliste en côte à 15 km/h se voyait donc affiché en
   min/km. Retenu : lire d'abord le `<type>` du GPX (`cycling`, `ride`…), et
   ne se rabattre sur un seuil de vitesse — abaissé à 20 km/h — qu'en son
   absence.

3. **Distance et D+ calculés sur les points complets.** La maquette
   sous-échantillonne à 1200 points *avant* de mesurer, ce qui coupe les
   virages et sous-estime la longueur. Le sous-échantillonnage ne sert plus
   qu'au rendu.

### Deux bugs trouvés par la vérification navigateur, et corrigés

La recette au navigateur n'était pas décorative : elle a révélé deux défauts
que ni les tests, ni le typecheck, ni les contrôles HTTP ne pouvaient voir.

1. **Le document ne défilait pas.** Le `ScrollView` racine de React Native Web
   créait un conteneur de défilement interne (`htmlScrollHeight` égal à
   `clientHeight`). Conséquence sérieuse : l'ancre `#generateur`, vers laquelle
   pointe justement le portfolio, était inopérante. Corrigé en n'utilisant qu'une
   `View` sur web et en réservant le `ScrollView` au natif.

2. **La mise en page restait figée sur le pré-rendu.** Tout style calculé
   depuis `useWindowDimensions` était bloqué à la valeur du rendu statique —
   React hydrate le DOM du serveur et ne réapplique pas les attributs
   divergents. Résultat mesuré sur une fenêtre de 1440 px : une seule colonne
   et un titre à la taille de repli. Corrigé en rendant la mise en page
   indépendante du JavaScript : `flexWrap` + `flexBasis` pour les colonnes,
   largeur maximale centrée pour les gouttières, `clamp()` en CSS pour les
   titres.

Vérifié après correction à 1440 / 1000 / 700 / 390 px : le document défile
partout, les colonnes basculent de deux à une sous ~830 px, le titre varie de
40 à 100,8 px, et `#generateur` défile bien à 574 px.

### Vérifications passées

| | Résultat |
|---|---|
| Tests `activity-core` | 128 passés (7 fichiers) |
| Typecheck des 4 projets | 0 erreur |
| `astro check` | 0 erreur, 0 avertissement, 37 fichiers |
| Build `home` | 2 pages, JS de 5,69 Ko (2,57 Ko gzippé) |
| Export `stravavisuel` | 3 routes statiques, bundle 1,3 Mo (339 Ko gzippé) |
| `nginx -t` (2 configurations) | OK dans un conteneur réel |
| `docker compose config` local et production | résolu, aucun `build:` en production |
| YAML (11 fichiers) | valides |
| `bash -n` du script de déploiement | OK |
| Image `home` derrière Traefik | `/` en 200, `/route-inexistante` en **404**, un seul `Cache-Control`, CSP présente jusque sur `/_astro/` |
| Empreinte du script d'hydratation | identique entre expo-router 57.0.18 et 57.0.19 |
| **Navigateur — portfolio** | 0 erreur console, 0 violation CSP, les deux canvas réellement dessinés, dock passant de HOME à STACK au défilement |
| **Navigateur — générateur** | 0 erreur, 0 violation CSP, script d'hydratation **exécuté** (l'empreinte fonctionne), 9 tuiles OSM en 200, **0 bloquée**, tuiles réellement dessinées (137 teintes distinctes en satellite contre 8 en papier) |

### Reste à faire

- **Créer le dépôt distant** : `gh repo create ValentinGaudin/portfolio --private --source=. --remote=origin`
- **Premier commit** — jamais fait automatiquement
- **Lever l'épinglage du SDK Expo** une fois la ligne 57.0.20 vieille de plus
  d'un jour (procédure dans `pnpm-workspace.yaml`)
- **Recette de la CSP en production** : validée en local au navigateur
  (tuiles chargées et dessinées, hydratation exécutée). À reconfirmer une fois
  en HTTPS derrière le socle de production, qui ajoute HSTS et ses propres
  en-têtes.
- **Secrets GitHub** pour le déploiement : `SSH_PRIVATE_KEY`,
  `SSH_KNOWN_HOSTS`, `SSH_USER`, `SERVER_HOSTNAME`, `SERVER_PORT`,
  `DEPLOY_PATH`
- **Contenu manquant** : deux emplacements « À REMPLIR », une capture
  1080 × 1920 « À FOURNIR »
- **Version anglaise** : un second fichier de contenu et le routage i18n
