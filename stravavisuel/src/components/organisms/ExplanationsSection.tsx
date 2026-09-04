import { StyleSheet, Text, View } from 'react-native';

import { SectionEnLargeur } from '~/components/atoms/SectionEnLargeur';
import { ExplanationBlock } from '~/components/molecules/ExplanationBlock';
import { contenuStravaVisuel } from '~/content/fr';
import { couleurs, identifiantsDeTitre, polices, taillesDeRepli } from '~/theme';

export function ExplanationsSection() {
  const { explications } = contenuStravaVisuel;

  return (
    <SectionEnLargeur style={styles.section}>
      <View style={styles.entete}>
        <Text style={styles.numero}>{explications.numero}</Text>
        <Text
          accessibilityRole="header"
          nativeID={identifiantsDeTitre.explications}
          style={styles.titre}
        >
          {explications.titre}
        </Text>
      </View>

      <Text style={styles.intro}>{explications.intro}</Text>

      <View style={styles.blocs}>
        {explications.blocs.map((bloc) => (
          <ExplanationBlock key={bloc.numero} bloc={bloc} />
        ))}
      </View>
    </SectionEnLargeur>
  );
}

const styles = StyleSheet.create({
  section: {
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA14,
    paddingTop: 72,
    paddingBottom: 80,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 20,
    marginBottom: 14,
  },
  numero: {
    fontFamily: polices.corps,
    fontSize: 12,
    letterSpacing: 1.68,
    color: couleurs.encreA45,
  },
  titre: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: taillesDeRepli.section,
    lineHeight: taillesDeRepli.section,
    color: couleurs.encre,
  },
  intro: {
    fontFamily: polices.corps,
    maxWidth: 520,
    marginBottom: 48,
    fontSize: 15,
    lineHeight: 26.25,
    color: couleurs.encreA6,
  },
  blocs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 40,
  },
});
