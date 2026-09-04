import type { ElevationProfile } from '../domain/elevation-profile';
import {
  policeBody,
  policeDisplay,
  type Point,
  type PosterCanvas,
  type Rect,
} from '../ports/poster-canvas';
import {
  ecrireAvecTracking,
  largeurAvecTracking,
} from './text-layout';
import {
  largeurDuVisuel,
  margeDuVisuel,
  trackingDesMentions,
  type PalettePoster,
} from './poster-theme';

export const trackingDesStatistiques = 2.6;

export function tracerFilet(
  canvas: PosterCanvas,
  ordonnee: number,
  palette: PalettePoster,
  abscisseGauche: number = margeDuVisuel,
  abscisseDroite: number = largeurDuVisuel - margeDuVisuel,
): void {
  canvas.strokePolyline(
    [
      { x: abscisseGauche, y: ordonnee },
      { x: abscisseDroite, y: ordonnee },
    ],
    2,
    palette.filet,
  );
}

export interface OptionsDeStatistique {
  readonly label: string;
  readonly valeur: string;
  readonly origine: Point;
  readonly taillePolice?: number;
}

export function ecrireStatistique(
  canvas: PosterCanvas,
  palette: PalettePoster,
  options: OptionsDeStatistique,
): void {
  const taille = options.taillePolice ?? 62;

  ecrireAvecTracking(
    canvas,
    options.label,
    options.origine,
    policeBody(24),
    palette.encreDouce,
    trackingDesStatistiques,
  );

  canvas.fillText(
    options.valeur,
    { x: options.origine.x, y: options.origine.y + taille + 14 },
    policeDisplay(taille),
    palette.encre,
  );
}

export interface OptionsDeGrandNombre {
  readonly valeur: string;
  readonly unite: string;
  readonly origine: Point;
  readonly tailleInitiale: number;
  readonly tailleDeLUnite: number;
  readonly tailleMinimale?: number;
  readonly pasDeReduction?: number;
}

const ecartEntreValeurEtUnite = 24;

export function ecrireGrandNombreAvecUnite(
  canvas: PosterCanvas,
  palette: PalettePoster,
  options: OptionsDeGrandNombre,
): void {
  const tailleMinimale = options.tailleMinimale ?? 90;
  const pasDeReduction = options.pasDeReduction ?? 8;
  const largeurDisponible =
    largeurDuVisuel - margeDuVisuel - options.origine.x;

  const tailleDeLUnitePour = (taille: number): number =>
    Math.round((taille * options.tailleDeLUnite) / options.tailleInitiale);

  const tientDansLaLargeur = (taille: number): boolean => {
    const largeurValeur = canvas.measureTextWidth(
      options.valeur,
      policeDisplay(taille),
    );
    const largeurUnite = canvas.measureTextWidth(
      options.unite,
      policeDisplay(tailleDeLUnitePour(taille)),
    );

    return (
      largeurValeur + ecartEntreValeurEtUnite + largeurUnite <= largeurDisponible
    );
  };

  let taille = options.tailleInitiale;

  while (taille > tailleMinimale && !tientDansLaLargeur(taille)) {
    taille -= pasDeReduction;
  }

  const ordonneeAjustee =
    options.origine.y - (options.tailleInitiale - taille) * 0.34;

  canvas.fillText(
    options.valeur,
    { x: options.origine.x, y: ordonneeAjustee },
    policeDisplay(taille),
    palette.encre,
  );

  const largeurValeur = canvas.measureTextWidth(
    options.valeur,
    policeDisplay(taille),
  );

  canvas.fillText(
    options.unite,
    {
      x: options.origine.x + largeurValeur + ecartEntreValeurEtUnite,
      y: ordonneeAjustee,
    },
    policeDisplay(tailleDeLUnitePour(taille)),
    palette.accent,
  );
}

export function tracerProfilAltimetrique(
  canvas: PosterCanvas,
  profil: ElevationProfile,
  cadre: Rect,
  couleurDeRemplissage: string | null,
  couleurDuContour: string | null,
): void {
  if (profil.length < 2) {
    return;
  }

  const pointsDuContour: Point[] = profil.map((valeur, index) => ({
    x: cadre.x + (index / (profil.length - 1)) * cadre.width,
    y: cadre.y + cadre.height - valeur * cadre.height,
  }));

  if (couleurDeRemplissage !== null) {
    canvas.fillPolygon(
      [
        { x: cadre.x, y: cadre.y + cadre.height },
        ...pointsDuContour,
        { x: cadre.x + cadre.width, y: cadre.y + cadre.height },
      ],
      couleurDeRemplissage,
    );
  }

  if (couleurDuContour !== null) {
    canvas.strokePolyline(pointsDuContour, 5, couleurDuContour);
  }
}

export function ecrireMentionCartographique(
  canvas: PosterCanvas,
  palette: PalettePoster,
  mention: string | null,
  origine: Point,
  alignerADroite: boolean,
): void {
  if (mention === null) {
    return;
  }

  const police = policeBody(18);
  const abscisse = alignerADroite
    ? origine.x - largeurAvecTracking(canvas, mention, police, trackingDesMentions)
    : origine.x;

  ecrireAvecTracking(
    canvas,
    mention,
    { x: abscisse, y: origine.y },
    police,
    palette.encreDouce,
    trackingDesMentions,
  );
}

export function metadonneesEnMajuscules(lieu: string, date: string): string {
  return [lieu, date]
    .map((valeur) => valeur.trim())
    .filter((valeur) => valeur !== '')
    .map((valeur) => valeur.toUpperCase())
    .join(' — ');
}
