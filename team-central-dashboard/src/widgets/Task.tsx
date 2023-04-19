import "../styles/Common.css";
import "../styles/Task.css";

import React from "react";

import { mergeStyles } from "@fluentui/react";
import { Button, Checkbox, Image, Spinner, Text } from "@fluentui/react-components";
import {
  Add20Filled,
  ArrowRight16Filled,
  Circle20Regular,
  MoreHorizontal32Regular,
  Star24Regular,
} from "@fluentui/react-icons";
import { BaseWidget, IWidgetClassNames } from "@microsoft/teamsfx-react";

import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { TeamsFxContext } from "../internal/context";
import { TaskModel } from "../models/taskModel";
import { callFunction } from "../services/callFunction";
import { addTask, getTasks } from "../services/taskService";

interface ITaskState {
  tasks?: TaskModel[];
  inputFocused?: boolean;
  addBtnOver?: boolean;
}

export class Task extends BaseWidget<any, ITaskState> {
  inputDivRef;
  btnRef;
  inputRef;

  constructor(props: any) {
    super(props);
    this.inputRef = React.createRef<HTMLInputElement>();
    this.inputDivRef = React.createRef<HTMLDivElement>();
    this.btnRef = React.createRef<HTMLButtonElement>();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  override async getData(): Promise<ITaskState> {
    return {
      tasks: await getTasks(),
      inputFocused: false,
      addBtnOver: false,
    };
  }

  override header(): JSX.Element | undefined {
    return (
      <div>
        <TeamsFxContext.Consumer>
          {({ themeString }) =>
            themeString === "default" ? <Image src={`task.svg`} /> : <Image src={`task-dark.svg`} />
          }
        </TeamsFxContext.Consumer>
        <Text>Your tasks</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  override body(): JSX.Element | undefined {
    const hasTask = this.state.tasks?.length !== 0;
    return (
      <div className={hasTask ? "has-task-layout" : "no-task-layout"}>
        {this.inputLayout()}
        {hasTask ? (
          this.state.tasks?.map((item: TaskModel) => {
            return (
              <div className="task-item">
                <Checkbox shape="circular" label={item.name} />
                <Button icon={<Star24Regular />} appearance="transparent" />
              </div>
            );
          })
        ) : (
          <div className="empty-layout">
            <EmptyThemeImg />
            <Text>Once you have a task, you'll find it here</Text>
          </div>
        )}
      </div>
    );
  }

  override footer(): JSX.Element | undefined {
    return this.state.tasks?.length !== 0 ? (
      <Button
        id="footer-transparent-button"
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        onClick={() => window.open("https://to-do.office.com/tasks/", "_blank")}
      >
        View all
      </Button>
    ) : undefined;
  }

  override styling(): IWidgetClassNames {
    return { footer: "footer-btn" };
  }

  override loading(): JSX.Element | undefined {
    return (
      <div className="loading-layout">
        <Spinner label="Loading..." labelPosition="below" />
      </div>
    );
  }

  async componentDidMount() {
    super.componentDidMount();
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  private inputLayout(): JSX.Element | undefined {
    return (
      <div
        ref={this.inputDivRef}
        className={mergeStyles(
          "add-task",
          this.state.inputFocused ? "focused-color" : "non-focused-color"
        )}
      >
        {this.state.inputFocused ? (
          <Circle20Regular className="add-btn" />
        ) : (
          <Add20Filled className="add-btn" />
        )}

        <input
          ref={this.inputRef}
          type="text"
          className={mergeStyles(
            "input",
            this.state.inputFocused ? "focused-color" : "non-focused-color"
          )}
          onFocus={() => this.inputFocusedState()}
          placeholder="Add a task"
        />
        {this.state.inputFocused && (
          <button
            className={this.state.addBtnOver ? "add-btn-enter" : "add-btn-leave"}
            onClick={() => {
              this.onAddButtonClick();
            }}
            onMouseEnter={() => this.mouseEnterState()}
            onMouseLeave={() => this.mouseLeaveState()}
          >
            Add
          </button>
        )}
      </div>
    );
  }

  private handleClickOutside(event: any) {
    if (!this.inputDivRef.current?.contains(event.target)) {
      this.setState({
        tasks: this.state.tasks,
        inputFocused: false,
        addBtnOver: this.state.addBtnOver,
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
        addBtnOver: false,
        loading: false,
      });
      callFunction(this.inputRef.current.value);
      this.inputRef.current.value = "";
    }
  };

  private inputFocusedState = () => {
    this.setState({
      tasks: this.state.tasks,
      inputFocused: true,
      addBtnOver: this.state.addBtnOver,
      loading: false,
    });
  };

  private mouseEnterState = () => {
    this.setState({
      tasks: this.state.tasks,
      inputFocused: this.state.inputFocused,
      addBtnOver: true,
      loading: false,
    });
  };

  private mouseLeaveState = () => {
    this.setState({
      tasks: this.state.tasks,
      inputFocused: this.state.inputFocused,
      addBtnOver: false,
      loading: false,
    });
  };
}
