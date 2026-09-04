export type ElevationProfile = readonly number[];

export const nombreDePointsDuProfil = 180;
export const altitudeNormaliseeMinimale = 0.08;
export const amplitudeNormalisee = 0.85;
export const altitudeNormaliseeDuProfilPlat = 0.2;
export const nombreMinimalDAltitudesConnues = 8;

export function profilPlat(): ElevationProfile {
  return new Array<number>(nombreDePointsDuProfil).fill(
    altitudeNormaliseeDuProfilPlat,
  );
}

export function profilNormalise(
  altitudes: readonly (number | null)[],
): ElevationProfile {
  const altitudesConnues = altitudes.filter(
    (altitude): altitude is number =>
      altitude !== null && Number.isFinite(altitude),
  );

  if (altitudesConnues.length <= nombreMinimalDAltitudesConnues) {
    return profilPlat();
  }

  const altitudeMinimale = Math.min(...altitudesConnues);
  const altitudeMaximale = Math.max(...altitudesConnues);
  const amplitude = altitudeMaximale - altitudeMinimale || 1;

  const profil: number[] = [];

  for (let index = 0; index < nombreDePointsDuProfil; index += 1) {
    const positionSource = Math.round(
      (index / (nombreDePointsDuProfil - 1)) * (altitudesConnues.length - 1),
    );
    const altitude = altitudesConnues[
      Math.min(altitudesConnues.length - 1, positionSource)
    ];

    if (altitude === undefined) {
      profil.push(altitudeNormaliseeDuProfilPlat);
      continue;
    }

    profil.push(
      altitudeNormaliseeMinimale +
        ((altitude - altitudeMinimale) / amplitude) * amplitudeNormalisee,
    );
  }

  return profil;
}
