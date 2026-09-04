const canauxEncreClaire = '17,17,17';
const canauxEncreSombre = '240,235,227';
const accentParDefaut = '#E8442A';

export function themeSombreActif(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function canauxEncre(): string {
  return themeSombreActif() ? canauxEncreSombre : canauxEncreClaire;
}

export function encreAvecOpacite(opacite: number): string {
  return `rgba(${canauxEncre()},${opacite.toFixed(3)})`;
}

export function couleurAccent(): string {
  const valeurDeclaree = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim();

  return valeurDeclaree === '' ? accentParDefaut : valeurDeclaree;
}

export function accentAvecOpacite(opacite: number): string {
  const accent = couleurAccent();
  const composantesHexadecimales = /^#([0-9a-f]{6})$/i.exec(accent);

  if (composantesHexadecimales === null) {
    return accent;
  }

  const groupe = composantesHexadecimales[1];

  if (groupe === undefined) {
    return accent;
  }

  const rouge = Number.parseInt(groupe.slice(0, 2), 16);
  const vert = Number.parseInt(groupe.slice(2, 4), 16);
  const bleu = Number.parseInt(groupe.slice(4, 6), 16);

  return `rgba(${rouge},${vert},${bleu},${opacite})`;
}
