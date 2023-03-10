import "../styles/PlannerTask.css";
import "../styles/Common.css";

import React from "react";

import { mergeStyles } from "@fluentui/react";
import {
    AvatarGroup,
    AvatarGroupItem,
    AvatarGroupPopover,
    Button,
    Checkbox,
    Image,
    Spinner,
    Text,
} from "@fluentui/react-components";
import {
    Add20Filled,
    ArrowRight16Filled,
    Circle20Regular,
    MoreHorizontal32Regular,
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { TaskAssignedToModel, TaskModel } from "../../models/plannerTaskModel";
import { addTask, getTasks } from "../../services/plannerService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface ITaskState {
    tasks?: TaskModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class PlannerTask extends Widget<ITaskState> {
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

    protected async getData(): Promise<ITaskState> {
        return {
            tasks: await getTasks(),
            inputFocused: false,
            addBtnOver: false,
            loading: false,
        };
    }

    protected headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <TeamsFxContext.Consumer>
                    {({ themeString }) =>
                        themeString === "default" ? (
                            <Image key="icon-planner-default" width="20px" src="planner.svg" />
                        ) : (
                            <Image key="icon-planner-dark" width="20px" src="planner-dark.svg" />
                        )
                    }
                </TeamsFxContext.Consumer>
                <Text key="text-planner-title" className={widgetStyle.headerText}>
                    Team Planner Tasks
                </Text>
                <Button
                    key="bt-planner-more"
                    icon={<MoreHorizontal32Regular />}
                    appearance="transparent"
                />
            </div>
        );
    }

    protected bodyContent(): JSX.Element | undefined {
        const hasTask = this.state.tasks?.length !== 0;
        return (
            <div className={hasTask ? "has-task-layout" : "no-task-layout"}>
                {this.inputLayout()}
                {hasTask ? (
                    this.state.tasks?.map((item: TaskModel) => {
                        return (
                            <div key={`div-planner-item-${item.id}`} className="div-task-item">
                                <div
                                    key={`div-planner-${item.id}`}
                                    className="existing-task-layout"
                                >
                                    <Checkbox
                                        key={`cb-planner-${item.id}`}
                                        shape="circular"
                                        label={item.name}
                                        className="task-checkbox"
                                    />
                                    {this.assignedToLayout(item)}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-layout">
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
        if (!this.state.loading && this.state.tasks?.length !== 0) {
            return (
                <Button
                    appearance="transparent"
                    icon={<ArrowRight16Filled />}
                    iconPosition="after"
                    size="small"
                    className={widgetStyle.footerBtn}
                    onClick={() =>
                        window.open(
                            "https://tasks.office.com/m365advocates.onmicrosoft.com/en-US/Home/Planner/#/plantaskboard?groupId=c168296c-f4cf-44a2-9e27-e9ef602e8b22&planId=wIfl13Xg6UCD_d5irDOTWJgAHcUy",
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

    protected loadingContent(): JSX.Element | undefined {
        return (
            <div className="loading-layout">
                <Spinner label="Loading..." labelPosition="below" />
            </div>
        );
    }

    private inputLayout(): JSX.Element | undefined {
        return (
            <div
                ref={this.inputDivRef}
                className={mergeStyles(
                    "add-task-container",
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
                        "task-input",
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

    private assignedToLayout(item: TaskModel): JSX.Element | undefined {
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
                                    return (
                                        <AvatarGroupItem
                                            name={overItem.userDisplayName}
                                            key={`avatar-${item.id}-${overItem.userId}`}
                                            image={{
                                                src: this.handleAvatar(overItem.userAvatar),
                                            }}
                                        />
                                    );
                                })}
                            </AvatarGroupPopover>
                        )}
                    </AvatarGroup>
                )}
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

    private handleClickOutside(event: any) {
        if (!this.inputDivRef.current?.contains(event.target)) {
            this.setState({
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

    private handleAvatar = (blob: any) => {
        if (blob === undefined) return "";
        let res;
        try {
            res = URL.createObjectURL(blob);
        } catch (e) {
            res = "";
        }
        return res;
    };
}
