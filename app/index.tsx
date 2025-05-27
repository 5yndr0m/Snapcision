import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View>
      <Text>Welcome to Snapcision</Text>
      <Link href="/albums"><Button title="Select Album" /></Link>
      <Link href="/settings"><Button title="Settings" /></Link>
    </View>
  );
}
