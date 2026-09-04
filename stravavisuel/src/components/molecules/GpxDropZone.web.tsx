import { useCallback, useRef, useState } from 'react';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  titre: string;
  aide: string;
  onFichierChoisi: (fichier: File) => void;
}

export function GpxDropZone({ titre, aide, onFichierChoisi }: Proprietes) {
  const champDeFichier = useRef<HTMLInputElement | null>(null);
  const [survole, setSurvole] = useState(false);

  const traiterLeDepot = useCallback(
    (evenement: React.DragEvent<HTMLDivElement>) => {
      evenement.preventDefault();
      setSurvole(false);

      const fichier = evenement.dataTransfer.files.item(0);

      if (fichier !== null) {
        onFichierChoisi(fichier);
      }
    },
    [onFichierChoisi],
  );

  return (
    <div
      onDrop={traiterLeDepot}
      onDragOver={(evenement) => {
        evenement.preventDefault();
        setSurvole(true);
      }}
      onDragLeave={() => setSurvole(false)}
      onClick={() => champDeFichier.current?.click()}
      onKeyDown={(evenement) => {
        if (evenement.key === 'Enter' || evenement.key === ' ') {
          evenement.preventDefault();
          champDeFichier.current?.click();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={titre}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'center',
        textAlign: 'center',
        padding: '26px 20px',
        border: `1px dashed ${survole ? couleurs.accent : couleurs.encreA3}`,
        background: survole ? couleurs.accentTresPale : 'transparent',
        cursor: 'pointer',
        transition: 'border-color .2s, background .2s',
      }}
    >
      <span
        style={{
          fontFamily: polices.corps,
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: '.06em',
          color: couleurs.encre,
        }}
      >
        {titre}
      </span>
      <span
        style={{
          fontFamily: polices.corps,
          fontSize: 11,
          lineHeight: 1.6,
          color: couleurs.encreA5,
        }}
      >
        {aide}
      </span>
      <input
        ref={champDeFichier}
        type="file"
        accept=".gpx,application/gpx+xml"
        onChange={(evenement) => {
          const fichier = evenement.target.files?.item(0) ?? null;

          if (fichier !== null) {
            onFichierChoisi(fichier);
          }

          evenement.target.value = '';
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
}
