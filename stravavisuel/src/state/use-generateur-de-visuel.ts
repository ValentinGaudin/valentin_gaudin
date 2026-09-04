import {
  activitesDeDemonstration,
  avecChampsEdites,
  misesEnPageDisponibles,
  taillesDExport,
  type Activity,
  type ChampsEditablesDActivite,
  type FondDeCarte,
  type FormatDExport,
  type NomDeMiseEnPage,
  type OptionsDeVisuel,
} from '@portfolio/activity-core';
import { posterAccentChoices } from '@portfolio/design-tokens';
import { useCallback, useMemo, useRef, useState } from 'react';

import { creerDepotDeTuilesDuNavigateur } from '~/adapters/browser-tile-repository';
import { importerDepuisUnFichier } from '~/adapters/gpx-file-reader';
import { exporterVisuel } from '~/adapters/poster-export';

const premiereMiseEnPage = misesEnPageDisponibles[0]?.cle ?? 'crete';
const premierAccent = posterAccentChoices[0]?.value ?? '#E8442A';
const premiereTaille = taillesDExport[0]?.facteur ?? 1;

export interface EtatDuGenerateur {
  readonly activites: readonly Activity[];
  readonly activiteCourante: Activity;
  readonly indexCourant: number;
  readonly visuel: OptionsDeVisuel;
  readonly miseEnPage: NomDeMiseEnPage;
  readonly accent: string;
  readonly themeSombre: boolean;
  readonly fond: FondDeCarte;
  readonly format: FormatDExport;
  readonly facteurDeTaille: number;
  readonly messageDErreur: string;
  readonly exportEnCours: boolean;
  readonly traceModifiable: boolean;
  readonly compteurDeRedessin: number;
  readonly depotDeTuiles: ReturnType<typeof creerDepotDeTuilesDuNavigateur>;
}

export interface ActionsDuGenerateur {
  choisirLActivite: (index: number) => void;
  choisirLaMiseEnPage: (miseEnPage: NomDeMiseEnPage) => void;
  choisirLAccent: (accent: string) => void;
  choisirLeTheme: (themeSombre: boolean) => void;
  choisirLeFond: (fond: FondDeCarte) => void;
  choisirLeFormat: (format: FormatDExport) => void;
  choisirLaTaille: (facteur: number) => void;
  changerUnChamp: (champ: keyof ChampsEditablesDActivite, valeur: string) => void;
  changerDeTrace: () => void;
  importerUnFichier: (fichier: File) => Promise<void>;
  telecharger: () => Promise<void>;
}

export function useGenerateurDeVisuel(): EtatDuGenerateur & ActionsDuGenerateur {
  const [indexCourant, setIndexCourant] = useState(0);
  const [activitesImportees, setActivitesImportees] = useState<readonly Activity[]>([]);
  const [miseEnPage, setMiseEnPage] = useState<NomDeMiseEnPage>(premiereMiseEnPage);
  const [accent, setAccent] = useState(premierAccent);
  const [themeSombre, setThemeSombre] = useState(true);
  const [fond, setFond] = useState<FondDeCarte>('papier');
  const [format, setFormat] = useState<FormatDExport>('png');
  const [facteurDeTaille, setFacteurDeTaille] = useState(premiereTaille);
  const [variation, setVariation] = useState(0);
  const [messageDErreur, setMessageDErreur] = useState('');
  const [exportEnCours, setExportEnCours] = useState(false);
  const [compteurDeRedessin, setCompteurDeRedessin] = useState(0);
  const [editionsParIdentifiant, setEditionsParIdentifiant] = useState<
    Readonly<Record<string, ChampsEditablesDActivite>>
  >({});

  const compteurDImports = useRef(0);

  const provoquerUnRedessin = useCallback(() => {
    setCompteurDeRedessin((valeur) => valeur + 1);
  }, []);

  const depotDeTuiles = useMemo(
    () => creerDepotDeTuilesDuNavigateur(provoquerUnRedessin),
    [provoquerUnRedessin],
  );

  const activites = useMemo(
    () => [...activitesDeDemonstration(variation), ...activitesImportees],
    [variation, activitesImportees],
  );

  const activiteBrute = activites[indexCourant] ?? activites[0];

  if (activiteBrute === undefined) {
    throw new Error('aucune activité disponible');
  }

  const activiteCourante = useMemo(
    () =>
      avecChampsEdites(
        activiteBrute,
        editionsParIdentifiant[activiteBrute.identifiant] ?? {},
      ),
    [activiteBrute, editionsParIdentifiant],
  );

  const visuel = useMemo<OptionsDeVisuel>(
    () => ({ activite: activiteCourante, miseEnPage, accent, themeSombre, fond }),
    [activiteCourante, miseEnPage, accent, themeSombre, fond],
  );

  const importerUnFichier = useCallback(async (fichier: File) => {
    compteurDImports.current += 1;

    const resultat = await importerDepuisUnFichier(
      fichier,
      `gpx-${compteurDImports.current}`,
    );

    if (resultat.statut === 'echec') {
      setMessageDErreur(resultat.message);
      return;
    }

    setMessageDErreur('');
    setActivitesImportees((precedentes) => {
      const suivantes = [...precedentes, resultat.activite];
      setIndexCourant(activitesDeDemonstration().length + suivantes.length - 1);
      return suivantes;
    });
  }, []);

  const telecharger = useCallback(async () => {
    setExportEnCours(true);

    try {
      const resultat = await exporterVisuel({
        visuel,
        format,
        facteurDeTaille,
        depotDeTuiles,
      });

      setMessageDErreur(resultat.statut === 'echec' ? resultat.message : '');
    } finally {
      setExportEnCours(false);
    }
  }, [visuel, format, facteurDeTaille, depotDeTuiles]);

  return {
    activites,
    activiteCourante,
    indexCourant,
    visuel,
    miseEnPage,
    accent,
    themeSombre,
    fond,
    format,
    facteurDeTaille,
    messageDErreur,
    exportEnCours,
    traceModifiable: activiteBrute.provenance === 'demonstration',
    compteurDeRedessin,
    depotDeTuiles,

    choisirLActivite: setIndexCourant,
    choisirLaMiseEnPage: setMiseEnPage,
    choisirLAccent: setAccent,
    choisirLeTheme: setThemeSombre,
    choisirLeFond: setFond,
    choisirLeFormat: setFormat,
    choisirLaTaille: setFacteurDeTaille,

    changerUnChamp: (champ, valeur) => {
      setEditionsParIdentifiant((precedentes) => ({
        ...precedentes,
        [activiteBrute.identifiant]: {
          ...precedentes[activiteBrute.identifiant],
          [champ]: valeur,
        },
      }));
    },

    changerDeTrace: () => {
      if (activiteBrute.provenance === 'demonstration') {
        setVariation((valeur) => valeur + 1);
      }
    },

    importerUnFichier,
    telecharger,
  };
}
