import type { SiteMeta } from './types';

export interface NotFoundContent {
  readonly meta: SiteMeta;
  readonly code: string;
  readonly title: string;
  readonly message: string;
  readonly homeLabel: string;
}

export const contenuPageIntrouvable: NotFoundContent = {
  meta: {
    locale: 'fr',
    title: 'Page introuvable — Valentin Gaudin',
    description: "Cette adresse ne correspond à aucune page du site.",
    canonicalUrl: 'https://valentingaudin.com/404',
    authorName: 'Valentin Gaudin',
  },
  code: '404',
  title: 'Rien à cette adresse',
  message:
    "Le lien est peut-être ancien, ou mal recopié. Tout le site tient sur une " +
    'seule page — celle-ci.',
  homeLabel: 'RETOUR À L’ACCUEIL ↗',
};
