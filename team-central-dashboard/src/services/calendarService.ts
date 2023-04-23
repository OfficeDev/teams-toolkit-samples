import { CalendarModel } from "../models/calendarModel";
import { callFunction } from "./callFunction";

/**
 * Retrieves calendar events from the Graph API.
 * @returns An array of CalendarModel objects representing the events.
 */
export async function getCalendar(): Promise<CalendarModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "calendar" });
    return respData["eventResult"];
  } catch (e) {
    console.log(e);
    throw e;
  }
}
