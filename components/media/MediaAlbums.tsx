import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { AlbumThumbnail } from './AlbumThumbnail';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const GAP = 8;
const ITEM_WIDTH = (width - (GAP * (COLUMN_COUNT + 2))) / COLUMN_COUNT;

export function MediaAlbums() {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<MediaLibrary.PermissionResponse>();

  useEffect(() => {
    (async () => {
      const permissionResult = await MediaLibrary.requestPermissionsAsync(true);
      setPermission(permissionResult);

      if (permissionResult.granted) {
        const albumsResult = await MediaLibrary.getAlbumsAsync({
          includeSmartAlbums: true
        });
        setAlbums(albumsResult);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Text>Permission to access media library was denied</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={albums}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <AlbumThumbnail 
          album={item} 
          width={ITEM_WIDTH}
        />
      )}
      numColumns={COLUMN_COUNT}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: GAP,
  },
  row: {
    justifyContent: 'flex-start',
    gap: GAP,
  },
});
