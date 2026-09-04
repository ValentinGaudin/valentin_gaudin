import { ajusterSurface, tracerPolyligne, type PointEcran } from './canvas-surface';
import { couleurAccent, encreAvecOpacite } from './theme';
import { animerCanvasVisible, mouvementReduitDemande } from './animation';

const rayonPrincipal = 1.55;
const profondeurCamera = 5.4;
const segmentsAutourDeLAxe = 44;
const segmentsAutourDuTube = 18;
const periodiciteDesMeridiensAccentues = 11;
const pasEntreParalleles = 3;
const tourComplet = Math.PI * 2;

function dessinerTore(canvas: HTMLCanvasElement, temps: number): void {
  const surface = ajusterSurface(canvas);

  if (surface === null) {
    return;
  }

  const { contexte, largeur, hauteur } = surface;
  const defilement = mouvementReduitDemande() ? 0 : window.scrollY;
  const avancement = defilement * 0.0022 + temps * 0.06;

  const angleLacet = avancement * 1.4;
  const angleTangage = 0.5 + Math.sin(avancement * 0.8) * 0.45;
  const rayonDuTube = 0.42 + 0.26 * Math.sin(avancement * 1.1);
  const longueurFocale = Math.min(largeur, hauteur) * 0.9;

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
      y: hauteur / 2 - yIncline * echelle,
    };
  };

  const pointDuTore = (angleAxe: number, angleTube: number): PointEcran => {
    const cosinusTube = Math.cos(angleTube);
    const sinusTube = Math.sin(angleTube);
    const distanceALAxe = rayonPrincipal + rayonDuTube * cosinusTube;

    return projeter(
      distanceALAxe * Math.cos(angleAxe),
      rayonDuTube * sinusTube,
      distanceALAxe * Math.sin(angleAxe),
    );
  };

  contexte.lineWidth = 1;

  const accent = couleurAccent();

  for (let indexAxe = 0; indexAxe < segmentsAutourDeLAxe; indexAxe += 1) {
    const angleAxe = (indexAxe / segmentsAutourDeLAxe) * tourComplet;
    const points: PointEcran[] = [];

    for (let indexTube = 0; indexTube <= segmentsAutourDuTube; indexTube += 1) {
      points.push(
        pointDuTore(angleAxe, (indexTube / segmentsAutourDuTube) * tourComplet),
      );
    }

    const meridienAccentue = indexAxe % periodiciteDesMeridiensAccentues === 0;
    tracerPolyligne(
      contexte,
      points,
      meridienAccentue ? accent : encreAvecOpacite(0.26),
    );
  }

  const couleurDesParalleles = encreAvecOpacite(0.16);

  for (
    let indexTube = 0;
    indexTube < segmentsAutourDuTube;
    indexTube += pasEntreParalleles
  ) {
    const angleTube = (indexTube / segmentsAutourDuTube) * tourComplet;
    const points: PointEcran[] = [];

    for (let indexAxe = 0; indexAxe <= segmentsAutourDeLAxe; indexAxe += 1) {
      points.push(
        pointDuTore((indexAxe / segmentsAutourDeLAxe) * tourComplet, angleTube),
      );
    }

    tracerPolyligne(contexte, points, couleurDesParalleles);
  }
}

export function demarrerCanvasTore(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('[data-torus-canvas]');

  if (canvas === null) {
    return;
  }

  animerCanvasVisible(canvas, (temps) => dessinerTore(canvas, temps));
}
