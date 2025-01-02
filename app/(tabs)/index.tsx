import { useState } from 'react';
import { StatusBar, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as S from '../../styles/home.styles';

export default function Index() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <S.Container>
      <StatusBar barStyle="light-content" />
      
      <S.Header>
        <S.Title>Censurfy</S.Title>
        <S.IconButton activeOpacity={0.7}>
          <MaterialIcons name="settings" size={24} color="#fff" />
        </S.IconButton>
      </S.Header>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <S.StatusContainer 
          style={S.styles.statusContainer}
          animate={{ 
            backgroundColor: isEnabled ? 'rgba(34,197,94,0.1)' : 'transparent'
          }}
        >
          <S.StatusButton
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
            
            <S.Title style={{ 
              color: isEnabled ? '#22c55e' : '#64748b',
              marginBottom: 8,
            }}>
              {isEnabled ? 'PROTECTED' : 'VULNERABLE'}
            </S.Title>
            <S.Text style={{ color: '#94a3b8' }}>
              {isEnabled ? 'Your device is actively protected' : 'Tap to enable protection'}
            </S.Text>
          </S.StatusButton>
        </S.StatusContainer>

        {/* Stats Cards */}
        <S.Card>
          <S.StatGrid>
            <S.StatItem>
              <S.IconBadge color="#3b82f6">
                <MaterialIcons name="block" size={24} color="#3b82f6" />
              </S.IconBadge>
              <S.Title style={{ color: '#fff' }}>24</S.Title>
              <S.Text style={{ color: '#94a3b8' }}>Blocks</S.Text>
            </S.StatItem>
            
            <S.StatItem>
              <S.IconBadge color="#a855f7">
                <MaterialIcons name="shield" size={24} color="#a855f7" />
              </S.IconBadge>
              <S.Title style={{ color: '#fff' }}>12</S.Title>
              <S.Text style={{ color: '#94a3b8' }}>Filters</S.Text>
            </S.StatItem>
          </S.StatGrid>
        </S.Card>

        {/* Recent Activity */}
        <S.Card>
          <S.Title style={{ color: '#fff', marginBottom: 16 }}>
            Recent Activity
          </S.Title>
          
          <S.Text style={{ color: '#94a3b8' }}>
            {[1, 2, 3].map((item) => (
              <S.ActivityItem key={item}>
                <S.ActivityIconBadge color="#ef4444">
                  <MaterialIcons name="warning" size={24} color="#ef4444" />
                </S.ActivityIconBadge>
                <S.ActivityText>
                  Blocked inappropriate content
                </S.ActivityText>
                <S.ActivityTime>
                  2 minutes ago
                </S.ActivityTime>
              </S.ActivityItem>
            ))}
          </S.Text>
        </S.Card>
      </ScrollView>
    </S.Container>
  );
}
