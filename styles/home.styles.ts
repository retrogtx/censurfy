import styled from 'styled-components/native';
import { MotiView, SafeAreaView } from 'moti';
import { StyleSheet } from 'react-native';

interface IconBadgeProps {
  color: string;
}

export const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: #020617; // slate-950
`;

export const Header = styled.View`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #1e293b; // slate-800
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;

export const IconButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: #1e293b;
  align-items: center;
  justify-content: center;
`;

export const StatusButton = styled.TouchableOpacity`
  align-items: center;
`;

export const Card = styled.View`
  background-color: #0f172a; // slate-900
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
`;

export const StatGrid = styled.View`
  flex-direction: row;
  gap: 16px;
`;

export const StatItem = styled.View`
  flex: 1;
  background-color: #1e293b; // slate-800
  padding: 16px;
  border-radius: 12px;
`;

export const IconBadge = styled.View<IconBadgeProps>`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background-color: ${(props: IconBadgeProps) => props.color};
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: #94a3b8;
`;

export const ActivityItem = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
`;

export const ActivityIconBadge = styled(IconBadge)`
  width: 48px;
  height: 48px;
  margin-right: 12px;
  margin-bottom: 0;
`;

export const ActivityText = styled(Text)`
  flex: 1;
`;

export const ActivityTime = styled.Text`
  color: #64748b;
  font-size: 14px;
  margin-left: 8px;
`;

export const styles = StyleSheet.create({
  statusContainer: {
    padding: 32,
  },
  statusIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  }
});

export { MotiView as StatusContainer, MotiView as StatusIcon }; 