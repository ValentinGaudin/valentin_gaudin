export const largeurDuVisuel = 1080;
export const hauteurDuVisuel = 1920;
export const margeDuVisuel = 88;

export const trackingDesLabels = 2.4;
export const trackingDesMentions = 1.8;

export interface PalettePoster {
  readonly fond: string;
  readonly encre: string;
  readonly encreDouce: string;
  readonly filet: string;
  readonly accent: string;
  readonly remplissageDuProfil: string;
  readonly haloDeTrace: string;
  readonly voileDeTexte: string;
  readonly voileDeTexteDense: string;
  readonly traceDiscrete: string;
}

const cremeDuTheme = '#F1ECE4';
const encreDuTheme = '#111111';

export function paletteDuVisuel(
  themeSombre: boolean,
  accentDemande: string,
  fondClairDeCarte: boolean,
): PalettePoster {
  const accentLisible =
    !themeSombre && accentDemande === cremeDuTheme ? encreDuTheme : accentDemande;

  return {
    fond: themeSombre ? encreDuTheme : cremeDuTheme,
    encre: themeSombre ? '#F0EBE3' : encreDuTheme,
    encreDouce: themeSombre ? 'rgba(240,235,227,.45)' : 'rgba(17,17,17,.5)',
    filet: themeSombre ? 'rgba(240,235,227,.18)' : 'rgba(17,17,17,.18)',
    accent: accentLisible,
    remplissageDuProfil: themeSombre
      ? 'rgba(240,235,227,.14)'
      : 'rgba(17,17,17,.1)',
    haloDeTrace: fondClairDeCarte ? 'rgba(255,255,255,.85)' : 'rgba(0,0,0,.4)',
    voileDeTexte: themeSombre ? 'rgba(17,17,17,.72)' : 'rgba(241,236,228,.78)',
    voileDeTexteDense: themeSombre
      ? 'rgba(17,17,17,.82)'
      : 'rgba(241,236,228,.85)',
    traceDiscrete: themeSombre
      ? 'rgba(240,235,227,.5)'
      : 'rgba(17,17,17,.45)',
  };
}
