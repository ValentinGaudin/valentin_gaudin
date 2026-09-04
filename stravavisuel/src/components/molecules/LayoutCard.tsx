import type { DescriptionDeMiseEnPage } from '@portfolio/activity-core';
import { Pressable, StyleSheet, Text } from 'react-native';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  miseEnPage: DescriptionDeMiseEnPage;
  selectionnee: boolean;
  onPress: () => void;
}

export function LayoutCard({ miseEnPage, selectionnee, onPress }: Proprietes) {
  const couleurDuTexte = selectionnee ? couleurs.papier : couleurs.encre;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: selectionnee }}
      onPress={onPress}
      style={[styles.carte, selectionnee ? styles.selectionnee : styles.nonSelectionnee]}
    >
      <Text style={[styles.numero, { color: couleurDuTexte }]}>
        {miseEnPage.numero}
      </Text>
      <Text style={[styles.nom, { color: couleurDuTexte }]}>{miseEnPage.nom}</Text>
      <Text style={[styles.note, { color: couleurDuTexte }]}>{miseEnPage.note}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexGrow: 1,
    flexBasis: 140,
    borderWidth: 1,
    paddingTop: 14,
    paddingHorizontal: 15,
    paddingBottom: 16,
    gap: 7,
    alignItems: 'flex-start',
  },
  selectionnee: {
    backgroundColor: couleurs.encre,
    borderColor: couleurs.encre,
  },
  nonSelectionnee: {
    backgroundColor: 'transparent',
    borderColor: couleurs.encreA22,
  },
  numero: {
    fontFamily: polices.corps,
    fontSize: 11,
    letterSpacing: 1.1,
    opacity: 0.55,
  },
  nom: {
    fontFamily: polices.corps,
    fontWeight: '700',
    fontSize: 14,
  },
  note: {
    fontFamily: polices.corps,
    fontSize: 11,
    lineHeight: 16.5,
    opacity: 0.65,
  },
});
