export type ZoomLevel = 'day' | 'week' | 'month';

export interface ZoomConfig {
  level: ZoomLevel;
  columnWidth: number;
}

export interface TimelinePosition {
  left: number;
  width: number;
}
