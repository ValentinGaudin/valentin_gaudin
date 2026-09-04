# Leçons

Pièges rencontrés sur ce dépôt, avec leur symptôme et le réflexe à prendre.
Le point commun des quatre premiers : **la cause et le symptôme sont très
éloignés**, et aucun outil ne les relie.

## Expo web statique : React n'hydrate pas les styles divergents

**Symptôme.** Sur une fenêtre de 1440 px, la mise en page reste en une colonne
et le titre à sa taille de repli. Aucune erreur, aucun avertissement.

**Cause.** Le HTML est pré-rendu côté Node, où aucune fenêtre n'existe.
`useWindowDimensions()` y renvoie une valeur par défaut, et React réutilise le
DOM du serveur à l'hydratation **sans réappliquer les attributs qui
divergent**. Tout style calculé depuis la largeur est donc figé sur la valeur
du pré-rendu, définitivement.

**Réflexe.** En Expo web avec `output: "static"`, ne jamais faire dépendre la
mise en page du JavaScript. Les trois outils qui marchent :
`flexWrap` + `flexBasis` (l'équivalent de `repeat(auto-fit, minmax(…, 1fr))`),
une largeur maximale centrée pour les gouttières, et `clamp()` en CSS global
ciblé par `nativeID` pour les tailles de police.

`useWindowDimensions` reste correct sur natif, où il n'y a pas de pré-rendu.

## Un `ScrollView` racine confisque le défilement du document

**Symptôme.** Aucune barre de défilement du navigateur, et surtout les ancres
(`/#generateur`) sans effet. Mesurable : `document.documentElement.scrollHeight`
égal à `clientHeight` alors que la page est longue.

**Réflexe.** Sur web, laisser le document défiler — une `View` suffit, le
`ScrollView` est réservé au natif. `ScrollViewStyleReset` d'Expo aide mais ne
suffit pas si le `ScrollView` porte `flex: 1`.

## pnpm 11 ne lit plus `.npmrc`

**Symptôme.** `node-linker=hoisted` sans effet, donc Metro qui ne résout pas
`@expo/metro-runtime` — et l'erreur arrive au bundling, longtemps après
l'installation.

**Réflexe.** Toute la configuration vit dans `pnpm-workspace.yaml`
(`nodeLinker`, `allowBuilds`, `overrides`, `strictPeerDependencies`). Contrôle
immédiat après un `install` : `ls node_modules | wc -l` — un compte proche de
zéro à la racine signifie que le hoisting n'a pas eu lieu.

Corollaire : `onlyBuiltDependencies` est devenu `allowBuilds` en pnpm 11.

## `minimumReleaseAge` bloque les paquets de moins de 24 heures

**Symptôme.** L'image Docker échoue sur `pnpm fetch` alors que
l'installation locale passe.

**Cause.** pnpm 11 refuse par défaut les paquets publiés depuis moins d'un
jour, protection contre les attaques de chaîne d'approvisionnement.
L'installation locale avait été faite par `expo install`, qui lançait une
version de pnpm antérieure à cette politique.

**Réflexe.** Ne pas désactiver la protection : épingler une ligne de versions
plus mûre via `overrides`, et prévoir de lever l'épinglage. Le contrôle porte
sur le **lockfile**, donc `pnpm clean --lockfile` est nécessaire après
l'épinglage — modifier les manifestes ne suffit pas.

## Expo CLI refuse un `.env` contenant `ENV`

**Symptôme.** `Refused to load dangerous environment variables from .env files`.

**Cause.** Expo lit tout `.env` du dossier de son projet et rejette les clefs
qu'il juge dangereuses. Or `ENV=local|production` est la variable dont
l'archétype `docker-deploy` a besoin pour choisir `containers/<ENV>/`.

**Réflexe.** Séparer les fichiers : `.env.deploiement` pour Docker, avec
`--env-file` dans le Makefile. Bénéfice au passage — la configuration de
déploiement quitte le champ de vision des outils de build front.

## `add_header` de nginx n'est pas cumulatif entre niveaux

**Symptôme.** Une CSP déclarée dans le bloc `server` disparaît de toutes les
réponses servies par un `location` qui pose ses propres en-têtes.

**Réflexe.** Sur ce socle, déclarer la CSP dans les labels Traefik — c'est
d'ailleurs ce que la décision D7 recommande. Et la mettre dans le fragment
**commun**, pas dans `production/`, pour qu'une politique cassante se voie en
local.

## Ce qu'aucun test automatique n'aurait attrapé

Les deux premiers pièges de cette liste sont passés à travers 128 tests, quatre
typechecks, `nginx -t`, `docker compose config` et une batterie de contrôles
HTTP. Seule l'ouverture d'un vrai navigateur les a révélés.

À l'inverse, deux garde-fous **écrits puis prouvés capables d'échouer** ont de
la valeur durable : `stravavisuel/scripts/verifier-scripts-en-ligne.mjs` et
`scripts/verifier-coherence-csp.mjs`. Un garde-fou qu'on n'a pas vu passer au
rouge n'est qu'une décoration.
