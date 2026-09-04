export type LibelleRythme = 'ALLURE' | 'MOYENNE';

export interface Rythme {
  readonly libelle: LibelleRythme;
  readonly valeurFormatee: string;
}

export interface ActivityMetrics {
  readonly distanceEnKilometres: number;
  readonly denivelePositifEnMetres: number;
  readonly dureeEnSecondes: number;
  readonly dureeFormatee: string;
  readonly rythme: Rythme;
}

export const seuilHysteresisDeniveleParDefautEnMetres = 3;
export const tailleFenetreDeLissageParDefaut = 5;
export const vitesseDeBasculeEnKilometresParHeure = 20;

export const dureeIndisponible = '—';
export const rythmeIndisponible: Rythme = {
  libelle: 'ALLURE',
  valeurFormatee: dureeIndisponible,
};

export function altitudesLissees(
  altitudes: readonly (number | null)[],
  tailleFenetre: number = tailleFenetreDeLissageParDefaut,
): readonly (number | null)[] {
  if (tailleFenetre <= 1) {
    return altitudes;
  }

  const demiFenetre = Math.floor(tailleFenetre / 2);

  return altitudes.map((altitude, index) => {
    if (altitude === null || !Number.isFinite(altitude)) {
      return null;
    }

    let somme = 0;
    let compte = 0;

    for (
      let voisin = index - demiFenetre;
      voisin <= index + demiFenetre;
      voisin += 1
    ) {
      const valeurVoisine = altitudes[voisin];

      if (valeurVoisine !== undefined && valeurVoisine !== null && Number.isFinite(valeurVoisine)) {
        somme += valeurVoisine;
        compte += 1;
      }
    }

    return compte === 0 ? null : somme / compte;
  });
}

export function denivelePositifEnMetres(
  altitudes: readonly (number | null)[],
  seuilEnMetres: number = seuilHysteresisDeniveleParDefautEnMetres,
): number {
  let gainCumule = 0;
  let altitudeRetenue: number | null = null;

  for (const altitude of altitudes) {
    if (altitude === null || !Number.isFinite(altitude)) {
      continue;
    }

    if (altitudeRetenue === null) {
      altitudeRetenue = altitude;
      continue;
    }

    const variation = altitude - altitudeRetenue;

    if (variation > seuilEnMetres) {
      gainCumule += variation;
      altitudeRetenue = altitude;
    } else if (variation < -seuilEnMetres) {
      altitudeRetenue = altitude;
    }
  }

  return gainCumule;
}

export function formaterDuree(dureeEnSecondes: number): string {
  if (!Number.isFinite(dureeEnSecondes) || dureeEnSecondes <= 0) {
    return dureeIndisponible;
  }

  const heures = Math.floor(dureeEnSecondes / 3600);
  const minutes = Math.round((dureeEnSecondes % 3600) / 60);

  if (heures === 0) {
    return `${minutes} min`;
  }

  if (minutes === 60) {
    return `${heures + 1} h 00`;
  }

  return `${heures} h ${String(minutes).padStart(2, '0')}`;
}

function enNombreFrancais(valeur: number, decimales: number): string {
  return valeur.toFixed(decimales).replace('.', ',');
}

export function calculerRythme(
  distanceEnKilometres: number,
  dureeEnSecondes: number,
  activiteRoulanteDeclaree: boolean,
): Rythme {
  if (
    !Number.isFinite(distanceEnKilometres) ||
    !Number.isFinite(dureeEnSecondes) ||
    distanceEnKilometres <= 0 ||
    dureeEnSecondes <= 0
  ) {
    return rythmeIndisponible;
  }

  const vitesseEnKilometresParHeure =
    distanceEnKilometres / (dureeEnSecondes / 3600);

  const afficherUneVitesse =
    activiteRoulanteDeclaree ||
    vitesseEnKilometresParHeure > vitesseDeBasculeEnKilometresParHeure;

  if (afficherUneVitesse) {
    return {
      libelle: 'MOYENNE',
      valeurFormatee: `${enNombreFrancais(vitesseEnKilometresParHeure, 1)} km/h`,
    };
  }

  const secondesParKilometre = dureeEnSecondes / distanceEnKilometres;
  const minutes = Math.floor(secondesParKilometre / 60);
  const secondes = Math.round(secondesParKilometre % 60);

  if (secondes === 60) {
    return {
      libelle: 'ALLURE',
      valeurFormatee: `${minutes + 1}'00 min/km`,
    };
  }

  return {
    libelle: 'ALLURE',
    valeurFormatee: `${minutes}'${String(secondes).padStart(2, '0')} min/km`,
  };
}

export function distanceFormatee(distanceEnKilometres: number): string {
  return `${enNombreFrancais(Math.round(distanceEnKilometres * 10) / 10, 1)} km`;
}
