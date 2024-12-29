import { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Surface, Text, TextInput, Button, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
import { blockedSitesState } from '../store/atoms';
import { nanoid } from 'nanoid';

export default function BlocklistScreen() {
  const [blockedSites, setBlockedSites] = useRecoilState(blockedSitesState);
  const [newUrl, setNewUrl] = useState('');

  const addSite = () => {
    if (newUrl.trim()) {
      setBlockedSites(current => [
        ...current,
        {
          id: nanoid(),
          url: newUrl.trim(),
          dateAdded: new Date().toISOString(),
        },
      ]);
      setNewUrl('');
    }
  };

  const removeSite = (id: string) => {
    setBlockedSites(current => current.filter(site => site.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.inputContainer}>
        <TextInput
          label="Enter URL to block"
          value={newUrl}
          onChangeText={setNewUrl}
          mode="outlined"
        />
        <Button mode="contained" onPress={addSite} style={styles.button}>
          Add to Blocklist
        </Button>
      </Surface>

      <FlatList
        data={blockedSites}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.url}
            description={new Date(item.dateAdded).toLocaleDateString()}
            right={props => (
              <Button
                {...props}
                onPress={() => removeSite(item.id)}
                mode="text"
                textColor="red">
                Remove
              </Button>
            )}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No blocked sites yet</Text>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    padding: 16,
    borderRadius: 12,
    elevation: 4,
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    opacity: 0.5,
  },
}); 