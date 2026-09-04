import { describe, expect, it } from 'vitest';

import {
  cadreEnglobant,
  distanceOrthodromiqueEnKilometres,
  longueurDuTraceEnKilometres,
  sousEchantillonner,
} from '../src/domain/geo-point';

const unDegreDeLatitudeEnKilometres = 111.19;

describe('distanceOrthodromiqueEnKilometres', () => {
  it('rend zéro entre un point et lui-même', () => {
    const point = { latitude: 45.19, longitude: 5.92 };

    expect(distanceOrthodromiqueEnKilometres(point, point)).toBe(0);
  });

  it('mesure un degré de latitude à environ 111 km', () => {
    const distance = distanceOrthodromiqueEnKilometres(
      { latitude: 0, longitude: 0 },
      { latitude: 1, longitude: 0 },
    );

    expect(distance).toBeCloseTo(unDegreDeLatitudeEnKilometres, 1);
  });

  it("mesure un degré de longitude à environ 111 km à l'équateur", () => {
    const distance = distanceOrthodromiqueEnKilometres(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 },
    );

    expect(distance).toBeCloseTo(unDegreDeLatitudeEnKilometres, 1);
  });

  it('resserre un degré de longitude à 45 degrés de latitude', () => {
    const distance = distanceOrthodromiqueEnKilometres(
      { latitude: 45, longitude: 0 },
      { latitude: 45, longitude: 1 },
    );

    expect(distance).toBeCloseTo(unDegreDeLatitudeEnKilometres * Math.cos(Math.PI / 4), 0);
  });

  it('mesure Paris–Lyon à environ 392 km', () => {
    const distance = distanceOrthodromiqueEnKilometres(
      { latitude: 48.8566, longitude: 2.3522 },
      { latitude: 45.764, longitude: 4.8357 },
    );

    expect(distance).toBeGreaterThan(385);
    expect(distance).toBeLessThan(400);
  });
});

describe('longueurDuTraceEnKilometres', () => {
  it('rend zéro pour une trace vide ou à un seul point', () => {
    expect(longueurDuTraceEnKilometres([])).toBe(0);
    expect(longueurDuTraceEnKilometres([{ latitude: 45, longitude: 5 }])).toBe(0);
  });

  it('additionne les segments successifs', () => {
    const longueur = longueurDuTraceEnKilometres([
      { latitude: 0, longitude: 0 },
      { latitude: 1, longitude: 0 },
      { latitude: 2, longitude: 0 },
    ]);

    expect(longueur).toBeCloseTo(unDegreDeLatitudeEnKilometres * 2, 1);
  });

  it('sous-estime la longueur si la trace est sous-échantillonnée avant le calcul', () => {
    const traceSinueuse = Array.from({ length: 201 }, (_, index) => ({
      latitude: 45 + index * 0.001,
      longitude: 5 + (index % 2 === 0 ? 0 : 0.002),
    }));

    const longueurComplete = longueurDuTraceEnKilometres(traceSinueuse);
    const longueurReduite = longueurDuTraceEnKilometres(
      sousEchantillonner(traceSinueuse, 20),
    );

    expect(longueurReduite).toBeLessThan(longueurComplete);
  });
});

describe('sousEchantillonner', () => {
  it('rend la liste inchangée sous le seuil', () => {
    const valeurs = [1, 2, 3];

    expect(sousEchantillonner(valeurs, 10)).toBe(valeurs);
  });

  it('respecte le nombre maximal de points demandé', () => {
    const valeurs = Array.from({ length: 5000 }, (_, index) => index);

    const retenus = sousEchantillonner(valeurs, 1200);

    expect(retenus.length).toBeLessThanOrEqual(1201);
    expect(retenus.length).toBeGreaterThan(1000);
  });

  it('conserve le premier et le dernier point', () => {
    const valeurs = Array.from({ length: 1000 }, (_, index) => index);

    const retenus = sousEchantillonner(valeurs, 7);

    expect(retenus[0]).toBe(0);
    expect(retenus.at(-1)).toBe(999);
  });
});

describe('cadreEnglobant', () => {
  it('rend null pour une trace vide', () => {
    expect(cadreEnglobant([])).toBeNull();
  });

  it('encadre tous les points', () => {
    const cadre = cadreEnglobant([
      { latitude: 45.1, longitude: 5.9 },
      { latitude: 45.3, longitude: 5.7 },
      { latitude: 45.2, longitude: 6.1 },
    ]);

    expect(cadre).toEqual({
      latitudeMinimale: 45.1,
      latitudeMaximale: 45.3,
      longitudeMinimale: 5.7,
      longitudeMaximale: 6.1,
    });
  });
});
