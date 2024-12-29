import { useColorScheme as useNativeColorScheme } from 'react-native';
import Colors from '../constants/Colors';

export type ColorScheme = keyof typeof Colors;

export function useColorScheme(): ColorScheme {
  return useNativeColorScheme() ?? 'light';
} 