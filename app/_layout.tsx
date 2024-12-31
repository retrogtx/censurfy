import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { View } from 'react-native';

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="dark"
            intensity={30}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ),
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center w-12 h-12 rounded-full">
              <MaterialIcons name="security" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="blocklist"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center w-12 h-12 rounded-full">
              <MaterialIcons name="block" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ color, size }) => (
            <View className="items-center justify-center w-12 h-12 rounded-full">
              <MaterialIcons name="settings" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
