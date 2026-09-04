import type {
  ResultatTuile,
  TileRepository,
} from '../src/ports/tile-repository';

export interface DepotDeTuilesFactice extends TileRepository {
  readonly urlsDemandees: readonly string[];
}

export function creerDepotDeTuilesFactice(
  statutRendu: ResultatTuile['statut'] = 'prete',
): DepotDeTuilesFactice {
  const urlsDemandees: string[] = [];

  return {
    urlsDemandees,

    demander(url) {
      urlsDemandees.push(url);

      if (statutRendu === 'prete') {
        return { statut: 'prete', tuile: { url } };
      }

      return statutRendu === 'en-attente'
        ? { statut: 'en-attente' }
        : { statut: 'indisponible' };
    },

    nombreDeTuilesEnAttente() {
      return statutRendu === 'en-attente' ? urlsDemandees.length : 0;
    },

    async attendreLesTuiles() {
      return Promise.resolve();
    },
  };
}
