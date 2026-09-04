import { describe, expect, it } from 'vitest';

import {
  altitudeNormaliseeDuProfilPlat,
  altitudeNormaliseeMinimale,
  amplitudeNormalisee,
  nombreDePointsDuProfil,
  profilNormalise,
} from '../src/domain/elevation-profile';

describe('profilNormalise', () => {
  it('rend toujours le nombre de points attendu', () => {
    const profil = profilNormalise(
      Array.from({ length: 43 }, (_, index) => index * 10),
    );

    expect(profil).toHaveLength(nombreDePointsDuProfil);
  });

  it('rend un profil plat sans altitude connue', () => {
    const profil = profilNormalise([null, null, null]);

    expect(new Set(profil)).toEqual(new Set([altitudeNormaliseeDuProfilPlat]));
  });

  it('rend un profil plat sous le nombre minimal de points connus', () => {
    const profil = profilNormalise([100, 200, 300, null, null]);

    expect(new Set(profil)).toEqual(new Set([altitudeNormaliseeDuProfilPlat]));
  });

  it('normalise entre le plancher et le plafond attendus', () => {
    const profil = profilNormalise(
      Array.from({ length: 100 }, (_, index) => index),
    );

    expect(Math.min(...profil)).toBeCloseTo(altitudeNormaliseeMinimale, 5);
    expect(Math.max(...profil)).toBeCloseTo(
      altitudeNormaliseeMinimale + amplitudeNormalisee,
      5,
    );
  });

  it('reste dans les bornes même sur une altitude constante', () => {
    const profil = profilNormalise(new Array<number>(50).fill(1200));

    for (const valeur of profil) {
      expect(valeur).toBeCloseTo(altitudeNormaliseeMinimale, 5);
    }
  });

  it('ignore les trous sans décaler le profil', () => {
    const avecTrous: (number | null)[] = [];

    for (let index = 0; index <= 20; index += 1) {
      avecTrous.push(index * 5);
      avecTrous.push(null);
    }

    const profil = profilNormalise(avecTrous);

    expect(profil).toHaveLength(nombreDePointsDuProfil);
    expect(profil[0]).toBeCloseTo(altitudeNormaliseeMinimale, 5);
    expect(profil.at(-1)).toBeCloseTo(
      altitudeNormaliseeMinimale + amplitudeNormalisee,
      5,
    );
  });

  it('bascule sur le profil plat en dessous du nombre minimal de points connus', () => {
    const troisPointsConnus = [0, null, 50, null, 100];

    const profil = profilNormalise(troisPointsConnus);

    expect(new Set(profil)).toEqual(new Set([altitudeNormaliseeDuProfilPlat]));
  });
});
