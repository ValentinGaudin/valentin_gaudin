import { mouvementReduitDemande } from './animation';

function centresDesCartes(rail: HTMLElement): number[] {
  return Array.from(rail.children).map((carte) => {
    const element = carte as HTMLElement;
    return element.offsetLeft - rail.offsetLeft + element.offsetWidth / 2;
  });
}

function indexDeLaCarteCentree(rail: HTMLElement, centres: readonly number[]): number {
  const centreVisible = rail.scrollLeft + rail.clientWidth / 2;

  let indexLePlusProche = 0;
  let distanceLaPlusCourte = Number.POSITIVE_INFINITY;

  centres.forEach((centre, index) => {
    const distance = Math.abs(centre - centreVisible);

    if (distance < distanceLaPlusCourte) {
      distanceLaPlusCourte = distance;
      indexLePlusProche = index;
    }
  });

  return indexLePlusProche;
}

export function synchroniserRailEtPastilles(): void {
  const rail = document.querySelector<HTMLElement>('[data-experiment-rail]');

  if (rail === null) {
    return;
  }

  const pastilles = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-rail-dot]'),
  );

  if (pastilles.length === 0) {
    return;
  }

  let indexActifCourant: number | null = null;

  const appliquerEtatActif = (): void => {
    const centres = centresDesCartes(rail);

    if (centres.length === 0) {
      return;
    }

    const indexActif = indexDeLaCarteCentree(rail, centres);

    if (indexActif === indexActifCourant) {
      return;
    }

    indexActifCourant = indexActif;

    pastilles.forEach((pastille, index) => {
      pastille.dataset.active = String(index === indexActif);
    });
  };

  const defilerVers = (index: number): void => {
    const centres = centresDesCartes(rail);
    const centreCible = centres[index];

    if (centreCible === undefined) {
      return;
    }

    const defilementMaximal = rail.scrollWidth - rail.clientWidth;
    const positionCible = Math.max(
      0,
      Math.min(defilementMaximal, centreCible - rail.clientWidth / 2),
    );

    rail.scrollTo({
      left: positionCible,
      behavior: mouvementReduitDemande() ? 'auto' : 'smooth',
    });
  };

  pastilles.forEach((pastille, index) => {
    pastille.addEventListener('click', () => defilerVers(index));
  });

  rail.addEventListener('scroll', appliquerEtatActif, { passive: true });
  window.addEventListener('resize', appliquerEtatActif);
  appliquerEtatActif();
}
