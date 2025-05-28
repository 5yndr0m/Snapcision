import { ReactNode, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '@/context/theme_context';

const THEME_PREFERENCE_KEY = '@theme_preference';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
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
      <NavigationThemeProvider value={navigationTheme}>
        <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode: handleThemeChange }}>
          {children}
        </ThemeContext.Provider>
      </NavigationThemeProvider>
    </PaperProvider>
  );
}
