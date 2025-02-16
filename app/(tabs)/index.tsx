import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { IconName } from '@/app/types';

// Add type definitions for the Toggle props
interface ToggleProps {
  isEnabled: boolean;
  onToggle: (value: boolean) => void;
  size?: 'small' | 'large';
  icon: IconName;
}

const Toggle = ({ isEnabled, onToggle, size = 'large', icon }: ToggleProps) => {
  const offset = useSharedValue(isEnabled ? 1 : 0);

  // Add useEffect to sync animation with state changes
  useEffect(() => {
    offset.value = withSpring(isEnabled ? 1 : 0);
  }, [isEnabled, offset]);

  const toggleSwitch = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    const newValue = !isEnabled;
    offset.value = withSpring(newValue ? 1 : 0);
    onToggle(newValue);
  };

  const animatedStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      offset.value,
      [0, 1],
      ['#FF6B6B', '#4c669f']
    );

    return {
      backgroundColor,
      transform: [
        {
          translateX: withSpring(offset.value * (size === 'large' ? 40 : 20)),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      style={[
        styles.toggleContainer,
        size === 'small' && styles.toggleContainerSmall,
      ]}>
      <Animated.View
        style={[
          styles.toggleBackground,
          size === 'small' && styles.toggleBackgroundSmall,
          animatedStyles,
        ]}>
        <View
          style={[styles.handle, size === 'small' && styles.handleSmall]}>
          <Ionicons
            name={icon}
            size={size === 'large' ? 24 : 16}
            color={isEnabled ? '#4c669f' : '#FF6B6B'}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function ProtectionScreen() {
  const [isProtectionEnabled, setIsProtectionEnabled] = useState(false);
  const [isUninstallProtected, setIsUninstallProtected] = useState(false);

  return (
    <LinearGradient
      colors={['#1a1a1a', '#2d2d2d']}
      style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Content Protection</Text>
        <Text style={styles.subtitle}>
          Toggle to enable NSFW content blocking
        </Text>

        <Toggle
          isEnabled={isProtectionEnabled}
          onToggle={setIsProtectionEnabled}
          icon={isProtectionEnabled ? 'shield' : 'shield-outline'}
          size="large"
        />

        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Protection is {isProtectionEnabled ? 'Active' : 'Inactive'}
          </Text>
          <Text style={styles.statusDescription}>
            {isProtectionEnabled
              ? 'Your content is being filtered for inappropriate material'
              : 'Warning: Content filtering is disabled'}
          </Text>
        </View>

        <View style={styles.premiumFeature}>
          <View style={styles.premiumHeader}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.premiumText}>Premium Feature</Text>
          </View>
          <View style={styles.premiumToggle}>
            <View style={styles.premiumInfo}>
              <Text style={styles.premiumTitle}>
                Prevent App Uninstallation
              </Text>
              <Text style={styles.premiumDescription}>
                Lock the app to prevent unauthorized removal
              </Text>
            </View>
            <Toggle
              isEnabled={isUninstallProtected}
              onToggle={setIsUninstallProtected}
              icon={isUninstallProtected ? 'lock-closed' : 'lock-open'}
              size="small"
            />
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1,234</Text>
            <Text style={styles.statLabel}>Blocks Today</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'Inter-Medium',
  },
  toggleContainer: {
    marginBottom: 40,
  },
  toggleContainerSmall: {
    marginBottom: 0,
  },
  toggleBackground: {
    width: 90,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
  },
  toggleBackgroundSmall: {
    width: 56,
    height: 32,
    borderRadius: 16,
  },
  handle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  handleSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  statusDescription: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
  premiumFeature: {
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 40,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  premiumText: {
    color: '#FFD700',
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  premiumToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  premiumInfo: {
    flex: 1,
    marginRight: 15,
  },
  premiumTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  premiumDescription: {
    color: '#999',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 15,
    width: '45%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#4c669f',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#999',
    fontFamily: 'Inter-Medium',
  },
});