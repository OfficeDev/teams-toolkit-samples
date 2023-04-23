import { CalendarModel } from "../models/calendarModel";
import { callFunction } from "./callFunction";

export async function getCalendar(): Promise<CalendarModel[]> {
  try {
    const respData = await callFunction("GET", "callGraph", { graphType: "calendar" });
    return respData["eventResult"];
  } catch (e) {
    console.log(e);
    throw e;
  }
}
