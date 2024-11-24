import Dexie, { Table } from 'dexie';

interface FeedingSession {
  id?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  amount?: number;
  type: 'breast' | 'bottle';
  side?: 'left' | 'right';
  notes?: string;
}

export class BabyFeedingDB extends Dexie {
  feedingSessions!: Table<FeedingSession>;

  constructor() {
    super('BabyFeedingDB');
    this.version(1).stores({
      feedingSessions: '++id, startTime, endTime, type'
    });
  }
}

export const db = new BabyFeedingDB();