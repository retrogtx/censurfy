import { View, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Text } from 'react-native';
import { useState, useCallback } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';

interface BlockedItem {
  id: string;
  text: string;
}

export default function BlockList() {
  const [newItem, setNewItem] = useState('');
  const [blockedItems, setBlockedItems] = useState<BlockedItem[]>([]);

  const handleAddItem = useCallback(() => {
    if (newItem.trim()) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setBlockedItems(prev => [
        { id: Date.now().toString(), text: newItem.trim().toLowerCase() },
        ...prev,
      ]);
      setNewItem('');
    }
  }, [newItem]);

  const handleRemoveItem = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setBlockedItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="px-4 py-3 border-b border-slate-800">
        <Text className="text-xl font-bold text-white">Block List</Text>
        <Text className="text-slate-400 text-sm mt-1">
          Manage your content filtering keywords
        </Text>
      </View>

      {/* Add New Item */}
      <View className="p-4">
        <View className="bg-slate-900 rounded-xl overflow-hidden">
          <View className="flex-row items-center p-2">
            <TextInput
              value={newItem}
              onChangeText={setNewItem}
              placeholder="Add new keyword..."
              placeholderTextColor="#64748b"
              className="flex-1 px-3 py-2.5 text-base text-white"
              autoCapitalize="none"
              autoCorrect={false}
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity
              onPress={handleAddItem}
              disabled={!newItem.trim()}
              className={`rounded-lg p-2.5 mx-1 ${
                newItem.trim() ? 'bg-green-500' : 'bg-slate-800'
              }`}
            >
              <MaterialIcons 
                name="add" 
                size={22} 
                color="#fff" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Blocked Items List */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="space-y-3">
          {blockedItems.map(item => (
            <MotiView
              key={item.id}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -20 }}
              className="bg-slate-900 rounded-xl overflow-hidden"
            >
              <View className="flex-row items-center p-4">
                <MaterialIcons 
                  name="block" 
                  size={20} 
                  color="#64748b"
                  style={{ marginRight: 12 }}
                />
                <Text className="text-white text-base flex-1">
                  {item.text}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  className="rounded-lg p-2 bg-red-500/20"
                >
                  <MaterialIcons 
                    name="delete-outline" 
                    size={20} 
                    color="#ef4444" 
                  />
                </TouchableOpacity>
              </View>
            </MotiView>
          ))}
        </View>

        {/* Empty State */}
        {blockedItems.length === 0 && (
          <View className="items-center justify-center py-12">
            <MaterialIcons 
              name="block" 
              size={48} 
              color="#475569" 
            />
            <Text className="text-slate-500 text-base mt-4 text-center">
              No blocked keywords yet.{'\n'}Add some keywords to start filtering.
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
} 