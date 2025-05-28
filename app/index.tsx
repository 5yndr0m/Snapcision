import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useState, useCallback } from "react";
import {
  Appbar,
  Text,
  ActivityIndicator,
  useTheme,
  Card,
  IconButton,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MediaManager, { AlbumWithThumbnail } from "../utils/mediaManager";

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const spacing = 8; 

export default function Home() {
  const theme = useTheme();
  const [albums, setAlbums] = useState<AlbumWithThumbnail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError(null);

      const permissionStatus = await MediaManager.requestPermissions();
      if (!permissionStatus.granted) {
        setError(permissionStatus.error? permissionStatus.error : "Failed to load albums");
        return;
      }

      const fetchedAlbums = await MediaManager.getPhotoAlbums();
      setAlbums(fetchedAlbums);
    } catch (err) {
      setError("Failed to load albums");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAlbums();
    }, []),
  );

  const renderAlbumTile = ({ item }: { item: AlbumWithThumbnail }) => (
    <Card
      style={[styles.tile, { backgroundColor: theme.colors.surfaceVariant }]}
      onPress={() => router.push(`/review/${item.id}`)}
      mode="elevated"
    >
      <Card.Cover
        source={
          item.thumbnailUri
            ? { uri: item.thumbnailUri }
            : require("../assets/placeholder.png")
        }
        style={styles.thumbnail}
      />
      <Card.Content style={styles.albumInfo}>
        <Text variant="titleMedium" numberOfLines={1}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.secondary }}>
          {item.assetCount} photos
        </Text>
      </Card.Content>
    </Card>
  );

  const renderErrorState = () => (
    <View
      style={[
        styles.centerContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text variant="headlineSmall" style={{ color: theme.colors.error }}>
        {error}
      </Text>
      <IconButton
        icon="refresh"
        mode="contained"
        size={24}
        onPress={loadAlbums}
        style={{ marginTop: 16 }}
      />
    </View>
  );

  const renderLoadingState = () => (
    <View
      style={[
        styles.centerContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header elevated>
        <Appbar.Content title="Snapcision" titleStyle={styles.title} />
        <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
      </Appbar.Header>

      {loading ? (
        renderLoadingState()
      ) : error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={albums}
          renderItem={renderAlbumTile}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.gridContainer}
          onRefresh={loadAlbums}
          refreshing={loading}
          style={{ backgroundColor: theme.colors.background }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: "sans-serif-medium",
    fontSize: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  gridContainer: {
    padding: spacing,
  },
  tile: {
    flex: 1,
    margin: spacing,
    maxWidth: (screenWidth - spacing * (numColumns + 1)) / numColumns,
  },
  thumbnail: {
    height: 160,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  albumInfo: {
    paddingVertical: 8,
  },
});
