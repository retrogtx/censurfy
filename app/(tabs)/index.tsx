import { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, Surface, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
import { appSettingsState } from '@/store/atoms';
import * as WebBrowser from 'expo-web-browser';
import { checkDNSConfiguration } from '@/utils/dns';

export default function HomeScreen() {
  const [settings, setSettings] = useRecoilState(appSettingsState);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const toggleProtection = () => {
    setSettings(prev => ({
      ...prev,
      isProtectionEnabled: !prev.isProtectionEnabled
    }));
  };

  const configureDNS = async () => {
    setIsConfiguring(true);
    try {
      await WebBrowser.openBrowserAsync(
        'https://developers.cloudflare.com/1.1.1.1/setup/'
      );
    } catch (error) {
      console.error('Error opening browser:', error);
    } finally {
      setIsConfiguring(false);
    }
  };

  useEffect(() => {
    const checkDNS = async () => {
      const isConfigured = await checkDNSConfiguration();
      setSettings(prev => ({
        ...prev,
        dnsStatus: {
          configured: isConfigured,
          lastChecked: new Date().toISOString()
        }
      }));
    };

    if (settings.isProtectionEnabled) {
      checkDNS();
    }
  }, [settings.isProtectionEnabled]);

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.statusCard}>
        <Text variant="headlineMedium">Protection Status</Text>
        <View style={styles.statusRow}>
          <Text variant="bodyLarge">
            {settings.isProtectionEnabled ? 'Protection Active' : 'Protection Disabled'}
          </Text>
          <Switch value={settings.isProtectionEnabled} onValueChange={toggleProtection} />
        </View>
      </Surface>

      <Surface style={[styles.statusCard, styles.marginTop]}>
        <Text variant="titleMedium">DNS Configuration</Text>
        <Text variant="bodyMedium" style={styles.marginTop}>
          Using {settings.dnsProvider} DNS
        </Text>
        <Button 
          mode="contained"
          onPress={configureDNS}
          loading={isConfiguring}
          style={styles.marginTop}>
          Configure DNS Settings
        </Button>
      </Surface>

      {settings.isProtectionEnabled && !settings.dnsStatus.configured && (
        <Surface style={[styles.statusCard, styles.marginTop, styles.warning]}>
          <Text variant="titleMedium">DNS Not Configured</Text>
          <Text variant="bodyMedium" style={styles.marginTop}>
            Please configure your DNS settings to enable protection
          </Text>
          <Button 
            mode="contained"
            onPress={configureDNS}
            style={styles.marginTop}>
            Configure Now
          </Button>
        </Surface>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  marginTop: {
    marginTop: 16,
  },
  warning: {
    backgroundColor: '#ffd700',
  },
});
