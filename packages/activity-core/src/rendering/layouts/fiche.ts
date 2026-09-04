import { distanceFormatee } from '../../domain/activity-metrics';
import { policeBody, policeDisplay } from '../../ports/poster-canvas';
import {
  ecrireGrandNombreAvecUnite,
  ecrireMentionCartographique,
  tracerFilet,
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
} from '../text-layout';
import type { ContexteDeVisuel } from './contexte';

const ordonneeDeLEntete = 190;
const ordonneeDuFiletDEntete = 230;
const ordonneeDeLaDistance = 530;
const tailleDeLaDistance = 290;
const tailleDeLUniteDeDistance = 70;
const ordonneePremiereLigneDuTitre = 650;
const ordonneeDeLaTrace = 780;
const hauteurDeLaTrace = 560;
const ordonneeDeLaMention = 1392;
const ordonneePremiereRangee = 1470;
const hauteurEntreRangees = 130;
const hauteurDuFiletAuDessusDeLaRangee = 60;

export function dessinerMiseEnPageFiche(contexte: ContexteDeVisuel): void {
  const { canvas, palette, activite, tuiles } = contexte;
  const { metriques } = activite;
  const largeurUtile = largeurDuVisuel - margeDuVisuel * 2;

  ecrireAvecTracking(
    canvas,
    [activite.libelleDuType, activite.date.toUpperCase()]
      .filter((valeur) => valeur !== '')
      .join(' — '),
    { x: margeDuVisuel, y: ordonneeDeLEntete },
    policeBody(26),
    palette.encreDouce,
    trackingDesLabels,
  );

  tracerFilet(canvas, ordonneeDuFiletDEntete, palette);

  ecrireGrandNombreAvecUnite(canvas, palette, {
    valeur: distanceFormatee(metriques.distanceEnKilometres).replace(' km', ''),
    unite: 'km',
    origine: { x: margeDuVisuel, y: ordonneeDeLaDistance },
    tailleInitiale: tailleDeLaDistance,
    tailleDeLUnite: tailleDeLUniteDeDistance,
  });

  const titre = ajusterTexteSurPlusieursLignes(canvas, activite.nom, policeDisplay(62), {
    tailleInitiale: 62,
    largeurMaximale: largeurUtile,
    nombreMaximalDeLignes: 2,
    tailleMinimale: 40,
  });

  const hauteurDeLigne = titre.taille * 1.12;

  titre.lignes.forEach((ligne, index) => {
    canvas.fillText(
      ligne,
      { x: margeDuVisuel, y: ordonneePremiereLigneDuTitre + index * hauteurDeLigne },
      policeDisplay(titre.taille),
      palette.encre,
    );
  });

  const lieuOuDate =
    activite.lieu !== '' ? activite.lieu.toUpperCase() : activite.date.toUpperCase();

  ecrireAvecTracking(
    canvas,
    lieuOuDate,
    {
      x: margeDuVisuel,
      y:
        ordonneePremiereLigneDuTitre +
        (titre.lignes.length - 1) * hauteurDeLigne +
        50,
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
    epaisseur: 6,
    couleur: palette.accent,
    couleurDuHalo: palette.haloDeTrace,
    fond: contexte.fond,
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

  const rangees: readonly (readonly [string, string])[] = [
    ['DÉNIVELÉ POSITIF', `${metriques.denivelePositifEnMetres} m`],
    ['TEMPS', metriques.dureeFormatee],
    [metriques.rythme.libelle, metriques.rythme.valeurFormatee],
  ];

  rangees.forEach(([label, valeur], index) => {
    const ordonnee = ordonneePremiereRangee + index * hauteurEntreRangees;

    tracerFilet(canvas, ordonnee - hauteurDuFiletAuDessusDeLaRangee, palette);

    ecrireAvecTracking(
      canvas,
      label,
      { x: margeDuVisuel, y: ordonnee },
      policeBody(26),
      palette.encreDouce,
      trackingDesLabels,
    );

    const policeDeLaValeur = policeDisplay(64);
    const largeurDeLaValeur = canvas.measureTextWidth(valeur, policeDeLaValeur);

    canvas.fillText(
      valeur,
      {
        x: largeurDuVisuel - margeDuVisuel - largeurDeLaValeur,
        y: ordonnee + 14,
      },
      policeDeLaValeur,
      palette.encre,
    );
  });
}
