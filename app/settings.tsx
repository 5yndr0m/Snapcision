import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { BackToHomeButton } from '@/components/navigation/BackToHomeButton';

export default function Settings() {
  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.surface}>
        <AppearanceSettings />
        <BackToHomeButton />
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  surface: { flex: 1 },
});
