import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function Settings() {
  return (
    <View>
      <Text>Settings Page</Text>
      <Link href="/">
        Go Back Home
      </Link>
    </View>
  );
}
