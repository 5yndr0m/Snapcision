import { List, Switch } from 'react-native-paper';
import { useContext } from 'react';
import { ThemeContext } from '@/context/theme_context';

export function AppearanceSettings() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);

  return (
    <List.Section>
      <List.Subheader>Appearance</List.Subheader>
      <List.Item
        title="Dark Mode"
        right={() => (
          <Switch
            value={isDarkMode}
            onValueChange={() => setIsDarkMode(!isDarkMode)}
          />
        )}
      />
    </List.Section>
  );
}
