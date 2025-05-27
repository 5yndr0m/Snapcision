import React, { useRef, useState, useEffect } from 'react';
import { View, Image, Dimensions, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Surface } from 'react-native-paper';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function ImageSwiper({
  images,
  onSwipe,
}: {
  images: any[];
  onSwipe: (id: string, action: 'keep' | 'delete') => void;
}) {
  const currentIndex = useRef(0);
  const [currentImage, setCurrentImage] = useState(images[0]);
  const translateX = useSharedValue(0);

  useEffect(() => {
    setCurrentImage(images[currentIndex.current]);
  }, [images]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const likeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [{ rotate: '-20deg' }],
  }));

  const nopeOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [{ rotate: '20deg' }],
  }));

  const handleGesture = (event: any) => {
    translateX.value = event.nativeEvent.translationX;
  };

  const handleEnd = (event: any) => {
    const { translationX } = event.nativeEvent;
    if (Math.abs(translationX) > SWIPE_THRESHOLD && currentImage) {
      const action = translationX < 0 ? 'delete' : 'keep';
      const id = currentImage.id;
      runOnJS(onSwipe)(id, action);
      translateX.value = 0;
      currentIndex.current += 1;
      runOnJS(setCurrentImage)(images[currentIndex.current]);
    } else {
      translateX.value = withSpring(0);
    }
  };

  if (!currentImage) {
    return (
      <View style={styles.center}>
        <Text>No more images</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.center}>
      <PanGestureHandler onGestureEvent={handleGesture} onEnded={handleEnd}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Surface style={styles.surface} elevation={4}>
            <Image
              source={{ uri: currentImage.uri }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.caption}>{currentImage.filename}</Text>
          </Surface>

          <Animated.Text style={[styles.label, styles.like, likeOpacity]}>
            KEEP
          </Animated.Text>
          <Animated.Text style={[styles.label, styles.nope, nopeOpacity]}>
            DELETE
          </Animated.Text>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '90%',
    height: '75%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  surface: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  caption: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 6,
    fontSize: 12,
  },
  label: {
    position: 'absolute',
    top: 40,
    fontSize: 32,
    fontWeight: 'bold',
    padding: 8,
    borderRadius: 8,
    zIndex: 10,
  },
  like: {
    left: 20,
    color: 'green',
    backgroundColor: 'rgba(0,255,0,0.2)',
  },
  nope: {
    right: 20,
    color: 'red',
    backgroundColor: 'rgba(255,0,0,0.2)',
  },
});
