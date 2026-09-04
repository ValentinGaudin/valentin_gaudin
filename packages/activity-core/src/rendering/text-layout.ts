import type { FontSpec, Point, PosterCanvas } from '../ports/poster-canvas';

export function largeurAvecTracking(
  canvas: PosterCanvas,
  texte: string,
  police: FontSpec,
  espacement: number,
): number {
  if (texte === '') {
    return 0;
  }

  let largeur = 0;

  for (const caractere of texte) {
    largeur += canvas.measureTextWidth(caractere, police) + espacement;
  }

  return largeur - espacement;
}

export function ecrireAvecTracking(
  canvas: PosterCanvas,
  texte: string,
  origine: Point,
  police: FontSpec,
  couleur: string,
  espacement: number,
): void {
  let abscisse = origine.x;

  for (const caractere of texte) {
    canvas.fillText(caractere, { x: abscisse, y: origine.y }, police, couleur);
    abscisse += canvas.measureTextWidth(caractere, police) + espacement;
  }
}

export interface TexteAjuste {
  readonly lignes: readonly string[];
  readonly taille: number;
}

export interface ContraintesDAjustement {
  readonly tailleInitiale: number;
  readonly largeurMaximale: number;
  readonly nombreMaximalDeLignes: number;
  readonly tailleMinimale: number;
  readonly pasDeReduction?: number;
}

export function ajusterTexteSurPlusieursLignes(
  canvas: PosterCanvas,
  texte: string,
  policeDeBase: FontSpec,
  contraintes: ContraintesDAjustement,
): TexteAjuste {
  const pasDeReduction = contraintes.pasDeReduction ?? 6;

  const decouper = (taille: number): string[] => {
    const police: FontSpec = { ...policeDeBase, sizeInPixels: taille };
    const lignes: string[] = [];
    let ligneCourante = '';

    for (const mot of texte.split(' ')) {
      const candidate = ligneCourante === '' ? mot : `${ligneCourante} ${mot}`;

      if (
        canvas.measureTextWidth(candidate, police) > contraintes.largeurMaximale &&
        ligneCourante !== ''
      ) {
        lignes.push(ligneCourante);
        ligneCourante = mot;
      } else {
        ligneCourante = candidate;
      }
    }

    if (ligneCourante !== '') {
      lignes.push(ligneCourante);
    }

    return lignes;
  };

  let taille = contraintes.tailleInitiale;
  let lignes = decouper(taille);

  while (
    lignes.length > contraintes.nombreMaximalDeLignes &&
    taille > contraintes.tailleMinimale
  ) {
    taille -= pasDeReduction;
    lignes = decouper(taille);
  }

  if (lignes.length <= contraintes.nombreMaximalDeLignes) {
    return { lignes, taille };
  }

  const lignesTronquees = lignes.slice(0, contraintes.nombreMaximalDeLignes);
  const police: FontSpec = { ...policeDeBase, sizeInPixels: taille };
  let derniereLigne = lignesTronquees[contraintes.nombreMaximalDeLignes - 1] ?? '';

  while (
    derniereLigne.length > 1 &&
    canvas.measureTextWidth(`${derniereLigne}…`, police) >
      contraintes.largeurMaximale
  ) {
    derniereLigne = derniereLigne.slice(0, -1);
  }

  lignesTronquees[contraintes.nombreMaximalDeLignes - 1] = `${derniereLigne}…`;

  return { lignes: lignesTronquees, taille };
}

export function tronquerALaLargeur(
  canvas: PosterCanvas,
  texte: string,
  police: FontSpec,
  largeurMaximale: number,
  espacement: number,
): string {
  let tronque = texte;

  while (
    tronque.length > 4 &&
    largeurAvecTracking(canvas, tronque, police, espacement) > largeurMaximale
  ) {
    tronque = tronque.slice(0, -1);
  }

  return tronque;
}
