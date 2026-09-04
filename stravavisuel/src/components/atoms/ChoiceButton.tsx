import { Pressable, StyleSheet, Text } from 'react-native';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  libelle: string;
  selectionne: boolean;
  onPress: () => void;
  taille?: 'normale' | 'compacte';
}

export function ChoiceButton({
  libelle,
  selectionne,
  onPress,
  taille = 'normale',
}: Proprietes) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: selectionne }}
      onPress={onPress}
      style={[
        styles.bouton,
        taille === 'compacte' ? styles.compacte : styles.normale,
        selectionne ? styles.selectionne : styles.nonSelectionne,
      ]}
    >
      <Text style={[styles.libelle, selectionne && styles.libelleSelectionne]}>
        {libelle}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  normale: {
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  compacte: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  selectionne: {
    backgroundColor: couleurs.encre,
    borderColor: couleurs.encre,
  },
  nonSelectionne: {
    backgroundColor: 'transparent',
    borderColor: couleurs.encreA22,
  },
  libelle: {
    fontFamily: polices.corps,
    fontSize: 12,
    letterSpacing: 0.96,
    color: couleurs.encre,
  },
  libelleSelectionne: {
    color: couleurs.papier,
  },
});
