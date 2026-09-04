import {
  misesEnPageDisponibles,
  taillesDExport,
  type FondDeCarte,
  type FormatDExport,
} from '@portfolio/activity-core';
import { posterAccentChoices } from '@portfolio/design-tokens';
import { StyleSheet, Text, View } from 'react-native';

import { ChoiceButton } from '~/components/atoms/ChoiceButton';
import { LabelledTextField } from '~/components/atoms/LabelledTextField';
import { StepHeading } from '~/components/atoms/StepHeading';
import { SwatchButton } from '~/components/atoms/SwatchButton';
import { ActivityRow } from '~/components/molecules/ActivityRow';
import { GpxDropZone } from '~/components/molecules/GpxDropZone';
import { LayoutCard } from '~/components/molecules/LayoutCard';
import { contenuStravaVisuel } from '~/content/fr';
import type {
  ActionsDuGenerateur,
  EtatDuGenerateur,
} from '~/state/use-generateur-de-visuel';
import { couleurs, polices } from '~/theme';

const fondsProposes: readonly { cle: FondDeCarte; libelle: string }[] = [
  { cle: 'papier', libelle: contenuStravaVisuel.generateur.fonds.papier },
  { cle: 'clair', libelle: contenuStravaVisuel.generateur.fonds.clair },
  { cle: 'sombre', libelle: contenuStravaVisuel.generateur.fonds.sombre },
  { cle: 'topo', libelle: contenuStravaVisuel.generateur.fonds.topo },
  { cle: 'satellite', libelle: contenuStravaVisuel.generateur.fonds.satellite },
  {
    cle: 'transparent',
    libelle: contenuStravaVisuel.generateur.fonds.transparent,
  },
];

const formatsProposes: readonly { cle: FormatDExport; libelle: string }[] = [
  { cle: 'png', libelle: contenuStravaVisuel.generateur.formats.png },
  { cle: 'jpg', libelle: contenuStravaVisuel.generateur.formats.jpg },
];

type Proprietes = EtatDuGenerateur & ActionsDuGenerateur;

export function GeneratorPanel(proprietes: Proprietes) {
  const { generateur } = contenuStravaVisuel;

  return (
    <View style={styles.panneau}>
      <View>
        <StepHeading
          numero={generateur.etapes.activite.numero}
          titre={generateur.etapes.activite.titre}
        />

        <View style={styles.zoneDeDepot}>
          <GpxDropZone
            titre={generateur.depot.titre}
            aide={generateur.depot.aide}
            onFichierChoisi={(fichier) => {
              void proprietes.importerUnFichier(fichier);
            }}
          />
        </View>

        {proprietes.messageDErreur !== '' && (
          <Text accessibilityRole="alert" style={styles.erreur}>
            {proprietes.messageDErreur}
          </Text>
        )}

        <View>
          {proprietes.activites.map((activite, index) => (
            <ActivityRow
              key={activite.identifiant}
              activite={activite}
              selectionnee={index === proprietes.indexCourant}
              onPress={() => proprietes.choisirLActivite(index)}
            />
          ))}
          <View style={styles.filetDeFin} />
        </View>

        <View style={styles.boutonDeTrace}>
          <ChoiceButton
            libelle={
              proprietes.traceModifiable
                ? generateur.autreTrace
                : generateur.traceImportee
            }
            selectionne={false}
            onPress={proprietes.changerDeTrace}
          />
        </View>
      </View>

      <View>
        <StepHeading
          numero={generateur.etapes.miseEnPage.numero}
          titre={generateur.etapes.miseEnPage.titre}
        />
        <View style={styles.grilleDeMisesEnPage}>
          {misesEnPageDisponibles.map((miseEnPage) => (
            <LayoutCard
              key={miseEnPage.cle}
              miseEnPage={miseEnPage}
              selectionnee={miseEnPage.cle === proprietes.miseEnPage}
              onPress={() => proprietes.choisirLaMiseEnPage(miseEnPage.cle)}
            />
          ))}
        </View>
      </View>

      <View>
        <StepHeading
          numero={generateur.etapes.couleurs.numero}
          titre={generateur.etapes.couleurs.titre}
        />
        <View style={styles.rangeeDeCouleurs}>
          <View style={styles.pastilles}>
            {posterAccentChoices.map((choix) => (
              <SwatchButton
                key={choix.key}
                couleur={choix.value}
                intitule={choix.label}
                selectionne={choix.value === proprietes.accent}
                onPress={() => proprietes.choisirLAccent(choix.value)}
              />
            ))}
          </View>
          <View style={styles.groupeDeBoutons}>
            <ChoiceButton
              libelle={generateur.themes.sombre}
              selectionne={proprietes.themeSombre}
              onPress={() => proprietes.choisirLeTheme(true)}
              taille="compacte"
            />
            <ChoiceButton
              libelle={generateur.themes.clair}
              selectionne={!proprietes.themeSombre}
              onPress={() => proprietes.choisirLeTheme(false)}
              taille="compacte"
            />
          </View>
        </View>
      </View>

      <View>
        <StepHeading
          numero={generateur.etapes.fond.numero}
          titre={generateur.etapes.fond.titre}
        />
        <View style={styles.groupeDeBoutons}>
          {fondsProposes.map((fond) => (
            <ChoiceButton
              key={fond.cle}
              libelle={fond.libelle}
              selectionne={fond.cle === proprietes.fond}
              onPress={() => proprietes.choisirLeFond(fond.cle)}
              taille="compacte"
            />
          ))}
        </View>
        <Text style={styles.note}>{generateur.notesurLesFonds}</Text>
      </View>

      <View>
        <StepHeading
          numero={generateur.etapes.textes.numero}
          titre={generateur.etapes.textes.titre}
        />
        <View style={styles.champs}>
          <LabelledTextField
            label={generateur.champs.titre}
            valeur={proprietes.activiteCourante.nom}
            onChangeText={(valeur) => proprietes.changerUnChamp('nom', valeur)}
          />
          <View style={styles.deuxChamps}>
            <LabelledTextField
              label={generateur.champs.lieu}
              valeur={proprietes.activiteCourante.lieu}
              onChangeText={(valeur) => proprietes.changerUnChamp('lieu', valeur)}
            />
            <LabelledTextField
              label={generateur.champs.date}
              valeur={proprietes.activiteCourante.date}
              onChangeText={(valeur) => proprietes.changerUnChamp('date', valeur)}
            />
          </View>
        </View>
      </View>

      <View>
        <StepHeading
          numero={generateur.etapes.export.numero}
          titre={generateur.etapes.export.titre}
        />
        <View style={[styles.groupeDeBoutons, styles.groupeEspace]}>
          {formatsProposes.map((format) => (
            <ChoiceButton
              key={format.cle}
              libelle={format.libelle}
              selectionne={format.cle === proprietes.format}
              onPress={() => proprietes.choisirLeFormat(format.cle)}
            />
          ))}
        </View>
        <View style={styles.groupeDeBoutons}>
          {taillesDExport.map((taille) => (
            <ChoiceButton
              key={taille.libelle}
              libelle={taille.libelle}
              selectionne={taille.facteur === proprietes.facteurDeTaille}
              onPress={() => proprietes.choisirLaTaille(taille.facteur)}
              taille="compacte"
            />
          ))}
        </View>
        <View style={styles.boutonDeTelechargement}>
          <ChoiceButton
            libelle={
              proprietes.exportEnCours
                ? generateur.exportEnCours
                : generateur.telecharger
            }
            selectionne
            onPress={() => {
              void proprietes.telecharger();
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panneau: {
    gap: 40,
    flex: 1,
  },
  zoneDeDepot: {
    marginBottom: 22,
  },
  erreur: {
    fontFamily: polices.corps,
    fontSize: 12,
    lineHeight: 19.2,
    color: couleurs.accent,
    marginTop: -12,
    marginBottom: 22,
  },
  filetDeFin: {
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA16,
  },
  boutonDeTrace: {
    marginTop: 18,
    alignItems: 'flex-start',
  },
  grilleDeMisesEnPage: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rangeeDeCouleurs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 26,
    alignItems: 'flex-start',
  },
  pastilles: {
    flexDirection: 'row',
    gap: 9,
  },
  groupeDeBoutons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  groupeEspace: {
    marginBottom: 12,
  },
  note: {
    fontFamily: polices.corps,
    fontSize: 12,
    lineHeight: 19.2,
    color: couleurs.encreA5,
    marginTop: 14,
  },
  champs: {
    gap: 18,
  },
  deuxChamps: {
    flexDirection: 'row',
    gap: 18,
  },
  boutonDeTelechargement: {
    marginTop: 24,
    alignItems: 'flex-start',
  },
});
