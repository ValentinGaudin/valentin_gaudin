import { Pressable, StyleSheet } from 'react-native';

import { couleurs } from '~/theme';

interface Proprietes {
  couleur: string;
  intitule: string;
  selectionne: boolean;
  onPress: () => void;
}

export function SwatchButton({
  couleur,
  intitule,
  selectionne,
  onPress,
}: Proprietes) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={intitule}
      accessibilityState={{ selected: selectionne }}
      onPress={onPress}
      style={[
        styles.pastille,
        { backgroundColor: couleur },
        selectionne && styles.selectionnee,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  pastille: {
    width: 34,
    height: 34,
    borderWidth: 1,
    borderColor: couleurs.encreA2,
  },
  selectionnee: {
    outlineWidth: 1,
    outlineColor: couleurs.encre,
    outlineStyle: 'solid',
    outlineOffset: 3,
  },
});
