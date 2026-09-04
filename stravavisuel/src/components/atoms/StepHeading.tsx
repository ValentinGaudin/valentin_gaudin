import { StyleSheet, Text, View } from 'react-native';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  numero: string;
  titre: string;
}

export function StepHeading({ numero, titre }: Proprietes) {
  return (
    <View style={styles.rangee}>
      <Text style={styles.numero}>{numero}</Text>
      <Text style={styles.titre}>{titre}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rangee: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 20,
  },
  numero: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: 20,
    color: couleurs.accent,
  },
  titre: {
    fontFamily: polices.corps,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 1.04,
    color: couleurs.encre,
  },
});
