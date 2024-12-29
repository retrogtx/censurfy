export interface BlockedSite {
  id: string;
  url: string;
  dateAdded: string;
  lastBlocked?: string;
  blockCount?: number;
}

export interface DNSProvider {
  name: string;
  primary: string;
  secondary: string;
  instructions: string;
}

export type DNSProviderType = 'CLOUDFLARE_FAMILY' | 'OPENDNS_FAMILY';

export interface AppSettings {
  isProtectionEnabled: boolean;
  useSecureDNS: boolean;
  dnsProvider: DNSProviderType;
  customDNS?: string;
  parentalControlEnabled: boolean;
  dnsStatus: {
    configured: boolean;
    lastChecked: string;
  };
} 