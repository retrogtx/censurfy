import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput, Button, List, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
import { blockedKeywordsState } from '@/store/atoms';
import { nanoid } from 'nanoid';

export default function BlocklistScreen() {
  const [blockedKeywords, setBlockedKeywords] = useRecoilState(blockedKeywordsState);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (!newKeyword.trim()) return;

    setBlockedKeywords(prev => [...prev, {
      id: nanoid(),
      keyword: newKeyword.trim(),
      isRegex: false,
      isEnabled: true,
      dateAdded: new Date().toISOString()
    }]);
    setNewKeyword('');
  };

  const removeKeyword = (id: string) => {
    setBlockedKeywords(prev => prev.filter(keyword => keyword.id !== id));
  };

  const toggleKeyword = (id: string) => {
    setBlockedKeywords(prev => prev.map(keyword => 
      keyword.id === id ? { ...keyword, isEnabled: !keyword.isEnabled } : keyword
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Add new keyword"
          value={newKeyword}
          onChangeText={setNewKeyword}
          onSubmitEditing={addKeyword}
        />
        <Button 
          mode="contained" 
          onPress={addKeyword}
          style={styles.button}
          disabled={!newKeyword.trim()}
        >
          Add Keyword
        </Button>
      </View>

      {blockedKeywords.length === 0 ? (
        <Text style={styles.emptyText}>No keywords added yet</Text>
      ) : (
        blockedKeywords.map(keyword => (
          <List.Item
            key={keyword.id}
            title={keyword.keyword}
            right={props => (
              <View style={{ flexDirection: 'row' }}>
                <Button onPress={() => toggleKeyword(keyword.id)}>
                  {keyword.isEnabled ? 'Disable' : 'Enable'}
                </Button>
                <Button onPress={() => removeKeyword(keyword.id)}>
                  Remove
                </Button>
              </View>
            )}
          />
        ))
      )}
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