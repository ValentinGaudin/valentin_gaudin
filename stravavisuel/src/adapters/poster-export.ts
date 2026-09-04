import {
  couleurDeFondDExport,
  dessinerVisuel,
  hauteurDuVisuel,
  largeurDuVisuel,
  nomDeFichierDExport,
  type FormatDExport,
  type OptionsDeVisuel,
} from '@portfolio/activity-core';

import { creerCanvasDeVisuel } from './canvas2d-poster-canvas';
import type { DepotDeTuilesDuNavigateur } from './browser-tile-repository';

export const nombreMaximalDePassesDeRendu = 4;
export const delaiMaximalDAttenteDesTuilesEnMillisecondes = 7000;
export const qualiteJpeg = 0.92;
export const delaiAvantLiberationDeLUrlEnMillisecondes = 4000;

export interface DemandeDExport {
  readonly visuel: OptionsDeVisuel;
  readonly format: FormatDExport;
  readonly facteurDeTaille: number;
  readonly depotDeTuiles: DepotDeTuilesDuNavigateur;
}

export type ResultatDExport =
  | { readonly statut: 'exporte'; readonly nomDeFichier: string }
  | { readonly statut: 'echec'; readonly message: string };

function enTypeMime(format: FormatDExport): string {
  return format === 'jpg' ? 'image/jpeg' : 'image/png';
}

export async function exporterVisuel(
  demande: DemandeDExport,
): Promise<ResultatDExport> {
  const canvasHorsEcran = document.createElement('canvas');
  canvasHorsEcran.width = Math.round(largeurDuVisuel * demande.facteurDeTaille);
  canvasHorsEcran.height = Math.round(hauteurDuVisuel * demande.facteurDeTaille);

  const contexte = canvasHorsEcran.getContext('2d');

  if (contexte === null) {
    return { statut: 'echec', message: "Le navigateur n'a pas fourni de canvas." };
  }

  const canvas = creerCanvasDeVisuel(contexte, (url) =>
    demande.depotDeTuiles.resoudre(url),
  );

  // Plusieurs passes : un canvas exporte avant l'arrivee des tuiles sortirait
  // sans la carte. Chaque passe redessine tout, puis attend les tuiles encore
  // en vol ; on s'arrete des qu'il n'en manque plus.
  for (let passe = 0; passe < nombreMaximalDePassesDeRendu; passe += 1) {
    contexte.setTransform(1, 0, 0, 1, 0, 0);
    contexte.clearRect(0, 0, canvasHorsEcran.width, canvasHorsEcran.height);

    // Le JPEG n'a pas de canal alpha : sans fond peint, les zones
    // transparentes sortiraient noires.
    if (demande.format === 'jpg') {
      const fond = couleurDeFondDExport(demande.visuel) ?? '#F1ECE4';
      contexte.fillStyle = fond;
      contexte.fillRect(0, 0, canvasHorsEcran.width, canvasHorsEcran.height);
    }

    contexte.scale(demande.facteurDeTaille, demande.facteurDeTaille);

    dessinerVisuel(
      canvas,
      demande.depotDeTuiles,
      demande.visuel,
      demande.facteurDeTaille,
    );

    if (demande.depotDeTuiles.nombreDeTuilesEnAttente() === 0) {
      break;
    }

    await demande.depotDeTuiles.attendreLesTuiles(
      delaiMaximalDAttenteDesTuilesEnMillisecondes,
    );
  }

  const nomDeFichier = nomDeFichierDExport(
    demande.visuel.activite,
    demande.format,
  );

  const blob = await new Promise<Blob | null>((resoudre) => {
    canvasHorsEcran.toBlob(resoudre, enTypeMime(demande.format), qualiteJpeg);
  });

  if (blob === null) {
    return {
      statut: 'echec',
      message: "L'image n'a pas pu être encodée.",
    };
  }

  const url = URL.createObjectURL(blob);
  const lien = document.createElement('a');
  lien.href = url;
  lien.download = nomDeFichier;
  lien.click();

  setTimeout(
    () => URL.revokeObjectURL(url),
    delaiAvantLiberationDeLUrlEnMillisecondes,
  );

  return { statut: 'exporte', nomDeFichier };
}
