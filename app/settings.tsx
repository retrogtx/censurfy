import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useState } from 'react';

interface SettingItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  isActive: boolean;
  onPress: () => void;
}

function SettingItem({ icon, title, description, isActive, onPress }: SettingItemProps) {
  return (
    <BlurView intensity={20} tint="dark" className="overflow-hidden rounded-2xl mb-3">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        className={`flex-row items-center p-4 ${isActive ? 'bg-green-500/10' : 'bg-slate-800/30'}`}
      >
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isActive ? 'bg-green-500/20' : 'bg-slate-700/30'
        }`}>
          <MaterialIcons 
            name={icon} 
            size={20} 
            color={isActive ? "#22c55e" : "#94a3b8"} 
          />
        </View>
        <View className="flex-1">
          <Text className={`font-medium ${isActive ? 'text-green-500' : 'text-white'}`}>
            {title}
          </Text>
          <Text className="text-slate-400 text-sm mt-0.5">
            {description}
          </Text>
        </View>
        <MaterialIcons 
          name={isActive ? "toggle-on" : "toggle-off"} 
          size={28} 
          color={isActive ? "#22c55e" : "#64748b"} 
        />
      </TouchableOpacity>
    </BlurView>
  );
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    exitOnDetection: true,
    notifications: true,
    preventReopen: false,
    timerLock: false,
    autoStart: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={['#0f172a', '#020617']}
        className="absolute inset-0"
      />

      {/* Safe Area Spacer */}
      <View className="h-12" />

      {/* Header */}
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-white">Settings</Text>
        <Text className="text-slate-400 mt-1">
          Customize your protection
        </Text>
      </View>

      {/* Settings List */}
      <ScrollView className="flex-1 px-6">
        <View className="py-4">
          <Text className="text-slate-400 text-sm uppercase tracking-wider mb-3">
            Protection
          </Text>
          
          <SettingItem
            icon="logout"
            title="Exit on Detection"
            description="Automatically exit apps with blocked content"
            isActive={settings.exitOnDetection}
            onPress={() => toggleSetting('exitOnDetection')}
          />

          <SettingItem
            icon="notifications"
            title="Show Notifications"
            description="Get notified when content is blocked"
            isActive={settings.notifications}
            onPress={() => toggleSetting('notifications')}
          />

          <Text className="text-slate-400 text-sm uppercase tracking-wider mb-3 mt-6">
            Security
          </Text>

          <SettingItem
            icon="block"
            title="Prevent App Reopen"
            description="Block immediate reopening of restricted apps"
            isActive={settings.preventReopen}
            onPress={() => toggleSetting('preventReopen')}
          />

          <SettingItem
            icon="timer"
            title="Timer Lock"
            description="Set a timer to prevent settings changes"
            isActive={settings.timerLock}
            onPress={() => toggleSetting('timerLock')}
          />

          <SettingItem
            icon="play-circle-outline"
            title="Auto-start Protection"
            description="Enable protection when device starts"
            isActive={settings.autoStart}
            onPress={() => toggleSetting('autoStart')}
          />
        </View>
      </ScrollView>
    </View>
  );
} 