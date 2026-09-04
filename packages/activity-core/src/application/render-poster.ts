import type { Activity } from '../domain/activity';
import type { PosterCanvas } from '../ports/poster-canvas';
import type { FondDeCarte, TileRepository } from '../ports/tile-repository';
import { dessinerMiseEnPageCrete } from '../rendering/layouts/crete';
import { dessinerMiseEnPageFiche } from '../rendering/layouts/fiche';
import { dessinerMiseEnPagePlein } from '../rendering/layouts/plein';
import { dessinerMiseEnPageProfil } from '../rendering/layouts/profil';
import type { MiseEnPage, NomDeMiseEnPage } from '../rendering/layouts/contexte';
import {
  hauteurDuVisuel,
  largeurDuVisuel,
  paletteDuVisuel,
} from '../rendering/poster-theme';

export type FormatDExport = 'png' | 'jpg';

export interface TailleDExport {
  readonly facteur: number;
  readonly libelle: string;
}

export const taillesDExport: readonly TailleDExport[] = [
  { facteur: 1, libelle: '1080 × 1920' },
  { facteur: 1.5, libelle: '1620 × 2880' },
  { facteur: 2, libelle: '2160 × 3840' },
];

export interface OptionsDeVisuel {
  readonly activite: Activity;
  readonly miseEnPage: NomDeMiseEnPage;
  readonly accent: string;
  readonly themeSombre: boolean;
  readonly fond: FondDeCarte;
}

const misesEnPageParNom: Readonly<Record<NomDeMiseEnPage, MiseEnPage>> = {
  crete: dessinerMiseEnPageCrete,
  fiche: dessinerMiseEnPageFiche,
  profil: dessinerMiseEnPageProfil,
  plein: dessinerMiseEnPagePlein,
};

export function dessinerVisuel(
  canvas: PosterCanvas,
  tuiles: TileRepository,
  options: OptionsDeVisuel,
  facteurDeDetail = 1,
): void {
  const palette = paletteDuVisuel(
    options.themeSombre,
    options.accent,
    options.fond === 'clair',
  );

  if (options.fond !== 'transparent') {
    canvas.fillRect(
      { x: 0, y: 0, width: largeurDuVisuel, height: hauteurDuVisuel },
      palette.fond,
    );
  }

  misesEnPageParNom[options.miseEnPage]({
    canvas,
    tuiles,
    activite: options.activite,
    palette,
    fond: options.fond,
    facteurDeDetail: Math.max(1, facteurDeDetail),
  });
}

export function couleurDeFondDExport(
  options: OptionsDeVisuel,
): string | null {
  if (options.fond === 'transparent') {
    return null;
  }

  return paletteDuVisuel(options.themeSombre, options.accent, false).fond;
}

export function nomDeFichierDExport(
  activite: Activity,
  format: FormatDExport,
): string {
  const base = activite.nom
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${base === '' ? 'visuel' : base}.${format}`;
}
