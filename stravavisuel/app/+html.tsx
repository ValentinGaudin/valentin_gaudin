import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

import { contenuStravaVisuel } from '~/content/fr';

// Le responsive vit ICI, en CSS, et non dans `useWindowDimensions`.
//
// Raison : le HTML est PRE-RENDU cote Node, ou aucune fenetre n'existe. Un
// style calcule depuis la largeur de fenetre est donc fige sur la valeur du
// pre-rendu — React hydrate le DOM du serveur et ne reapplique pas les
// attributs qui divergent. Constate en test : mise en page en une colonne et
// titre a la taille de repli sur une fenetre de 1440 px.
//
// `clamp()` produit le meme resultat au pre-rendu et dans le navigateur, parce
// que le navigateur seul le resout. Les `!important` sont necessaires : React
// Native Web genere des classes atomiques de forte specificite.
const stylesDeBase = `
  html, body { margin: 0; background: #F1ECE4; }
  body { -webkit-font-smoothing: antialiased; }
  ::selection { background: #E8442A; color: #F1ECE4; }
  a { color: inherit; }
  a:hover { color: #E8442A; }

  #titre-banniere {
    font-size: clamp(40px, 7vw, 104px) !important;
    line-height: 0.96 !important;
  }

  #titre-explications,
  #titre-pied-de-page {
    font-size: clamp(34px, 4.4vw, 56px) !important;
    line-height: 1 !important;
  }

  @media (min-width: 900px) {
    [data-gouttiere-large] { padding-left: 64px !important; padding-right: 64px !important; }
  }
`;

export default function Racine({ children }: { children: ReactNode }) {
  const { meta } = contenuStravaVisuel;

  return (
    <html lang={meta.langue}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>{meta.titre}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.titre} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href={
            'https://fonts.googleapis.com/css2' +
            '?family=Bodoni+Moda:opsz,wght@6..96,400;6..96,700' +
            '&family=Space+Mono:wght@400;700' +
            '&display=swap'
          }
        />

        {/* Permet au DOCUMENT de defiler plutot qu'a un conteneur interne.
            Sans lui, l'ancre #generateur — vers laquelle pointe le portfolio —
            ne fonctionne pas, et le navigateur n'affiche aucune barre de
            defilement. */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: stylesDeBase }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
