import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { contenuStravaVisuel } from '~/content/fr';
import { couleurs, gouttiere, largeurMaximaleDuContenu, polices } from '~/theme';

export function SiteHeader() {
  const { entete } = contenuStravaVisuel;

  return (
    <View style={styles.bandeau}>
      <View style={styles.entete}>
        <Text style={styles.nom}>{entete.nom}</Text>
        <Link href={entete.lienPortfolio.url} style={styles.lien}>
          {entete.lienPortfolio.libelle}
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bandeau: {
    width: '100%',
    paddingHorizontal: gouttiere,
    backgroundColor: couleurs.papierVoile,
    borderBottomWidth: 1,
    borderBottomColor: couleurs.encreA1,
  },
  entete: {
    width: '100%',
    maxWidth: largeurMaximaleDuContenu,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    rowGap: 12,
    paddingVertical: 18,
  },
  nom: {
    fontFamily: polices.corps,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.96,
    color: couleurs.encre,
  },
  lien: {
    fontFamily: polices.corps,
    fontSize: 12,
    letterSpacing: 0.96,
    color: couleurs.encreA5,
  },
});
