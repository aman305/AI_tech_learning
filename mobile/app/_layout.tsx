import '../global.css';
import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { runMigrations } from '../db/migrations';
import { useAuthStore } from '../stores/useAuthStore';
import { useSessionStore } from '../stores/useSessionStore';

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    runMigrations();
    hydrate();
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    useSessionStore.getState().loadFromDB();
    router.replace('/(app)/(tabs)/home');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
