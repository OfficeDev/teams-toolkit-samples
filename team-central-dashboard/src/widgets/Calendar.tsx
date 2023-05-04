import "../styles/Calendar.css";
import "../styles/Common.css";

import moment from "moment-timezone";

import { Button, Image, Spinner, Text } from "@fluentui/react-components";
import {
  ArrowRight16Filled,
  CalendarLtr24Regular,
  MoreHorizontal32Regular,
} from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import { extractTime } from "../common/dateUtils";
import { CalendarModel } from "../models/calendarModel";
import { getCalendar } from "../services/calendarService";

// Defining the state interface for the Calendar widget
interface ICalendarState {
  meetings?: CalendarModel[];
}

export class Calendar extends BaseWidget<any, ICalendarState> {
  override async getData(): Promise<ICalendarState> {
    try {
      const meetings = await getCalendar();
      return { meetings };
    } catch (error) {
      console.error(error);
      return { meetings: [] };
    } finally {
      this.setState({ loading: false });
    }
  }

  override header(): JSX.Element | undefined {
    return (
      <div>
        <CalendarLtr24Regular />
        <Text>Your upcoming events</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    const hasMeeting = this.state.meetings?.length !== 0;
    return (
      <div className={hasMeeting ? "has-meeting-layout" : ""}>
        {hasMeeting ? (
          <>
            <div className="today-layout">
              <Text id="time">{moment().format("ll")}</Text>
              <Text>
                {`You have ${this.state.meetings?.length ?? 0} meetings today. The upcoming events`}
              </Text>
            </div>

            {this.state.meetings?.map((item: CalendarModel, index) => {
              return (
                <div key={`div-meeting-item-${index}`} className="meeting-item">
                  <div className="divider" />
                  <div className="content">
                    <Text className="title">{item.title}</Text>
                    <Text className="time">{this.getMeetingTime(item)}</Text>
                    <Text className="location">{item.location}</Text>
                  </div>
                  <Button
                    appearance={index === 0 ? "primary" : "secondary"}
                    onClick={() => window.open(item.url)}
                  >
                    {index === 0 ? "Join" : "Chat"}
                  </Button>
                </div>
              );
            })}
          </>
        ) : (
          <div className="empty-layout">
            <Image src={`no-meeting.svg`} />
            <Text>No meeting today</Text>
          </div>
        )}
      </div>
    );
  }

  override footer(): JSX.Element | undefined {
    return (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        onClick={() => window.open("https://outlook.office.com/calendar/view/day")}
      >
        View calendar
      </Button>
    );
  }

  override styling(): IWidgetClassNames {
    return { root: "concise-root", footer: "footer-btn" };
  }

  override loading(): JSX.Element | undefined {
    return (
      <div className="loading-layout">
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  /**
   * A private method that takes a CalendarModel object and returns a formatted string representing the meeting time.
   * @param item The CalendarModel object representing the meeting.
   * @returns A string representing the meeting time in the format "start time - end time".
   */
  private getMeetingTime = (item: CalendarModel) => {
    return extractTime(item.startTime.dateTime) + " - " + extractTime(item.endTime.dateTime);
  };
}
