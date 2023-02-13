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

import { TeamsFxContext } from "../../internal/context";
import { TaskModel } from "../../models/taskModel";
import { callFunction } from "../../services/callFunction";
import { addTask, getTasks } from "../../services/taskService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface ITaskState {
  tasks?: TaskModel[];
  inputFocused?: boolean;
  addBtnOver?: boolean;
}

export class Task extends Widget<ITaskState> {
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

  async getData(): Promise<ITaskState> {
    return {
      tasks: await getTasks(),
      inputFocused: false,
      addBtnOver: false,
    };
  }

  protected headerContent(): JSX.Element | undefined {
    return (
      <div className={widgetStyle.headerContent}>
        <TeamsFxContext.Consumer>
          {({ themeString }) =>
            themeString === "default" ? (
              <Image key="icon-task-default" src={`task.svg`} />
            ) : (
              <Image key="icon-task-dark" src={`task-dark.svg`} />
            )
          }
        </TeamsFxContext.Consumer>
        <Text key="text-task-title" className={widgetStyle.headerText}>
          Your tasks
        </Text>
        <Button key="bt-task-more" icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  protected bodyContent(): JSX.Element | undefined {
    const hasTask = this.state.tasks?.length !== 0;
    return (
      <div className={hasTask ? "has-task-layout" : "no-task-layout"}>
        <TeamsFxContext.Consumer>
          {({ themeString }) => this.inputLayout(themeString)}
        </TeamsFxContext.Consumer>
        {hasTask ? (
          this.state.tasks?.map((item: TaskModel) => {
            return (
              <TeamsFxContext.Consumer key={`consumer-task-${item.id}`}>
                {({ themeString }) => (
                  <div
                    key={`div-task-${item.id}`}
                    className={mergeStyles(
                      "existing-task-layout",
                      themeString === "contrast" ? "border-style" : ""
                    )}
                  >
                    <Checkbox key={`cb-task-${item.id}`} shape="circular" label={item.name} />
                    <Button
                      key={`bt-task-${item.id}`}
                      icon={<Star24Regular />}
                      appearance="transparent"
                    />
                  </div>
                )}
              </TeamsFxContext.Consumer>
            );
          })
        ) : (
          <div>
            <EmptyThemeImg key="img-empty" />
            <Text key="text-empty" weight="semibold" className="empty-text">
              Once you have a task, you'll find it here
            </Text>
          </div>
        )}
      </div>
    );
  }

  protected footerContent(): JSX.Element | undefined {
    return this.state.tasks?.length !== 0 ? (
      <Button
        appearance="transparent"
        icon={<ArrowRight16Filled />}
        iconPosition="after"
        size="small"
        className={widgetStyle.footerBtn}
        onClick={() => window.open("https://to-do.office.com/tasks/", "_blank")} // navigate to detailed page
      >
        View all
      </Button>
    ) : undefined;
  }

  protected loadingContent(): JSX.Element | undefined {
    return (
      <div style={{ display: "grid" }}>
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

  private inputLayout(themeString: string): JSX.Element | undefined {
    return (
      <div
        ref={this.inputDivRef}
        className={mergeStyles(
          "add-task-container",
          this.state.inputFocused ? "focused-color" : "non-focused-color",
          themeString === "contrast" ? "border-style" : ""
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
      this.inputRef.current.value = "";
      callFunction(this.inputRef.current.value);
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
