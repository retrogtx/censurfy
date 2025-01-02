import { MotiView } from 'moti';
import { View, Text as RNText, TouchableOpacity, SafeAreaView } from 'react-native';

// Export base components directly
export const Container = SafeAreaView;
export const Header = View;
export const StyledText = RNText;
export const Title = RNText;
export const IconButton = TouchableOpacity;
export const Card = View;
export const StatGrid = View;
export const StatItem = View;
export const ActivityItem = View;
export const ActivityTime = RNText;

// Moti components
export const StatusContainer = MotiView;
export const StatusIcon = MotiView; 