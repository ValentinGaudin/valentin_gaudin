import type {
  FontSpec,
  ImageFilter,
  PosterCanvas,
} from '@portfolio/activity-core';
import { canvasFontFamilies } from '@portfolio/design-tokens';

export type ResolveurDeTuile = (url: string) => CanvasImageSource | null;

const tourComplet = Math.PI * 2;

function enPoliceCss(police: FontSpec): string {
  return `${police.weight} ${police.sizeInPixels}px ${canvasFontFamilies[police.family]}`;
}

function enFiltreCss(filtre: ImageFilter | null): string {
  if (filtre === null) {
    return 'none';
  }

  const composantes: string[] = [];

  if (filtre.grayscale !== undefined) {
    composantes.push(`grayscale(${filtre.grayscale})`);
  }
  if (filtre.invert !== undefined) {
    composantes.push(`invert(${filtre.invert})`);
  }
  if (filtre.brightness !== undefined) {
    composantes.push(`brightness(${filtre.brightness})`);
  }
  if (filtre.contrast !== undefined) {
    composantes.push(`contrast(${filtre.contrast})`);
  }
  if (filtre.saturate !== undefined) {
    composantes.push(`saturate(${filtre.saturate})`);
  }

  return composantes.length === 0 ? 'none' : composantes.join(' ');
}

export function creerCanvasDeVisuel(
  contexte: CanvasRenderingContext2D,
  resoudreLaTuile: ResolveurDeTuile,
): PosterCanvas {
  contexte.lineJoin = 'round';
  contexte.lineCap = 'round';

  const tracerChemin = (points: readonly { x: number; y: number }[]): void => {
    contexte.beginPath();

    points.forEach((point, index) => {
      if (index === 0) {
        contexte.moveTo(point.x, point.y);
      } else {
        contexte.lineTo(point.x, point.y);
      }
    });
  };

  return {
    fillRect(cadre, couleur) {
      contexte.fillStyle = couleur;
      contexte.fillRect(cadre.x, cadre.y, cadre.width, cadre.height);
    },

    fillCircle(centre, rayon, couleur) {
      contexte.fillStyle = couleur;
      contexte.beginPath();
      contexte.arc(centre.x, centre.y, rayon, 0, tourComplet);
      contexte.fill();
    },

    strokePolyline(points, epaisseur, couleur) {
      if (points.length < 2) {
        return;
      }

      contexte.lineWidth = epaisseur;
      contexte.strokeStyle = couleur;
      tracerChemin(points);
      contexte.stroke();
    },

    fillPolygon(points, couleur) {
      if (points.length < 3) {
        return;
      }

      tracerChemin(points);
      contexte.closePath();
      contexte.fillStyle = couleur;
      contexte.fill();
    },

    fillText(texte, origine, police, couleur) {
      contexte.font = enPoliceCss(police);
      contexte.fillStyle = couleur;
      contexte.fillText(texte, origine.x, origine.y);
    },

    measureTextWidth(texte, police) {
      contexte.font = enPoliceCss(police);
      return contexte.measureText(texte).width;
    },

    drawTile(tuile, cadre, filtre) {
      const image = resoudreLaTuile(tuile.url);

      if (image === null) {
        return;
      }

      const filtreAnterieur = contexte.filter;
      contexte.filter = enFiltreCss(filtre);
      contexte.drawImage(image, cadre.x, cadre.y, cadre.width, cadre.height);
      contexte.filter = filtreAnterieur;
    },

    withClip(cadre, dessiner) {
      contexte.save();
      contexte.beginPath();
      contexte.rect(cadre.x, cadre.y, cadre.width, cadre.height);
      contexte.clip();
      dessiner();
      contexte.restore();
    },
  };
}
