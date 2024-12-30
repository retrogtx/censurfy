import { atom } from 'recoil';
import { BlockedKeyword, BlockEvent, MonitoringStatus } from '@/types';

export const blockedKeywordsState = atom<BlockedKeyword[]>({
  key: 'blockedKeywords',
  default: [],
});

export const blockEventsState = atom<BlockEvent[]>({
  key: 'blockEvents',
  default: [],
});

export const monitoringStatusState = atom<MonitoringStatus>({
  key: 'monitoringStatus',
  default: {
    isActive: false,
    lastCheck: new Date().toISOString(),
    blockedCount: 0
  },
}); 