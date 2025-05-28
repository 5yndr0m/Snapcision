import { Slot } from "expo-router";
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import { useMemo, useState, useEffect, createContext } from "react";
import { ThemeProvider } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "@/context/theme_context";

const THEME_PREFERENCE_KEY = '@theme_preference';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_PREFERENCE_KEY)
      .then(value => {
        if (value !== null) {
          setIsDarkMode(JSON.parse(value));
        }
      });
  }, []);

  const handleThemeChange = (value: boolean) => {
    setIsDarkMode(value);
    AsyncStorage.setItem(THEME_PREFERENCE_KEY, JSON.stringify(value));
  };

  const paperTheme = useMemo(() => {
    return isDarkMode ? MD3DarkTheme : MD3LightTheme;
  }, [isDarkMode]);

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: MD3DarkTheme,
    reactNavigationLight: MD3LightTheme,
  });

  const navigationTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider value={navigationTheme}>
        <SafeAreaProvider>
          <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode: handleThemeChange }}>
            <Slot />
          </ThemeContext.Provider>
        </SafeAreaProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}
