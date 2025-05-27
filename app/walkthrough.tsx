import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const slides = [
  { title: 'Welcome!', desc: 'This app helps you clean your photos easily.' },
  { title: 'Swipe Right', desc: 'Keep the image by swiping right.' },
  { title: 'Swipe Left', desc: 'Delete the image by swiping left (with confirmation).' },
];

export default function Walkthrough() {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  const next = async () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      await AsyncStorage.setItem('seenWalkthrough', 'true');
      router.replace('/');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">{slides[index].title}</Text>
      <Text style={{ marginVertical: 10 }}>{slides[index].desc}</Text>
      <Button mode="contained" onPress={next}>{index < slides.length - 1 ? 'Next' : 'Get Started'}</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }
});
