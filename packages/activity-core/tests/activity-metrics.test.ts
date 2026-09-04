import { describe, expect, it } from 'vitest';

import {
  altitudesLissees,
  calculerRythme,
  denivelePositifEnMetres,
  distanceFormatee,
  dureeIndisponible,
  formaterDuree,
} from '../src/domain/activity-metrics';

function altitudesBruitees(
  altitudeMoyenne: number,
  amplitudeDuBruit: number,
  nombreDePoints: number,
): number[] {
  return Array.from({ length: nombreDePoints }, (_, index) =>
    index % 2 === 0 ? altitudeMoyenne : altitudeMoyenne + amplitudeDuBruit,
  );
}

describe('denivelePositifEnMetres', () => {
  it('rend zéro sur une trace sans altitude connue', () => {
    expect(denivelePositifEnMetres([null, null, null])).toBe(0);
  });

  it('rend zéro sur une trace plate', () => {
    expect(denivelePositifEnMetres([200, 200, 200, 200])).toBe(0);
  });

  it('additionne une montée franche', () => {
    expect(denivelePositifEnMetres([0, 500, 1000])).toBe(1000);
  });

  it('ignore la descente', () => {
    expect(denivelePositifEnMetres([1000, 0, 1000])).toBe(1000);
  });

  it('ignore une oscillation qui reste sous le seuil', () => {
    expect(denivelePositifEnMetres([100, 102, 100, 102, 100], 3)).toBe(0);
  });

  it('accumule dès que le seuil est franchi', () => {
    expect(denivelePositifEnMetres([100, 104, 108], 3)).toBe(8);
  });

  it("compare à la dernière altitude retenue, pas à la précédente", () => {
    expect(denivelePositifEnMetres([100, 102, 104, 106], 3)).toBe(4);
  });

  it('conserve une montée lente et régulière', () => {
    const monteeLente = Array.from({ length: 501 }, (_, index) => index * 2);

    const denivele = denivelePositifEnMetres(monteeLente, 3);

    expect(denivele).toBeGreaterThan(990);
    expect(denivele).toBeLessThanOrEqual(1000);
  });

  it('saute les altitudes manquantes sans casser la chaîne', () => {
    expect(denivelePositifEnMetres([0, null, 500, null, 1000])).toBe(1000);
  });

  it('compte le bruit vertical comme du dénivelé si les altitudes ne sont pas lissées', () => {
    const bruit = altitudesBruitees(1000, 6, 200);

    const deniveleBrut = denivelePositifEnMetres(bruit);

    expect(deniveleBrut).toBeGreaterThan(500);
  });

  it('ne compte plus le bruit une fois les altitudes lissées', () => {
    const bruit = altitudesBruitees(1000, 6, 200);

    const deniveleLisse = denivelePositifEnMetres(altitudesLissees(bruit));

    expect(deniveleLisse).toBe(0);
  });

  it('conserve une vraie montée à travers le lissage', () => {
    const montee = Array.from({ length: 200 }, (_, index) => index * 5);

    const deniveleLisse = denivelePositifEnMetres(altitudesLissees(montee));

    expect(deniveleLisse).toBeGreaterThan(950);
    expect(deniveleLisse).toBeLessThanOrEqual(1000);
  });
});

describe('altitudesLissees', () => {
  it('rend la liste inchangée pour une fenêtre de 1', () => {
    const altitudes = [1, 2, 3];

    expect(altitudesLissees(altitudes, 1)).toBe(altitudes);
  });

  it('préserve les trous', () => {
    expect(altitudesLissees([100, null, 100], 3)).toEqual([100, null, 100]);
  });

  it('moyenne sur la fenêtre', () => {
    expect(altitudesLissees([0, 30, 0], 3)).toEqual([15, 10, 15]);
  });
});

describe('formaterDuree', () => {
  it('signale une durée indisponible', () => {
    expect(formaterDuree(0)).toBe(dureeIndisponible);
    expect(formaterDuree(Number.NaN)).toBe(dureeIndisponible);
  });

  it('affiche les minutes seules sous une heure', () => {
    expect(formaterDuree(52 * 60)).toBe('52 min');
  });

  it('affiche heures et minutes au-delà', () => {
    expect(formaterDuree(2 * 3600 + 41 * 60)).toBe('2 h 41');
  });

  it('complète les minutes à deux chiffres', () => {
    expect(formaterDuree(3 * 3600 + 5 * 60)).toBe('3 h 05');
  });

  it("ne rend jamais 60 minutes après arrondi", () => {
    expect(formaterDuree(3 * 3600 + 59 * 60 + 50)).toBe('4 h 00');
  });
});

describe('calculerRythme', () => {
  it('signale un rythme indisponible sans durée', () => {
    expect(calculerRythme(18.4, 0, false).valeurFormatee).toBe(dureeIndisponible);
  });

  it('affiche une allure en minutes par kilomètre pour la course', () => {
    const rythme = calculerRythme(21.1, 5640, false);

    expect(rythme.libelle).toBe('ALLURE');
    expect(rythme.valeurFormatee).toBe("4'27 min/km");
  });

  it('affiche une vitesse au-delà du seuil de bascule', () => {
    const rythme = calculerRythme(74.2, 11520, false);

    expect(rythme.libelle).toBe('MOYENNE');
    expect(rythme.valeurFormatee).toBe('23,2 km/h');
  });

  it('affiche une vitesse dès que le GPX déclare une activité roulante, même lente', () => {
    const rythme = calculerRythme(30, 7200, true);

    expect(rythme.libelle).toBe('MOYENNE');
    expect(rythme.valeurFormatee).toBe('15,0 km/h');
  });

  it('reste en allure pour une course rapide sous le seuil', () => {
    const rythme = calculerRythme(10, 1800, false);

    expect(rythme.libelle).toBe('ALLURE');
    expect(rythme.valeurFormatee).toBe("3'00 min/km");
  });

  it("ne rend jamais 60 secondes d'allure après arrondi", () => {
    const rythme = calculerRythme(1, 299.7, false);

    expect(rythme.valeurFormatee).toBe("5'00 min/km");
  });
});

describe('distanceFormatee', () => {
  it('emploie la virgule décimale française', () => {
    expect(distanceFormatee(18.44)).toBe('18,4 km');
  });

  it('affiche une décimale même sur un entier', () => {
    expect(distanceFormatee(21)).toBe('21,0 km');
  });
});
