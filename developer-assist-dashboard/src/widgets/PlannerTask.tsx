import "../styles/PlannerTask.css";
import "../styles/Common.css";

import React from "react";

import {
  AvatarGroup,
  AvatarGroupItem,
  AvatarGroupPopover,
  Button,
  Checkbox,
  Spinner,
  Text,
} from "@fluentui/react-components";
import {
  Add20Filled,
  ArrowRight16Filled,
  Circle20Regular,
  MoreHorizontal32Regular,
} from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import { EmptyThemeImg, getImageByTheme } from "../components/ThemeImg";
import { TaskAssignedToModel, TaskModel } from "../models/plannerTaskModel";
import { addTask, getTasks } from "../services/plannerService";
import { GROUP_ID, PLAN_ID } from "../configs";

interface ITaskState {
  tasks?: TaskModel[];
  loading: boolean;
  inputFocused?: boolean;
}

const themeImageMap = {
  default: "planner.svg",
  dark: "planner-dark.svg",
  contrast: "planner-dark.svg",
};

export class PlannerTask extends BaseWidget<any, ITaskState> {
  inputDivRef;
  inputRef;

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef<HTMLInputElement>();
    this.inputDivRef = React.createRef<HTMLDivElement>();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  override async getData(): Promise<ITaskState> {
    return {
      tasks: await getTasks(),
      inputFocused: false,
      loading: false,
    };
  }

  override header(): JSX.Element | undefined {
    return (
      <div>
        {getImageByTheme(themeImageMap)}
        <Text>Team Planner Tasks</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    const hasTask = this.state.tasks?.length !== 0;
    return (
      <div className={hasTask ? "planner-layout" : ""}>
        <div
          ref={this.inputDivRef}
          className={this.state.inputFocused ? "item add-task focused" : "item add-task"}
        >
          <div className="icon">
            {this.state.inputFocused ? <Circle20Regular /> : <Add20Filled />}
          </div>
          <input
            ref={this.inputRef}
            className={this.state.inputFocused ? "task-input focused" : "task-input"}
            onFocus={() => this.inputFocusedState()}
            placeholder="Add a task"
            type="text"
          />
          {this.state.inputFocused && <button onClick={() => this.onAddButtonClick()}>Add</button>}
        </div>
        {hasTask ? (
          this.state.tasks?.map((item: TaskModel) => {
            return (
              <div key={`div-planner-item-${item.id}`} className="item">
                <Checkbox shape="circular" label={item.name} className="task-checkbox" />
                {this.assignedToLayout(item)}
              </div>
            );
          })
        ) : (
          <div className="empty-layout">
            <EmptyThemeImg />
            <Text weight="semibold" className="empty-text">
              Once you have a task, you'll find it here
            </Text>
          </div>
        )}
      </div>
    );
  }

  override footer(): JSX.Element | undefined {
    if (!this.state.loading && this.state.tasks?.length !== 0) {
      return (
        <Button
          appearance="transparent"
          icon={<ArrowRight16Filled />}
          iconPosition="after"
          size="small"
          onClick={() =>
            window.open(
              `https://tasks.office.com/5b37c6.onmicrosoft.com/Home/Planner/#/plantaskboard?groupId=${GROUP_ID}&planId=${PLAN_ID}`,
              "_blank"
            )
          } // navigate to detailed page
        >
          View on Planner
        </Button>
      );
    } else {
      return undefined;
    }
  }

  override loading(): JSX.Element | undefined {
    return (
      <div className="loading-layout">
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  override styling(): IWidgetClassNames {
    return { footer: "footer-btn" };
  }

  private assignedToLayout = (item: TaskModel): JSX.Element | undefined => {
    return (
      <div className="assigned-layout">
        {item.assignments !== undefined && item.assignments.length > 0 && (
          <AvatarGroup layout="stack">
            {item.assignments?.map((assignItem: TaskAssignedToModel) => {
              return (
                <AvatarGroupItem
                  name={assignItem.userDisplayName}
                  key={`avatar-${item.id}-${assignItem.userId}`}
                  image={{
                    src: this.handleAvatar(assignItem.userAvatar),
                  }}
                />
              );
            })}
            {item.overAssignments !== undefined && item.overAssignments.length > 0 && (
              <AvatarGroupPopover>
                {item.overAssignments.map((overItem: TaskAssignedToModel) => {
                  const imgSrc = this.handleAvatar(overItem.userAvatar);
                  return imgSrc !== "" ? (
                    <AvatarGroupItem
                      name={overItem.userDisplayName}
                      key={`avatar-${item.id}-${overItem.userId}`}
                      image={{ src: imgSrc }}
                    />
                  ) : (
                    <AvatarGroupItem
                      name={overItem.userDisplayName}
                      key={`avatar-${item.id}-${overItem.userId}`}
                    />
                  );
                })}
              </AvatarGroupPopover>
            )}
          </AvatarGroup>
        )}
      </div>
    );
  };

  private handleClickOutside(event: any) {
    if (!this.inputDivRef.current?.contains(event.target)) {
      this.setState({
        inputFocused: false,
        loading: false,
      });
    }
  }

  private onAddButtonClick = async () => {
    if (this.inputRef.current && this.inputRef.current.value.length > 0) {
      const tasks: TaskModel[] = await addTask(this.inputRef.current.value);
      this.setState({
        tasks: tasks,
        inputFocused: false,
        loading: false,
      });
      this.inputRef.current.value = "";
    }
  };

  private inputFocusedState = () => {
    this.setState({
      tasks: this.state.tasks,
      inputFocused: true,
      loading: false,
    });
  };

  private handleAvatar = (blob: any) => {
    try {
      return blob ? URL.createObjectURL(blob) : "";
    } catch (e) {
      return "";
    }
  };

  async componentDidMount() {
    super.componentDidMount();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }
}
