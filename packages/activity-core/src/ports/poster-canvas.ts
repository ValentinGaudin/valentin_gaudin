export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type FontFamilyRole = 'display' | 'body';
export type FontWeight = 400 | 700;

export interface FontSpec {
  readonly family: FontFamilyRole;
  readonly sizeInPixels: number;
  readonly weight: FontWeight;
}

export interface ImageFilter {
  readonly grayscale?: number;
  readonly invert?: number;
  readonly brightness?: number;
  readonly contrast?: number;
  readonly saturate?: number;
}

export interface TileImage {
  readonly url: string;
}

export interface PosterCanvas {
  fillRect(rect: Rect, color: string): void;
  fillCircle(center: Point, radius: number, color: string): void;
  strokePolyline(
    points: readonly Point[],
    strokeWidth: number,
    color: string,
  ): void;
  fillPolygon(points: readonly Point[], color: string): void;
  fillText(text: string, origin: Point, font: FontSpec, color: string): void;
  measureTextWidth(text: string, font: FontSpec): number;
  drawTile(tile: TileImage, rect: Rect, filter: ImageFilter | null): void;
  withClip(rect: Rect, dessiner: () => void): void;
}

export function policeDisplay(sizeInPixels: number): FontSpec {
  return { family: 'display', sizeInPixels, weight: 700 };
}

export function policeBody(sizeInPixels: number): FontSpec {
  return { family: 'body', sizeInPixels, weight: 400 };
}
