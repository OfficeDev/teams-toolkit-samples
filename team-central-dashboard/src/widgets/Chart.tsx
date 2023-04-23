import "../styles/Chart.css";

import { AreaChart, IChartProps } from "@fluentui/react-charting";
import { Avatar, Button, Text, ToggleButton } from "@fluentui/react-components";
import {
  ArrowMaximize20Regular,
  ArrowRight16Filled,
  ChevronRight20Regular,
  MoreHorizontal16Filled,
  MoreHorizontal32Regular,
  Rocket20Regular,
  Search20Regular,
  Settings20Regular,
  Trophy20Regular,
} from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import ProgressBar from "../components/Progress";
import { DayRange, DayRangeModel } from "../models/dayRangeModel";
import { TableModel } from "../models/tableModel";
import {
  chart1Points_30D,
  chart1Points_60D,
  chart1Points_7D,
  chart2Points_30D,
  chart2Points_60D,
  chart2Points_7D,
  dayRangeData,
  tableData,
} from "../services/chartService";

interface IChartWidgetState {
  dayRange: DayRange;
  chartProps: IChartProps;
}

export class Chart extends BaseWidget<any, IChartWidgetState> {
  override async getData(): Promise<IChartWidgetState> {
    const chartPoints = [
      {
        legend: "Line 1",
        data: chart1Points_7D,
        color: "#6264A7",
      },
      {
        legend: "Line 2",
        data: chart2Points_7D,
        color: "#D9DBDB",
      },
    ];
    const chartData = {
      chartTitle: "Area chart multiple example",
      lineChartData: chartPoints,
    };
    return {
      dayRange: DayRange.Seven,
      chartProps: chartData,
    };
  }

  override header(): JSX.Element | undefined {
    return (
      <div id="no-icon-header">
        <Text id="area-chart-title">Area chart</Text>
        <div id="action-layout">
          <Button icon={<Search20Regular />} appearance="transparent" />
          <Button icon={<ArrowMaximize20Regular />} appearance="transparent" />
          <Button icon={<Settings20Regular />} appearance="transparent" />
          <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
        </div>
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    return (
      <>
        <div className="legend">
          <div className="item">
            <Text className="bold">Feb 1, 2020</Text>
            <Text>11:59 am (PT)</Text>
          </div>
          <div className="divider" />
          <div className="item">
            <Text>Location:</Text>
            <Text className="bold">All</Text>
          </div>
          <div className="divider" />
          <div className="item">
            <Text>Groups:</Text>
            <Text className="bold">All</Text>
          </div>
          <div className="divider" />
          <div className="item">
            <Text>Date range:</Text>
            <Text className="bold">Jan 1, 2020 - Jan 30, 2020</Text>
          </div>
        </div>
        <div className="time-span">
          {dayRangeData.map((item: DayRangeModel) => {
            return (
              <ToggleButton
                key={`tb-day-range-${item.id}`}
                appearance="transparent"
                checked={this.state.dayRange === item.dayRange}
                onClick={() =>
                  this.setState({
                    chartProps: this.retriveChartsData(item.dayRange),
                    dayRange: item.dayRange,
                  })
                }
              >
                {item.displayName}
              </ToggleButton>
            );
          })}
        </div>

        {this.state.chartProps && (
          <div className="area-chart">
            <AreaChart data={this.state.chartProps} />
          </div>
        )}

        <div className="table-layout">
          <div className="backlog">
            <Text>Features backlog (57)</Text>
            <Button icon={<MoreHorizontal16Filled />} appearance="transparent" />
          </div>

          <div className="table-content">
            <div className="table-header">
              <Text>Title</Text>
              <Text>Assigned To</Text>
              <Text>PM Owner</Text>
              <Text>Priority</Text>
              <Text>State</Text>
            </div>
            {tableData.map((item: TableModel, index) => {
              return (
                <div key={`div-table-content-${item.id}`} className="table-body">
                  {index !== 0 && <div className="divider" />}
                  <div className="table-row">
                    <div className="title">
                      <ChevronRight20Regular />
                      {index !== 3 ? <Rocket20Regular /> : <Trophy20Regular />}
                      <Text wrap={false}>{item.title}</Text>
                    </div>

                    <div className="avatar">
                      <Avatar
                        name={item.assignedName}
                        image={{ src: `${item.assignedAvatar}` }}
                        size={16}
                      />
                      <Text>{item.assignedName}</Text>
                    </div>
                    <div className="avatar">
                      <Avatar
                        name={item.ownerName}
                        image={{ src: `${item.ownerAvatar}` }}
                        size={16}
                      />
                      <Text>{item.ownerName}</Text>
                    </div>
                    <Text>{item.priority}</Text>
                    <div className="state">
                      <ProgressBar bgcolor={item.color} completed={item.state} />
                      <Text>{`${item.state}%`}</Text>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  override footer(): JSX.Element | undefined {
    return (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        onClick={() => {}} // navigate to detailed page
      >
        View query
      </Button>
    );
  }

  override styling(): IWidgetClassNames {
    return { body: "body-layout", footer: "footer-btn" };
  }

  /**
   * Retrieves chart data based on the selected day range.
   * @param r The selected day range.
   * @returns The chart data.
   */
  private retriveChartsData(r: DayRange): IChartProps {
    // Define chart points based on the selected day range.
    const chartPoints = [
      {
        legend: "Line 1",
        data:
          r === DayRange.Seven
            ? chart1Points_7D
            : r === DayRange.Thirty
            ? chart1Points_30D
            : chart1Points_60D,
        color: "#6264A7",
      },
      {
        legend: "Line 2",
        data:
          r === DayRange.Seven
            ? chart2Points_7D
            : r === DayRange.Thirty
            ? chart2Points_30D
            : chart2Points_60D,
        color: "#D9DBDB",
      },
    ];
    // Define chart data.
    const chartData = {
      chartTitle: "Area chart multiple example",
      lineChartData: chartPoints,
    };
    return chartData;
  }
}
