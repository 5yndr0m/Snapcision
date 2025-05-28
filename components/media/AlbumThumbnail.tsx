import { useEffect, useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';

interface AlbumThumbnailProps {
  album: MediaLibrary.Album;
}

export function AlbumThumbnail({ album }: AlbumThumbnailProps) {
  const [thumbnail, setThumbnail] = useState<MediaLibrary.Asset | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 1,
          sortBy: ['creationTime'],
        });

        if (assets.assets.length > 0) {
          setThumbnail(assets.assets[0]);
        }
      } catch (error) {
        console.error('Error loading thumbnail:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [album.id]);

  return (
    <Card style={styles.card}>
      <Card.Cover
        source={thumbnail ? { uri: thumbnail.uri } : require('@/assets/placeholder.png')}
        style={styles.thumbnail}
      />
      <Card.Title
        title={album.title}
        subtitle={`${album.assetCount} items`}
        titleNumberOfLines={1}
      />
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="small" />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 8,
  },
  thumbnail: {
    height: 150,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
