import type {
  FontSpec,
  ImageFilter,
  Point,
  PosterCanvas,
  Rect,
  TileImage,
} from '../src/ports/poster-canvas';

export interface AppelDeTexte {
  readonly texte: string;
  readonly origine: Point;
  readonly police: FontSpec;
  readonly couleur: string;
}

export interface AppelDeRectangle {
  readonly cadre: Rect;
  readonly couleur: string;
}

export interface AppelDeCercle {
  readonly centre: Point;
  readonly rayon: number;
  readonly couleur: string;
}

export interface AppelDePolyligne {
  readonly points: readonly Point[];
  readonly epaisseur: number;
  readonly couleur: string;
}

export interface AppelDeTuile {
  readonly tuile: TileImage;
  readonly cadre: Rect;
  readonly filtre: ImageFilter | null;
}

export interface CanvasEspion extends PosterCanvas {
  readonly textes: readonly AppelDeTexte[];
  readonly rectangles: readonly AppelDeRectangle[];
  readonly cercles: readonly AppelDeCercle[];
  readonly polylignes: readonly AppelDePolyligne[];
  readonly polygones: readonly AppelDePolyligne[];
  readonly tuiles: readonly AppelDeTuile[];
  readonly cadresDeDecoupe: readonly Rect[];
  texteConcatene(): string;
}

const largeurRelativeParCaractere = 0.6;

export function creerCanvasEspion(): CanvasEspion {
  const textes: AppelDeTexte[] = [];
  const rectangles: AppelDeRectangle[] = [];
  const cercles: AppelDeCercle[] = [];
  const polylignes: AppelDePolyligne[] = [];
  const polygones: AppelDePolyligne[] = [];
  const tuiles: AppelDeTuile[] = [];
  const cadresDeDecoupe: Rect[] = [];

  return {
    textes,
    rectangles,
    cercles,
    polylignes,
    polygones,
    tuiles,
    cadresDeDecoupe,

    fillRect(cadre, couleur) {
      rectangles.push({ cadre, couleur });
    },

    fillCircle(centre, rayon, couleur) {
      cercles.push({ centre, rayon, couleur });
    },

    strokePolyline(points, epaisseur, couleur) {
      polylignes.push({ points, epaisseur, couleur });
    },

    fillPolygon(points, couleur) {
      polygones.push({ points, epaisseur: 0, couleur });
    },

    fillText(texte, origine, police, couleur) {
      textes.push({ texte, origine, police, couleur });
    },

    measureTextWidth(texte, police) {
      return texte.length * police.sizeInPixels * largeurRelativeParCaractere;
    },

    drawTile(tuile, cadre, filtre) {
      tuiles.push({ tuile, cadre, filtre });
    },

    withClip(cadre, dessiner) {
      cadresDeDecoupe.push(cadre);
      dessiner();
    },

    texteConcatene() {
      return textes.map((appel) => appel.texte).join('');
    },
  };
}
