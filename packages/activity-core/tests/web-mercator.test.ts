import { describe, expect, it } from 'vitest';

import {
  abscisseMercator,
  ajusterCarte,
  colonneNormalisee,
  fenetreDeTuiles,
  ordonneeMercator,
  projeterSurLeCadre,
  tailleDUneTuileEnPixels,
  zoomMinimal,
} from '../src/rendering/web-mercator';
import type { GeoPoint } from '../src/domain/geo-point';
import type { Rect } from '../src/ports/poster-canvas';

const cadreDeTest: Rect = { x: 88, y: 620, width: 904, height: 620 };

const traceBelledonne: readonly GeoPoint[] = [
  { latitude: 45.19, longitude: 5.92 },
  { latitude: 45.21, longitude: 5.95 },
  { latitude: 45.2, longitude: 5.98 },
];

describe('projection Web Mercator', () => {
  it('place le méridien de Greenwich au milieu au zoom 0', () => {
    expect(abscisseMercator(0, 0)).toBe(tailleDUneTuileEnPixels / 2);
  });

  it('place les antiméridiens aux bords', () => {
    expect(abscisseMercator(-180, 0)).toBe(0);
    expect(abscisseMercator(180, 0)).toBe(tailleDUneTuileEnPixels);
  });

  it("place l'équateur au milieu vertical", () => {
    expect(ordonneeMercator(0, 0)).toBeCloseTo(tailleDUneTuileEnPixels / 2, 6);
  });

  it('rapproche du bord haut aux latitudes extrêmes', () => {
    expect(ordonneeMercator(85.0511, 0)).toBeLessThan(1);
  });

  it('double la taille du plan à chaque niveau de zoom', () => {
    expect(abscisseMercator(10, 1)).toBeCloseTo(abscisseMercator(10, 0) * 2, 6);
    expect(ordonneeMercator(45, 3)).toBeCloseTo(ordonneeMercator(45, 2) * 2, 6);
  });
});

describe('ajusterCarte', () => {
  it('rend null pour une trace vide', () => {
    expect(ajusterCarte([], cadreDeTest, 1, 18)).toBeNull();
  });

  it('choisit un zoom plus élevé pour une trace plus petite', () => {
    const tracePetite: readonly GeoPoint[] = [
      { latitude: 45.19, longitude: 5.92 },
      { latitude: 45.191, longitude: 5.921 },
    ];
    const traceGrande: readonly GeoPoint[] = [
      { latitude: 40, longitude: 0 },
      { latitude: 50, longitude: 10 },
    ];

    const ajustementPetite = ajusterCarte(tracePetite, cadreDeTest, 1, 18);
    const ajustementGrande = ajusterCarte(traceGrande, cadreDeTest, 1, 18);

    expect(ajustementPetite).not.toBeNull();
    expect(ajustementGrande).not.toBeNull();
    if (ajustementPetite === null || ajustementGrande === null) return;

    expect(ajustementPetite.zoom).toBeGreaterThan(ajustementGrande.zoom);
  });

  it('ne descend jamais sous le zoom minimal', () => {
    const traceMondiale: readonly GeoPoint[] = [
      { latitude: -60, longitude: -170 },
      { latitude: 60, longitude: 170 },
    ];

    const ajustement = ajusterCarte(traceMondiale, cadreDeTest, 1, 18);

    expect(ajustement).not.toBeNull();
    if (ajustement === null) return;

    expect(ajustement.zoom).toBeGreaterThanOrEqual(zoomMinimal);
  });

  it('ne dépasse jamais le zoom maximal du fournisseur', () => {
    const traceMinuscule: readonly GeoPoint[] = [
      { latitude: 45.19, longitude: 5.92 },
      { latitude: 45.190001, longitude: 5.920001 },
    ];

    const ajustement = ajusterCarte(traceMinuscule, cadreDeTest, 1, 16);

    expect(ajustement).not.toBeNull();
    if (ajustement === null) return;

    expect(ajustement.zoom).toBeLessThanOrEqual(16);
  });

  it('demande plus de zoom quand on augmente le facteur de détail', () => {
    const sansSurechantillonnage = ajusterCarte(traceBelledonne, cadreDeTest, 1, 18);
    const avecFacteurDeux = ajusterCarte(traceBelledonne, cadreDeTest, 2, 18);

    expect(sansSurechantillonnage).not.toBeNull();
    expect(avecFacteurDeux).not.toBeNull();
    if (sansSurechantillonnage === null || avecFacteurDeux === null) return;

    expect(avecFacteurDeux.zoom).toBeGreaterThanOrEqual(
      sansSurechantillonnage.zoom,
    );
  });
});

describe('projeterSurLeCadre', () => {
  it('garde tous les points de la trace dans le cadre', () => {
    const ajustement = ajusterCarte(traceBelledonne, cadreDeTest, 1, 18);

    expect(ajustement).not.toBeNull();
    if (ajustement === null) return;

    for (const point of traceBelledonne) {
      const projete = projeterSurLeCadre(ajustement, point);

      expect(projete.x).toBeGreaterThanOrEqual(cadreDeTest.x);
      expect(projete.x).toBeLessThanOrEqual(cadreDeTest.x + cadreDeTest.width);
      expect(projete.y).toBeGreaterThanOrEqual(cadreDeTest.y);
      expect(projete.y).toBeLessThanOrEqual(cadreDeTest.y + cadreDeTest.height);
    }
  });

  it("respecte l'orientation nord-sud", () => {
    const ajustement = ajusterCarte(traceBelledonne, cadreDeTest, 1, 18);

    if (ajustement === null) throw new Error('ajustement attendu');

    const nord = projeterSurLeCadre(ajustement, {
      latitude: 45.21,
      longitude: 5.95,
    });
    const sud = projeterSurLeCadre(ajustement, {
      latitude: 45.19,
      longitude: 5.95,
    });

    expect(nord.y).toBeLessThan(sud.y);
  });
});

describe('fenetreDeTuiles', () => {
  it('couvre le cadre demandé', () => {
    const ajustement = ajusterCarte(traceBelledonne, cadreDeTest, 1, 18);

    if (ajustement === null) throw new Error('ajustement attendu');

    const fenetre = fenetreDeTuiles(ajustement, cadreDeTest);

    expect(fenetre.colonneMaximale).toBeGreaterThanOrEqual(fenetre.colonneMinimale);
    expect(fenetre.ligneMaximale).toBeGreaterThanOrEqual(fenetre.ligneMinimale);
    expect(fenetre.tailleAffichee).toBeGreaterThan(0);
    expect(fenetre.nombreDeTuilesParCote).toBe(Math.pow(2, ajustement.zoom));
  });
});

describe('colonneNormalisee', () => {
  it('replie les colonnes négatives au-delà de l’antiméridien', () => {
    expect(colonneNormalisee(-1, 8)).toBe(7);
    expect(colonneNormalisee(-9, 8)).toBe(7);
  });

  it('replie les colonnes trop grandes', () => {
    expect(colonneNormalisee(8, 8)).toBe(0);
    expect(colonneNormalisee(9, 8)).toBe(1);
  });

  it('laisse les colonnes valides inchangées', () => {
    expect(colonneNormalisee(3, 8)).toBe(3);
  });
});
