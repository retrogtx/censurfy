export interface BlockedKeyword {
  id: string;
  keyword: string;
  isRegex: boolean;
  isEnabled: boolean;
  dateAdded: string;
}

export interface BlockEvent {
  id: string;
  keyword: string;
  detectedText: string;
  timestamp: string;
  appPackageName?: string;
}

export interface MonitoringStatus {
  isActive: boolean;
  lastCheck: string;
  blockedCount: number;
} 