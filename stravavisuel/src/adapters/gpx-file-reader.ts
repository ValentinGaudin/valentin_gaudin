import {
  importerActiviteDepuisGpx,
  type ResultatImportGpx,
} from '@portfolio/activity-core';

export const tailleMaximaleDuFichierEnOctets = 25 * 1024 * 1024;

export const messageFichierTropVolumineux =
  'Ce fichier dépasse 25 Mo. Un GPX de sortie en fait rarement plus de 5.';
export const messageLectureImpossible = 'Lecture du fichier impossible.';

function lireLeTexte(fichier: File): Promise<string> {
  return new Promise((resoudre, rejeter) => {
    const lecteur = new FileReader();

    lecteur.addEventListener('load', () => {
      resoudre(String(lecteur.result));
    });

    lecteur.addEventListener('error', () => {
      rejeter(new Error(messageLectureImpossible));
    });

    lecteur.readAsText(fichier);
  });
}

export async function importerDepuisUnFichier(
  fichier: File,
  identifiant: string,
): Promise<ResultatImportGpx> {
  if (fichier.size > tailleMaximaleDuFichierEnOctets) {
    return {
      statut: 'echec',
      raison: 'xml-invalide',
      message: messageFichierTropVolumineux,
    };
  }

  if (fichier.size === 0) {
    return {
      statut: 'echec',
      raison: 'aucune-trace',
      message: 'Ce fichier est vide.',
    };
  }

  let contenu: string;

  try {
    contenu = await lireLeTexte(fichier);
  } catch {
    return {
      statut: 'echec',
      raison: 'xml-invalide',
      message: messageLectureImpossible,
    };
  }

  return importerActiviteDepuisGpx(contenu, fichier.name, identifiant);
}
