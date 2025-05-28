import { StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { Link } from 'expo-router';

interface HeaderProps {
  title?: string;
  showSettings?: boolean;
  onBackPress?: () => void;
}

export function Header({
  title = 'Snapcision',
  showSettings = false,
  onBackPress
}: HeaderProps) {
  const theme = useTheme();

  return (
    <Appbar.Header
      statusBarHeight={0}
      backgroundColor={theme.colors.primary}
    >
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} />
      )}
      <Appbar.Content 
        title={title} 
        titleStyle={styles.title}
      />
      {showSettings && (
        <Link href="/settings" asChild>
          <Appbar.Action icon="cog" />
        </Link>
      )}
    </Appbar.Header>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: 'System',  
    fontWeight: '900', 
    fontSize: 20,
  },
});
