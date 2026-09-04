import { distanceFormatee } from '../../domain/activity-metrics';
import { policeBody, policeDisplay } from '../../ports/poster-canvas';
import {
  ecrireMentionCartographique,
  ecrireStatistique,
  metadonneesEnMajuscules,
  tracerFilet,
  tracerProfilAltimetrique,
} from '../poster-primitives';
import {
  largeurDuVisuel,
  margeDuVisuel,
  trackingDesLabels,
} from '../poster-theme';
import { dessinerTrace } from '../route-drawing';
import {
  ajusterTexteSurPlusieursLignes,
  ecrireAvecTracking,
  largeurAvecTracking,
} from '../text-layout';
import type { ContexteDeVisuel } from './contexte';

const cotePastilleAccent = 46;
const ordonneePastilleAccent = 150;
const ordonneePremiereLigneDuTitre = 300;
const ordonneeDeLaTrace = 620;
const hauteurDeLaTrace = 620;
const rayonDuDepart = 13;
const ordonneeDeLaMention = 1290;
const ordonneeDuProfil = 1330;
const hauteurDuProfil = 150;
const ordonneeDuFilet = 1550;
const ordonneeDesStatistiques = 1620;
const ordonneeDuPiedDePage = 1810;
const decalageDeuxiemeStatistique = 400;
const decalageTroisiemeStatistique = 700;

export function dessinerMiseEnPageCrete(contexte: ContexteDeVisuel): void {
  const { canvas, palette, activite, tuiles } = contexte;
  const { metriques } = activite;
  const largeurUtile = largeurDuVisuel - margeDuVisuel * 2;

  canvas.fillRect(
    {
      x: margeDuVisuel,
      y: ordonneePastilleAccent,
      width: cotePastilleAccent,
      height: cotePastilleAccent,
    },
    palette.accent,
  );

  const titre = ajusterTexteSurPlusieursLignes(canvas, activite.nom, policeDisplay(84), {
    tailleInitiale: 84,
    largeurMaximale: largeurUtile,
    nombreMaximalDeLignes: 3,
    tailleMinimale: 52,
  });

  const hauteurDeLigne = titre.taille * 1.1;

  titre.lignes.forEach((ligne, index) => {
    canvas.fillText(
      ligne,
      { x: margeDuVisuel, y: ordonneePremiereLigneDuTitre + index * hauteurDeLigne },
      policeDisplay(titre.taille),
      palette.encre,
    );
  });

  ecrireAvecTracking(
    canvas,
    metadonneesEnMajuscules(activite.lieu, activite.date),
    {
      x: margeDuVisuel,
      y:
        ordonneePremiereLigneDuTitre +
        (titre.lignes.length - 1) * hauteurDeLigne +
        54,
    },
    policeBody(26),
    palette.encreDouce,
    trackingDesLabels,
  );

  const trace = dessinerTrace(canvas, tuiles, activite.trace, {
    cadre: {
      x: margeDuVisuel,
      y: ordonneeDeLaTrace,
      width: largeurUtile,
      height: hauteurDeLaTrace,
    },
    facteurDeDetail: contexte.facteurDeDetail,
    epaisseur: 7,
    couleur: palette.accent,
    couleurDuHalo: palette.haloDeTrace,
    fond: contexte.fond,
  });

  if (trace !== null) {
    canvas.fillCircle(trace.depart, rayonDuDepart, palette.encre);
    ecrireMentionCartographique(
      canvas,
      palette,
      trace.mention,
      { x: largeurDuVisuel - margeDuVisuel, y: ordonneeDeLaMention },
      true,
    );
  }

  tracerProfilAltimetrique(
    canvas,
    activite.profilAltimetrique,
    {
      x: margeDuVisuel,
      y: ordonneeDuProfil,
      width: largeurUtile,
      height: hauteurDuProfil,
    },
    palette.remplissageDuProfil,
    palette.filet,
  );

  tracerFilet(canvas, ordonneeDuFilet, palette);

  ecrireStatistique(canvas, palette, {
    label: 'DISTANCE',
    valeur: distanceFormatee(metriques.distanceEnKilometres),
    origine: { x: margeDuVisuel, y: ordonneeDesStatistiques },
    taillePolice: 64,
  });

  ecrireStatistique(canvas, palette, {
    label: 'D+',
    valeur: `${metriques.denivelePositifEnMetres} m`,
    origine: {
      x: margeDuVisuel + decalageDeuxiemeStatistique,
      y: ordonneeDesStatistiques,
    },
    taillePolice: 64,
  });

  ecrireStatistique(canvas, palette, {
    label: 'TEMPS',
    valeur: metriques.dureeFormatee,
    origine: {
      x: margeDuVisuel + decalageTroisiemeStatistique,
      y: ordonneeDesStatistiques,
    },
    taillePolice: 64,
  });

  const policeDuPiedDePage = policeBody(24);

  ecrireAvecTracking(
    canvas,
    `${metriques.rythme.libelle} ${metriques.rythme.valeurFormatee}`,
    { x: margeDuVisuel, y: ordonneeDuPiedDePage },
    policeDuPiedDePage,
    palette.encreDouce,
    trackingDesLabels,
  );

  const largeurDuType = largeurAvecTracking(
    canvas,
    activite.libelleDuType,
    policeDuPiedDePage,
    trackingDesLabels,
  );

  ecrireAvecTracking(
    canvas,
    activite.libelleDuType,
    {
      x: largeurDuVisuel - margeDuVisuel - largeurDuType,
      y: ordonneeDuPiedDePage,
    },
    policeDuPiedDePage,
    palette.encreDouce,
    trackingDesLabels,
  );
}
