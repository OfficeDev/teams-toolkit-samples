export interface CalendarModel {
  id?: string;
  startTime: {
    dateTime: string;
    timeZone: string;
  };
  endTime: {
    dateTime: string;
    timeZone: string;
  };
  title: string;
  location?: string;
  url?: string;
}
