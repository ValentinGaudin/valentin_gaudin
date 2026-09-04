import { describe, expect, it } from 'vitest';

import type { Activity } from '../src/domain/activity';
import {
  dessinerVisuel,
  nomDeFichierDExport,
  taillesDExport,
  type OptionsDeVisuel,
} from '../src/application/render-poster';
import { profilNormalise } from '../src/domain/elevation-profile';
import { misesEnPageDisponibles } from '../src/rendering/layouts/contexte';
import {
  hauteurDuVisuel,
  largeurDuVisuel,
  paletteDuVisuel,
} from '../src/rendering/poster-theme';
import { creerCanvasEspion } from './canvas-espion';
import { creerDepotDeTuilesFactice } from './depot-de-tuiles-factice';

const activiteDeReference: Activity = {
  identifiant: 'colon',
  nom: 'Tour du Grand Colon',
  lieu: 'Belledonne',
  date: '24 août 2026',
  libelleDuType: 'TRAIL',
  metriques: {
    distanceEnKilometres: 18.4,
    denivelePositifEnMetres: 1240,
    dureeEnSecondes: 9660,
    dureeFormatee: '2 h 41',
    rythme: { libelle: 'ALLURE', valeurFormatee: "8'45 min/km" },
  },
  trace: [
    { latitude: 45.19, longitude: 5.92 },
    { latitude: 45.21, longitude: 5.95 },
    { latitude: 45.2, longitude: 5.98 },
    { latitude: 45.19, longitude: 5.92 },
  ],
  profilAltimetrique: profilNormalise(
    Array.from({ length: 60 }, (_, index) => 800 + index * 8),
  ),
  provenance: 'demonstration',
};

function optionsPour(
  surcharges: Partial<OptionsDeVisuel> = {},
): OptionsDeVisuel {
  return {
    activite: activiteDeReference,
    miseEnPage: 'crete',
    accent: '#E8442A',
    themeSombre: true,
    fond: 'papier',
    ...surcharges,
  };
}

describe('dessinerVisuel — toutes les mises en page', () => {
  for (const miseEnPage of misesEnPageDisponibles) {
    it(`dessine la mise en page ${miseEnPage.cle} sans échouer`, () => {
      const canvas = creerCanvasEspion();

      dessinerVisuel(
        canvas,
        creerDepotDeTuilesFactice(),
        optionsPour({ miseEnPage: miseEnPage.cle }),
      );

      expect(canvas.textes.length).toBeGreaterThan(0);
      expect(canvas.polylignes.length).toBeGreaterThan(0);
    });

    it(`affiche le nom de l'activité dans la mise en page ${miseEnPage.cle}`, () => {
      const canvas = creerCanvasEspion();

      dessinerVisuel(
        canvas,
        creerDepotDeTuilesFactice(),
        optionsPour({ miseEnPage: miseEnPage.cle }),
      );

      const texteRendu = canvas.texteConcatene().toUpperCase();

      expect(texteRendu).toContain('COLON');
    });

    it(`garde tout le texte dans le format 1080 × 1920 pour ${miseEnPage.cle}`, () => {
      const canvas = creerCanvasEspion();

      dessinerVisuel(
        canvas,
        creerDepotDeTuilesFactice(),
        optionsPour({ miseEnPage: miseEnPage.cle }),
      );

      for (const appel of canvas.textes) {
        expect(appel.origine.x).toBeGreaterThanOrEqual(0);
        expect(appel.origine.x).toBeLessThanOrEqual(largeurDuVisuel);
        expect(appel.origine.y).toBeGreaterThan(0);
        expect(appel.origine.y).toBeLessThanOrEqual(hauteurDuVisuel);
      }
    });
  }
});

describe('dessinerVisuel — fond', () => {
  it('peint un fond opaque sur toute la surface hors mode transparent', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(canvas, creerDepotDeTuilesFactice(), optionsPour());

    const premierRectangle = canvas.rectangles[0];

    expect(premierRectangle).toBeDefined();
    expect(premierRectangle?.cadre).toEqual({
      x: 0,
      y: 0,
      width: largeurDuVisuel,
      height: hauteurDuVisuel,
    });
  });

  it('ne peint aucun fond en mode transparent', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(
      canvas,
      creerDepotDeTuilesFactice(),
      optionsPour({ fond: 'transparent' }),
    );

    const remplitToutLeCadre = canvas.rectangles.some(
      (appel) =>
        appel.cadre.x === 0 &&
        appel.cadre.y === 0 &&
        appel.cadre.width === largeurDuVisuel &&
        appel.cadre.height === hauteurDuVisuel,
    );

    expect(remplitToutLeCadre).toBe(false);
  });
});

describe('dessinerVisuel — cartographie', () => {
  it('ne demande aucune tuile sur un fond papier', () => {
    const depot = creerDepotDeTuilesFactice();

    dessinerVisuel(creerCanvasEspion(), depot, optionsPour({ fond: 'papier' }));

    expect(depot.urlsDemandees).toHaveLength(0);
  });

  it('demande des tuiles OpenStreetMap sur un fond clair', () => {
    const depot = creerDepotDeTuilesFactice();

    dessinerVisuel(creerCanvasEspion(), depot, optionsPour({ fond: 'clair' }));

    expect(depot.urlsDemandees.length).toBeGreaterThan(0);
    expect(depot.urlsDemandees[0]).toContain('tile.openstreetmap.org');
  });

  it('applique le filtre du style aux tuiles dessinées', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(canvas, creerDepotDeTuilesFactice(), optionsPour({ fond: 'sombre' }));

    expect(canvas.tuiles.length).toBeGreaterThan(0);
    expect(canvas.tuiles[0]?.filtre).toMatchObject({ invert: 1, grayscale: 1 });
  });

  it('découpe le dessin des tuiles au cadre de la trace', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(canvas, creerDepotDeTuilesFactice(), optionsPour({ fond: 'clair' }));

    expect(canvas.cadresDeDecoupe.length).toBeGreaterThan(0);
  });

  it('dessine quand même la trace si aucune tuile ne répond', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(
      canvas,
      creerDepotDeTuilesFactice('indisponible'),
      optionsPour({ fond: 'satellite' }),
    );

    expect(canvas.tuiles).toHaveLength(0);
    expect(canvas.polylignes.length).toBeGreaterThan(0);
  });

  it('affiche la mention du fournisseur sur un fond cartographique', () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(canvas, creerDepotDeTuilesFactice(), optionsPour({ fond: 'topo' }));

    expect(canvas.texteConcatene()).toContain('OPENTOPOMAP');
  });

  it("n'affiche aucune mention sur un fond papier", () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(canvas, creerDepotDeTuilesFactice(), optionsPour({ fond: 'papier' }));

    expect(canvas.texteConcatene()).not.toContain('OPENSTREETMAP');
  });
});

describe('paletteDuVisuel — lisibilité de l’accent', () => {
  it("remplace l'accent crème par l'encre en thème clair", () => {
    const palette = paletteDuVisuel(false, '#F1ECE4', false);

    expect(palette.accent).toBe('#111111');
    expect(palette.fond).toBe('#F1ECE4');
  });

  it("conserve l'accent crème en thème sombre", () => {
    const palette = paletteDuVisuel(true, '#F1ECE4', false);

    expect(palette.accent).toBe('#F1ECE4');
    expect(palette.fond).toBe('#111111');
  });

  it('laisse tout autre accent intact', () => {
    expect(paletteDuVisuel(false, '#E8442A', false).accent).toBe('#E8442A');
    expect(paletteDuVisuel(true, '#2570CE', false).accent).toBe('#2570CE');
  });

  it('éclaircit le halo de trace sur une carte claire', () => {
    expect(paletteDuVisuel(false, '#E8442A', true).haloDeTrace).toContain('255,255,255');
    expect(paletteDuVisuel(false, '#E8442A', false).haloDeTrace).toContain('0,0,0');
  });
});

describe('dessinerVisuel — accent et thème', () => {
  it("ne peint jamais la pastille d'accent en crème sur fond crème", () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(
      canvas,
      creerDepotDeTuilesFactice(),
      optionsPour({ themeSombre: false, accent: '#F1ECE4', miseEnPage: 'crete' }),
    );

    const pastilleDAccent = canvas.rectangles.find(
      (appel) => appel.cadre.width === 46 && appel.cadre.height === 46,
    );

    expect(pastilleDAccent).toBeDefined();
    expect(pastilleDAccent?.couleur).not.toBe('#F1ECE4');
  });

  it("trace la route dans la couleur d'accent demandée", () => {
    const canvas = creerCanvasEspion();

    dessinerVisuel(
      canvas,
      creerDepotDeTuilesFactice(),
      optionsPour({ themeSombre: true, accent: '#2570CE', miseEnPage: 'crete' }),
    );

    const traceEnAccent = canvas.polylignes.some(
      (appel) => appel.couleur === '#2570CE',
    );

    expect(traceEnAccent).toBe(true);
  });
});

describe('nomDeFichierDExport', () => {
  it('translittère les accents', () => {
    const nom = nomDeFichierDExport(
      { ...activiteDeReference, nom: 'Sortie été à Grenoble' },
      'png',
    );

    expect(nom).toBe('sortie-ete-a-grenoble.png');
  });

  it('ne laisse ni tiret initial ni tiret final', () => {
    const nom = nomDeFichierDExport(
      { ...activiteDeReference, nom: '  ??? Trail ???  ' },
      'jpg',
    );

    expect(nom).toBe('trail.jpg');
  });

  it('se rabat sur un nom générique si tout est retiré', () => {
    const nom = nomDeFichierDExport({ ...activiteDeReference, nom: '???' }, 'png');

    expect(nom).toBe('visuel.png');
  });

  it("respecte l'extension demandée", () => {
    expect(nomDeFichierDExport(activiteDeReference, 'jpg')).toMatch(/\.jpg$/);
    expect(nomDeFichierDExport(activiteDeReference, 'png')).toMatch(/\.png$/);
  });
});

describe('taillesDExport', () => {
  it('propose trois facteurs croissants', () => {
    expect(taillesDExport).toHaveLength(3);
    expect(taillesDExport.map((taille) => taille.facteur)).toEqual([1, 1.5, 2]);
  });

  it('annonce des dimensions cohérentes avec le format de base', () => {
    for (const taille of taillesDExport) {
      const largeurAttendue = Math.round(largeurDuVisuel * taille.facteur);
      const hauteurAttendue = Math.round(hauteurDuVisuel * taille.facteur);

      expect(taille.libelle).toBe(`${largeurAttendue} × ${hauteurAttendue}`);
    }
  });
});
