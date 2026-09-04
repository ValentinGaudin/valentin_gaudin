import type { Activity } from '../../domain/activity';
import type { PosterCanvas } from '../../ports/poster-canvas';
import type { FondDeCarte, TileRepository } from '../../ports/tile-repository';
import type { PalettePoster } from '../poster-theme';

export interface ContexteDeVisuel {
  readonly canvas: PosterCanvas;
  readonly tuiles: TileRepository;
  readonly activite: Activity;
  readonly palette: PalettePoster;
  readonly fond: FondDeCarte;
  readonly facteurDeDetail: number;
}

export type NomDeMiseEnPage = 'crete' | 'fiche' | 'profil' | 'plein';

export type MiseEnPage = (contexte: ContexteDeVisuel) => void;

export interface DescriptionDeMiseEnPage {
  readonly cle: NomDeMiseEnPage;
  readonly numero: string;
  readonly nom: string;
  readonly note: string;
}

export const misesEnPageDisponibles: readonly DescriptionDeMiseEnPage[] = [
  { cle: 'crete', numero: '01', nom: 'Crête', note: 'Trace au centre, chiffres en bas' },
  { cle: 'fiche', numero: '02', nom: 'Fiche', note: 'Distance en très grand' },
  { cle: 'profil', numero: '03', nom: 'Profil', note: 'Le dénivelé en héros' },
  { cle: 'plein', numero: '04', nom: 'Plein', note: 'Trace plein cadre' },
];
