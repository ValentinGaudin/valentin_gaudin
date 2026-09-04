// Verifie que l'export ne contient AUCUN script en ligne autre que ceux dont
// l'empreinte est declaree dans la Content-Security-Policy du service.
//
// Pourquoi ce controle existe : Expo Router injecte un petit script en ligne
// pour amorcer l'hydratation. La CSP l'autorise par son empreinte SHA-256
// plutot que par 'unsafe-inline', ce qui garde la politique stricte. Mais une
// montee de version d'Expo peut changer ce script — et alors le navigateur le
// bloquerait : la page s'afficherait, aucun bouton ne repondrait, et rien
// dans les journaux du serveur ne le signalerait.
//
// Ce script transforme donc une panne silencieuse en production en un echec
// de construction explicite.
//
//   node verifier-scripts-en-ligne.mjs <dossier> <empreinte...>

import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const [dossierDeSortie, ...empreintesAutorisees] = process.argv.slice(2);

if (dossierDeSortie === undefined || empreintesAutorisees.length === 0) {
  console.error(
    'Usage : node verifier-scripts-en-ligne.mjs <dossier> <empreinte-sha256...>',
  );
  process.exit(2);
}

const motifDeScriptEnLigne =
  /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;

const empreintesAutoriseesNormalisees = new Set(
  empreintesAutorisees.map((empreinte) => empreinte.replace(/^sha256-/, '')),
);

const pagesHtml = readdirSync(dossierDeSortie, { recursive: true })
  .map(String)
  .filter((chemin) => chemin.endsWith('.html'));

if (pagesHtml.length === 0) {
  console.error(`ERREUR: aucune page HTML dans ${dossierDeSortie}.`);
  process.exit(1);
}

const scriptsInattendus = [];

for (const page of pagesHtml) {
  const contenu = readFileSync(join(dossierDeSortie, page), 'utf8');

  for (const correspondance of contenu.matchAll(motifDeScriptEnLigne)) {
    const corps = correspondance[1] ?? '';

    if (corps.trim() === '') {
      continue;
    }

    const empreinte = createHash('sha256').update(corps, 'utf8').digest('base64');

    if (!empreintesAutoriseesNormalisees.has(empreinte)) {
      scriptsInattendus.push({ page, empreinte, corps });
    }
  }
}

if (scriptsInattendus.length > 0) {
  console.error(
    "ERREUR: l'export contient des scripts en ligne non declares dans la CSP.",
  );
  console.error(
    'La page se chargerait mais son JavaScript serait bloque par le navigateur.',
  );
  console.error('');

  for (const { page, empreinte, corps } of scriptsInattendus) {
    console.error(`  ${page}`);
    console.error(`    empreinte : 'sha256-${empreinte}'`);
    console.error(`    contenu   : ${corps.trim().slice(0, 120)}`);
  }

  console.error('');
  console.error(
    'Corriger : reporter cette empreinte dans script-src, dans',
  );
  console.error('containers/web.yml, puis reconstruire.');
  process.exit(1);
}

console.log(
  `Scripts en ligne verifies : ${pagesHtml.length} page(s), ` +
    `${empreintesAutoriseesNormalisees.size} empreinte(s) autorisee(s).`,
);
