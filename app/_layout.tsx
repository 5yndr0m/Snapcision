import { Slot } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Walkthrough from "./walkthrough"

export default function Layout() {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? MD3DarkTheme : MD3LightTheme;
  const [showWalkthrough, setShowWalkthrough] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const seen = await AsyncStorage.getItem('seenWalkthrough');
      setShowWalkthrough(seen !== 'true');
    })();
  }, []);

  if (showWalkthrough === null) return null;

  return (
    <PaperProvider theme={theme}>
      {showWalkthrough ? <Walkthrough /> : <Slot />}
    </PaperProvider>
  );
}
