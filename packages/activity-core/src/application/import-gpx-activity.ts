import { XMLParser, XMLValidator } from 'fast-xml-parser';

import type { Activity } from '../domain/activity';
import {
  altitudesLissees,
  calculerRythme,
  denivelePositifEnMetres,
  formaterDuree,
  type ActivityMetrics,
} from '../domain/activity-metrics';
import { profilNormalise } from '../domain/elevation-profile';
import {
  longueurDuTraceEnKilometres,
  sousEchantillonner,
  type GeoPoint,
} from '../domain/geo-point';

export type RaisonEchecImport =
  | 'xml-invalide'
  | 'aucune-trace'
  | 'coordonnees-illisibles'
  | 'trace-trop-courte';

export interface EchecImportGpx {
  readonly statut: 'echec';
  readonly raison: RaisonEchecImport;
  readonly message: string;
}

export interface SuccesImportGpx {
  readonly statut: 'succes';
  readonly activite: Activity;
}

export type ResultatImportGpx = SuccesImportGpx | EchecImportGpx;

export const messagesParRaison: Readonly<Record<RaisonEchecImport, string>> = {
  'xml-invalide': "Ce fichier n'est pas un GPX valide.",
  'aucune-trace': 'Aucune trace trouvée dans ce GPX.',
  'coordonnees-illisibles': 'Coordonnées illisibles dans ce GPX.',
  'trace-trop-courte': 'Cette trace contient moins de deux points.',
};

export const nombreMaximalDePointsPourLeRendu = 1200;
export const libelleTypeImporte = 'GPX IMPORTÉ';

const libellesDActiviteRoulante = [
  'ride',
  'cycling',
  'biking',
  'bike',
  'virtualride',
  'ebikeride',
  'gravelride',
  'mountainbikeride',
  'velo',
  'vélo',
  'cyclisme',
];

interface PointGpx {
  readonly position: GeoPoint;
  readonly altitude: number | null;
  readonly horodatage: number | null;
}

type NoeudXml = Record<string, unknown>;

function estUnObjet(valeur: unknown): valeur is NoeudXml {
  return typeof valeur === 'object' && valeur !== null && !Array.isArray(valeur);
}

function collecterNoeudsNommes(valeur: unknown, nomRecherche: string): NoeudXml[] {
  const trouves: NoeudXml[] = [];

  const explorer = (candidat: unknown): void => {
    if (Array.isArray(candidat)) {
      for (const element of candidat) {
        explorer(element);
      }
      return;
    }

    if (!estUnObjet(candidat)) {
      return;
    }

    for (const [cle, contenu] of Object.entries(candidat)) {
      if (cle === nomRecherche) {
        if (Array.isArray(contenu)) {
          for (const element of contenu) {
            if (estUnObjet(element)) {
              trouves.push(element);
            }
          }
        } else if (estUnObjet(contenu)) {
          trouves.push(contenu);
        }
        continue;
      }

      explorer(contenu);
    }
  };

  explorer(valeur);

  return trouves;
}

function premierTexteNomme(valeur: unknown, nomRecherche: string): string | null {
  let trouve: string | null = null;

  const explorer = (candidat: unknown): void => {
    if (trouve !== null) {
      return;
    }

    if (Array.isArray(candidat)) {
      for (const element of candidat) {
        explorer(element);
      }
      return;
    }

    if (!estUnObjet(candidat)) {
      return;
    }

    for (const [cle, contenu] of Object.entries(candidat)) {
      if (trouve !== null) {
        return;
      }

      if (cle === nomRecherche && (typeof contenu === 'string' || typeof contenu === 'number')) {
        const texte = String(contenu).trim();

        if (texte !== '') {
          trouve = texte;
          return;
        }
        continue;
      }

      explorer(contenu);
    }
  };

  explorer(valeur);

  return trouve;
}

function nombreDepuis(valeur: unknown): number | null {
  if (typeof valeur === 'number') {
    return Number.isFinite(valeur) ? valeur : null;
  }

  if (typeof valeur === 'string') {
    const analyse = Number.parseFloat(valeur);
    return Number.isFinite(analyse) ? analyse : null;
  }

  return null;
}

function horodatageDepuis(valeur: unknown): number | null {
  if (typeof valeur !== 'string' && typeof valeur !== 'number') {
    return null;
  }

  const instant = new Date(String(valeur)).getTime();

  return Number.isNaN(instant) ? null : instant;
}

function pointsDepuisNoeuds(noeuds: readonly NoeudXml[]): PointGpx[] {
  const points: PointGpx[] = [];

  for (const noeud of noeuds) {
    const latitude = nombreDepuis(noeud['@lat']);
    const longitude = nombreDepuis(noeud['@lon']);

    if (latitude === null || longitude === null) {
      continue;
    }

    points.push({
      position: { latitude, longitude },
      altitude: nombreDepuis(noeud['ele']),
      horodatage: horodatageDepuis(noeud['time']),
    });
  }

  return points;
}

function dureeEnSecondesDepuis(points: readonly PointGpx[]): number {
  const horodatages = points
    .map((point) => point.horodatage)
    .filter((horodatage): horodatage is number => horodatage !== null);

  if (horodatages.length < 2) {
    return 0;
  }

  const premier = Math.min(...horodatages);
  const dernier = Math.max(...horodatages);

  return Math.max(0, (dernier - premier) / 1000);
}

function activiteRoulante(typeDeclare: string | null): boolean {
  if (typeDeclare === null) {
    return false;
  }

  const normalise = typeDeclare.toLowerCase().replace(/[\s_-]/g, '');

  return libellesDActiviteRoulante.some((libelle) =>
    normalise.includes(libelle.replace(/[\s_-]/g, '')),
  );
}

function nomDActivite(nomDeclare: string | null, nomDeFichier: string): string {
  const nomRetenu =
    nomDeclare ??
    nomDeFichier.replace(/\.gpx$/i, '').replace(/[-_]+/g, ' ').trim();

  return nomRetenu.slice(0, 60);
}

function dateLocalisee(points: readonly PointGpx[]): string {
  const premierHorodatage = points.find((point) => point.horodatage !== null)
    ?.horodatage;

  if (premierHorodatage === undefined || premierHorodatage === null) {
    return '';
  }

  return new Date(premierHorodatage).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function echec(raison: RaisonEchecImport): EchecImportGpx {
  return { statut: 'echec', raison, message: messagesParRaison[raison] };
}

export function importerActiviteDepuisGpx(
  contenuGpx: string,
  nomDeFichier: string,
  identifiant: string,
): ResultatImportGpx {
  const validation = XMLValidator.validate(contenuGpx);

  if (validation !== true) {
    return echec('xml-invalide');
  }

  const analyseur = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@',
    trimValues: true,
  });

  let documentAnalyse: unknown;

  try {
    documentAnalyse = analyseur.parse(contenuGpx);
  } catch {
    return echec('xml-invalide');
  }

  const noeudsDeTrace = collecterNoeudsNommes(documentAnalyse, 'trkpt');
  const noeudsRetenus =
    noeudsDeTrace.length > 0
      ? noeudsDeTrace
      : collecterNoeudsNommes(documentAnalyse, 'rtept');

  if (noeudsRetenus.length === 0) {
    return echec('aucune-trace');
  }

  if (noeudsRetenus.length < 2) {
    return echec('trace-trop-courte');
  }

  const pointsComplets = pointsDepuisNoeuds(noeudsRetenus);

  if (pointsComplets.length < 2) {
    return echec('coordonnees-illisibles');
  }

  const positionsCompletes = pointsComplets.map((point) => point.position);
  const altitudesCompletes = pointsComplets.map((point) => point.altitude);

  const distanceEnKilometres = longueurDuTraceEnKilometres(positionsCompletes);
  const denivele = denivelePositifEnMetres(altitudesLissees(altitudesCompletes));
  const dureeEnSecondes = dureeEnSecondesDepuis(pointsComplets);

  const noeudsDePiste = collecterNoeudsNommes(documentAnalyse, 'trk');
  const sourceDesMetadonnees =
    noeudsDePiste.length > 0 ? noeudsDePiste : [documentAnalyse];

  const typeDeclare = premierTexteNomme(sourceDesMetadonnees, 'type');
  const nomDeclare = premierTexteNomme(sourceDesMetadonnees, 'name');

  const metriques: ActivityMetrics = {
    distanceEnKilometres: Math.round(distanceEnKilometres * 10) / 10,
    denivelePositifEnMetres: Math.round(denivele),
    dureeEnSecondes,
    dureeFormatee: formaterDuree(dureeEnSecondes),
    rythme: calculerRythme(
      distanceEnKilometres,
      dureeEnSecondes,
      activiteRoulante(typeDeclare),
    ),
  };

  const pointsPourLeRendu = sousEchantillonner(
    pointsComplets,
    nombreMaximalDePointsPourLeRendu,
  );

  const activite: Activity = {
    identifiant,
    nom: nomDActivite(nomDeclare, nomDeFichier),
    lieu: '',
    date: dateLocalisee(pointsComplets),
    libelleDuType: libelleTypeImporte,
    metriques,
    trace: pointsPourLeRendu.map((point) => point.position),
    profilAltimetrique: profilNormalise(
      pointsPourLeRendu.map((point) => point.altitude),
    ),
    provenance: 'gpx',
  };

  return { statut: 'succes', activite };
}
