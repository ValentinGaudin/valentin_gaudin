import { StyleSheet, Text, TextInput, View } from 'react-native';

import { couleurs, polices } from '~/theme';

interface Proprietes {
  label: string;
  valeur: string;
  onChangeText: (valeur: string) => void;
}

export function LabelledTextField({ label, valeur, onChangeText }: Proprietes) {
  return (
    <View style={styles.groupe}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={valeur}
        onChangeText={onChangeText}
        style={styles.champ}
        placeholderTextColor={couleurs.encreA4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  groupe: {
    flex: 1,
    gap: 7,
  },
  label: {
    fontFamily: polices.corps,
    fontSize: 11,
    letterSpacing: 1.32,
    color: couleurs.encreA5,
  },
  champ: {
    fontFamily: polices.corps,
    fontSize: 15,
    color: couleurs.encre,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.encreA28,
    paddingVertical: 7,
    paddingHorizontal: 2,
  },
});
