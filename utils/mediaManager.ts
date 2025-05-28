import { Album, PermissionStatus, requestPermissionsAsync, getAlbumsAsync, getAssetsAsync } from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MediaPermissionStatus {
  granted: boolean;
  error?: string;
}

export interface AlbumWithThumbnail extends Album {
  thumbnailUri?: string;
  assetCount: number;
}

class MediaManager {
  private static instance: MediaManager;
  private permissionStatus: PermissionStatus | null = null;

  private constructor() {}

  static getInstance(): MediaManager {
    if (!MediaManager.instance) {
      MediaManager.instance = new MediaManager();
    }
    return MediaManager.instance;
  }

  async requestPermissions(): Promise<MediaPermissionStatus> {
    try {
      const { status, accessPrivileges } = await requestPermissionsAsync();
      this.permissionStatus = status;

      if (status !== 'granted') {
        return {
          granted: false,
          error: 'Permission to access media library was denied'
        };
      }

      // Store permission status
      await AsyncStorage.setItem('mediaPermissionStatus', status);

      return { granted: true };
    } catch (error) {
      console.error('Error requesting media permissions:', error);
      return {
        granted: false,
        error: 'Failed to request media permissions'
      };
    }
  }

  async getPhotoAlbums(): Promise<AlbumWithThumbnail[]> {
    if (this.permissionStatus !== 'granted') {
      const permissionResult = await this.requestPermissions();
      if (!permissionResult.granted) {
        throw new Error(permissionResult.error);
      }
    }

    try {
      const albums = await getAlbumsAsync({
        mediaType: ['photo']  
      });

      const albumsWithThumbnails = await Promise.all(
        albums.map(async (album) => {
          if (album.assetCount > 0) {
            const assets = await getAssetsAsync({
              album: album.id,
              first: 1,
              mediaType: ['photo'],
              sortBy: ['creationTime']
            });

            return {
              ...album,
              thumbnailUri: assets.assets[0]?.uri
            };
          }
          return album;
        })
      );

      // Filter out empty albums
      return albumsWithThumbnails.filter(album => album.assetCount > 0);
    } catch (error) {
      console.error('Error fetching photo albums:', error);
      throw new Error('Failed to fetch photo albums');
    }
  }

  async clearMediaCache(): Promise<void> {
    try {
      // Clear AsyncStorage cache
      const keys = await AsyncStorage.getAllKeys();
      const mediaCacheKeys = keys.filter(key => key.startsWith('mediaCache_'));
      await AsyncStorage.multiRemove(mediaCacheKeys);
    } catch (error) {
      console.error('Error clearing media cache:', error);
      throw new Error('Failed to clear media cache');
    }
  }
}

export default MediaManager.getInstance();
