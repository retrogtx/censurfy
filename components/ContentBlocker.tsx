import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Switch, Alert, Linking, AppState, TextInput } from 'react-native'
import { ThemedText } from './ThemedText'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { analyzeText } from '@/lib/textAnalyzer'

export default function ContentBlocker() {
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    loadBlockerState()
  }, [])

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
    const state = await AsyncStorage.getItem('blockerEnabled')
    setIsEnabled(state === 'true')
  }

  const handleToggle = async (value: boolean) => {
    // Always update UI state immediately
    setIsEnabled(value)

    if (value) {
      Alert.alert(
        'Enable Content Blocker',
        'Warning: Once enabled, this cannot be disabled without system permissions. Are you sure?',
        [
          { 
            text: 'Cancel', 
            style: 'cancel',
            onPress: () => setIsEnabled(false)  // Revert if cancelled
          },
          {
            text: 'Enable',
            onPress: async () => {
              await AsyncStorage.setItem('blockerEnabled', 'true')
              // Keep it enabled and show settings prompt
              Alert.alert('Additional Setup Required', 'Please go to Settings to prevent app uninstallation',
                [{ text: 'Open Settings', onPress: () => Linking.openSettings() }]
              )
            }
          }
        ]
      )
    }
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Content Blocker</ThemedText>
      
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={isEnabled ? '#2196F3' : '#f4f3f4'}
        onValueChange={handleToggle}
        value={isEnabled}
      />
      <ThemedText style={styles.toggleText}>
        {isEnabled ? 'Blocker Enabled' : 'Enable Blocker'}
      </ThemedText>

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
  toggleText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '600',
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
}) 