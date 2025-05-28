import { StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { Header } from '@/components/navigation/Header';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="Settings"
        onBackPress={() => router.back()}
      />
      <Surface style={styles.content}>
        <AppearanceSettings />
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  content: { 
    flex: 1,
    padding: 16,
  },
});
