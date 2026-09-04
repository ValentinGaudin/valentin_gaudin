import type { GeoPoint } from '../domain/geo-point';
import type { Point, PosterCanvas, Rect } from '../ports/poster-canvas';
import type { FondDeCarte, TileRepository } from '../ports/tile-repository';
import { styleDuFond } from '../ports/tile-repository';
import {
  ajusterAuCadreSansCarte,
  ajusterCarte,
  colonneNormalisee,
  fenetreDeTuiles,
  projeterSurLeCadre,
} from './web-mercator';

export interface TraceDessinee {
  readonly depart: Point;
  readonly arrivee: Point;
  readonly mention: string | null;
}

export interface OptionsDeTrace {
  readonly cadre: Rect;
  readonly facteurDeDetail: number;
  readonly epaisseur: number;
  readonly couleur: string;
  readonly couleurDuHalo: string;
  readonly fond: FondDeCarte;
}

const debordementDesTuiles = 0.6;
const epaisseurDuHaloAjoutee = 3;

export function projeterEnPlanLocal(trace: readonly GeoPoint[]): Point[] {
  const origine = trace[0];

  if (origine === undefined) {
    return [];
  }

  const facteurLongitude = Math.cos((origine.latitude * Math.PI) / 180);

  return trace.map((point) => ({
    x: (point.longitude - origine.longitude) * facteurLongitude,
    y: -(point.latitude - origine.latitude),
  }));
}

function traceSansCarte(
  canvas: PosterCanvas,
  trace: readonly GeoPoint[],
  options: OptionsDeTrace,
): TraceDessinee | null {
  const pointsAjustes = ajusterAuCadreSansCarte(
    projeterEnPlanLocal(trace),
    options.cadre,
  );

  const depart = pointsAjustes[0];
  const arrivee = pointsAjustes[pointsAjustes.length - 1];

  if (depart === undefined || arrivee === undefined) {
    return null;
  }

  canvas.strokePolyline(pointsAjustes, options.epaisseur, options.couleur);

  return { depart, arrivee, mention: null };
}

export function dessinerTrace(
  canvas: PosterCanvas,
  tuiles: TileRepository,
  trace: readonly GeoPoint[],
  options: OptionsDeTrace,
): TraceDessinee | null {
  const style = styleDuFond(options.fond);

  if (style === null) {
    return traceSansCarte(canvas, trace, options);
  }

  const ajustement = ajusterCarte(
    trace,
    options.cadre,
    options.facteurDeDetail,
    style.zoomMaximal,
  );

  if (ajustement === null) {
    return traceSansCarte(canvas, trace, options);
  }

  const fenetre = fenetreDeTuiles(ajustement, options.cadre);

  canvas.withClip(options.cadre, () => {
    canvas.fillRect(options.cadre, style.couleurDeFond);

    for (
      let colonne = fenetre.colonneMinimale;
      colonne <= fenetre.colonneMaximale;
      colonne += 1
    ) {
      for (
        let ligne = fenetre.ligneMinimale;
        ligne <= fenetre.ligneMaximale;
        ligne += 1
      ) {
        if (ligne < 0 || ligne >= fenetre.nombreDeTuilesParCote) {
          continue;
        }

        const url = style.construireUrl(
          ajustement.zoom,
          colonneNormalisee(colonne, fenetre.nombreDeTuilesParCote),
          ligne,
        );

        const resultat = tuiles.demander(url);

        if (resultat.statut !== 'prete') {
          continue;
        }

        canvas.drawTile(
          resultat.tuile,
          {
            x: ajustement.decalageX + colonne * fenetre.tailleAffichee,
            y: ajustement.decalageY + ligne * fenetre.tailleAffichee,
            width: fenetre.tailleAffichee + debordementDesTuiles,
            height: fenetre.tailleAffichee + debordementDesTuiles,
          },
          style.filtre,
        );
      }
    }
  });

  const pointsProjetes = trace.map((point) =>
    projeterSurLeCadre(ajustement, point),
  );

  canvas.strokePolyline(
    pointsProjetes,
    options.epaisseur + epaisseurDuHaloAjoutee,
    options.couleurDuHalo,
  );
  canvas.strokePolyline(pointsProjetes, options.epaisseur, options.couleur);

  const depart = pointsProjetes[0];
  const arrivee = pointsProjetes[pointsProjetes.length - 1];

  if (depart === undefined || arrivee === undefined) {
    return null;
  }

  return { depart, arrivee, mention: style.mention };
}
