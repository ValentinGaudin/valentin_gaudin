import type { GeoPoint } from '../domain/geo-point';
import type { ElevationProfile } from '../domain/elevation-profile';
import { nombreDePointsDuProfil } from '../domain/elevation-profile';

export type FormeDeTrace = 'boucle' | 'aller-retour' | 'piste' | 'ville';

export interface GrainesDeTrace {
  readonly graine: number;
  readonly forme: FormeDeTrace;
  readonly latitudeCentrale: number;
  readonly longitudeCentrale: number;
  readonly etendueEnKilometres: number;
  readonly denivelePositifEnMetres: number;
}

const nombreDePointsGeneres = 260;
const kilometresParDegreDeLatitude = 110.574;
const kilometresParDegreDeLongitudeALEquateur = 111.32;

interface PointPlan {
  readonly x: number;
  readonly y: number;
}

function generateurPseudoAleatoire(graine: number): () => number {
  let etat = graine * 9301 + 49297;

  return () => {
    etat = (etat * 9301 + 49297) % 233280;
    return etat / 233280;
  };
}

function pisteDAthletisme(tirage: () => number): PointPlan[] {
  const points: PointPlan[] = [];

  for (let index = 0; index < nombreDePointsGeneres; index += 1) {
    const angle = (index / nombreDePointsGeneres) * Math.PI * 2;

    points.push({
      x: Math.cos(angle) * 1.5 + (tirage() - 0.5) * 0.03,
      y: Math.sin(angle) * 0.62 + (tirage() - 0.5) * 0.03,
    });
  }

  return points;
}

function allerRetour(tirage: () => number): PointPlan[] {
  const aller: PointPlan[] = [];
  let abscisse = 0;
  let ordonnee = 0;
  let cap = -0.4;

  for (let index = 0; index < nombreDePointsGeneres / 2; index += 1) {
    cap += (tirage() - 0.5) * 0.9;
    abscisse += Math.cos(cap) * 0.1;
    ordonnee += Math.sin(cap) * 0.1;
    aller.push({ x: abscisse, y: ordonnee });
  }

  const retour = [...aller]
    .reverse()
    .map((point) => ({ x: point.x + 0.05, y: point.y - 0.05 }));

  return [...aller, ...retour];
}

function boucleLobee(
  tirage: () => number,
  graine: number,
  nombreDeLobes: number,
): PointPlan[] {
  const points: PointPlan[] = [];

  for (let index = 0; index < nombreDePointsGeneres; index += 1) {
    const angle = (index / nombreDePointsGeneres) * Math.PI * 2;
    const rayon =
      1 +
      Math.sin(angle * nombreDeLobes + graine) * 0.3 +
      Math.sin(angle * 2.3) * 0.18 +
      (tirage() - 0.5) * 0.05;

    points.push({
      x: Math.cos(angle) * rayon * 1.25,
      y: Math.sin(angle) * rayon,
    });
  }

  return points;
}

function pointsDuPlan(graines: GrainesDeTrace, variation: number): PointPlan[] {
  const tirage = generateurPseudoAleatoire(graines.graine + variation * 131);

  if (graines.forme === 'piste') {
    return pisteDAthletisme(tirage);
  }

  if (graines.forme === 'aller-retour') {
    return allerRetour(tirage);
  }

  return boucleLobee(
    tirage,
    graines.graine,
    graines.forme === 'ville' ? 3 : 5,
  );
}

export function traceSynthetique(
  graines: GrainesDeTrace,
  variation = 0,
): readonly GeoPoint[] {
  const points = pointsDuPlan(graines, variation);

  let abscisseMinimale = Number.POSITIVE_INFINITY;
  let abscisseMaximale = Number.NEGATIVE_INFINITY;
  let ordonneeMinimale = Number.POSITIVE_INFINITY;
  let ordonneeMaximale = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    abscisseMinimale = Math.min(abscisseMinimale, point.x);
    abscisseMaximale = Math.max(abscisseMaximale, point.x);
    ordonneeMinimale = Math.min(ordonneeMinimale, point.y);
    ordonneeMaximale = Math.max(ordonneeMaximale, point.y);
  }

  const etendueLocale =
    Math.max(
      abscisseMaximale - abscisseMinimale,
      ordonneeMaximale - ordonneeMinimale,
    ) || 1;

  const kilometresParUniteLocale = graines.etendueEnKilometres / etendueLocale;
  const centreX = (abscisseMinimale + abscisseMaximale) / 2;
  const centreY = (ordonneeMinimale + ordonneeMaximale) / 2;

  const degresParKilometreEnLatitude = 1 / kilometresParDegreDeLatitude;
  const degresParKilometreEnLongitude =
    1 /
    (kilometresParDegreDeLongitudeALEquateur *
      Math.cos((graines.latitudeCentrale * Math.PI) / 180));

  return points.map((point) => ({
    latitude:
      graines.latitudeCentrale -
      (point.y - centreY) * kilometresParUniteLocale * degresParKilometreEnLatitude,
    longitude:
      graines.longitudeCentrale +
      (point.x - centreX) * kilometresParUniteLocale * degresParKilometreEnLongitude,
  }));
}

const seuilDeDeniveleMontagneux = 800;
const altitudeNormaliseeMinimaleDuProfil = 0.04;

export function profilSynthetique(graines: GrainesDeTrace): ElevationProfile {
  const profil: number[] = [];
  const frequence =
    graines.denivelePositifEnMetres > seuilDeDeniveleMontagneux ? 2.2 : 1.2;

  for (let index = 0; index < nombreDePointsDuProfil; index += 1) {
    const avancement = index / (nombreDePointsDuProfil - 1);
    const valeur =
      Math.pow(
        Math.abs(Math.sin(avancement * Math.PI * frequence + graines.graine)),
        1.4,
      ) *
        0.75 +
      Math.sin(avancement * 9 + graines.graine) * 0.09 +
      Math.sin(avancement * 23) * 0.04 +
      0.12;

    profil.push(Math.max(altitudeNormaliseeMinimaleDuProfil, valeur));
  }

  return profil;
}
