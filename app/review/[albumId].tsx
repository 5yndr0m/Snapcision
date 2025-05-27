import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Alert, Platform } from 'react-native';
import { getImagesFromAlbum, deleteImageById } from '../../utils/media';
import ImageSwiper from '../../components/ImageSwiper';

export default function ReviewScreen() {
  const { albumId } = useLocalSearchParams();
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const imgs = await getImagesFromAlbum(albumId as string);
      setImages(imgs);
    })();
  }, [albumId]);

  const handleSwipe = async (imageId: string, action: 'keep' | 'delete') => {
    if (action === 'delete') {
      const confirmDelete = Platform.OS === 'web'
        ? window.confirm('Are you sure you want to delete this image?')
        : await new Promise((resolve) => {
            Alert.alert(
              'Delete Image',
              'Are you sure you want to delete this image?',
              [
                { text: 'Cancel', onPress: () => resolve(false), style: 'cancel' },
                { text: 'Delete', onPress: () => resolve(true), style: 'destructive' },
              ],
              { cancelable: true }
            );
          });
      if (!confirmDelete) return;
      await deleteImageById(imageId);
    }
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageSwiper images={images} onSwipe={handleSwipe} />
    </View>
  );
}