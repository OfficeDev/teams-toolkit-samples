// This interface represents a day range model.
export interface DayRangeModel {
  // The ID of the day range model.
  id: string;

  // The day range of the model.
  dayRange: DayRange;

  // The display name of the day range model.
  displayName: string;
}

// This enum represents the different day ranges available.
export enum DayRange {
  // Represents a 7-day range.
  Seven,

  // Represents a 30-day range.
  Thirty,

  // Represents a 60-day range.
  Sixty,
}
