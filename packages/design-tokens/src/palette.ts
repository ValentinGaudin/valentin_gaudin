export type ThemeName = 'clair' | 'sombre';

export interface SurfaceColors {
  readonly paper: string;
  readonly paperRaised: string;
  readonly ink: string;
  readonly bezel: string;
  readonly dock: string;
}

export const surfaceColorsByTheme: Readonly<Record<ThemeName, SurfaceColors>> = {
  clair: {
    paper: '#F1ECE4',
    paperRaised: '#EAE4DA',
    ink: '#111111',
    bezel: '#191919',
    dock: 'rgba(241,236,228,.82)',
  },
  sombre: {
    paper: '#12120F',
    paperRaised: '#1B1B18',
    ink: '#F0EBE3',
    bezel: '#2B2B26',
    dock: 'rgba(26,26,23,.84)',
  },
};

export const inkChannelsByTheme: Readonly<Record<ThemeName, string>> = {
  clair: '17,17,17',
  sombre: '240,235,227',
};

export const inkOpacityStepNames = [
  'a055', 'a07', 'a09', 'a1', 'a12', 'a14', 'a16', 'a18', 'a2', 'a28', 'a3',
  'a32', 'a35', 'a4', 'a42', 'a45', 'a5', 'a55', 'a6', 'a62', 'a72', 'a75',
] as const;

export type InkOpacityStepName = (typeof inkOpacityStepNames)[number];

export const inkOpacityByTheme: Readonly<
  Record<ThemeName, Readonly<Record<InkOpacityStepName, number>>>
> = {
  clair: {
    a055: 0.055, a07: 0.07, a09: 0.09, a1: 0.1, a12: 0.12, a14: 0.14,
    a16: 0.16, a18: 0.18, a2: 0.2, a28: 0.28, a3: 0.3, a32: 0.32,
    a35: 0.35, a4: 0.4, a42: 0.42, a45: 0.45, a5: 0.5, a55: 0.55,
    a6: 0.6, a62: 0.62, a72: 0.72, a75: 0.75,
  },
  sombre: {
    a055: 0.082, a07: 0.098, a09: 0.121, a1: 0.132, a12: 0.154, a14: 0.177,
    a16: 0.199, a18: 0.222, a2: 0.244, a28: 0.334, a3: 0.356, a32: 0.378,
    a35: 0.412, a4: 0.468, a42: 0.49, a45: 0.524, a5: 0.58, a55: 0.636,
    a6: 0.692, a62: 0.714, a72: 0.826, a75: 0.86,
  },
};

export function inkWithOpacity(theme: ThemeName, step: InkOpacityStepName): string {
  return `rgba(${inkChannelsByTheme[theme]},${inkOpacityByTheme[theme][step]})`;
}

export interface AccentChoice {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export const vermillon = '#E8442A';

export const posterAccentChoices: readonly AccentChoice[] = [
  { key: 'vermillon', label: 'Vermillon', value: vermillon },
  { key: 'bleu', label: 'Bleu', value: '#2570CE' },
  { key: 'ocre', label: 'Ocre', value: '#E9B44C' },
  { key: 'creme', label: 'Crème', value: '#F1ECE4' },
];

export const posterInkFallbackWhenAccentMatchesPaper = '#111111';
