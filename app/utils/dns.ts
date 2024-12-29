import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlockedSite } from '@/store/atoms';

export const DNS_PROVIDERS = {
  CLOUDFLARE_FAMILY: {
    name: 'Cloudflare Family',
    primary: '1.1.1.3',
    secondary: '1.0.0.3',
    instructions: 'https://developers.cloudflare.com/1.1.1.1/setup/'
  },
  OPENDNS_FAMILY: {
    name: 'OpenDNS Family',
    primary: '208.67.222.123',
    secondary: '208.67.220.123',
    instructions: 'https://www.opendns.com/setupguide/'
  }
} as const;

// Default blocked domains
const DEFAULT_BLOCKED_DOMAINS = [
  'adult.com',
  'porn.com',
  // Add more default domains
];

export async function checkDNSConfiguration(): Promise<boolean> {
  try {
    const netInfo = await NetInfo.fetch();
    if (netInfo.type === 'wifi') {
      const { details } = netInfo;
      if ('ipAddress' in details) {
        // Attempt to resolve a test domain using configured DNS
        const response = await fetch('https://1.1.1.1/dns-query', {
          headers: {
            'accept': 'application/dns-json'
          }
        });
        return response.ok;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking DNS:', error);
    return false;
  }
}

export async function getBlockedDomains(): Promise<string[]> {
  try {
    const domains = await AsyncStorage.getItem('blockedDomains');
    if (!domains) {
      // Initialize with default domains if none exist
      await AsyncStorage.setItem('blockedDomains', JSON.stringify(DEFAULT_BLOCKED_DOMAINS));
      return DEFAULT_BLOCKED_DOMAINS;
    }
    return JSON.parse(domains);
  } catch (error) {
    console.error('Error getting blocked domains:', error);
    return DEFAULT_BLOCKED_DOMAINS;
  }
}

export async function updateBlockedDomains(sites: BlockedSite[]): Promise<void> {
  try {
    const domains = sites.map(site => site.url);
    await AsyncStorage.setItem('blockedDomains', JSON.stringify(domains));
  } catch (error) {
    console.error('Error updating blocked domains:', error);
  }
}

export async function testDNSBlocking(domain: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      timeout: 5000
    });
    // If we can reach the domain, blocking is not working
    return !response.ok;
  } catch (error) {
    // If we can't reach the domain, blocking might be working
    return true;
  }
}

// Update our atoms.ts to include DNS status 