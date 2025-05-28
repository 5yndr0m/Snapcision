import { List } from 'react-native-paper';
import { Link } from 'expo-router';

export function BackToHomeButton() {
  return (
    <Link href="/" asChild>
      <List.Item
        title="Back to Home"
        left={props => <List.Icon {...props} icon="arrow-left" />}
      />
    </Link>
  );
}
