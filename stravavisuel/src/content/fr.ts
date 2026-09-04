export interface EtapeDuGenerateur {
  readonly numero: string;
  readonly titre: string;
}

export interface BlocExplicatif {
  readonly numero: string;
  readonly titre: string;
  readonly texte: string;
}

export interface LienDePiedDePage {
  readonly libelle: string;
  readonly url: string;
}

export const contenuStravaVisuel = {
  meta: {
    titre: 'Strava Visuel — un GPX, un visuel à publier',
    description:
      "Dépose le GPX d'une sortie et récupère un visuel au format story : " +
      'trace, profil et chiffres, en 1080 × 1920.',
    langue: 'fr',
  },

  entete: {
    nom: 'STRAVA VISUEL',
    lienPortfolio: {
      libelle: 'VALENTINGAUDIN.COM ↗',
      url: 'https://valentingaudin.com',
    },
  },

  banniere: {
    surtitre: 'PROTOTYPE — IMPORT GPX',
    titreLignes: ['Une sortie,', 'un visuel à publier.'],
    accroche:
      'Tu déposes le GPX de ta sortie, je lis la trace et les relevés, et ' +
      "j'en sors une image au format story. Dépose un fichier ou prends une " +
      "sortie d'exemple : le rendu est réel, l'export aussi.",
  },

  generateur: {
    etapes: {
      activite: { numero: '01', titre: "L'ACTIVITÉ" },
      miseEnPage: { numero: '02', titre: 'LA MISE EN PAGE' },
      couleurs: { numero: '03', titre: 'LES COULEURS' },
      fond: { numero: '04', titre: 'LE FOND' },
      textes: { numero: '05', titre: 'LES TEXTES' },
      export: { numero: '06', titre: "L'EXPORT" },
    } satisfies Record<string, EtapeDuGenerateur>,

    depot: {
      titre: 'DÉPOSER UN FICHIER .GPX',
      aide: 'Export Strava, Garmin, Komoot — ou clique pour choisir',
    },

    autreTrace: '↻ AUTRE TRACÉ',
    traceImportee: 'TRACÉ RÉEL — IMPORTÉ',

    notesurLesFonds:
      'Les cartes sont de vraies tuiles, la trace est calée dessus en ' +
      'coordonnées réelles. Transparent sort un PNG sans fond, à poser sur ' +
      "n'importe quelle story.",

    champs: {
      titre: 'TITRE',
      lieu: 'LIEU',
      date: 'DATE',
    },

    themes: {
      sombre: 'SOMBRE',
      clair: 'CLAIR',
    },

    fonds: {
      papier: 'PAPIER',
      clair: 'CARTE CLAIRE',
      sombre: 'CARTE SOMBRE',
      topo: 'TOPO',
      satellite: 'SATELLITE',
      transparent: 'TRANSPARENT',
    },

    formats: {
      png: 'PNG',
      jpg: 'JPG',
    },

    telecharger: 'TÉLÉCHARGER ↓',
    exportEnCours: 'EXPORT EN COURS…',
    legendeDeLApercu: 'APERÇU — RENDU RÉEL',
  },

  explications: {
    numero: '02',
    titre: "Comment c'est fait",
    intro:
      "Le prototype ci-dessus tourne sur des données d'exemple. La version " +
      'connectée suit le même chemin.',
    blocs: [
      {
        numero: '01',
        titre: 'IMPORT',
        texte:
          'Un fichier GPX déposé : trace, altitudes et horodatages lus dans ' +
          "le navigateur, rien n'est envoyé.",
      },
      {
        numero: '02',
        titre: 'DESSIN',
        texte:
          'Trace et profil redessinés au trait, seuls ou posés sur une carto ' +
          'claire, sombre ou satellite.',
      },
      {
        numero: '03',
        titre: 'EXPORT',
        texte:
          'Rendu 1080 × 1920 côté client, enregistré dans la galerie ou ' +
          'partagé directement.',
      },
      {
        numero: '04',
        titre: 'STACK',
        texte:
          'React Native, Expo, TypeScript. API Strava et rendu sur canvas.',
      },
    ] satisfies readonly BlocExplicatif[],
  },

  piedDePage: {
    titre: "Envie d'en parler ?",
    courriel: 'contact@valentingaudin.com',
    liens: [
      { libelle: 'valentingaudin.com ↗', url: 'https://valentingaudin.com' },
      { libelle: 'GitHub', url: 'https://github.com/ValentinGaudin' },
    ] satisfies readonly LienDePiedDePage[],
    signature: 'VALENTIN GAUDIN — 2026',
  },
} as const;

export type ContenuStravaVisuel = typeof contenuStravaVisuel;
