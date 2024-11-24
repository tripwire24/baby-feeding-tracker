export interface FeedingSession {
  id?: number;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  amount?: number;
  type: 'breast' | 'bottle';
  side?: 'left' | 'right';
  notes?: string;
}