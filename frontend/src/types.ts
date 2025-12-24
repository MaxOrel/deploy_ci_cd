export interface HistoryItem {
  id: number;
  percent: number;
  createdAt: string;
}

export interface Statistics {
  total: number;
  average: number;
  min: number;
  max: number;
  median: number;
}
