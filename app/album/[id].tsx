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
  const [hasPermissions, setHasPermissions] = useState(false);

  useEffect(() => {
    (async () => {
      const permission = await MediaLibrary.requestPermissionsAsync(true);
      setHasPermissions(permission.granted);
      if (permission.granted) {
        loadAssets();
      } else {
        setLoading(false);
        Alert.alert(
          "Permission Required",
          "This app needs access to your media library to function. Please grant permission in your device settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    })();
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
  const handleBatchDelete = async () => {
    if (deleting || markedForDeletion.size === 0) return;

    const { granted } = await MediaLibrary.getPermissionsAsync();
    if (!granted) {
      const { granted: newGranted } =
        await MediaLibrary.requestPermissionsAsync(true);
      if (!newGranted) {
        Alert.alert(
          "Permission Required",
          "This app needs permission to delete photos. Please grant permission in your device settings.",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
        );
        return;
      }
    }

    Alert.alert(
      "Delete Images",
      `Are you sure you want to delete ${markedForDeletion.size} marked images?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);

              const assetsToDelete = assets.filter((asset) =>
                markedForDeletion.has(asset.id),
              );

              const result =
                await MediaLibrary.deleteAssetsAsync(assetsToDelete);

              if (!result) {
                throw new Error("Failed to delete assets");
              }

              setAssets((currentAssets) =>
                currentAssets.filter((a) => !markedForDeletion.has(a.id)),
              );
              setMarkedForDeletion(new Set());

              if (assets.length === assetsToDelete.length) {
                router.back();
              } else {
                setCurrentIndex(0);
                setReviewMode(false);
              }
            } catch (error) {
              console.error("Error deleting assets:", error);
              Alert.alert(
                "Error",
                "Failed to delete images. Please try again or check app permissions.",
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
      { cancelable: true },
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
