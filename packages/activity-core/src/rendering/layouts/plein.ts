import { distanceFormatee } from '../../domain/activity-metrics';
import { policeBody, policeDisplay } from '../../ports/poster-canvas';
import { styleDuFond } from '../../ports/tile-repository';
import {
  ecrireMentionCartographique,
  ecrireStatistique,
  metadonneesEnMajuscules,
  tracerFilet,
} from '../poster-primitives';
import {
  hauteurDuVisuel,
  largeurDuVisuel,
  margeDuVisuel,
  trackingDesLabels,
} from '../poster-theme';
import { dessinerTrace } from '../route-drawing';
import {
  ajusterTexteSurPlusieursLignes,
  ecrireAvecTracking,
} from '../text-layout';
import type { ContexteDeVisuel } from './contexte';

const nombreDeColonnesDeLaGrille = 6;
const rayonDeLArrivee = 18;
const ordonneeDuVoile = 1390;
const hauteurDuVoile = 530;
const ordonneeDesStatistiques = 1730;
const ecartFiletStatistiques = 60;
const ecartMetaFilet = 46;
const ecartTitreMeta = 54;
const decalageDeuxiemeStatistique = 400;
const decalageTroisiemeStatistique = 700;
const ordonneeDeLaMention = 1866;

const cadreDeTraceSurCarte = {
  x: 0,
  y: 0,
  width: largeurDuVisuel,
  height: 1460,
};

const cadreDeTraceSansCarte = {
  x: -60,
  y: 240,
  width: largeurDuVisuel + 120,
  height: 1180,
};

export function dessinerMiseEnPagePlein(contexte: ContexteDeVisuel): void {
  const { canvas, palette, activite, tuiles } = contexte;
  const { metriques } = activite;
  const largeurUtile = largeurDuVisuel - margeDuVisuel * 2;
  const surUneCarte = styleDuFond(contexte.fond) !== null;

  if (!surUneCarte) {
    for (let colonne = 1; colonne < nombreDeColonnesDeLaGrille; colonne += 1) {
      const abscisse = (colonne * largeurDuVisuel) / nombreDeColonnesDeLaGrille;

      canvas.strokePolyline(
        [
          { x: abscisse, y: 0 },
          { x: abscisse, y: hauteurDuVisuel },
        ],
        1,
        palette.filet,
      );
    }
  }

  const trace = dessinerTrace(canvas, tuiles, activite.trace, {
    cadre: surUneCarte ? cadreDeTraceSurCarte : cadreDeTraceSansCarte,
    facteurDeDetail: contexte.facteurDeDetail,
    epaisseur: 12,
    couleur: palette.accent,
    couleurDuHalo: palette.haloDeTrace,
    fond: contexte.fond,
  });

  if (trace !== null) {
    canvas.fillCircle(trace.arrivee, rayonDeLArrivee, palette.encre);
  }

  canvas.fillRect(
    {
      x: 0,
      y: ordonneeDuVoile,
      width: largeurDuVisuel,
      height: hauteurDuVoile,
    },
    palette.voileDeTexte,
  );

  const titre = ajusterTexteSurPlusieursLignes(canvas, activite.nom, policeDisplay(76), {
    tailleInitiale: 76,
    largeurMaximale: largeurUtile,
    nombreMaximalDeLignes: 2,
    tailleMinimale: 46,
  });

  const hauteurDeLigne = titre.taille * 1.1;
  const ordonneeDuFilet = ordonneeDesStatistiques - ecartFiletStatistiques;
  const ordonneeDesMetadonnees = ordonneeDuFilet - ecartMetaFilet;
  const ordonneeDerniereLigneDuTitre = ordonneeDesMetadonnees - ecartTitreMeta;

  titre.lignes.forEach((ligne, index) => {
    canvas.fillText(
      ligne,
      {
        x: margeDuVisuel,
        y:
          ordonneeDerniereLigneDuTitre -
          (titre.lignes.length - 1 - index) * hauteurDeLigne,
      },
      policeDisplay(titre.taille),
      palette.encre,
    );
  });

  ecrireAvecTracking(
    canvas,
    metadonneesEnMajuscules(activite.lieu, activite.date),
    { x: margeDuVisuel, y: ordonneeDesMetadonnees },
    policeBody(26),
    palette.encreDouce,
    trackingDesLabels,
  );

  tracerFilet(canvas, ordonneeDuFilet, palette);

  ecrireStatistique(canvas, palette, {
    label: 'DISTANCE',
    valeur: distanceFormatee(metriques.distanceEnKilometres),
    origine: { x: margeDuVisuel, y: ordonneeDesStatistiques },
    taillePolice: 58,
  });

  ecrireStatistique(canvas, palette, {
    label: 'D+',
    valeur: `${metriques.denivelePositifEnMetres} m`,
    origine: {
      x: margeDuVisuel + decalageDeuxiemeStatistique,
      y: ordonneeDesStatistiques,
    },
    taillePolice: 58,
  });

  ecrireStatistique(canvas, palette, {
    label: 'TEMPS',
    valeur: metriques.dureeFormatee,
    origine: {
      x: margeDuVisuel + decalageTroisiemeStatistique,
      y: ordonneeDesStatistiques,
    },
    taillePolice: 58,
  });

  if (trace !== null) {
    ecrireMentionCartographique(
      canvas,
      palette,
      trace.mention,
      { x: largeurDuVisuel - margeDuVisuel, y: ordonneeDeLaMention },
      true,
    );
  }
}
