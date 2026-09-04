import { describe, expect, it } from 'vitest';

import {
  importerActiviteDepuisGpx,
  libelleTypeImporte,
  nombreMaximalDePointsPourLeRendu,
} from '../src/application/import-gpx-activity';
import { nombreDePointsDuProfil } from '../src/domain/elevation-profile';

interface PointDeTest {
  readonly lat: number;
  readonly lon: number;
  readonly ele?: number;
  readonly time?: string;
}

function gpxAvec(
  points: readonly PointDeTest[],
  options: {
    readonly nomDePiste?: string;
    readonly nomDeMetadonnees?: string;
    readonly type?: string;
    readonly baliseDePoint?: 'trkpt' | 'rtept';
  } = {},
): string {
  const balise = options.baliseDePoint ?? 'trkpt';

  const corpsDesPoints = points
    .map((point) => {
      const altitude = point.ele === undefined ? '' : `<ele>${point.ele}</ele>`;
      const instant = point.time === undefined ? '' : `<time>${point.time}</time>`;
      return `<${balise} lat="${point.lat}" lon="${point.lon}">${altitude}${instant}</${balise}>`;
    })
    .join('');

  const metadonnees =
    options.nomDeMetadonnees === undefined
      ? ''
      : `<metadata><name>${options.nomDeMetadonnees}</name></metadata>`;

  const nomDePiste =
    options.nomDePiste === undefined ? '' : `<name>${options.nomDePiste}</name>`;

  const type = options.type === undefined ? '' : `<type>${options.type}</type>`;

  const conteneur =
    balise === 'trkpt'
      ? `<trk>${nomDePiste}${type}<trkseg>${corpsDesPoints}</trkseg></trk>`
      : `<rte>${nomDePiste}${type}${corpsDesPoints}</rte>`;

  return `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="test">${metadonnees}${conteneur}</gpx>`;
}

const deuxPointsSurUnDegre: readonly PointDeTest[] = [
  { lat: 45, lon: 5, ele: 1000, time: '2026-08-24T08:00:00Z' },
  { lat: 46, lon: 5, ele: 1000, time: '2026-08-24T10:00:00Z' },
];

describe('importerActiviteDepuisGpx — échecs', () => {
  it('refuse un XML mal formé', () => {
    const resultat = importerActiviteDepuisGpx('<gpx><trk>', 'casse.gpx', 'test');

    expect(resultat.statut).toBe('echec');
    if (resultat.statut === 'echec') {
      expect(resultat.raison).toBe('xml-invalide');
      expect(resultat.message).toContain('GPX valide');
    }
  });

  it('refuse un fichier qui ne contient pas de texte XML', () => {
    const resultat = importerActiviteDepuisGpx(
      'ceci est un fichier texte',
      'notes.gpx',
      'test',
    );

    expect(resultat.statut).toBe('echec');
  });

  it('refuse un GPX sans point de trace', () => {
    const resultat = importerActiviteDepuisGpx(
      '<?xml version="1.0"?><gpx><trk><trkseg></trkseg></trk></gpx>',
      'vide.gpx',
      'test',
    );

    expect(resultat.statut).toBe('echec');
    if (resultat.statut === 'echec') {
      expect(resultat.raison).toBe('aucune-trace');
    }
  });

  it('refuse une trace à un seul point', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec([{ lat: 45, lon: 5 }]),
      'unique.gpx',
      'test',
    );

    expect(resultat.statut).toBe('echec');
    if (resultat.statut === 'echec') {
      expect(resultat.raison).toBe('trace-trop-courte');
    }
  });

  it('refuse des coordonnées illisibles', () => {
    const resultat = importerActiviteDepuisGpx(
      '<?xml version="1.0"?><gpx><trk><trkseg>' +
        '<trkpt lat="nord" lon="est"></trkpt>' +
        '<trkpt lat="sud" lon="ouest"></trkpt>' +
        '</trkseg></trk></gpx>',
      'illisible.gpx',
      'test',
    );

    expect(resultat.statut).toBe('echec');
    if (resultat.statut === 'echec') {
      expect(resultat.raison).toBe('coordonnees-illisibles');
    }
  });
});

describe('importerActiviteDepuisGpx — succès', () => {
  it('calcule la distance depuis les coordonnées', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre),
      'sortie.gpx',
      'test',
    );

    expect(resultat.statut).toBe('succes');
    if (resultat.statut !== 'succes') return;

    expect(resultat.activite.metriques.distanceEnKilometres).toBeCloseTo(111.2, 0);
  });

  it('calcule la durée depuis les horodatages', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre),
      'sortie.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.metriques.dureeEnSecondes).toBe(7200);
    expect(resultat.activite.metriques.dureeFormatee).toBe('2 h 00');
  });

  it('préfère le nom de la piste à celui des métadonnées', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre, {
        nomDeMetadonnees: 'Export Garmin Connect',
        nomDePiste: 'Tour du Grand Colon',
      }),
      'sortie.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.nom).toBe('Tour du Grand Colon');
  });

  it('se rabat sur le nom de fichier nettoyé', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre),
      'sortie_longue-chartreuse.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.nom).toBe('sortie longue chartreuse');
  });

  it('tronque un nom trop long', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre, { nomDePiste: 'a'.repeat(200) }),
      'sortie.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.nom).toHaveLength(60);
  });

  it('lit une trace déclarée en rtept', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre, { baliseDePoint: 'rtept' }),
      'itineraire.gpx',
      'test',
    );

    expect(resultat.statut).toBe('succes');
    if (resultat.statut !== 'succes') return;

    expect(resultat.activite.trace).toHaveLength(2);
  });

  it('affiche une vitesse quand le GPX déclare une activité roulante', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre, { type: 'cycling' }),
      'sortie.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.metriques.rythme.libelle).toBe('MOYENNE');
  });

  it('reste en allure pour une course', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec([
        { lat: 45, lon: 5, time: '2026-08-24T08:00:00Z' },
        { lat: 45.09, lon: 5, time: '2026-08-24T09:00:00Z' },
      ], { type: 'running' }),
      'sortie.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.metriques.rythme.libelle).toBe('ALLURE');
  });

  it('tolère un GPX sans altitude', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec([
        { lat: 45, lon: 5, time: '2026-08-24T08:00:00Z' },
        { lat: 45.1, lon: 5, time: '2026-08-24T09:00:00Z' },
      ]),
      'sans-altitude.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.metriques.denivelePositifEnMetres).toBe(0);
    expect(resultat.activite.profilAltimetrique).toHaveLength(nombreDePointsDuProfil);
  });

  it('tolère un GPX sans horodatage', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec([
        { lat: 45, lon: 5, ele: 1000 },
        { lat: 45.1, lon: 5, ele: 1200 },
      ]),
      'sans-temps.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.metriques.dureeEnSecondes).toBe(0);
    expect(resultat.activite.date).toBe('');
  });

  it('marque la provenance et le libellé de type', () => {
    const resultat = importerActiviteDepuisGpx(
      gpxAvec(deuxPointsSurUnDegre),
      'sortie.gpx',
      'identifiant-attendu',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.provenance).toBe('gpx');
    expect(resultat.activite.libelleDuType).toBe(libelleTypeImporte);
    expect(resultat.activite.identifiant).toBe('identifiant-attendu');
  });

  it('agrège plusieurs segments de trace', () => {
    const gpx =
      '<?xml version="1.0"?><gpx><trk>' +
      '<trkseg><trkpt lat="45" lon="5"></trkpt><trkpt lat="45.1" lon="5"></trkpt></trkseg>' +
      '<trkseg><trkpt lat="45.2" lon="5"></trkpt><trkpt lat="45.3" lon="5"></trkpt></trkseg>' +
      '</trk></gpx>';

    const resultat = importerActiviteDepuisGpx(gpx, 'deux-segments.gpx', 'test');

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.trace).toHaveLength(4);
  });

  it('borne la trace rendue au nombre maximal de points', () => {
    const points = Array.from({ length: 5000 }, (_, index) => ({
      lat: 45 + index * 0.0001,
      lon: 5,
      ele: 1000 + index * 0.1,
    }));

    const resultat = importerActiviteDepuisGpx(
      gpxAvec(points),
      'longue.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    expect(resultat.activite.trace.length).toBeLessThanOrEqual(
      nombreMaximalDePointsPourLeRendu + 1,
    );
  });

  it('mesure la distance sur les points complets, pas sur la trace réduite', () => {
    const points = Array.from({ length: 5000 }, (_, index) => ({
      lat: 45 + index * 0.0002,
      lon: 5 + (index % 2 === 0 ? 0 : 0.0004),
    }));

    const resultat = importerActiviteDepuisGpx(
      gpxAvec(points),
      'sinueuse.gpx',
      'test',
    );

    if (resultat.statut !== 'succes') throw new Error('import attendu en succès');

    const longueurDeLaTraceReduite = resultat.activite.trace.length;

    expect(longueurDeLaTraceReduite).toBeLessThan(points.length);
    expect(resultat.activite.metriques.distanceEnKilometres).toBeGreaterThan(111);
  });
});
