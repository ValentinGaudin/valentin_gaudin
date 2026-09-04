import type { ReactNode } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

import { gouttiere, largeurMaximaleDuContenu } from '~/theme';

interface Proprietes {
  children: ReactNode;
  style?: ViewStyle;
  nativeID?: string;
}

export function SectionEnLargeur({ children, style, nativeID }: Proprietes) {
  return (
    <View style={[styles.pleineLargeur, style]} nativeID={nativeID}>
      <View style={styles.contenuCentre}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  pleineLargeur: {
    width: '100%',
    paddingHorizontal: gouttiere,
  },
  contenuCentre: {
    width: '100%',
    maxWidth: largeurMaximaleDuContenu,
    alignSelf: 'center',
  },
});
