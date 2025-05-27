import * as MediaLibrary from 'expo-media-library';

export async function getImagesFromAlbum(albumId: string) {
  const assets = await MediaLibrary.getAssetsAsync({ album: albumId, mediaType: 'photo', first: 1000 });
  return assets.assets;
}

export async function deleteImageById(id: string) {
  await MediaLibrary.deleteAssetsAsync([id]);
}

export const clearMediaLibraryCache = async () => {
};
