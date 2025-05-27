import { useEffect, useState } from 'react';
import { Text, FlatList, TouchableOpacity } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useRouter } from 'expo-router';

export default function AlbumListScreen() {
  const [albums, setAlbums] = useState<MediaLibrary.Album[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const fetchedAlbums = await MediaLibrary.getAlbumsAsync();
        setAlbums(fetchedAlbums);
      }
    })();
  }, []);

  return (
    <FlatList
      data={albums}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => router.push(`/review/${item.id}`)}>
          <Text>{item.title}</Text>
        </TouchableOpacity>
      )}
    />
  );
}