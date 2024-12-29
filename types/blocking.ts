interface BlockedKeyword {
  id: string;
  keyword: string;
  isRegex: boolean;
  isEnabled: boolean;
  dateAdded: string;
}

interface BlockEvent {
  id: string;
  keyword: string;
  detectedText: string;
  timestamp: string;
  appPackageName?: string;
}

interface MonitoringStatus {
  isActive: boolean;
  lastCheck: string;
  blockedCount: number;
}

export type { BlockedKeyword, BlockEvent, MonitoringStatus }; 