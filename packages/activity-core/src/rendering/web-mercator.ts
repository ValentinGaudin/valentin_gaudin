import { cadreEnglobant, type GeoPoint } from '../domain/geo-point';
import type { Point, Rect } from '../ports/poster-canvas';

export const tailleDUneTuileEnPixels = 256;
export const zoomMinimal = 3;
export const margeRelativeAutourDeLaTrace = 0.1;

const margeMinimaleEnDegres = 1e-4;

export function abscisseMercator(longitude: number, zoom: number): number {
  return (
    ((longitude + 180) / 360) * tailleDUneTuileEnPixels * Math.pow(2, zoom)
  );
}

export function ordonneeMercator(latitude: number, zoom: number): number {
  const latitudeEnRadians = (latitude * Math.PI) / 180;
  const projection =
    Math.log(
      Math.tan(latitudeEnRadians) + 1 / Math.cos(latitudeEnRadians),
    ) / Math.PI;

  return (
    ((1 - projection) / 2) * tailleDUneTuileEnPixels * Math.pow(2, zoom)
  );
}

export interface AjustementDeCarte {
  readonly zoom: number;
  readonly echelle: number;
  readonly decalageX: number;
  readonly decalageY: number;
}

export function ajusterCarte(
  points: readonly GeoPoint[],
  cadre: Rect,
  facteurDeDetail: number,
  zoomMaximal: number,
): AjustementDeCarte | null {
  const englobant = cadreEnglobant(points);

  if (englobant === null) {
    return null;
  }

  const margeLongitude =
    (englobant.longitudeMaximale - englobant.longitudeMinimale) *
      margeRelativeAutourDeLaTrace +
    margeMinimaleEnDegres;
  const margeLatitude =
    (englobant.latitudeMaximale - englobant.latitudeMinimale) *
      margeRelativeAutourDeLaTrace +
    margeMinimaleEnDegres;

  const longitudeMinimale = englobant.longitudeMinimale - margeLongitude;
  const longitudeMaximale = englobant.longitudeMaximale + margeLongitude;
  const latitudeMinimale = englobant.latitudeMinimale - margeLatitude;
  const latitudeMaximale = englobant.latitudeMaximale + margeLatitude;

  let zoom = zoomMaximal;

  while (zoom > zoomMinimal) {
    const largeurEnPixels =
      abscisseMercator(longitudeMaximale, zoom) -
      abscisseMercator(longitudeMinimale, zoom);
    const hauteurEnPixels =
      ordonneeMercator(latitudeMinimale, zoom) -
      ordonneeMercator(latitudeMaximale, zoom);

    if (
      largeurEnPixels <= cadre.width * facteurDeDetail &&
      hauteurEnPixels <= cadre.height * facteurDeDetail
    ) {
      break;
    }

    zoom -= 1;
  }

  const gauche = abscisseMercator(longitudeMinimale, zoom);
  const droite = abscisseMercator(longitudeMaximale, zoom);
  const haut = ordonneeMercator(latitudeMaximale, zoom);
  const bas = ordonneeMercator(latitudeMinimale, zoom);

  const largeurProjetee = droite - gauche || 1;
  const hauteurProjetee = bas - haut || 1;

  const echelle = Math.min(
    cadre.width / largeurProjetee,
    cadre.height / hauteurProjetee,
  );

  return {
    zoom,
    echelle,
    decalageX:
      cadre.x + (cadre.width - largeurProjetee * echelle) / 2 - gauche * echelle,
    decalageY:
      cadre.y + (cadre.height - hauteurProjetee * echelle) / 2 - haut * echelle,
  };
}

export function projeterSurLeCadre(
  ajustement: AjustementDeCarte,
  point: GeoPoint,
): Point {
  return {
    x:
      ajustement.decalageX +
      abscisseMercator(point.longitude, ajustement.zoom) * ajustement.echelle,
    y:
      ajustement.decalageY +
      ordonneeMercator(point.latitude, ajustement.zoom) * ajustement.echelle,
  };
}

export interface FenetreDeTuiles {
  readonly colonneMinimale: number;
  readonly colonneMaximale: number;
  readonly ligneMinimale: number;
  readonly ligneMaximale: number;
  readonly nombreDeTuilesParCote: number;
  readonly tailleAffichee: number;
}

export function fenetreDeTuiles(
  ajustement: AjustementDeCarte,
  cadre: Rect,
): FenetreDeTuiles {
  const tailleAffichee = tailleDUneTuileEnPixels * ajustement.echelle;

  return {
    colonneMinimale: Math.floor((cadre.x - ajustement.decalageX) / tailleAffichee),
    colonneMaximale: Math.floor(
      (cadre.x + cadre.width - ajustement.decalageX) / tailleAffichee,
    ),
    ligneMinimale: Math.floor((cadre.y - ajustement.decalageY) / tailleAffichee),
    ligneMaximale: Math.floor(
      (cadre.y + cadre.height - ajustement.decalageY) / tailleAffichee,
    ),
    nombreDeTuilesParCote: Math.pow(2, ajustement.zoom),
    tailleAffichee,
  };
}

export function colonneNormalisee(
  colonne: number,
  nombreDeTuilesParCote: number,
): number {
  return ((colonne % nombreDeTuilesParCote) + nombreDeTuilesParCote) %
    nombreDeTuilesParCote;
}

export function ajusterAuCadreSansCarte(
  points: readonly Point[],
  cadre: Rect,
): readonly Point[] {
  if (points.length === 0) {
    return points;
  }

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

  const largeurSource = abscisseMaximale - abscisseMinimale || 1;
  const hauteurSource = ordonneeMaximale - ordonneeMinimale || 1;
  const echelle = Math.min(
    cadre.width / largeurSource,
    cadre.height / hauteurSource,
  );

  const decalageX =
    cadre.x + (cadre.width - largeurSource * echelle) / 2 - abscisseMinimale * echelle;
  const decalageY =
    cadre.y + (cadre.height - hauteurSource * echelle) / 2 - ordonneeMinimale * echelle;

  return points.map((point) => ({
    x: decalageX + point.x * echelle,
    y: decalageY + point.y * echelle,
  }));
}
