import { StyleSheet, Dimensions, View } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from "react-native-reanimated";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { ActivityIndicator, Text } from "react-native-paper";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

interface AlbumViewerProps {
  assets: MediaLibrary.Asset[];
  currentIndex: number;
  onMarkForDeletion: (asset: MediaLibrary.Asset) => void;
  onNext: () => void;
  onPrevious: () => void;
  loading: boolean;
  deleting: boolean;
  markedForDeletion: Set<string>;
  reviewMode: boolean;
  onUnmark?: (asset: MediaLibrary.Asset) => void;
  onBatchDelete?: () => void;
}

export function AlbumViewer({
  assets,
  currentIndex,
  onMarkForDeletion,
  onNext,
  onPrevious,
  loading,
  deleting,
  markedForDeletion,
  reviewMode,
  onUnmark,
  onBatchDelete,
}: AlbumViewerProps) {
  const translateX = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - next image
        translateX.value = withSpring(SCREEN_WIDTH);
        runOnJS(onNext)();
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left - delete
        translateX.value = withSpring(-SCREEN_WIDTH);
        runOnJS(onDelete)(assets[currentIndex]);
      } else {
        // Reset position
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (assets.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No images in this album</Text>
      </View>
    );
  }

  const currentAsset = assets[currentIndex];

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={{ uri: currentAsset.uri }}
            style={styles.image}
            contentFit="contain"
          />
        </Animated.View>
      </GestureDetector>

      <View style={styles.footer}>
        {deleting && (
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="white" />
            <Text style={styles.overlayText}>Deleting...</Text>
          </View>
        )}

        <Text style={styles.counter}>
          {currentIndex + 1} / {assets.length}
        </Text>
        <Text style={styles.hint}>
          Swipe left to delete, right for next image
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  imageContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  image: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayText: {
    color: 'white',
    marginTop: 8,
  },
  counter: {
    color: "white",
    marginBottom: 4,
  },
  hint: {
    color: "white",
    opacity: 0.7,
    fontSize: 12,
  },
});
