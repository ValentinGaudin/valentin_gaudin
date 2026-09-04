import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import type { ReactNode } from 'react';

import { SectionEnLargeur } from '~/components/atoms/SectionEnLargeur';
import { ExplanationsSection } from '~/components/organisms/ExplanationsSection';
import { GeneratorPanel } from '~/components/organisms/GeneratorPanel';
import { HeroSection } from '~/components/organisms/HeroSection';
import { PosterPreview } from '~/components/organisms/PosterPreview';
import { SiteFooter } from '~/components/organisms/SiteFooter';
import { SiteHeader } from '~/components/organisms/SiteHeader';
import { contenuStravaVisuel } from '~/content/fr';
import { useGenerateurDeVisuel } from '~/state/use-generateur-de-visuel';
import { couleurs } from '~/theme';

function Page({ children }: { children: ReactNode }) {
  if (Platform.OS === 'web') {
    return <View style={styles.page}>{children}</View>;
  }

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.contenuNatif}>
      {children}
    </ScrollView>
  );
}

export default function PageDuGenerateur() {
  const generateur = useGenerateurDeVisuel();

  return (
    <Page>
      <SiteHeader />
      <HeroSection />

      <SectionEnLargeur nativeID="generateur" style={styles.sectionDuGenerateur}>
        <View style={styles.colonnes}>
          <View style={styles.colonne}>
            <PosterPreview
              visuel={generateur.visuel}
              depotDeTuiles={generateur.depotDeTuiles}
              compteurDeRedessin={generateur.compteurDeRedessin}
              legende={contenuStravaVisuel.generateur.legendeDeLApercu}
            />
          </View>

          <View style={styles.colonne}>
            <GeneratorPanel {...generateur} />
          </View>
        </View>
      </SectionEnLargeur>

      <ExplanationsSection />
      <SiteFooter />
    </Page>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    backgroundColor: couleurs.papier,
  },
  contenuNatif: {
    minHeight: '100%',
  },
  sectionDuGenerateur: {
    borderTopWidth: 1,
    borderTopColor: couleurs.encreA14,
    paddingTop: 72,
    paddingBottom: 80,
  },
  colonnes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 48,
    alignItems: 'flex-start',
  },
  colonne: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 380,
  },
});
