import { fontStacks, vermillon } from '@portfolio/design-tokens';

export const couleurs = {
  papier: '#F1ECE4',
  encre: '#111111',
  accent: vermillon,
  encreA1: 'rgba(17,17,17,0.1)',
  encreA14: 'rgba(17,17,17,0.14)',
  encreA16: 'rgba(17,17,17,0.16)',
  encreA2: 'rgba(17,17,17,0.2)',
  encreA22: 'rgba(17,17,17,0.22)',
  encreA25: 'rgba(17,17,17,0.25)',
  encreA28: 'rgba(17,17,17,0.28)',
  encreA3: 'rgba(17,17,17,0.3)',
  encreA4: 'rgba(17,17,17,0.4)',
  encreA45: 'rgba(17,17,17,0.45)',
  encreA5: 'rgba(17,17,17,0.5)',
  encreA55: 'rgba(17,17,17,0.55)',
  encreA6: 'rgba(17,17,17,0.6)',
  encreA7: 'rgba(17,17,17,0.7)',
  encreA72: 'rgba(17,17,17,0.72)',
  accentTresPale: 'rgba(232,68,42,0.05)',
  accentPale: 'rgba(232,68,42,0.06)',
  accentDouce: 'rgba(232,68,42,0.7)',
  papierVoile: 'rgba(241,236,228,0.86)',
  cremeSurSombre: '#F0EBE3',
  cremeSurSombreA75: 'rgba(240,235,227,0.75)',
  cremeSurSombreA4: 'rgba(240,235,227,0.4)',
  cremeSurSombreA35: 'rgba(240,235,227,0.35)',
  cremeSurSombreA16: 'rgba(240,235,227,0.16)',
} as const;

export const polices = {
  titre: fontStacks.display,
  corps: fontStacks.body,
} as const;

export const gouttiere = 24;
export const largeurMaximaleDuContenu = 1360;

export const identifiantsDeTitre = {
  banniere: 'titre-banniere',
  explications: 'titre-explications',
  piedDePage: 'titre-pied-de-page',
} as const;

export const taillesDeRepli = {
  banniere: 56,
  section: 40,
} as const;
