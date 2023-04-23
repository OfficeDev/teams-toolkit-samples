export interface CalendarModel {
  // Unique identifier for the calendar model
  id?: string;

  // Start time of the event
  startTime: {
    dateTime: string;
    timeZone: string;
  };

  // End time of the event
  endTime: {
    dateTime: string;
    timeZone: string;
  };

  // Title of the event
  title: string;

  // Location of the event
  location?: string;

  // URL associated with the event
  url?: string;
}
