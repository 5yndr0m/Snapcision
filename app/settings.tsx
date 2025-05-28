import { StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { useContext } from 'react';
import { ThemeContext } from '../context/theme_context';
import { 
  Surface, 
  List, 
  Switch, 
  useTheme
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Settings() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.surface}>
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

        <Link href="/" asChild>
          <List.Item
            title="Back to Home"
            left={props => <List.Icon {...props} icon="arrow-left" />}
          />
        </Link>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  surface: {
    flex: 1,
  },
});
