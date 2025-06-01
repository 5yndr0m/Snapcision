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
import { ActivityIndicator, Button, Text } from "react-native-paper";

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
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      const rotation = (event.translationX / SCREEN_WIDTH) * 15;
      scale.value = 1 - Math.abs(event.translationX / SCREEN_WIDTH) * 0.2;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        if (event.translationX < 0) {
          translateX.value = withSpring(-SCREEN_WIDTH, {}, () => {
            runOnJS(onMarkForDeletion)(assets[currentIndex]);
            translateX.value = 0;
            scale.value = withSpring(1);
          });
        } else {
          translateX.value = withSpring(SCREEN_WIDTH, {}, () => {
            runOnJS(onNext)();
            translateX.value = 0;
            scale.value = withSpring(1);
          });
        }
      } else {
        translateX.value = withSpring(0);
        scale.value = withSpring(1);
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

        <View style={styles.counterContainer}>
          <Text style={styles.counter}>
            {currentIndex + 1} / {assets.length}
          </Text>
          {markedForDeletion.size > 0 && (
            <Text style={styles.markedCount}>
              {markedForDeletion.size} marked for deletion
            </Text>
          )}
        </View>

        {currentIndex === assets.length - 1 && markedForDeletion.size > 0 && (
          <Button
            mode="contained"
            onPress={onBatchDelete}
            style={styles.deleteButton}
            icon="delete-sweep"
          >
            Delete {markedForDeletion.size} Photos
          </Button>
        )}

        <Text style={styles.hint}>
          Swipe left to mark for deletion, right to keep
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
  counterContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  markedCount: {
    color: "#ff6b6b",
    fontSize: 14,
    marginTop: 4,
  },
  deleteButton: {
    marginVertical: 16,
    backgroundColor: "#ff6b6b",
  },
  markedOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#ff6b6b",
    padding: 8,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  markedText: {
    color: "white",
    marginLeft: 8,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  overlayText: {
    color: "white",
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
