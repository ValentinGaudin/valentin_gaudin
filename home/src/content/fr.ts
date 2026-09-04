import type { SiteContent } from './types';

const stravaVisuelUrl = 'https://stravavisuel.valentingaudin.com';

export const contenuFrancais: SiteContent = {
  meta: {
    locale: 'fr',
    title: 'Valentin Gaudin — applications mobiles',
    description:
      "Développeur freelance d'applications mobiles React Native et Expo. " +
      'Avant : dix ans chez les chasseurs alpins.',
    canonicalUrl: 'https://valentingaudin.com/',
    authorName: 'Valentin Gaudin',
  },

  header: {
    wordmark: 'VALENTIN GAUDIN',
    wordmarkHref: '#top',
    languages: {
      activeLabel: 'FR',
      alternateLabel: 'EN',
      alternateHref: null,
    },
  },

  navigation: {
    ariaLabel: 'Navigation',
    items: [
      { sectionId: 'top', label: 'HOME', title: 'Accueil', icon: 'maison' },
      { sectionId: 'projet', label: 'PROJET', title: 'Projet', icon: 'epingle' },
      {
        sectionId: 'experimentations',
        label: 'LABO',
        title: 'Expérimentations',
        icon: 'grille',
      },
      { sectionId: 'stack', label: 'STACK', title: 'Stack', icon: 'couches' },
      { sectionId: 'contact', label: 'CONTACT', title: 'Contact', icon: 'enveloppe' },
    ],
    socialLinks: [
      {
        label: 'GitHub',
        href: 'https://github.com/ValentinGaudin',
        icon: 'github',
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/gaudinvalentin/',
        icon: 'linkedin',
      },
    ],
  },

  hero: {
    sectionId: 'top',
    availability: 'FREELANCE — DISPONIBLE',
    headlineLines: ['Je fais des', 'applications', 'mobiles.'],
    subline: 'Avant : dix ans chez les chasseurs alpins.',
    scrollHint: '↓ FAIRE DÉFILER',
    year: '2026',
  },

  project: {
    sectionId: 'projet',
    sectionNumber: '01',
    title: 'Le projet du moment',
    domainLabel: 'STRAVAVISUEL.VALENTINGAUDIN.COM',
    subtitle: 'Un GPX, un visuel à publier',
    description:
      "Un projet à part, sur son propre domaine. Je dépose le GPX d'une sortie, " +
      "je récupère la trace, le dénivelé et les chiffres, et j'en sors une image " +
      'propre au format story — au lieu du fond gris par défaut.',
    steps: [
      { number: '01', text: 'Un fichier GPX déposé, lu dans le navigateur' },
      {
        number: '02',
        text: 'Trace et profil redessinés, carto claire, sombre ou satellite',
      },
      { number: '03', text: 'Export 1080×1920, prêt pour Instagram ou TikTok' },
    ],
    primaryAction: {
      label: 'OUVRIR LE SITE ↗',
      href: stravaVisuelUrl,
      opensInNewTab: false,
    },
    secondaryAction: {
      label: 'Aller au générateur',
      href: `${stravaVisuelUrl}/#generateur`,
      opensInNewTab: false,
    },
    status: 'EN CONSTRUCTION',
    previewCaptionLines: ['CAPTURE DU GÉNÉRATEUR', '1080 × 1920 — À FOURNIR'],
  },

  lab: {
    sectionId: 'experimentations',
    sectionNumber: '02',
    title: 'Expérimentations',
    intro: 'Des choses que je construis pour apprendre, sans client derrière.',
    experiments: [
      {
        number: '01',
        title: 'Strava Visuel',
        description:
          'Un GPX déposé, un visuel story en sortie. Projet indépendant.',
        status: 'EN COURS · REACT NATIVE',
        mockup: 'generateur-strava',
        isPlaceholder: false,
      },
      {
        number: '02',
        title: 'Emplacement libre',
        description: 'Titre, une phrase, la techno. Dis-moi quoi mettre.',
        status: 'À REMPLIR',
        mockup: 'cartes-vides',
        isPlaceholder: true,
      },
      {
        number: '03',
        title: 'Emplacement libre',
        description: 'Titre, une phrase, la techno. Dis-moi quoi mettre.',
        status: 'À REMPLIR',
        mockup: 'liste-vide',
        isPlaceholder: true,
      },
    ],
    swipeHint: 'GLISSE →',
    slideAriaLabelPrefix: 'Écran',
    stravaMockup: {
      statusTime: '9:41',
      appName: 'STRAVA VISUEL',
      sourceTag: 'GPX',
      stats: [
        { label: 'DIST', value: '18,4' },
        { label: 'D+', value: '1240' },
        { label: 'TEMPS', value: '2h41' },
      ],
      actionLabel: 'EXPORTER 1080 × 1920',
    },
    placeholderMockup: {
      statusTime: '9:41',
      actionLabel: 'À DÉFINIR',
    },
  },

  stack: {
    sectionId: 'stack',
    sectionNumber: '03',
    title: 'Stack',
    intro: 'Ce avec quoi je travaille vraiment, pas une liste de logos.',
    groups: [
      {
        number: '01',
        title: 'MOBILE',
        technologies: ['React Native', 'Expo', 'TypeScript', 'Builds & stores'],
      },
      {
        number: '02',
        title: 'WEB',
        technologies: ['React', 'Next.js', 'Tailwind', 'HTML / CSS'],
      },
      {
        number: '03',
        title: 'BACK & DONNÉES',
        technologies: ['Node', 'PHP / Symfony', 'MySQL', 'REST'],
      },
      {
        number: '04',
        title: 'OUTILS',
        technologies: ['Git & GitHub', 'Figma', 'CI / releases'],
      },
    ],
    canvasCaption: 'SE DÉFORME AU DÉFILEMENT',
  },

  contact: {
    sectionId: 'contact',
    sectionNumber: '04',
    title: 'Travaillons ensemble',
    intro:
      'Une application à construire, une existante à reprendre : écris-moi, je réponds.',
    emailAddress: 'contact@valentingaudin.com',
    links: [
      {
        label: 'GitHub',
        href: 'https://github.com/ValentinGaudin',
        opensInNewTab: true,
      },
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/gaudinvalentin/',
        opensInNewTab: true,
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/valentin_gdn_/',
        opensInNewTab: true,
      },
    ],
    signature: 'VALENTIN GAUDIN — 2026',
  },
};
