import { StyleSheet, useColorScheme } from 'react-native';
import { List, Switch, useTheme, Divider } from 'react-native-paper';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MediaManager from '../utils/mediaManager';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const systemColorScheme = useColorScheme();
  const theme = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [isSystemTheme, setIsSystemTheme] = useState(true);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    const themePreference = await AsyncStorage.getItem('themePreference');
    const useSystemTheme = await AsyncStorage.getItem('useSystemTheme');
    
    setIsSystemTheme(useSystemTheme !== 'false');
    setIsDarkMode(themePreference === 'dark');
  };

  const handleThemeToggle = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('themePreference', newMode ? 'dark' : 'light');
    await AsyncStorage.setItem('useSystemTheme', 'false');
    setIsSystemTheme(false);
  };

  const handleSystemThemeToggle = async () => {
    const newValue = !isSystemTheme;
    setIsSystemTheme(newValue);
    await AsyncStorage.setItem('useSystemTheme', newValue.toString());
    if (newValue) {
      setIsDarkMode(systemColorScheme === 'dark');
    }
  };

  const handleClearCache = async () => {
    try {
      await MediaManager.clearMediaCache();
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Appearance</List.Subheader>
        <List.Item
          title="Use System Theme"
          left={props => <List.Icon {...props} icon="theme-light-dark" />}
          right={() => (
            <Switch
              value={isSystemTheme}
              onValueChange={handleSystemThemeToggle}
            />
          )}
        />
        {!isSystemTheme && (
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon={isDarkMode ? 'weather-night' : 'weather-sunny'} />}
            right={() => (
              <Switch
                value={isDarkMode}
                onValueChange={handleThemeToggle}
              />
            )}
          />
        )}
      </List.Section>

      <Divider />

      <List.Section>
        <List.Subheader>Media Management</List.Subheader>
        <List.Item
          title="Clear Media Cache"
          left={props => <List.Icon {...props} icon="trash-can-outline" />}
          onPress={handleClearCache}
        />
      </List.Section>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
