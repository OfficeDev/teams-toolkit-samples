import "../styles/Chart.css";

import * as d3 from "d3-format";

import { AreaChart, IChartProps } from "@fluentui/react-charting";
import { Avatar, Button, Text, ToggleButton, tokens } from "@fluentui/react-components";
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

import { DayRange, DayRangeModel } from "../../models/dayRangeModel";
import { TableModel } from "../../models/tableModel";
import {
  chart1Points_30D,
  chart1Points_60D,
  chart1Points_7D,
  chart2Points_30D,
  chart2Points_60D,
  chart2Points_7D,
  dayRangeData,
  tableData,
} from "../../services/chartService";
import ProgressBar from "../components/Progress";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface IChartWidgetState {
  dayRange: DayRange;
  chartProps: IChartProps;
}

export class Chart extends Widget<IChartWidgetState> {
  protected async getData(): Promise<IChartWidgetState> {
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

  protected headerContent(): JSX.Element | undefined {
    return (
      <div key="div-chart-header" className={widgetStyle.headerWithoutIcon}>
        <Text key="text-chart-title" className="area-chart">
          Area chart
        </Text>
        <div key="div-chart-actions" className="action-layout">
          <Button key="bt-chart-search" icon={<Search20Regular />} appearance="transparent" />
          <Button key="bt-chart-max" icon={<ArrowMaximize20Regular />} appearance="transparent" />
          <Button key="bt-chart-setting" icon={<Settings20Regular />} appearance="transparent" />
          <Button key="bt-chart-more" icon={<MoreHorizontal32Regular />} appearance="transparent" />
        </div>
      </div>
    );
  }

  protected bodyContent(): JSX.Element | undefined {
    return (
      <div key="div-chart-body" className="body-layout">
        <div key="div-chart-legend" className="legend-layout">
          <div key="div-legend-time" className="legend-item-layout">
            <Text key="text-legend-date" className="legend-bold">
              Feb 1, 2020
            </Text>
            <Text key="text-legend-time" className="legend-normal">
              11:59 am (PT)
            </Text>
          </div>
          <div key="div-legend-divider1" className="legend-divider" />
          <div key="div-legend-loc" className="legend-item-layout">
            <Text key="text-legend-loc" className="legend-normal">
              Location:
            </Text>
            <Text key="text-legend-loc-all" className="legend-bold">
              All
            </Text>
          </div>
          <div key="div-legend-divider2" className="legend-divider" />
          <div key="div-legend-groups" className="legend-item-layout">
            <Text key="text-legend-groups" className="legend-normal">
              Groups:
            </Text>
            <Text key="text-legend-groups-all" className="legend-bold">
              All
            </Text>
          </div>
          <div key="div-legend-divider3" className="legend-divider" />
          <div key="div-legend-range" className="legend-item-layout">
            <Text key="text-legend-range" className="legend-normal">
              Date range:
            </Text>
            <Text key="text-legend-range-time" className="legend-bold">
              Jan 1, 2020 - Jan 30, 2020
            </Text>
          </div>
        </div>
        <div key="div-time-span" className="time-span-layout">
          {dayRangeData.map((item: DayRangeModel) => {
            return (
              <ToggleButton
                key={`tb-day-range-${item.id}`}
                appearance="transparent"
                checked={this.state.dayRange === item.dayRange}
                className="time-span"
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

        <div key="div-area-chart" className="area-chart-layout">
          {this.state.chartProps && (
            <AreaChart
              key={`area-chart-${this.state.dayRange}`}
              data={this.state.chartProps}
              legendsOverflowText={"Overflow Items"}
              yAxisTickFormat={d3.format(".1s")}
              wrapXAxisLables={false}
              legendProps={{
                allowFocusOnLegends: true,
                styles: { text: { color: tokens.colorNeutralForeground1 } },
              }}
            />
          )}
        </div>

        <div key="div-table-layout" className="table-layout">
          <div key="div-back-log" className="backlog-layout">
            <Text key="text-back-log" className="backlog">
              Features backlog (57)
            </Text>
            <Button
              key="bt-back-log-more"
              icon={<MoreHorizontal16Filled />}
              appearance="transparent"
            />
          </div>

          <div key="div-table-content" className="table-content-layout">
            <div key="div-table-column" className="table-column">
              <Text key="text-table-header-title" className="min-width-18 table-header">
                Title
              </Text>
              <Text key="text-table-header-assigned" className="min-width-8 table-header">
                Assigned To
              </Text>
              <Text key="text-table-header-owner" className="min-width-8 table-header">
                PM Owner
              </Text>
              <Text key="text-table-header-priority" className="min-width-4 table-header">
                Priority
              </Text>
              <Text key="text-table-header-state" className="min-width-4 table-header">
                State
              </Text>
            </div>
            {tableData.map((item: TableModel, index) => {
              return (
                <>
                  {index !== 0 && <div key={`table-divider-${item.id}`} className="divider" />}
                  <div key={`div-table-column-${item.id}`} className="table-column">
                    <div key={`div-table-title-${item.id}`} className="title">
                      <ChevronRight20Regular key={`icon-chevron-${item.id}`} />
                      {index !== 3 ? (
                        <Rocket20Regular key={`icon-rocket-${item.id}`} />
                      ) : (
                        <Trophy20Regular key={`icon-trophy-${item.id}`} />
                      )}
                      <Text key={`text-title-${item.id}`} wrap={false}>
                        {item.title}
                      </Text>
                    </div>

                    <div key={`div-table-avatar-${item.id}`} className="avatar">
                      <Avatar
                        key={`avatar-assigned-${item.id}`}
                        name={item.assignedName}
                        image={{ src: `${item.assignedAvatar}` }}
                        size={16}
                      />
                      <Text key={`text-assigned-${item.id}`}>{item.assignedName}</Text>
                    </div>
                    <div key={`div-table-avatar2-${item.id}`} className="avatar">
                      <Avatar
                        key={`avatar-owner-${item.id}`}
                        name={item.ownerName}
                        image={{ src: `${item.ownerAvatar}` }}
                        size={16}
                      />
                      <Text key={`text-owner-${item.id}`}>{item.ownerName}</Text>
                    </div>
                    <Text key={`text-priority-${item.id}`} style={{ minWidth: "4rem" }}>
                      {item.priority}
                    </Text>
                    <div key={`div-state-${item.id}`} className="state-layout">
                      <ProgressBar
                        key={`pb-state-${item.id}`}
                        bgcolor={item.color}
                        completed={item.state}
                      />
                      <Text key={`text-state-${item.id}`} className="state">
                        {`${item.state}%`}
                      </Text>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  protected footerContent(): JSX.Element | undefined {
    return (
      <Button
        key="bt-chart-footer"
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        className={widgetStyle.footerBtn}
        onClick={() => {}} // navigate to detailed page
      >
        View query
      </Button>
    );
  }

  private retriveChartsData(r: DayRange): IChartProps {
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
    const chartData = {
      chartTitle: "Area chart multiple example",
      lineChartData: chartPoints,
    };
    return chartData;
  }
}
