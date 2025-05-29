import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, ActivityIndicator, Text } from 'react-native-paper';
import * as MediaLibrary from 'expo-media-library';

interface AlbumThumbnailProps {
  album: MediaLibrary.Album;
  width: number;
}

export function AlbumThumbnail({ album, width }: AlbumThumbnailProps) {
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
    <Card style={[styles.card, { width }]}>
      <Card.Cover
        source={thumbnail ? { uri: thumbnail.uri } : require('@/assets/placeholder.png')}
        style={[styles.thumbnail, { width }]}
      />
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" numberOfLines={1} style={styles.title}>
          {album.title}
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          {album.assetCount} items
        </Text>
      </Card.Content>
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
    marginBottom: 8,
  },
  thumbnail: {
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  content: {
    paddingVertical: 8,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    opacity: 0.7,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
