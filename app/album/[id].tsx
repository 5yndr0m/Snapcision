import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MediaLibrary from 'expo-media-library';
import { Header } from '@/components/navigation/Header';
import { AlbumViewer } from '@/components/media/AlbumViewer';

const { width } = Dimensions.get('window');

export default function AlbumScreen() {
  const { id, title } = useLocalSearchParams();
  const router = useRouter();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [markedForDeletion, setMarkedForDeletion] = useState<Set<string>>(
    new Set(),
  );

  useEffect(() => {
    loadAssets();
  }, [id]);

  const loadAssets = async () => {
    try {
      const result = await MediaLibrary.getAssetsAsync({
        album: id as string,
        sortBy: ['creationTime'],
        mediaType: ['photo'],
      });
      setAssets(result.assets);
    } catch (error) {
      console.error('Error loading assets:', error);
      Alert.alert('Error', 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (asset: MediaLibrary.Asset) => {
    if (deleting) return; // Prevent multiple deletion attempts
  const handleMarkForDeletion = (asset: MediaLibrary.Asset) => {
    setMarkedForDeletion((prev) => {
      const newSet = new Set(prev);
      newSet.add(asset.id);
      return newSet;
    });
    handleNext();
  };

  const handleUnmark = (asset: MediaLibrary.Asset) => {
    setMarkedForDeletion((prev) => {
      const newSet = new Set(prev);
      newSet.delete(asset.id);
      return newSet;
    });
  };
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const permission = await MediaLibrary.requestPermissionsAsync(true);
              
              if (!permission.granted) {
                Alert.alert('Permission Denied', 'Cannot delete images without permission');
                return;
              }

              await MediaLibrary.deleteAssetsAsync([asset]);
              
              // Remove the asset from the state
              setAssets(currentAssets => 
                currentAssets.filter(a => a.id !== asset.id)
              );
              
              // If we deleted all images or the last image, go back
              if (assets.length <= 1) {
                router.back();
              }
              // If we deleted the current image, show the next one
              else if (currentIndex >= assets.length - 1) {
                setCurrentIndex(currentIndex - 1);
              }
            } catch (error) {
              console.error('Error deleting asset:', error);
              Alert.alert(
                'Error',
                'Failed to delete image. Please check app permissions in your device settings.'
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNext = () => {
    if (currentIndex < assets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title={title as string || 'Album'}
        onBackPress={() => router.back()}
      />
      <AlbumViewer
        assets={assets}
        currentIndex={currentIndex}
        onDelete={handleDelete}
        onNext={handleNext}
        onPrevious={handlePrevious}
        loading={loading}
        deleting={deleting}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
