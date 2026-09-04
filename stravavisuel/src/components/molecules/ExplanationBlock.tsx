import { StyleSheet, Text, View } from 'react-native';

import type { BlocExplicatif } from '~/content/fr';
import { couleurs, polices } from '~/theme';

interface Proprietes {
  bloc: BlocExplicatif;
}

export function ExplanationBlock({ bloc }: Proprietes) {
  return (
    <View style={styles.bloc}>
      <View style={styles.entete}>
        <Text style={styles.numero}>{bloc.numero}</Text>
        <Text style={styles.titre}>{bloc.titre}</Text>
      </View>
      <Text style={styles.texte}>{bloc.texte}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: {
    flexGrow: 1,
    flexBasis: 240,
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA16,
    paddingTop: 22,
    paddingBottom: 30,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 16,
    marginBottom: 16,
  },
  numero: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: 22,
    color: couleurs.accent,
  },
  titre: {
    fontFamily: polices.corps,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.84,
    color: couleurs.encre,
  },
  texte: {
    fontFamily: polices.corps,
    fontSize: 14,
    lineHeight: 24.5,
    color: couleurs.encreA7,
  },
});
