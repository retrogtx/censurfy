import { Alert, StyleSheet } from 'react-native';
import { Surface, Text, Switch, List, RadioButton, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
import { appSettingsState } from '@/store/atoms';
import { DNS_PROVIDERS, testDNSBlocking } from '@/utils/dns';

export default function SettingsScreen() {
  const [settings, setSettings] = useRecoilState(appSettingsState);

  const toggleParentalControl = () => {
    setSettings(prev => ({
      ...prev,
      parentalControlEnabled: !prev.parentalControlEnabled
    }));
  };

  const changeDNSProvider = (provider: keyof typeof DNS_PROVIDERS) => {
    setSettings(prev => ({
      ...prev,
      dnsProvider: provider
    }));
  };

  const testDNSProtection = async () => {
    const testDomain = 'adult.com';
    const isBlocked = await testDNSBlocking(testDomain);
    Alert.alert(
      'DNS Protection Test',
      isBlocked 
        ? 'DNS blocking is working correctly!' 
        : 'DNS blocking is not active. Please check your settings.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.section}>
        <List.Section>
          <List.Subheader>DNS Settings</List.Subheader>
          <RadioButton.Group 
            onValueChange={value => changeDNSProvider(value as keyof typeof DNS_PROVIDERS)} 
            value={settings.dnsProvider}>
            {Object.entries(DNS_PROVIDERS).map(([key, value]) => (
              <List.Item
                key={key}
                title={value.name}
                description={`${value.primary}, ${value.secondary}`}
                left={() => <RadioButton value={key} />}
              />
            ))}
          </RadioButton.Group>
        </List.Section>

        <List.Section>
          <List.Subheader>Protection Settings</List.Subheader>
          <List.Item
            title="Parental Controls"
            description="Enable additional content filtering"
            right={() => (
              <Switch
                value={settings.parentalControlEnabled}
                onValueChange={toggleParentalControl}
              />
            )}
          />
        </List.Section>

        <Button 
          mode="contained"
          onPress={testDNSProtection}
          style={styles.button}>
          Test DNS Protection
        </Button>
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  button: {
    margin: 16,
  },
}); 