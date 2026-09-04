import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { SectionEnLargeur } from '~/components/atoms/SectionEnLargeur';
import { contenuStravaVisuel } from '~/content/fr';
import { couleurs, identifiantsDeTitre, polices, taillesDeRepli } from '~/theme';

export function SiteFooter() {
  const { piedDePage } = contenuStravaVisuel;

  return (
    <View style={styles.fondSombre}>
      <SectionEnLargeur style={styles.pied}>
      <Text
        accessibilityRole="header"
        nativeID={identifiantsDeTitre.piedDePage}
        style={styles.titre}
      >
        {piedDePage.titre}
      </Text>

      <Link href={`mailto:${piedDePage.courriel}`} style={styles.courriel}>
        {piedDePage.courriel}
      </Link>

      <View style={styles.liens}>
        {piedDePage.liens.map((lien) => (
          <Link key={lien.url} href={lien.url} style={styles.lien}>
            {lien.libelle}
          </Link>
        ))}
        <Text style={styles.signature}>{piedDePage.signature}</Text>
      </View>
      </SectionEnLargeur>
    </View>
  );
}

const styles = StyleSheet.create({
  fondSombre: {
    width: '100%',
    backgroundColor: couleurs.encre,
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA14,
  },
  pied: {
    paddingTop: 76,
    paddingBottom: 48,
  },
  titre: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: taillesDeRepli.section,
    lineHeight: taillesDeRepli.section,
    color: couleurs.cremeSurSombre,
    marginBottom: 26,
  },
  courriel: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: 28,
    color: couleurs.cremeSurSombre,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.cremeSurSombreA35,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  liens: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 40,
    rowGap: 18,
    marginTop: 56,
    paddingTop: 26,
    borderTopWidth: 1,
    borderTopColor: couleurs.cremeSurSombreA16,
    alignItems: 'center',
  },
  lien: {
    fontFamily: polices.corps,
    fontSize: 13,
    color: couleurs.cremeSurSombreA75,
  },
  signature: {
    fontFamily: polices.corps,
    fontSize: 13,
    letterSpacing: 1.3,
    color: couleurs.cremeSurSombreA4,
    marginLeft: 'auto',
  },
});
