const proportionDeclenchement = 0.42;
const margeBasDePage = 48;

export function observerSectionActive(): void {
  const dock = document.querySelector<HTMLElement>('[data-navigation-dock]');

  if (dock === null) {
    return;
  }

  const liens = Array.from(
    dock.querySelectorAll<HTMLAnchorElement>('[data-dock-target]'),
  );

  if (liens.length === 0) {
    return;
  }

  const identifiantsDeSection = liens
    .map((lien) => lien.dataset.dockTarget)
    .filter((identifiant): identifiant is string => identifiant !== undefined);

  const dernierIdentifiant = identifiantsDeSection.at(-1);
  let identifiantActifCourant: string | null = null;

  const identifiantDeSectionVisible = (): string => {
    const seuil = window.innerHeight * proportionDeclenchement;
    let identifiantVisible = identifiantsDeSection[0] ?? '';

    for (const identifiant of identifiantsDeSection) {
      const section = document.getElementById(identifiant);

      if (section !== null && section.getBoundingClientRect().top <= seuil) {
        identifiantVisible = identifiant;
      }
    }

    const basDePageAtteint =
      window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight - margeBasDePage;

    if (basDePageAtteint && dernierIdentifiant !== undefined) {
      return dernierIdentifiant;
    }

    return identifiantVisible;
  };

  const appliquerEtatActif = (): void => {
    const identifiantActif = identifiantDeSectionVisible();

    if (identifiantActif === identifiantActifCourant) {
      return;
    }

    identifiantActifCourant = identifiantActif;

    for (const lien of liens) {
      const estActif = lien.dataset.dockTarget === identifiantActif;
      lien.dataset.active = String(estActif);

      if (estActif) {
        lien.setAttribute('aria-current', 'true');
      } else {
        lien.removeAttribute('aria-current');
      }
    }
  };

  window.addEventListener('scroll', appliquerEtatActif, { passive: true });
  window.addEventListener('resize', appliquerEtatActif);
  appliquerEtatActif();
}
