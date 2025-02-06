import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="shield.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">About Content Blocker</ThemedText>
      </ThemedView>
      
      <Collapsible title="How it works">
        <ThemedText>
          This app monitors text input and screen content to protect you from inappropriate content.
          Once enabled, it cannot be disabled until the specified time period has elapsed.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Features">
        <ThemedText>• Real-time content monitoring</ThemedText>
        <ThemedText>• Time-based locking mechanism</ThemedText>
        <ThemedText>• Uninstall protection</ThemedText>
        <ThemedText>• Customizable duration settings</ThemedText>
      </Collapsible>

      <Collapsible title="Privacy">
        <ThemedText>
          Your privacy is important to us. All content analysis happens locally on your device.
          No data is sent to external servers for analysis.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Support">
        <ThemedText>
          If you need help or have questions about the content blocker,
          please contact our support team through the app settings.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Important Note">
        <ThemedText style={styles.warningText}>
          Once enabled, the blocker cannot be disabled or uninstalled until the timer expires.
          Please choose your duration carefully.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  warningText: {
    color: '#ff6b6b',
    fontWeight: 'bold',
  }
});
