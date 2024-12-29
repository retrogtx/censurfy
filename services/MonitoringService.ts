import { AccessibilityInfo, BackHandler, Platform, findNodeHandle } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlockedKeyword, BlockEvent } from '@/types/index';

// Built-in blocklist that can't be disabled
const BUILT_IN_KEYWORDS = [
  'porn', 'xxx', 'adult', 'sex',
  'nsfw', 'nude', 'naked', 'hentai',
  // Add more keywords as needed
].map(keyword => ({
  id: `built_in_${keyword}`,
  keyword,
  isRegex: false,
  isEnabled: true,
  dateAdded: new Date().toISOString(),
  isBuiltIn: true
}));

class MonitoringService {
  private static instance: MonitoringService;
  private isActive = false;
  private accessibilityListener: any = null;
  
  private constructor() {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  async startMonitoring() {
    if (Platform.OS !== 'android') {
      console.log('Content monitoring is only supported on Android');
      return;
    }

    this.isActive = true;

    // Request accessibility permissions
    const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
    if (!isEnabled) {
      console.log('Please enable accessibility service in Android settings');
      // Here you might want to guide user to accessibility settings
      return;
    }

    // Monitor accessibility announcements
    this.accessibilityListener = AccessibilityInfo.addEventListener(
      'announcementFinished',
      this.onAccessibilityAnnouncement
    );
  }

  private onAccessibilityAnnouncement = async ({ announcement }: { announcement: string }) => {
    if (!this.isActive) return;

    try {
      const shouldBlock = await this.checkForBlockedContent(announcement);
      if (shouldBlock) {
        BackHandler.exitApp();
      }
    } catch (error) {
      console.error('Error processing announcement:', error);
    }
  };

  private async checkForBlockedContent(text: string): Promise<boolean> {
    try {
      // First check built-in keywords
      for (const keyword of BUILT_IN_KEYWORDS) {
        if (text.toLowerCase().includes(keyword.keyword.toLowerCase())) {
          await this.logBlockEvent(keyword, text);
          return true;
        }
      }

      // Then check user-defined keywords
      const userKeywords = await this.getBlockedKeywords();
      for (const keyword of userKeywords) {
        if (!keyword.isEnabled) continue;
        
        if (text.toLowerCase().includes(keyword.keyword.toLowerCase())) {
          await this.logBlockEvent(keyword, text);
          return true;
        }
      }
    } catch (error) {
      console.error('Error checking content:', error);
    }
    return false;
  }

  private async logBlockEvent(keyword: BlockedKeyword, detectedText: string) {
    const event: BlockEvent = {
      id: Date.now().toString(),
      keyword: keyword.keyword,
      detectedText,
      timestamp: new Date().toISOString()
    };

    try {
      const eventsJson = await AsyncStorage.getItem('blockEvents');
      const events: BlockEvent[] = eventsJson ? JSON.parse(eventsJson) : [];
      events.unshift(event);
      await AsyncStorage.setItem('blockEvents', JSON.stringify(events.slice(0, 100)));
    } catch (error) {
      console.error('Error logging block event:', error);
    }
  }

  private async getBlockedKeywords(): Promise<BlockedKeyword[]> {
    try {
      const data = await AsyncStorage.getItem('blockedKeywords');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting keywords:', error);
      return [];
    }
  }

  async stopMonitoring() {
    this.isActive = false;
    if (this.accessibilityListener) {
      this.accessibilityListener.remove();
      this.accessibilityListener = null;
    }
  }
}

export default MonitoringService; 