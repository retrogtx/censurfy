import { useState, useEffect } from 'react';
import { StatusBar, ScrollView, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as S from '../../styles/home.styles';

export default function Index() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return null;

  return (
    <S.Container className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" />
      
      <S.Header className="p-4 flex-row items-center justify-between border-b border-slate-800">
        <S.Title className="text-xl font-bold text-white">Censurfy</S.Title>
        <S.IconButton className="w-10 h-10 rounded-full bg-slate-800 items-center justify-center" activeOpacity={0.7}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </S.IconButton>
      </S.Header>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <S.StatusContainer
          animate={{ 
            backgroundColor: isEnabled ? 'rgba(34,197,94,0.1)' : 'transparent'
          }}
        >
          <TouchableOpacity
            className="items-center"
            onPress={() => setIsEnabled(!isEnabled)}
            activeOpacity={0.9}
          >
            <S.StatusIcon
              animate={{ 
                scale: isEnabled ? 1.1 : 1,
                backgroundColor: isEnabled ? '#22c55e' : '#1e293b'
              }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <MaterialIcons 
                name="security" 
                size={40} 
                color={isEnabled ? "#fff" : "#64748b"} 
              />
            </S.StatusIcon>
            
            <S.Title className={`mb-2 ${isEnabled ? 'text-green-500' : 'text-slate-500'}`}>
              {isEnabled ? 'PROTECTED' : 'VULNERABLE'}
            </S.Title>
            <S.StyledText className="text-slate-400">
              {isEnabled ? 'Your device is actively protected' : 'Tap to enable protection'}
            </S.StyledText>
          </TouchableOpacity>
        </S.StatusContainer>

        {/* Stats Cards */}
        <S.Card className="bg-slate-900 rounded-xl p-4 mb-4">
          <S.StatGrid className="flex-row gap-4">
            <S.StatItem className="flex-1 bg-slate-800 p-4 rounded-xl">
              <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center mb-3">
                <MaterialIcons name="block" size={24} color="#3b82f6" />
              </View>
              <S.Title className="text-white">24</S.Title>
              <S.StyledText className="text-slate-400">Blocks</S.StyledText>
            </S.StatItem>
            
            <S.StatItem className="flex-1 bg-slate-800 p-4 rounded-xl">
              <View className="w-12 h-12 rounded-full bg-purple-500/20 items-center justify-center mb-3">
                <MaterialIcons name="shield" size={24} color="#a855f7" />
              </View>
              <S.Title className="text-white">12</S.Title>
              <S.StyledText className="text-slate-400">Filters</S.StyledText>
            </S.StatItem>
          </S.StatGrid>
        </S.Card>

        {/* Recent Activity */}
        <S.Card className="bg-slate-900 rounded-xl p-4">
          <S.Title className="text-white mb-4">Recent Activity</S.Title>
          {[1, 2, 3].map((item) => (
            <S.ActivityItem key={item} className="flex-row items-center p-3 mb-2">
              <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center mr-3">
                <MaterialIcons name="warning" size={24} color="#ef4444" />
              </View>
              <S.StyledText className="flex-1 text-slate-400">
                Blocked inappropriate content
              </S.StyledText>
              <S.ActivityTime className="text-slate-500 text-sm ml-2">
                2 minutes ago
              </S.ActivityTime>
            </S.ActivityItem>
          ))}
        </S.Card>
      </ScrollView>
    </S.Container>
  );
}
