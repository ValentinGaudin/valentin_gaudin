export interface SurfaceDeDessin {
  readonly contexte: CanvasRenderingContext2D;
  readonly largeur: number;
  readonly hauteur: number;
}

const rapportPixelsMaximal = 2;

export function ajusterSurface(canvas: HTMLCanvasElement): SurfaceDeDessin | null {
  const rapportPixels = Math.min(rapportPixelsMaximal, window.devicePixelRatio || 1);
  const largeur = canvas.clientWidth;
  const hauteur = canvas.clientHeight;

  if (largeur === 0 || hauteur === 0) {
    return null;
  }

  const largeurCible = Math.round(largeur * rapportPixels);
  const hauteurCible = Math.round(hauteur * rapportPixels);

  if (canvas.width !== largeurCible || canvas.height !== hauteurCible) {
    canvas.width = largeurCible;
    canvas.height = hauteurCible;
  }

  const contexte = canvas.getContext('2d');

  if (contexte === null) {
    return null;
  }

  contexte.setTransform(rapportPixels, 0, 0, rapportPixels, 0, 0);
  contexte.clearRect(0, 0, largeur, hauteur);

  return { contexte, largeur, hauteur };
}

export interface PointEcran {
  readonly x: number;
  readonly y: number;
}

export function tracerPolyligne(
  contexte: CanvasRenderingContext2D,
  points: readonly PointEcran[],
  couleur: string,
): void {
  if (points.length < 2) {
    return;
  }

  contexte.beginPath();

  for (let index = 0; index < points.length; index += 1) {
    const point = points[index];

    if (point === undefined) {
      continue;
    }

    if (index === 0) {
      contexte.moveTo(point.x, point.y);
    } else {
      contexte.lineTo(point.x, point.y);
    }
  }

  contexte.strokeStyle = couleur;
  contexte.stroke();
}
