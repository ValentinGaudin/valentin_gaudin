export const fontStacks = {
  display: "'Bodoni Moda', serif",
  body: "'Space Mono', ui-monospace, monospace",
} as const;

export const canvasFontFamilies = {
  display: '"Bodoni Moda", serif',
  body: '"Space Mono", monospace',
} as const;

export const fontWeights = {
  regular: 400,
  bold: 700,
} as const;

export const googleFontsStylesheetHref =
  'https://fonts.googleapis.com/css2' +
  '?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700' +
  '&family=Space+Mono:wght@400;700' +
  '&display=swap';

export const googleFontsPreconnectOrigins = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
] as const;

export const letterSpacings = {
  eyebrow: '.14em',
  label: '.1em',
  tight: '.06em',
  headline: '-.025em',
} as const;
