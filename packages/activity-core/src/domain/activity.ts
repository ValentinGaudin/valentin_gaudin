import type { ActivityMetrics } from './activity-metrics';
import type { ElevationProfile } from './elevation-profile';
import type { GeoPoint } from './geo-point';

export type ActivitySource = 'demonstration' | 'gpx';

export interface Activity {
  readonly identifiant: string;
  readonly nom: string;
  readonly lieu: string;
  readonly date: string;
  readonly libelleDuType: string;
  readonly metriques: ActivityMetrics;
  readonly trace: readonly GeoPoint[];
  readonly profilAltimetrique: ElevationProfile;
  readonly provenance: ActivitySource;
}

export interface ChampsEditablesDActivite {
  readonly nom?: string;
  readonly lieu?: string;
  readonly date?: string;
}

export function avecChampsEdites(
  activite: Activity,
  champs: ChampsEditablesDActivite,
): Activity {
  return {
    ...activite,
    nom: champs.nom ?? activite.nom,
    lieu: champs.lieu ?? activite.lieu,
    date: champs.date ?? activite.date,
  };
}
