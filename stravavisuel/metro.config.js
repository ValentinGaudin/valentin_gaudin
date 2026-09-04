// Metro dans un espace de travail pnpm.
//
// Sans ces trois reglages, le bundler ne resout pas @portfolio/activity-core :
// il cherche dans stravavisuel/node_modules, ou pnpm n'a place qu'un lien
// symbolique vers la racine. L'erreur survient au bundling, pas a
// l'installation — donc bien apres qu'on croit le projet en place.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const racineDuProjet = __dirname;
const racineDuMonorepo = path.resolve(racineDuProjet, '..');

const config = getDefaultConfig(racineDuProjet);

// Metro doit surveiller la racine : les paquets partages y vivent, et une
// modification de activity-core doit declencher un rechargement.
config.watchFolders = [racineDuMonorepo];

// Les deux emplacements ou pnpm depose les dependances.
config.resolver.nodeModulesPaths = [
  path.resolve(racineDuProjet, 'node_modules'),
  path.resolve(racineDuMonorepo, 'node_modules'),
];

// Empeche Metro de remonter l'arborescence au hasard : avec pnpm, la
// remontee hierarchique peut trouver deux exemplaires de react et produire
// l'erreur « Invalid hook call », dont la cause est introuvable.
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
