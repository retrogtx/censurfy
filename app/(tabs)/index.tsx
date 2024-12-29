import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Switch, Text, Surface, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
import { monitoringStatusState } from '@/store/atoms';
import MonitoringService from '@/services/MonitoringService';

export default function HomeScreen() {
  const [monitoringStatus, setMonitoringStatus] = useRecoilState(monitoringStatusState);
  const [isLoading, setIsLoading] = useState(false);

  const toggleMonitoring = async () => {
    setIsLoading(true);
    try {
      const monitoringService = MonitoringService.getInstance();
      
      if (monitoringStatus.isActive) {
        await monitoringService.stopMonitoring();
      } else {
        await monitoringService.startMonitoring();
      }

      setMonitoringStatus((prev: typeof monitoringStatus) => ({
        ...prev,
        isActive: !prev.isActive,
        lastCheck: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to toggle monitoring:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.statusCard}>
        <Text variant="titleLarge">Content Protection</Text>
        <View style={styles.row}>
          <Text>Protection Status</Text>
          <Switch
            value={monitoringStatus.isActive}
            onValueChange={toggleMonitoring}
            disabled={isLoading}
          />
        </View>
        <Text style={styles.stats}>
          Blocked Content: {monitoringStatus.blockedCount}
        </Text>
      </Surface>
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
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stats: {
    opacity: 0.7,
  },
});
