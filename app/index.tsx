import { View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { useState } from 'react';
import { Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotiView } from 'moti';

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export default function Index() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center justify-between border-b border-slate-800">
        <Text className="text-xl font-bold text-white">Censurfy</Text>
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center"
          activeOpacity={0.7}
        >
          <MaterialIcons name="settings" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-6"
      >
        {/* Main Status */}
        <MotiView
          animate={{ 
            backgroundColor: isEnabled ? 'rgba(34,197,94,0.1)' : 'transparent'
          }}
          transition={{ type: 'timing', duration: 300 }}
          className="px-4 py-8"
        >
          <TouchableOpacity
            onPress={() => setIsEnabled(!isEnabled)}
            activeOpacity={0.9}
            className="items-center"
          >
            <MotiView
              animate={{ 
                scale: isEnabled ? 1.1 : 1,
                backgroundColor: isEnabled ? '#22c55e' : '#1e293b'
              }}
              transition={{ 
                type: 'spring',
                damping: 15
              }}
              className="w-24 h-24 rounded-full items-center justify-center mb-6"
            >
              <MaterialIcons 
                name="security" 
                size={40} 
                color={isEnabled ? "#fff" : "#64748b"} 
              />
            </MotiView>
            
            <Text className={`text-2xl font-bold mb-2 ${
              isEnabled ? 'text-green-500' : 'text-slate-500'
            }`}>
              {isEnabled ? 'PROTECTED' : 'VULNERABLE'}
            </Text>
            <Text className="text-slate-400 text-center text-base">
              {isEnabled 
                ? 'Your device is actively protected' 
                : 'Tap to enable protection'
              }
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Stats Cards */}
        <View className="px-4 space-y-4">
          <View className="bg-slate-900 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-white text-lg font-semibold">Statistics</Text>
              <TouchableOpacity className="bg-slate-800 rounded-full px-4 py-1">
                <Text className="text-slate-400">Today</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row space-x-4">
              <View className="flex-1 bg-slate-800 p-4 rounded-xl">
                <View className="w-12 h-12 bg-blue-500/20 rounded-full items-center justify-center mb-3">
                  <MaterialIcons name="block" size={24} color="#3b82f6" />
                </View>
                <Text className="text-3xl font-bold text-white mb-1">24</Text>
                <Text className="text-slate-400">Blocks</Text>
              </View>
              
              <View className="flex-1 bg-slate-800 p-4 rounded-xl">
                <View className="w-12 h-12 bg-purple-500/20 rounded-full items-center justify-center mb-3">
                  <MaterialIcons name="shield" size={24} color="#a855f7" />
                </View>
                <Text className="text-3xl font-bold text-white mb-1">12</Text>
                <Text className="text-slate-400">Filters</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="bg-slate-900 rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-4">
              Recent Activity
            </Text>
            
            <View className="space-y-4">
              {[1, 2, 3].map((item) => (
                <TouchableOpacity 
                  key={item}
                  activeOpacity={0.7}
                  className="flex-row items-center bg-slate-800 p-3 rounded-xl"
                >
                  <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center mr-3">
                    <MaterialIcons name="warning" size={24} color="#ef4444" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white font-medium">
                      Blocked inappropriate content
                    </Text>
                    <Text className="text-slate-400 text-sm mt-0.5">
                      2 minutes ago
                    </Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={24} color="#475569" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
