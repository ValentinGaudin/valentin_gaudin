import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { couleurs, polices } from '~/theme';

const contenu = {
  code: '404',
  titre: 'Rien à cette adresse',
  message: "Le générateur vit sur la page d'accueil.",
  retour: "RETOUR AU GÉNÉRATEUR ↗",
};

export default function PageIntrouvable() {
  return (
    <View style={styles.page}>
      <Text style={styles.code}>{contenu.code}</Text>
      <Text accessibilityRole="header" style={styles.titre}>
        {contenu.titre}
      </Text>
      <Text style={styles.message}>{contenu.message}</Text>
      <Link href="/" style={styles.retour}>
        {contenu.retour}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: couleurs.papier,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 22,
  },
  code: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: 120,
    lineHeight: 120,
    color: couleurs.accent,
  },
  titre: {
    fontFamily: polices.titre,
    fontWeight: '700',
    fontSize: 40,
    color: couleurs.encre,
  },
  message: {
    fontFamily: polices.corps,
    fontSize: 16,
    lineHeight: 28.8,
    color: couleurs.encreA72,
    maxWidth: 460,
  },
  retour: {
    fontFamily: polices.corps,
    fontSize: 13,
    letterSpacing: 1.04,
    color: couleurs.papier,
    backgroundColor: couleurs.encre,
    paddingVertical: 15,
    paddingHorizontal: 26,
    alignSelf: 'flex-start',
  },
});
