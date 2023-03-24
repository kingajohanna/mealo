import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {Colors} from './colors';

export const baseTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primaryContainer: Colors.vibrant,
    secondaryContainer: 'transparent',
  },
};
