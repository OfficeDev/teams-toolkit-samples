export interface DayRangeModel {
  // Unique identifier for the day range model
  id: string;

  // The day range selected from the enum
  dayRange: DayRange;

  // The display name for the day range
  displayName: string;
}

// Define an enum for the different day ranges available
export enum DayRange {
  Seven,
  Thirty,
  Sixty,
}
