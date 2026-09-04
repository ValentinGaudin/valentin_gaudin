import { describe, expect, it } from 'vitest';

import {
  activitesDeDemonstration,
  creerDepotDActivitesDeDemonstration,
} from '../src/demo/demo-activities';
import { cadreEnglobant, longueurDuTraceEnKilometres } from '../src/domain/geo-point';
import { nombreDePointsDuProfil } from '../src/domain/elevation-profile';

describe('activitesDeDemonstration', () => {
  it('propose cinq activités', () => {
    expect(activitesDeDemonstration()).toHaveLength(5);
  });

  it('donne à chaque activité un identifiant distinct', () => {
    const identifiants = activitesDeDemonstration().map(
      (activite) => activite.identifiant,
    );

    expect(new Set(identifiants).size).toBe(identifiants.length);
  });

  it('marque toutes les activités comme démonstration', () => {
    for (const activite of activitesDeDemonstration()) {
      expect(activite.provenance).toBe('demonstration');
    }
  });

  it('produit un profil de la bonne longueur pour chacune', () => {
    for (const activite of activitesDeDemonstration()) {
      expect(activite.profilAltimetrique).toHaveLength(nombreDePointsDuProfil);
    }
  });

  it('place chaque trace autour de son centre déclaré', () => {
    for (const activite of activitesDeDemonstration()) {
      const cadre = cadreEnglobant(activite.trace);

      expect(cadre).not.toBeNull();
      if (cadre === null) continue;

      expect(cadre.latitudeMinimale).toBeGreaterThan(44.9);
      expect(cadre.latitudeMaximale).toBeLessThan(45.6);
      expect(cadre.longitudeMinimale).toBeGreaterThan(5.5);
      expect(cadre.longitudeMaximale).toBeLessThan(6.2);
    }
  });

  it("respecte à peu près l'étendue déclarée de chaque trace", () => {
    const sortieVelo = activitesDeDemonstration().find(
      (activite) => activite.identifiant === 'sortie-longue-chartreuse',
    );
    const fractionne = activitesDeDemonstration().find(
      (activite) => activite.identifiant === 'fractionne-au-stade',
    );

    expect(sortieVelo).toBeDefined();
    expect(fractionne).toBeDefined();
    if (sortieVelo === undefined || fractionne === undefined) return;

    expect(longueurDuTraceEnKilometres(sortieVelo.trace)).toBeGreaterThan(
      longueurDuTraceEnKilometres(fractionne.trace),
    );
  });

  it('affiche une vitesse pour la sortie vélo et une allure pour la course', () => {
    const activites = activitesDeDemonstration();
    const velo = activites.find(
      (activite) => activite.identifiant === 'sortie-longue-chartreuse',
    );
    const semi = activites.find(
      (activite) => activite.identifiant === 'semi-de-grenoble',
    );

    expect(velo?.metriques.rythme.libelle).toBe('MOYENNE');
    expect(velo?.metriques.rythme.valeurFormatee).toBe('23,2 km/h');
    expect(semi?.metriques.rythme.libelle).toBe('ALLURE');
    expect(semi?.metriques.rythme.valeurFormatee).toBe("4'27 min/km");
  });

  it('formate les durées comme la maquette', () => {
    const activites = activitesDeDemonstration();

    expect(activites[0]?.metriques.dureeFormatee).toBe('2 h 41');
    expect(activites[1]?.metriques.dureeFormatee).toBe('3 h 58');
    expect(activites[2]?.metriques.dureeFormatee).toBe('3 h 12');
    expect(activites[3]?.metriques.dureeFormatee).toBe('52 min');
    expect(activites[4]?.metriques.dureeFormatee).toBe('1 h 34');
  });

  it('est déterministe à variation constante', () => {
    const premiere = activitesDeDemonstration(0)[0];
    const seconde = activitesDeDemonstration(0)[0];

    expect(premiere?.trace).toEqual(seconde?.trace);
  });

  it('change le tracé quand la variation change', () => {
    const sansVariation = activitesDeDemonstration(0)[0];
    const avecVariation = activitesDeDemonstration(1)[0];

    expect(avecVariation?.trace).not.toEqual(sansVariation?.trace);
  });

  it('conserve le profil altimétrique malgré la variation', () => {
    const sansVariation = activitesDeDemonstration(0)[0];
    const avecVariation = activitesDeDemonstration(1)[0];

    expect(avecVariation?.profilAltimetrique).toEqual(
      sansVariation?.profilAltimetrique,
    );
  });
});

describe('creerDepotDActivitesDeDemonstration', () => {
  it('liste les activités de démonstration', async () => {
    const depot = creerDepotDActivitesDeDemonstration();

    await expect(depot.lister()).resolves.toHaveLength(5);
  });
});
