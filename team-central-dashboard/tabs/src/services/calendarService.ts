import { Client } from "@microsoft/microsoft-graph-client";
import { createMicrosoftGraphClientWithCredential, TeamsUserCredential } from "@microsoft/teamsfx";

import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { CalendarModel } from "../models/calendarModel";

export async function getCalendar(): Promise<CalendarModel[]> {
  var credential: TeamsUserCredential;
  try {
    credential = TeamsUserCredentialContext.getInstance().getCredential();
    const graphClient: Client = createMicrosoftGraphClientWithCredential(credential, [
      "Calendars.Read",
    ]);
    let endOfDay = new Date();
    endOfDay.setUTCHours(23, 59, 59, 999);
    const calendarResponse = await graphClient
      .api(
        `/me/events?$top=2&$select=subject,bodyPreview,organizer,attendees,start,end,location,onlineMeeting&$filter=start/dateTime ge '${new Date().toUTCString()}' and start/dateTime lt '${endOfDay.toUTCString()}'`
      )
      .get();
    const calendarValue = calendarResponse["value"];
    let calendarItems: CalendarModel[] = [];
    for (const obj of calendarValue) {
      const tmp: CalendarModel = {
        startTime: obj["start"],
        endTime: obj["end"],
        title: obj["subject"],
        location: obj["location"]["displayName"],
        url: obj["onlineMeeting"] ? obj["onlineMeeting"]["joinUrl"] : undefined,
      };
      calendarItems.push(tmp);
    }
    return calendarItems.reverse();
  } catch (e) {
    console.log(e);
    alert(e);
    throw e;
  }
}
