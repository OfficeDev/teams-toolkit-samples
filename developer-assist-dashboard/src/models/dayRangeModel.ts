export interface DayRangeModel {
  id: string;
  dayRange: DayRange;
  displayName: string;
}

export enum DayRange {
  Seven,
  Thirty,
  Sixty,
}
