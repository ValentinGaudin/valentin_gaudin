import { Stack } from 'expo-router';

import { couleurs } from '~/theme';

export default function DispositionRacine() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: couleurs.papier },
      }}
    />
  );
}
