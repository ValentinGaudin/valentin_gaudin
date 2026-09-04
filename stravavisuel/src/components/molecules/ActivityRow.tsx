import type { Activity } from '@portfolio/activity-core';
import { distanceFormatee } from '@portfolio/activity-core';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  activite: Activity;
  selectionnee: boolean;
  onPress: () => void;
}

export function ActivityRow({ activite, selectionnee, onPress }: Proprietes) {
  const mesures = `${distanceFormatee(activite.metriques.distanceEnKilometres)} · ${activite.metriques.denivelePositifEnMetres} m D+`;
  const etiquette =
    activite.date === ''
      ? activite.libelleDuType
      : `${activite.libelleDuType} — ${activite.date}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: selectionnee }}
      onPress={onPress}
      style={styles.rangee}
    >
      <View style={styles.ligneHaute}>
        <Text style={[styles.nom, selectionnee && styles.nomSelectionne]}>
          {activite.nom}
        </Text>
        <Text style={styles.mesures}>{mesures}</Text>
      </View>
      <Text style={[styles.etiquette, selectionnee && styles.etiquetteSelectionnee]}>
        {etiquette}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rangee: {
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA16,
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 6,
  },
  ligneHaute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 18,
    flexWrap: 'wrap',
  },
  nom: {
    fontFamily: polices.corps,
    fontSize: 15,
    color: couleurs.encre,
    flexShrink: 1,
  },
  nomSelectionne: {
    color: couleurs.accent,
  },
  mesures: {
    fontFamily: polices.corps,
    fontSize: 12,
    letterSpacing: 0.72,
    color: couleurs.encreA45,
  },
  etiquette: {
    fontFamily: polices.corps,
    fontSize: 11,
    letterSpacing: 1.1,
    color: couleurs.encreA4,
  },
  etiquetteSelectionnee: {
    color: couleurs.accentDouce,
  },
});
