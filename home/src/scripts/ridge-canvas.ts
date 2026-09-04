import { ajusterSurface, tracerPolyligne, type PointEcran } from './canvas-surface';
import { accentAvecOpacite, encreAvecOpacite } from './theme';
import { animerCanvasVisible, mouvementReduitDemande } from './animation';

const nombreDeColonnes = 96;
const nombreDeRangees = 30;
const profondeurCamera = 6.2;
const opaciteAccentDesAretes = 0.302;
const pasEntreAretesLongitudinales = 8;

interface PositionPointeur {
  x: number;
  y: number;
}

const positionPointeur: PositionPointeur = { x: Number.NaN, y: Number.NaN };

let ecouteurPointeurInstalle = false;

function installerSuiviPointeur(): void {
  if (ecouteurPointeurInstalle) {
    return;
  }

  window.addEventListener(
    'pointermove',
    (evenement: PointerEvent) => {
      positionPointeur.x = evenement.clientX;
      positionPointeur.y = evenement.clientY;
    },
    { passive: true },
  );

  ecouteurPointeurInstalle = true;
}

function decalageNormaliseDuPointeur(
  canvas: HTMLCanvasElement,
  largeur: number,
  hauteur: number,
): PointEcran {
  if (mouvementReduitDemande() || Number.isNaN(positionPointeur.x)) {
    return { x: 0, y: 0 };
  }

  const cadre = canvas.getBoundingClientRect();
  const pointeurSurLeCanvas =
    positionPointeur.x > cadre.left &&
    positionPointeur.x < cadre.right &&
    positionPointeur.y > cadre.top &&
    positionPointeur.y < cadre.bottom;

  if (!pointeurSurLeCanvas) {
    return { x: 0, y: 0 };
  }

  return {
    x: (positionPointeur.x - cadre.left) / largeur - 0.5,
    y: (positionPointeur.y - cadre.top) / hauteur - 0.5,
  };
}

function hauteurDuRelief(x: number, z: number, temps: number): number {
  const enveloppe = Math.exp(-(x * x * 0.016 + z * z * 0.05));
  const crete = (phase: number, durete: number): number =>
    Math.pow(Math.abs(Math.sin(phase)), durete);

  const sommeDesCretes =
    crete(x * 0.95 + temps * 0.11, 3.2) * 0.62 +
    crete(z * 0.8 - temps * 0.08, 2.8) * 0.3 +
    crete(x * 2.6 + z * 1.4, 3.4) * 0.18 +
    crete(x * 5.2 - z * 2.2, 4) * 0.07;

  return sommeDesCretes * enveloppe * 1.6 + 0.04;
}

function dessinerRelief(canvas: HTMLCanvasElement, temps: number): void {
  const surface = ajusterSurface(canvas);

  if (surface === null) {
    return;
  }

  const { contexte, largeur, hauteur } = surface;
  const decalagePointeur = decalageNormaliseDuPointeur(canvas, largeur, hauteur);

  const angleTangage = 0.2 + decalagePointeur.y * 0.14;
  const angleLacet = Math.PI + temps * 0.07 + decalagePointeur.x * 0.5;
  const longueurFocale = Math.max(430, largeur * 0.5);

  const cosinusLacet = Math.cos(angleLacet);
  const sinusLacet = Math.sin(angleLacet);
  const cosinusTangage = Math.cos(angleTangage);
  const sinusTangage = Math.sin(angleTangage);

  const projeter = (x: number, y: number, z: number): PointEcran => {
    const xPivote = x * cosinusLacet - z * sinusLacet;
    const zPivote = x * sinusLacet + z * cosinusLacet;
    const yIncline = y * cosinusTangage - zPivote * sinusTangage;
    const zIncline = y * sinusTangage + zPivote * cosinusTangage;
    const distance = Math.max(0.4, zIncline + profondeurCamera);
    const echelle = longueurFocale / distance;

    return {
      x: largeur / 2 + xPivote * echelle,
      y: hauteur * 0.92 - yIncline * echelle,
    };
  };

  contexte.lineWidth = 1;

  for (let rangee = 0; rangee <= nombreDeRangees; rangee += 1) {
    const z = -4.4 + (rangee * 8.8) / nombreDeRangees;
    const points: PointEcran[] = [];

    for (let colonne = 0; colonne <= nombreDeColonnes; colonne += 1) {
      const x = -9 + (colonne * 18) / nombreDeColonnes;
      points.push(projeter(x, hauteurDuRelief(x, z, temps), z));
    }

    const opacite = 0.035 + 0.2 * (rangee / nombreDeRangees);
    tracerPolyligne(contexte, points, encreAvecOpacite(opacite));
  }

  const couleurDesAretes = accentAvecOpacite(opaciteAccentDesAretes);

  for (
    let colonne = 0;
    colonne <= nombreDeColonnes;
    colonne += pasEntreAretesLongitudinales
  ) {
    const x = -9 + (colonne * 18) / nombreDeColonnes;
    const points: PointEcran[] = [];

    for (let rangee = 0; rangee <= nombreDeRangees; rangee += 1) {
      const z = -4.4 + (rangee * 8.8) / nombreDeRangees;
      points.push(projeter(x, hauteurDuRelief(x, z, temps), z));
    }

    tracerPolyligne(contexte, points, couleurDesAretes);
  }
}

export function demarrerCanvasRelief(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-ridge-canvas]');

  if (canvas === null) {
    return;
  }

  installerSuiviPointeur();
  animerCanvasVisible(canvas, (temps) => dessinerRelief(canvas, temps));
}
