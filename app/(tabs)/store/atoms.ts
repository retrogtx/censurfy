import { atom } from 'recoil';
import { DNS_PROVIDERS } from '../../utils/dns';

export interface BlockedSite {
  id: string;
  url: string;
  dateAdded: string;
  lastBlocked?: string;
  blockCount?: number;
}

export interface AppSettings {
  isProtectionEnabled: boolean;
  useSecureDNS: boolean;
  dnsProvider: keyof typeof DNS_PROVIDERS;
  customDNS?: string;
  parentalControlEnabled: boolean;
  dnsStatus: {
    configured: boolean;
    lastChecked: string;
  };
}

export const blockedSitesState = atom<BlockedSite[]>({
  key: 'blockedSites',
  default: [],
});

export const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: {
    isProtectionEnabled: false,
    useSecureDNS: true,
    dnsProvider: 'CLOUDFLARE_FAMILY',
    parentalControlEnabled: false,
    dnsStatus: {
      configured: false,
      lastChecked: new Date().toISOString()
    }
  },
}); 