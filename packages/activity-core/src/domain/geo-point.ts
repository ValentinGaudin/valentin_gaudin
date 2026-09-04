export interface GeoPoint {
  readonly latitude: number;
  readonly longitude: number;
}

const rayonTerrestreEnKilometres = 6371;

function enRadians(degres: number): number {
  return (degres * Math.PI) / 180;
}

export function distanceOrthodromiqueEnKilometres(
  depart: GeoPoint,
  arrivee: GeoPoint,
): number {
  const ecartLatitude = enRadians(arrivee.latitude - depart.latitude);
  const ecartLongitude = enRadians(arrivee.longitude - depart.longitude);

  const demiCordeAuCarre =
    Math.sin(ecartLatitude / 2) ** 2 +
    Math.cos(enRadians(depart.latitude)) *
      Math.cos(enRadians(arrivee.latitude)) *
      Math.sin(ecartLongitude / 2) ** 2;

  return (
    rayonTerrestreEnKilometres *
    2 *
    Math.atan2(Math.sqrt(demiCordeAuCarre), Math.sqrt(1 - demiCordeAuCarre))
  );
}

export function longueurDuTraceEnKilometres(points: readonly GeoPoint[]): number {
  let longueur = 0;

  for (let index = 1; index < points.length; index += 1) {
    const precedent = points[index - 1];
    const courant = points[index];

    if (precedent === undefined || courant === undefined) {
      continue;
    }

    longueur += distanceOrthodromiqueEnKilometres(precedent, courant);
  }

  return longueur;
}

export interface CadreGeographique {
  readonly latitudeMinimale: number;
  readonly latitudeMaximale: number;
  readonly longitudeMinimale: number;
  readonly longitudeMaximale: number;
}

export function cadreEnglobant(
  points: readonly GeoPoint[],
): CadreGeographique | null {
  if (points.length === 0) {
    return null;
  }

  let latitudeMinimale = Number.POSITIVE_INFINITY;
  let latitudeMaximale = Number.NEGATIVE_INFINITY;
  let longitudeMinimale = Number.POSITIVE_INFINITY;
  let longitudeMaximale = Number.NEGATIVE_INFINITY;

  for (const point of points) {
    latitudeMinimale = Math.min(latitudeMinimale, point.latitude);
    latitudeMaximale = Math.max(latitudeMaximale, point.latitude);
    longitudeMinimale = Math.min(longitudeMinimale, point.longitude);
    longitudeMaximale = Math.max(longitudeMaximale, point.longitude);
  }

  return {
    latitudeMinimale,
    latitudeMaximale,
    longitudeMinimale,
    longitudeMaximale,
  };
}

export function sousEchantillonner<T>(
  valeurs: readonly T[],
  nombreMaximalDePoints: number,
): readonly T[] {
  if (valeurs.length <= nombreMaximalDePoints) {
    return valeurs;
  }

  const pas = Math.ceil(valeurs.length / nombreMaximalDePoints);
  const retenus: T[] = [];

  for (let index = 0; index < valeurs.length; index += pas) {
    const valeur = valeurs[index];

    if (valeur !== undefined) {
      retenus.push(valeur);
    }
  }

  const derniereValeur = valeurs[valeurs.length - 1];

  if (derniereValeur !== undefined && retenus[retenus.length - 1] !== derniereValeur) {
    retenus.push(derniereValeur);
  }

  return retenus;
}
