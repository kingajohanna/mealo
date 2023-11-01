import { DefaultTheme } from 'react-native-paper';
import { Colors } from './colors';

export const baseTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primaryContainer: Colors.salmon,
    secondaryContainer: 'transparent',
    backgroundColor: Colors.beige,
  },
};
