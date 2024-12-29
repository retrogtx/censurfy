import { atom } from 'recoil';
import { AppSettings, BlockedSite } from '@/types';

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