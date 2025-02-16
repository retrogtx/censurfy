import React from 'react';
import { View, Text, Button, Platform, StyleSheet } from 'react-native';
import { NativeModules } from 'react-native';

const { AccessibilityModule } = NativeModules;

const SystemAccessibilityPrompt = () => {
  if (Platform.OS !== 'android') return null;

  const openSettings = () => {
    AccessibilityModule.openAccessibilitySettings();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.info}>
        To enable system‑wide blocking, please enable our accessibility service in your device settings.
      </Text>
      <Button title="Open Accessibility Settings" onPress={openSettings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  info: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
});

export default SystemAccessibilityPrompt; 