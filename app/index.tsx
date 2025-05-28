import { StyleSheet } from "react-native";
import { Surface, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/navigation/Header";
import { MediaAlbums } from "@/components/media/MediaAlbums";

export default function Index() {
  return (
    <SafeAreaView style={styles.container}>
      <Header showSettings />
      <Surface style={styles.content}>
       <MediaAlbums/>
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
