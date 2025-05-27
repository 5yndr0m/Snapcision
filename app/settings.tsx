import { ScrollView, Linking, StyleSheet } from 'react-native';
import { List, Switch, useTheme, Divider } from 'react-native-paper';
import { useState } from 'react';
import { clearMediaLibraryCache } from '../utils/media';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useTheme();

  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <List.Subheader>Preferences</List.Subheader>

      <List.Item
        title="Dark Mode"
        right={() => <Switch value={darkMode} onValueChange={() => setDarkMode(!darkMode)} />}
      />

      <List.Item
        title="Clear Media Cache"
        onPress={async () => {
          await clearMediaLibraryCache();
          alert('Cache cleared.');
        }}
        left={() => <List.Icon icon="delete" />}
      />

      <Divider style={{ marginVertical: 10 }} />

      <List.Subheader>About</List.Subheader>

      <List.Item
        title="Made by Syndrom"
        description="Image Review App"
        left={() => <List.Icon icon="account-heart-outline" />}
      />

      <List.Item
        title="GitHub"
        description="View Source Code"
        onPress={() => openLink('https://github.com/username/repo')}
        left={() => <List.Icon icon="github" />}
      />

      <List.Item
        title="Twitter"
        onPress={() => openLink('https://twitter.com/username')}
        left={() => <List.Icon icon="twitter" />}
      />

      <List.Item
        title="LinkedIn"
        onPress={() => openLink('https://linkedin.com/in/username')}
        left={() => <List.Icon icon="linkedin" />}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
