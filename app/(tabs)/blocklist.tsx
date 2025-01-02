import { View, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as S from '../../styles/home.styles';

interface BlockedItem {
  id: string;
  text: string;
}

export default function BlocklistScreen() {
  const [items, setItems] = useState<BlockedItem[]>([]);
  const [text, setText] = useState('');

  const addItem = useCallback(() => {
    if (!text.trim()) return;
    
    setItems(prev => [...prev, { id: Date.now().toString(), text: text.trim() }]);
    setText('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [text]);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }, []);

  return (
    <S.Container className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      <S.Header className="p-4 flex-row items-center justify-between border-b border-slate-800">
        <S.Title className="text-xl font-bold text-white">Blocklist</S.Title>
        <View className="flex-row gap-2">
          <TextInput
            className="flex-1 px-4 py-2 bg-slate-800 rounded-lg text-white"
            placeholder="Add keyword or phrase..."
            placeholderTextColor="#64748b"
            value={text}
            onChangeText={setText}
            onSubmitEditing={addItem}
          />
          <S.IconButton 
            className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center"
            onPress={addItem}
            activeOpacity={0.7}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </S.IconButton>
        </View>
      </S.Header>

      <ScrollView className="flex-1 p-4">
        {items.map(item => (
          <S.Card key={item.id} className="bg-slate-900 rounded-xl p-4 mb-3 flex-row items-center">
            <S.StyledText className="flex-1 text-white">{item.text}</S.StyledText>
            <TouchableOpacity
              onPress={() => removeItem(item.id)}
              className="w-8 h-8 rounded-full bg-red-500/20 items-center justify-center"
            >
              <MaterialIcons name="close" size={16} color="#ef4444" />
            </TouchableOpacity>
          </S.Card>
        ))}
      </ScrollView>
    </S.Container>
  );
} 