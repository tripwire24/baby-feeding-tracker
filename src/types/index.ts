export interface FeedingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  amount?: number;
  type: 'bottle' | 'breast';
}

export interface DayGroup {
  date: Date;
  sessions: FeedingSession[];
  totalTime: number;
  totalMl: number;
}
