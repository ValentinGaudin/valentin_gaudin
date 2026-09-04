import {
  dessinerVisuel,
  hauteurDuVisuel,
  largeurDuVisuel,
  type OptionsDeVisuel,
} from '@portfolio/activity-core';
import { useEffect, useRef } from 'react';

import { creerCanvasDeVisuel } from '~/adapters/canvas2d-poster-canvas';
import type { DepotDeTuilesDuNavigateur } from '~/adapters/browser-tile-repository';
import { couleurs, polices } from '~/theme';

interface Proprietes {
  visuel: OptionsDeVisuel;
  depotDeTuiles: DepotDeTuilesDuNavigateur;
  compteurDeRedessin: number;
  legende: string;
}

export function PosterPreview({
  visuel,
  depotDeTuiles,
  compteurDeRedessin,
  legende,
}: Proprietes) {
  const canvasDuDom = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const element = canvasDuDom.current;

    if (element === null) {
      return;
    }

    const contexte = element.getContext('2d');

    if (contexte === null) {
      return;
    }

    const dessiner = (): void => {
      contexte.setTransform(1, 0, 0, 1, 0, 0);
      contexte.clearRect(0, 0, largeurDuVisuel, hauteurDuVisuel);

      dessinerVisuel(
        creerCanvasDeVisuel(contexte, (url) => depotDeTuiles.resoudre(url)),
        depotDeTuiles,
        visuel,
      );
    };

    dessiner();

    // Les polices Bodoni Moda et Space Mono arrivent apres le premier rendu.
    // Sans ce second passage, la mise en page est calculee avec les metriques
    // de la police de repli, puis jamais recalculee : les textes debordent ou
    // laissent des trous.
    let annule = false;

    document.fonts.ready.then(() => {
      if (!annule) {
        dessiner();
      }
    });

    return () => {
      annule = true;
    };
  }, [visuel, depotDeTuiles, compteurDeRedessin]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
        position: 'sticky',
        top: 96,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 430,
          background: couleurs.encre,
          borderRadius: 44,
          padding: 11,
          boxShadow: '0 26px 60px rgba(17,17,17,.22)',
        }}
      >
        <canvas
          ref={canvasDuDom}
          width={largeurDuVisuel}
          height={hauteurDuVisuel}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            borderRadius: 34,
            backgroundColor: '#dad5cc',
            backgroundImage:
              'linear-gradient(45deg,rgba(17,17,17,.09) 25%,transparent 25%,transparent 75%,rgba(17,17,17,.09) 75%),' +
              'linear-gradient(45deg,rgba(17,17,17,.09) 25%,transparent 25%,transparent 75%,rgba(17,17,17,.09) 75%)',
            backgroundSize: '28px 28px',
            backgroundPosition: '0 0, 14px 14px',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: polices.corps,
          fontSize: 11,
          letterSpacing: '.1em',
          color: couleurs.encreA45,
        }}
      >
        {legende}
      </span>
    </div>
  );
}
