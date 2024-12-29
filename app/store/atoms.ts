import { atom } from 'recoil';

export interface BlockedSite {
  id: string;
  url: string;
  dateAdded: string;
}

export interface AppSettings {
  isProtectionEnabled: boolean;
  useSecureDNS: boolean;
  dnsProvider: 'cloudflare' | 'opendns' | 'custom';
  customDNS?: string;
  parentalControlEnabled: boolean;
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
    dnsProvider: 'cloudflare',
    parentalControlEnabled: false,
  },
}); 