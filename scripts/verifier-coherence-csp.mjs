// Verifie que la Content-Security-Policy declaree dans les labels Traefik
// couvre bien tous les domaines que le code charge reellement.
//
// Pourquoi ce controle existe : la CSP et le code vivent dans deux fichiers
// qui n'ont aucune raison technique d'evoluer ensemble. Ajouter un fournisseur
// de tuiles dans activity-core sans toucher a containers/web.yml donne une
// cartographie qui fonctionne en local — ou aucune CSP ne s'applique si le
// proxy local n'en pose pas — et qui tombe en production. Le navigateur
// bloque alors les images en silence cote serveur : aucune trace dans les
// journaux nginx, aucune erreur HTTP.
//
//   node scripts/verifier-coherence-csp.mjs

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');

function politiqueDeSecurite(cheminDuFragment) {
  const fragment = readFileSync(join(racine, cheminDuFragment), 'utf8');
  const correspondance =
    /Content-Security-Policy=([^"\n]+)/.exec(fragment);

  if (correspondance === null) {
    throw new Error(`aucune CSP trouvee dans ${cheminDuFragment}`);
  }

  return correspondance[1];
}

function directive(politique, nom) {
  const correspondance = new RegExp(`${nom}\\s+([^;]+)`).exec(politique);
  return correspondance === null ? '' : correspondance[1].trim();
}

function domainesDeTuilesDuCode() {
  const source = readFileSync(
    join(racine, 'packages/activity-core/src/ports/tile-repository.ts'),
    'utf8',
  );

  const domaines = new Set();

  for (const correspondance of source.matchAll(/https:\/\/[a-z0-9.-]+/g)) {
    domaines.add(correspondance[0]);
  }

  return [...domaines];
}

const anomalies = [];

const politiqueDuGenerateur = politiqueDeSecurite(
  'stravavisuel/containers/web.yml',
);
const sourcesDImages = directive(politiqueDuGenerateur, 'img-src');

for (const domaine of domainesDeTuilesDuCode()) {
  if (!sourcesDImages.includes(domaine)) {
    anomalies.push(
      `stravavisuel : ${domaine} est charge par le code mais absent de img-src`,
    );
  }
}

for (const forme of ['data:', 'blob:']) {
  if (!sourcesDImages.includes(forme)) {
    anomalies.push(
      `stravavisuel : img-src doit inclure ${forme} ` +
        "(actifs incorpores et image exportee)",
    );
  }
}

const politiqueDuPortfolio = politiqueDeSecurite('home/containers/web.yml');

if (directive(politiqueDuPortfolio, 'script-src').includes('unsafe-inline')) {
  anomalies.push(
    "home : script-src ne doit pas contenir 'unsafe-inline' — le HTML genere " +
      "n'a aucun script en ligne",
  );
}

if (directive(politiqueDuPortfolio, 'style-src').includes('unsafe-inline')) {
  anomalies.push(
    "home : style-src ne doit pas contenir 'unsafe-inline' — Astro est " +
      "configure avec inlineStylesheets: 'never' et aucun attribut style " +
      "n'est genere",
  );
}

for (const [nom, politique] of [
  ['home', politiqueDuPortfolio],
  ['stravavisuel', politiqueDuGenerateur],
]) {
  for (const attendue of [
    "default-src 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    "base-uri 'self'",
  ]) {
    if (!politique.includes(attendue)) {
      anomalies.push(`${nom} : la CSP devrait contenir "${attendue}"`);
    }
  }
}

if (anomalies.length > 0) {
  console.error('ERREUR: la CSP et le code ne concordent pas.');
  console.error('');
  for (const anomalie of anomalies) {
    console.error(`  - ${anomalie}`);
  }
  console.error('');
  console.error('Corriger le label Content-Security-Policy dans');
  console.error('<site>/containers/web.yml, puis relancer.');
  process.exit(1);
}

console.log(
  'CSP coherente avec le code : ' +
    `${domainesDeTuilesDuCode().length} domaine(s) de tuiles couvert(s), ` +
    'politique stricte confirmee pour le portfolio.',
);
