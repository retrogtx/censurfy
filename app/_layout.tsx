import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { NativeModules, Platform, Alert, AppState } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Define the interface for our native module
interface AccessibilityModuleInterface {
  isAccessibilityServiceEnabled(): Promise<boolean>;
  openAccessibilitySettings(): void;
}

// Access the native module
const AccessibilityModule = NativeModules.AccessibilityModule as AccessibilityModuleInterface;

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Function to check and request accessibility permission
  const checkAccessibilityPermission = async () => {
    if (Platform.OS === 'android' && AccessibilityModule) {
      try {
        const isEnabled = await AccessibilityModule.isAccessibilityServiceEnabled();
        console.log('Accessibility Service Enabled:', isEnabled); // For debugging

        if (!isEnabled) {
          Alert.alert(
            'Permission Required',
            'Censurfy needs Accessibility permission to monitor screen content for NSFW words. Please enable it in Settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
                onPress: () => console.log('User declined Accessibility permission.'),
              },
              {
                text: 'Open Settings',
                onPress: () => AccessibilityModule.openAccessibilitySettings(),
              },
            ],
            { cancelable: false }
          );
        }
      } catch (error) {
        console.error('Failed to check or request Accessibility permission:', error);
        Alert.alert('Error', 'Could not check Accessibility permission.');
      }
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      // Initial check when the app loads and assets are ready
      checkAccessibilityPermission();

      // Optional: Re-check when the app comes back to the foreground
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          console.log('App has come to the foreground, re-checking permission.');
          checkAccessibilityPermission();
        }
      });

      // Clean up the subscription on unmount
      return () => {
        subscription.remove();
      };
    }
  }, [loaded]); // Rerun effect when loaded status changes

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
