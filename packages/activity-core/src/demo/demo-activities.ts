import type { Activity } from '../domain/activity';
import { calculerRythme, formaterDuree } from '../domain/activity-metrics';
import type { ActivityRepository } from '../ports/activity-repository';
import {
  profilSynthetique,
  traceSynthetique,
  type GrainesDeTrace,
} from './synthetic-tracks';

interface DefinitionDActiviteDeDemonstration {
  readonly identifiant: string;
  readonly nom: string;
  readonly lieu: string;
  readonly date: string;
  readonly libelleDuType: string;
  readonly distanceEnKilometres: number;
  readonly dureeEnSecondes: number;
  readonly activiteRoulante: boolean;
  readonly graines: GrainesDeTrace;
}

const definitions: readonly DefinitionDActiviteDeDemonstration[] = [
  {
    identifiant: 'grand-colon',
    nom: 'Tour du Grand Colon',
    lieu: 'Belledonne',
    date: '24 août 2026',
    libelleDuType: 'TRAIL',
    distanceEnKilometres: 18.4,
    dureeEnSecondes: 9660,
    activiteRoulante: false,
    graines: {
      graine: 7,
      forme: 'boucle',
      latitudeCentrale: 45.19,
      longitudeCentrale: 5.92,
      etendueEnKilometres: 6.5,
      denivelePositifEnMetres: 1240,
    },
  },
  {
    identifiant: 'croix-de-chamrousse',
    nom: 'Croix de Chamrousse',
    lieu: 'Chamrousse',
    date: '10 août 2026',
    libelleDuType: 'TRAIL',
    distanceEnKilometres: 24.6,
    dureeEnSecondes: 14280,
    activiteRoulante: false,
    graines: {
      graine: 21,
      forme: 'aller-retour',
      latitudeCentrale: 45.115,
      longitudeCentrale: 5.885,
      etendueEnKilometres: 8,
      denivelePositifEnMetres: 1890,
    },
  },
  {
    identifiant: 'sortie-longue-chartreuse',
    nom: 'Sortie longue Chartreuse',
    lieu: 'Chartreuse',
    date: '2 août 2026',
    libelleDuType: 'VÉLO',
    distanceEnKilometres: 74.2,
    dureeEnSecondes: 11520,
    activiteRoulante: true,
    graines: {
      graine: 34,
      forme: 'boucle',
      latitudeCentrale: 45.35,
      longitudeCentrale: 5.8,
      etendueEnKilometres: 22,
      denivelePositifEnMetres: 1480,
    },
  },
  {
    identifiant: 'fractionne-au-stade',
    nom: 'Fractionné au stade',
    lieu: 'Grenoble',
    date: '28 juillet 2026',
    libelleDuType: 'COURSE',
    distanceEnKilometres: 12.1,
    dureeEnSecondes: 3134,
    activiteRoulante: false,
    graines: {
      graine: 5,
      forme: 'piste',
      latitudeCentrale: 45.185,
      longitudeCentrale: 5.735,
      etendueEnKilometres: 0.55,
      denivelePositifEnMetres: 60,
    },
  },
  {
    identifiant: 'semi-de-grenoble',
    nom: 'Semi de Grenoble',
    lieu: 'Grenoble',
    date: '12 juillet 2026',
    libelleDuType: 'COURSE',
    distanceEnKilometres: 21.1,
    dureeEnSecondes: 5640,
    activiteRoulante: false,
    graines: {
      graine: 12,
      forme: 'ville',
      latitudeCentrale: 45.188,
      longitudeCentrale: 5.724,
      etendueEnKilometres: 4.2,
      denivelePositifEnMetres: 95,
    },
  },
];

function enActivite(
  definition: DefinitionDActiviteDeDemonstration,
  variation: number,
): Activity {
  return {
    identifiant: definition.identifiant,
    nom: definition.nom,
    lieu: definition.lieu,
    date: definition.date,
    libelleDuType: definition.libelleDuType,
    metriques: {
      distanceEnKilometres: definition.distanceEnKilometres,
      denivelePositifEnMetres: definition.graines.denivelePositifEnMetres,
      dureeEnSecondes: definition.dureeEnSecondes,
      dureeFormatee: formaterDuree(definition.dureeEnSecondes),
      rythme: calculerRythme(
        definition.distanceEnKilometres,
        definition.dureeEnSecondes,
        definition.activiteRoulante,
      ),
    },
    trace: traceSynthetique(definition.graines, variation),
    profilAltimetrique: profilSynthetique(definition.graines),
    provenance: 'demonstration',
  };
}

export function activitesDeDemonstration(variation = 0): readonly Activity[] {
  return definitions.map((definition) => enActivite(definition, variation));
}

export function creerDepotDActivitesDeDemonstration(): ActivityRepository {
  return {
    async lister() {
      return Promise.resolve(activitesDeDemonstration());
    },
  };
}
