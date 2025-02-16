import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import type { IconName } from '@/app/types';

const storage = {
  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.removeItem(key);
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export default function SettingsScreen() {
  const handleLogout = async () => {
    await storage.removeItem('userToken');
    router.replace('/login');
  };

  const settings: Array<{title: string; icon: IconName; color: string}> = [
    {
      title: 'Notification Settings',
      icon: 'notifications-sharp',
      color: '#4c669f',
    },
    {
      title: 'Content Filters',
      icon: 'filter' as IconName,
      color: '#3b5998',
    },
    {
      title: 'Security',
      icon: 'lock-closed',
      color: '#192f6a',
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      color: '#4c669f',
    },
    {
      title: 'About',
      icon: 'information-circle',
      color: '#3b5998',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.settingsContainer}>
        {settings.map((setting, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              index === settings.length - 1 && styles.lastItem,
            ]}>
            <View style={[styles.settingIcon, { backgroundColor: setting.color + '20' }]}>
              <Ionicons
                name={setting.icon}
                size={24}
                color={setting.color}
              />
            </View>
            <Text style={styles.settingTitle}>{setting.title}</Text>
            <Ionicons
              name="chevron-forward-sharp"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}>
        <Ionicons name="log-out-sharp" size={24} color="#FF6B6B" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  settingsContainer: {
    backgroundColor: '#2a2a2a',
    marginTop: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginLeft: 10,
    fontFamily: 'Inter-Medium',
  },
  version: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    fontFamily: 'Inter-Medium',
  },
});