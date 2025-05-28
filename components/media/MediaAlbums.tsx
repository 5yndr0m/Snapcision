import { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';
import { AlbumThumbnail } from './AlbumThumbnail';

export function MediaAlbums() {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [permission, setPermission] = useState<MediaLibrary.PermissionResponse>();

  useEffect(() => {
    (async () => {
      const permissionResult = await MediaLibrary.requestPermissionsAsync();
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
      renderItem={({ item }) => <AlbumThumbnail album={item} />}
      numColumns={2}
      contentContainerStyle={styles.content}
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
    padding: 4,
  },
});
