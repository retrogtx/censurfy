import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch, Alert, Linking, AppState, TextInput, Platform, NativeModules } from 'react-native'
import { ThemedText } from './ThemedText'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { analyzeText } from '@/lib/textAnalyzer'

export default function ContentBlocker() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [lockEndTime, setLockEndTime] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<string>('')

  useEffect(() => {
    loadBlockerState()
  }, [])

  // Add this new useEffect to check timer status
  useEffect(() => {
    if (isEnabled && lockEndTime) {
      const interval = setInterval(() => {
        const now = Date.now()
        if (now >= lockEndTime) {
          setRemainingTime('Expired')
          setIsEnabled(false)
          AsyncStorage.setItem('blockerEnabled', 'false')
          AsyncStorage.removeItem('lockEndTime')
          clearInterval(interval)
        } else {
          const diff = lockEndTime - now
          const minutes = Math.floor(diff / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setRemainingTime(`${minutes}m ${seconds}s`)
        }
      }, 1000)

      return () => clearInterval(interval)
    } else {
      setRemainingTime('')
    }
  }, [isEnabled, lockEndTime])

  // Simplified monitoring
  useEffect(() => {
    if (isEnabled) {
      const subscription = AppState.addEventListener('change', (nextAppState) => {
        if (nextAppState === 'active') {
          console.log('App became active')
        }
      })

      return () => {
        subscription.remove()
      }
    }
  }, [isEnabled])

  const loadBlockerState = async () => {
    try {
      const state = await AsyncStorage.getItem('blockerEnabled')
      const endTime = await AsyncStorage.getItem('lockEndTime')
      const endTimeNum = endTime ? parseInt(endTime) : null

      // Check if timer has expired
      if (endTimeNum && Date.now() >= endTimeNum) {
        // Timer expired, disable blocker
        setIsEnabled(false)
        setLockEndTime(null)
        await AsyncStorage.setItem('blockerEnabled', 'false')
        await AsyncStorage.removeItem('lockEndTime')
      } else {
        // Set states based on stored values
        setIsEnabled(state === 'true')
        setLockEndTime(endTimeNum)
      }
    } catch (error) {
      // If any error, ensure blocker is disabled
      setIsEnabled(false)
      setLockEndTime(null)
      await AsyncStorage.setItem('blockerEnabled', 'false')
      await AsyncStorage.removeItem('lockEndTime')
    }
  }

  const canDisable = () => {
    // If no timer set, it was never properly enabled
    if (!lockEndTime) return true
    return Date.now() >= lockEndTime
  }

  const openDeviceSettings = () => {
    if (Platform.OS === 'android') {
      // Open device admin settings directly
      Linking.openSettings().catch(() => {
        // Fallback to specific Android settings
        Linking.sendIntent('android.settings.SECURITY_SETTINGS')
          .catch(() => {
            // If all fails, open general settings
            Alert.alert('Please enable Device Admin in Security settings manually')
          })
      })
    } else if (Platform.OS === 'ios') {
      // For iOS, open Screen Time settings
      Linking.openURL('app-settings:Screen Time')
        .catch(() => {
          // Fallback to general settings
          Linking.openSettings()
        })
    }
  }

  const simulateDeviceAdmin = () => {
    Alert.alert(
      'Device Admin Required',
      'In the actual APK build, this will request device admin permissions to prevent uninstallation.',
      [
        { text: 'OK' }
      ]
    )
  }

  const handleToggle = async (value: boolean) => {
    if (value) {
      // Turning ON - Ask for duration first
      Alert.alert(
        'Set Lock Duration',
        'How long should the blocker stay enabled?',
        [
          { text: 'Cancel', style: 'cancel', onPress: () => setIsEnabled(false) },
          {
            text: '1 min (test)',
            onPress: () => enableBlocker(1)
          },
          {
            text: '24 hours',
            onPress: () => enableBlocker(24 * 60)
          },
          {
            text: '7 days',
            onPress: () => enableBlocker(7 * 24 * 60)
          }
        ]
      )
    } else {
      // Trying to turn OFF
      if (!canDisable()) {
        const timeLeft = Math.ceil((lockEndTime! - Date.now()) / (1000 * 60))
        Alert.alert(
          'Cannot Disable Yet',
          `Blocker can be disabled in ${timeLeft > 0 ? timeLeft : 1} minutes.`,
          [{ 
            text: 'OK',
            onPress: () => setIsEnabled(true)
          }]
        )
      } else {
        setIsEnabled(false)
        await AsyncStorage.setItem('blockerEnabled', 'false')
        await AsyncStorage.removeItem('lockEndTime')
      }
    }
  }

  const enableBlocker = async (durationMinutes: number) => {
    const endTime = Date.now() + durationMinutes * 60 * 1000
    await AsyncStorage.setItem('lockEndTime', endTime.toString())
    await AsyncStorage.setItem('blockerEnabled', 'true')
    setLockEndTime(endTime)
    setIsEnabled(true)
    
    if (__DEV__) {
      Alert.alert(
        'Development Mode',
        'In production, this would:\n\n' +
        '1. Request device admin permissions\n' +
        '2. Prevent app uninstallation\n' +
        '3. Lock settings access\n\n' +
        `Will unlock in ${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`
      )
    } else {
      requestDeviceAdmin()
    }
  }

  const requestDeviceAdmin = async () => {
    if (Platform.OS === 'android') {
      try {
        // This would require a native module
        await NativeModules.DeviceAdmin.requestAdminPrivileges()
        Alert.alert('Success', 'App protection enabled')
      } catch (error) {
        Alert.alert('Error', 'Failed to enable app protection')
      }
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Content Blocker</ThemedText>
      
      <View style={styles.toggleContainer}>
        <Switch
          style={styles.switch}
          trackColor={{ false: '#767577', true: '#4CAF50' }}
          thumbColor={isEnabled ? '#fff' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleToggle}
          value={isEnabled}
        />
        <ThemedText style={[
          styles.toggleText,
          { color: isEnabled ? '#4CAF50' : '#666' }
        ]}>
          {isEnabled ? 'Blocker Enabled' : 'Enable Blocker'}
        </ThemedText>
        {remainingTime ? (
          <ThemedText style={styles.timerText}>
            Time remaining: {remainingTime}
          </ThemedText>
        ) : null}
      </View>

      {/* Development Test Area */}
      {__DEV__ && (
        <View style={styles.testArea}>
          <ThemedText style={styles.subtitle}>Development Testing</ThemedText>
          <TextInput
            style={styles.testInput}
            placeholder="Type 'adult' to test blocking..."
            onChangeText={(text) => {
              console.log('Input changed:', text) // Debug log
              const result = analyzeText(text)
              console.log('Analysis result:', result) // Debug log
            }}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  toggleContainer: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switch: {
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
    marginBottom: 10,
  },
  toggleText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  testArea: {
    width: '100%',
    marginTop: 40,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  testInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    color: '#000',
    backgroundColor: '#fff',
  },
  timerText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}) 