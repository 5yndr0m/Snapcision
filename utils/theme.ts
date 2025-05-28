import { MD3DarkTheme, MD3LightTheme, configureFonts } from 'react-native-paper';

const lightColors = {
  ...MD3LightTheme.colors,
  primary: '#006C51',
  onPrimary: '#FFFFFF',
  primaryContainer: '#85F8CE',
  onPrimaryContainer: '#002116',
  secondary: '#4B635B',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#CDE8DE',
  onSecondaryContainer: '#072019',
  tertiary: '#3D6373',
  onTertiary: '#FFFFFF',
  tertiaryContainer: '#C1E8FB',
  onTertiaryContainer: '#001F29',
  surface: '#F8FAF8',
  surfaceVariant: '#DBE5E0',
};

const darkColors = {
  ...MD3DarkTheme.colors,
  primary: '#67DBB2',
  onPrimary: '#003828',
  primaryContainer: '#00513C',
  onPrimaryContainer: '#85F8CE',
  secondary: '#B1CCC2',
  onSecondary: '#1C352E',
  secondaryContainer: '#334B44',
  onSecondaryContainer: '#CDE8DE',
  tertiary: '#A5CCDE',
  onTertiary: '#063543',
  tertiaryContainer: '#234A5A',
  onTertiaryContainer: '#C1E8FB',
  surface: '#191C1B',
  surfaceVariant: '#404944',
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
    },
  },
};

export const customLightTheme = {
  ...MD3LightTheme,
  colors: lightColors,
  fonts: configureFonts({ config: fontConfig }),
};

export const customDarkTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
  fonts: configureFonts({ config: fontConfig }),
};
