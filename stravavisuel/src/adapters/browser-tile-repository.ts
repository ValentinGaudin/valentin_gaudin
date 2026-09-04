import type { ResultatTuile, TileRepository } from '@portfolio/activity-core';

type EtatDeTuile = 'en-cours' | 'indisponible' | HTMLImageElement;

export interface DepotDeTuilesDuNavigateur extends TileRepository {
  resoudre(url: string): CanvasImageSource | null;
}

const intervalleDeVerificationEnMillisecondes = 120;

export function creerDepotDeTuilesDuNavigateur(
  surTuileChargee: () => void,
): DepotDeTuilesDuNavigateur {
  const etatsParUrl = new Map<string, EtatDeTuile>();

  const charger = (url: string): void => {
    etatsParUrl.set(url, 'en-cours');

    const image = new Image();

    // Indispensable, et pas par politesse : sans en-tete CORS accepte, le
    // canvas devient « contamine » et toBlob() leve une SecurityError. Le
    // visuel s'afficherait mais l'export echouerait, sans rapport apparent.
    image.crossOrigin = 'anonymous';

    image.addEventListener('load', () => {
      etatsParUrl.set(url, image);
      surTuileChargee();
    });

    image.addEventListener('error', () => {
      etatsParUrl.set(url, 'indisponible');
      surTuileChargee();
    });

    image.src = url;
  };

  return {
    demander(url): ResultatTuile {
      const etat = etatsParUrl.get(url);

      if (etat === undefined) {
        charger(url);
        return { statut: 'en-attente' };
      }

      if (etat === 'en-cours') {
        return { statut: 'en-attente' };
      }

      if (etat === 'indisponible') {
        return { statut: 'indisponible' };
      }

      return { statut: 'prete', tuile: { url } };
    },

    nombreDeTuilesEnAttente() {
      let enAttente = 0;

      for (const etat of etatsParUrl.values()) {
        if (etat === 'en-cours') {
          enAttente += 1;
        }
      }

      return enAttente;
    },

    attendreLesTuiles(delaiMaximalEnMillisecondes) {
      return new Promise((resoudre) => {
        const debut = Date.now();

        const verifier = (): void => {
          const delaiDepasse =
            Date.now() - debut > delaiMaximalEnMillisecondes;

          if (this.nombreDeTuilesEnAttente() === 0 || delaiDepasse) {
            resoudre();
            return;
          }

          setTimeout(verifier, intervalleDeVerificationEnMillisecondes);
        };

        verifier();
      });
    },

    resoudre(url) {
      const etat = etatsParUrl.get(url);

      if (etat === undefined || etat === 'en-cours' || etat === 'indisponible') {
        return null;
      }

      return etat;
    },
  };
}
