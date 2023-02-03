import "../styles/Calendar.css";
import "../styles/Common.css";

import moment from "moment-timezone";

import { Button, Image, Spinner, Text } from "@fluentui/react-components";
import {
  ArrowRight16Filled,
  CalendarLtr24Regular,
  MoreHorizontal32Regular,
} from "@fluentui/react-icons";

import { extractTime } from "../../common/dateUtils";
import { CalendarModel } from "../../models/calendarModel";
import { getCalendar } from "../../services/calendarService";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface ICalendarState {
  meetings?: CalendarModel[];
}

export class Calendar extends Widget<ICalendarState> {
  protected async getData(): Promise<ICalendarState> {
    return { meetings: await getCalendar() };
  }

  protected headerContent(): JSX.Element | undefined {
    return (
      <div className={widgetStyle.headerContent}>
        <CalendarLtr24Regular />
        <Text className={widgetStyle.headerText}>Your upcoming events</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  protected bodyContent(): JSX.Element | undefined {
    const hasMeeting = this.state.meetings?.length !== 0;
    return (
      <div className={hasMeeting ? "has-meeting-layout" : "no-meeting-layout"}>
        {hasMeeting ? (
          <>
            <div className="today-layout">
              <Text className="today-text">{moment().format("ll")}</Text>
              <Text className="meeting-summary">
                {`You have ${this.state.meetings?.length ?? 0} meetings today. The upcoming events`}
              </Text>
            </div>

            {this.state.meetings?.map((item: CalendarModel, index) => {
              return (
                <div key="div-meeting-item" className="meeting-item-layout">
                  <div key="div-divider" className="meeting-divider" />
                  <div key="div-meeting-content" className="meeting-content-layout">
                    <Text key="text-meeting-title" className="meeting-title">
                      {item.title}
                    </Text>
                    <Text key="text-meeting-time" className="meeting-time">
                      {this.getMeetingTime(item)}
                    </Text>
                    <Text key="text-meeting-loc" className="meeting-location">
                      {item.location}
                    </Text>
                  </div>
                  <Button
                    key="bt-meeting-action"
                    className="meeting-action-btn"
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
            <Image src={`no-meeting.svg`} className="empty-img" />
            <Text weight="semibold" className="empty-text">
              No meeting today
            </Text>
          </div>
        )}
      </div>
    );
  }

  protected footerContent(): JSX.Element | undefined {
    return (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        className={widgetStyle.footerBtn}
        onClick={() => window.open("https://outlook.office.com/calendar/view/day")}
      >
        View calendar
      </Button>
    );
  }

  protected loadingContent(): JSX.Element | undefined {
    return (
      <div style={{ display: "grid" }}>
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  private getMeetingTime = (item: CalendarModel) => {
    return extractTime(item.startTime.dateTime) + " - " + extractTime(item.endTime.dateTime);
  };
}
