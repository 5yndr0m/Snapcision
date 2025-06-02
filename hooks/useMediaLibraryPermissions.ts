import { useEffect, useState } from 'react';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking, Platform } from 'react-native';

export function useMediaLibraryPermissions() {
  const [hasPermissions, setHasPermissions] = useState(false);

  const checkAndRequestPermissions = async () => {
    try {
      let { status, granted } = await MediaLibrary.getPermissionsAsync();

      if (status === 'undetermined') {
        const result = await MediaLibrary.requestPermissionsAsync(true);
        granted = result.granted;
        status = result.status;
      }

      if (!granted && status === 'denied') {
        Alert.alert(
          'Permission Required',
          'This app needs access to your media library to function. Please grant permission in your device settings.',
          [
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      }

      setHasPermissions(granted);
      return granted;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return false;
    }
  };

  return { hasPermissions, checkAndRequestPermissions };
}
