import type { ImageFilter, TileImage } from './poster-canvas';

export type FondDeCarte =
  | 'papier'
  | 'clair'
  | 'sombre'
  | 'topo'
  | 'satellite'
  | 'transparent';

export interface StyleDeTuiles {
  readonly construireUrl: (zoom: number, x: number, y: number) => string;
  readonly mention: string;
  readonly zoomMaximal: number;
  readonly filtre: ImageFilter | null;
  readonly couleurDeFond: string;
}

export type ResultatTuile =
  | { readonly statut: 'prete'; readonly tuile: TileImage }
  | { readonly statut: 'en-attente' }
  | { readonly statut: 'indisponible' };

export interface TileRepository {
  demander(url: string): ResultatTuile;
  nombreDeTuilesEnAttente(): number;
  attendreLesTuiles(delaiMaximalEnMillisecondes: number): Promise<void>;
}

const urlOpenStreetMap = (zoom: number, x: number, y: number): string =>
  `https://tile.openstreetmap.org/${zoom}/${x}/${y}.png`;

export const stylesDeTuilesParFond: Readonly<
  Partial<Record<FondDeCarte, StyleDeTuiles>>
> = {
  clair: {
    construireUrl: urlOpenStreetMap,
    mention: '© OPENSTREETMAP',
    zoomMaximal: 18,
    filtre: { grayscale: 1, brightness: 1.12, contrast: 0.78 },
    couleurDeFond: '#f3f1ec',
  },
  sombre: {
    construireUrl: urlOpenStreetMap,
    mention: '© OPENSTREETMAP',
    zoomMaximal: 18,
    filtre: { grayscale: 1, invert: 1, brightness: 0.72, contrast: 1.15 },
    couleurDeFond: '#0d1013',
  },
  topo: {
    construireUrl: (zoom, x, y) =>
      `https://tile.opentopomap.org/${zoom}/${x}/${y}.png`,
    mention: '© OPENTOPOMAP · OSM',
    zoomMaximal: 16,
    filtre: { saturate: 0.7 },
    couleurDeFond: '#eef0e6',
  },
  satellite: {
    construireUrl: (zoom, x, y) =>
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery' +
      `/MapServer/tile/${zoom}/${y}/${x}`,
    mention: '© ESRI · MAXAR',
    zoomMaximal: 17,
    filtre: null,
    couleurDeFond: '#1d2620',
  },
};

export const domainesDeTuiles = [
  'https://tile.openstreetmap.org',
  'https://tile.opentopomap.org',
  'https://server.arcgisonline.com',
] as const;

export function styleDuFond(fond: FondDeCarte): StyleDeTuiles | null {
  return stylesDeTuilesParFond[fond] ?? null;
}
