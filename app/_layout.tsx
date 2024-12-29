import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { RecoilRoot } from 'recoil';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { MaterialIcons } from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <RecoilRoot>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <PaperProvider>
          <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#0a7ea4',
          }}>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="home" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="blocklist"
              options={{
                title: 'Blocklist',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="block" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="settings"
              options={{
                title: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <MaterialIcons name="settings" size={size} color={color} />
                ),
              }}
            />
          </Tabs>
        </PaperProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
}
