import { StyleSheet } from 'react-native';
import { List, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilValue } from 'recoil';
import { blockEventsState } from '@/store/atoms';

export default function SettingsScreen() {
  const blockEvents = useRecoilValue(blockEventsState);

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.section}>
        <List.Section title="Block History">
          {blockEvents.map(event => (
            <List.Item
              key={event.id}
              title={event.keyword}
              description={`Detected: ${event.detectedText}`}
              right={props => <List.Icon {...props} icon="alert" />}
            />
          ))}
        </List.Section>
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
}); 