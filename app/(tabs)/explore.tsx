import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Collapsible } from '@/components/Collapsible';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Link } from 'expo-router';
import ContentBlocker from '@/components/ContentBlocker';

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const accentColor = colorScheme === 'dark' ? '#4CAF50' : '#2E7D32';

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
      <ThemedView style={styles.contentContainer}>
        {/* Status Overview Section */}
        <ThemedView style={styles.statusContainer}>
          <ThemedText type="title" style={styles.statusTitle}>
            Blocker Status
          </ThemedText>
          <ContentBlocker />
          <Link
            href="/"
            style={[styles.settingsLink, { borderColor: accentColor }]}>
            <ThemedText style={{ color: accentColor }}>
              Advanced Settings
            </ThemedText>
          </Link>
        </ThemedView>

        {/* Quick Stats */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="defaultSemiBold">⏱️ Active Duration</ThemedText>
            <ThemedText>24h 15m</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="defaultSemiBold">🚫 Blocks Today</ThemedText>
            <ThemedText>42 attempts</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Existing Collapsible Sections with enhancements */}
        <Collapsible title="How it works">
          <ThemedText style={styles.sectionText}>
            🛡️ Real-time monitoring of all text input and displayed content
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            ⚡ Instant blocking of inappropriate content
          </ThemedText>
          <ThemedText style={styles.sectionText}>
            🔒 Time-locked security once activated
          </ThemedText>
        </Collapsible>

        {/* Enhanced Features Section */}
        <Collapsible title="Advanced Protection Features">
          <ThemedView style={styles.featureItem}>
            <IconSymbol name="checkmark.shield.fill" size={20} color="#4CAF50" />
            <ThemedText style={styles.featureText}>Deep Content Analysis</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <IconSymbol name="clock.fill" size={20} color="#FFA000" />
            <ThemedText style={styles.featureText}>Customizable Time Locks</ThemedText>
          </ThemedView>
          <ThemedView style={styles.featureItem}>
            <IconSymbol name="eye.slash.fill" size={20} color="#D32F2F" />
            <ThemedText style={styles.featureText}>Stealth Mode</ThemedText>
          </ThemedView>
        </Collapsible>

        {/* New FAQ Section */}
        <Collapsible title="FAQ & Troubleshooting">
          <ThemedText style={styles.faqQuestion}>How do I emergency disable?</ThemedText>
          <ThemedText style={styles.faqAnswer}>
            Contact support with your recovery code for verification
          </ThemedText>
          
          <ThemedText style={styles.faqQuestion}>Battery usage concerns?</ThemedText>
          <ThemedText style={styles.faqAnswer}>
            Optimized to use less than 2% battery daily
          </ThemedText>
        </Collapsible>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
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
  },
  statusContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: 'rgba(100,100,100,0.1)',
    alignItems: 'center',
  },
  statusTitle: {
    marginBottom: 15,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(100,100,100,0.1)',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
  },
  featureText: {
    fontSize: 16,
  },
  settingsLink: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    alignSelf: 'center',
  },
  sectionText: {
    marginVertical: 5,
    lineHeight: 22,
  },
  faqQuestion: {
    fontWeight: '600',
    marginTop: 10,
    color: '#4CAF50',
  },
  faqAnswer: {
    marginLeft: 10,
    color: '#666',
  },
});
