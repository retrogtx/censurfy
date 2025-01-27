import { BackHandler, Alert, Platform } from 'react-native'

// Simple list of blocked words/patterns - you can expand this
const BLOCKED_PATTERNS = [
  /adult/i,
  /xxx/i,
  /porn/i,
  // Add more patterns as needed
]

export const analyzeText = (text: string): boolean => {
  console.log('Analyzing text:', text) // Debug log
  
  const isBlocked = BLOCKED_PATTERNS.some(pattern => pattern.test(text))
  console.log('Is blocked?', isBlocked) // Debug log
  
  if (isBlocked) {
    console.log('Showing alert...') // Debug log
    Alert.alert(
      '⚠️ Inappropriate Content Detected',
      'This app will now close.',
      [{ 
        text: 'OK',
        onPress: () => {
          console.log('Alert OK clicked') // Debug log
          if (Platform.OS === 'web') {
            window.close()
          } else {
            BackHandler.exitApp()
          }
        }
      }]
    )
  }
  
  return isBlocked
} 