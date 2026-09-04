import { StyleSheet, Text, View } from 'react-native';

import { SectionEnLargeur } from '~/components/atoms/SectionEnLargeur';
import { contenuStravaVisuel } from '~/content/fr';
import { couleurs, identifiantsDeTitre, polices, taillesDeRepli } from '~/theme';

export function HeroSection() {
  const { banniere } = contenuStravaVisuel;

  return (
    <SectionEnLargeur style={styles.section}>
      <View style={styles.surtitre}>
        <View style={styles.pastille} />
        <Text style={styles.surtitreTexte}>{banniere.surtitre}</Text>
      </View>

      <Text
        accessibilityRole="header"
        nativeID={identifiantsDeTitre.banniere}
        style={styles.titre}
      >
        {banniere.titreLignes.join('\n')}
      </Text>

      <Text style={styles.accroche}>{banniere.accroche}</Text>
    </SectionEnLargeur>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 72,
    paddingBottom: 60,
  },
  surtitre: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  pastille: {
    width: 11,
    height: 11,
    backgroundColor: couleurs.accent,
  },
  surtitreTexte: {
    fontFamily: polices.corps,
    fontSize: 12,
    letterSpacing: 1.68,
    color: couleurs.encreA55,
  },
  titre: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: taillesDeRepli.banniere,
    lineHeight: taillesDeRepli.banniere * 0.96,
    letterSpacing: -1,
    color: couleurs.encre,
    marginTop: 30,
  },
  accroche: {
    fontFamily: polices.corps,
    maxWidth: 600,
    marginTop: 32,
    fontSize: 16,
    lineHeight: 28.8,
    color: couleurs.encreA72,
  },
});
