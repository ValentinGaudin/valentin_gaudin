export type DessinAnime = (tempsEnSecondes: number) => void;

export interface ControleurAnimation {
  readonly arreter: () => void;
}

const requeteMouvementReduit = '(prefers-reduced-motion: reduce)';

export function animerCanvasVisible(
  canvas: HTMLCanvasElement,
  dessiner: DessinAnime,
): ControleurAnimation {
  const preferenceMouvementReduit = window.matchMedia(requeteMouvementReduit);

  let identifiantFrame: number | null = null;
  let horodatageInitial: number | null = null;
  let canvasDansLaFenetre = false;

  const dessinerFrameFigee = (): void => {
    dessiner(0);
  };

  const boucler = (horodatage: number): void => {
    if (horodatageInitial === null) {
      horodatageInitial = horodatage;
    }

    dessiner((horodatage - horodatageInitial) / 1000);
    identifiantFrame = window.requestAnimationFrame(boucler);
  };

  const arreterBoucle = (): void => {
    if (identifiantFrame !== null) {
      window.cancelAnimationFrame(identifiantFrame);
      identifiantFrame = null;
    }
  };

  const synchroniserEtat = (): void => {
    const animationSouhaitee =
      canvasDansLaFenetre && !preferenceMouvementReduit.matches;

    if (animationSouhaitee) {
      if (identifiantFrame === null) {
        horodatageInitial = null;
        identifiantFrame = window.requestAnimationFrame(boucler);
      }
      return;
    }

    arreterBoucle();

    if (canvasDansLaFenetre) {
      dessinerFrameFigee();
    }
  };

  const observateurVisibilite = new IntersectionObserver((entrees) => {
    for (const entree of entrees) {
      canvasDansLaFenetre = entree.isIntersecting;
    }
    synchroniserEtat();
  });

  observateurVisibilite.observe(canvas);

  const observateurTaille = new ResizeObserver(() => {
    if (identifiantFrame === null && canvasDansLaFenetre) {
      dessinerFrameFigee();
    }
  });

  observateurTaille.observe(canvas);

  preferenceMouvementReduit.addEventListener('change', synchroniserEtat);

  return {
    arreter: () => {
      arreterBoucle();
      observateurVisibilite.disconnect();
      observateurTaille.disconnect();
      preferenceMouvementReduit.removeEventListener('change', synchroniserEtat);
    },
  };
}

export function mouvementReduitDemande(): boolean {
  return window.matchMedia(requeteMouvementReduit).matches;
}
