import { distanceFormatee } from '../../domain/activity-metrics';
import { policeBody, policeDisplay } from '../../ports/poster-canvas';
import { styleDuFond } from '../../ports/tile-repository';
import {
  ecrireGrandNombreAvecUnite,
  ecrireMentionCartographique,
  ecrireStatistique,
  tracerProfilAltimetrique,
} from '../poster-primitives';
import {
  hauteurDuVisuel,
  largeurDuVisuel,
  margeDuVisuel,
  trackingDesLabels,
} from '../poster-theme';
import { dessinerTrace } from '../route-drawing';
import {
  ecrireAvecTracking,
  largeurAvecTracking,
  tronquerALaLargeur,
} from '../text-layout';
import type { ContexteDeVisuel } from './contexte';

const ordonneeDuNom = 180;
const ordonneeDuDenivele = 470;
const tailleDuDenivele = 260;
const tailleDeLUniteDeDenivele = 64;
const ordonneeDuSousTitre = 540;
const ordonneeDeLaTrace = 640;
const coteDeLaTrace = 380;
const ordonneeDeLaMention = 1052;
const abscisseDesStatistiques = 560;
const ordonneePremiereStatistique = 700;
const ordonneeDeuxiemeStatistique = 860;
const ordonneeTroisiemeStatistique = 1020;
const ordonneeDuProfil = 1180;
const hauteurDuProfil = 560;
const ordonneeDuVoile = 1740;
const hauteurDuVoile = 180;
const ordonneeDeLaDate = 1836;
const ordonneeDuType = 1830;

export function dessinerMiseEnPageProfil(contexte: ContexteDeVisuel): void {
  const { canvas, palette, activite, tuiles } = contexte;
  const { metriques } = activite;
  const largeurUtile = largeurDuVisuel - margeDuVisuel * 2;
  const policeDuNom = policeBody(26);

  ecrireAvecTracking(
    canvas,
    tronquerALaLargeur(
      canvas,
      activite.nom.toUpperCase(),
      policeDuNom,
      largeurUtile,
      trackingDesLabels,
    ),
    { x: margeDuVisuel, y: ordonneeDuNom },
    policeDuNom,
    palette.encreDouce,
    trackingDesLabels,
  );

  ecrireGrandNombreAvecUnite(canvas, palette, {
    valeur: String(metriques.denivelePositifEnMetres),
    unite: 'm D+',
    origine: { x: margeDuVisuel, y: ordonneeDuDenivele },
    tailleInitiale: tailleDuDenivele,
    tailleDeLUnite: tailleDeLUniteDeDenivele,
  });

  ecrireAvecTracking(
    canvas,
    activite.lieu !== ''
      ? `DÉNIVELÉ POSITIF — ${activite.lieu.toUpperCase()}`
      : 'DÉNIVELÉ POSITIF',
    { x: margeDuVisuel, y: ordonneeDuSousTitre },
    policeBody(28),
    palette.encreDouce,
    trackingDesLabels,
  );

  const surUneCarte = styleDuFond(contexte.fond) !== null;

  const trace = dessinerTrace(canvas, tuiles, activite.trace, {
    cadre: {
      x: margeDuVisuel,
      y: ordonneeDeLaTrace,
      width: coteDeLaTrace,
      height: coteDeLaTrace,
    },
    facteurDeDetail: contexte.facteurDeDetail,
    epaisseur: 5,
    couleur: surUneCarte ? palette.accent : palette.traceDiscrete,
    couleurDuHalo: palette.haloDeTrace,
    fond: contexte.fond,
  });

  if (trace !== null) {
    ecrireMentionCartographique(
      canvas,
      palette,
      trace.mention,
      { x: margeDuVisuel, y: ordonneeDeLaMention },
      false,
    );
  }

  ecrireStatistique(canvas, palette, {
    label: 'DISTANCE',
    valeur: distanceFormatee(metriques.distanceEnKilometres),
    origine: { x: abscisseDesStatistiques, y: ordonneePremiereStatistique },
    taillePolice: 58,
  });

  ecrireStatistique(canvas, palette, {
    label: 'TEMPS',
    valeur: metriques.dureeFormatee,
    origine: { x: abscisseDesStatistiques, y: ordonneeDeuxiemeStatistique },
    taillePolice: 58,
  });

  ecrireStatistique(canvas, palette, {
    label: metriques.rythme.libelle,
    valeur: metriques.rythme.valeurFormatee,
    origine: { x: abscisseDesStatistiques, y: ordonneeTroisiemeStatistique },
    taillePolice: 46,
  });

  tracerProfilAltimetrique(
    canvas,
    activite.profilAltimetrique,
    {
      x: 0,
      y: ordonneeDuProfil,
      width: largeurDuVisuel,
      height: hauteurDuProfil,
    },
    palette.accent,
    null,
  );

  canvas.fillRect(
    {
      x: 0,
      y: ordonneeDuVoile,
      width: largeurDuVisuel,
      height: Math.min(hauteurDuVoile, hauteurDuVisuel - ordonneeDuVoile),
    },
    palette.voileDeTexteDense,
  );

  canvas.fillText(
    activite.date,
    { x: margeDuVisuel, y: ordonneeDeLaDate },
    policeDisplay(58),
    palette.encre,
  );

  const policeDuType = policeBody(24);
  const largeurDuType = largeurAvecTracking(
    canvas,
    activite.libelleDuType,
    policeDuType,
    trackingDesLabels,
  );

  ecrireAvecTracking(
    canvas,
    activite.libelleDuType,
    {
      x: largeurDuVisuel - margeDuVisuel - largeurDuType,
      y: ordonneeDuType,
    },
    policeDuType,
    palette.encreDouce,
    trackingDesLabels,
  );
}
