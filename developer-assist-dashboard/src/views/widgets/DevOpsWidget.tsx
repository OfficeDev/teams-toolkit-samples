import "../styles/DevOps.css";
import "../styles/Common.css";

import React from "react";

import { Avatar, Button, Image, Spinner, Text } from "@fluentui/react-components";
import {
    ArrowRight16Filled,
    CircleSmall20Filled,
    MoreHorizontal32Regular,
} from "@fluentui/react-icons";

import { TeamsFxContext } from "../../internal/context";
import { DevOpsModel } from "../../models/devOpsModel";
import { DevOpsWorkItems } from "../../services/devopsService";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";

interface IWorkItemState {
    devOpsData?: DevOpsModel[];
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class DevOps extends Widget<IWorkItemState> {
    inputDivRef;
    inputRef;

    constructor(props: any) {
        super(props);
        this.inputRef = React.createRef<HTMLInputElement>();
        this.inputDivRef = React.createRef<HTMLDivElement>();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    protected async getData(): Promise<IWorkItemState> {
        let devOpsData: DevOpsModel[] = [];
        try {
            devOpsData = await DevOpsWorkItems();
        } catch (e) {
            console.log("Get Devops Data Error: ", e);
        }
        return {
            devOpsData: devOpsData,
            inputFocused: false,
        };
    }

    protected headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <TeamsFxContext.Consumer>
                    {({ themeString }) =>
                        themeString === "default" ? (
                            <Image
                                key="icon-devops-default"
                                width="20px"
                                src="devops-default.svg"
                            />
                        ) : (
                            <Image key="icon-devops-dark" width="20px" src="devops-dark.svg" />
                        )
                    }
                </TeamsFxContext.Consumer>
                <Text key="text-task-title" className={widgetStyle.headerText}>
                    Azure DevOps Work Items
                </Text>
                <Button
                    key="bt-task-more"
                    icon={<MoreHorizontal32Regular />}
                    appearance="transparent"
                />
            </div>
        );
    }

    protected bodyContent(): JSX.Element | undefined {
        const hasWorkItem =
            this.state.devOpsData !== undefined && this.state.devOpsData?.length !== 0;
        return (
            <div className="devops-body-layout">
                {hasWorkItem ? (
                    <div className="devops-list-layout">
                        <div className="work-items-table-title-layout">
                            <Text key="text-work-item-title" className="work-items-table-title">
                                Title
                            </Text>
                            <Text key="text-work-item-type" className="work-items-table-title">
                                Type
                            </Text>
                            <Text key="text-work-item-assigned" className="work-items-table-title">
                                Assigned To
                            </Text>
                            <Text key="text-work-item-state" className="work-items-table-title">
                                State
                            </Text>
                        </div>
                        <div className="work-items">
                            {this.state.devOpsData?.map((item: DevOpsModel, index) => {
                                return (
                                    <>
                                        {index !== 0 && (
                                            <div
                                                key={`div-items-divider-${index}`}
                                                className="divider"
                                            />
                                        )}
                                        <div key={`div-item-${index}`} className="work-item-layout">
                                            <Text
                                                key={`text-item-title-${index}`}
                                                className="work-item-title"
                                                onClick={() => {
                                                    window.open(item.url, "_blank");
                                                }}
                                            >
                                                {item.fields.title}
                                            </Text>
                                            <Text key={`text-item-type-${index}`}>
                                                {item.fields.workItemType}
                                            </Text>
                                            <div
                                                key={`div-item-assigned-${item.id}`}
                                                className="work-item-assigned-state-layout"
                                            >
                                                <Avatar
                                                    key={`avatar-item-assigned-${item.id}`}
                                                    name={item.fields.assigendTo?.displayName}
                                                    image={{
                                                        src: `${item.fields.assigendTo?.links?.avatar?.href}`,
                                                    }}
                                                    size={16}
                                                />
                                                <Text key={`text-item-assigned-${item.id}`}>
                                                    {item.fields.assigendTo?.displayName}
                                                </Text>
                                            </div>
                                            <div className="work-item-assigned-state-layout">
                                                <CircleSmall20Filled className="state-icon" />
                                                <Text key={`text-item-state-${index}`}>
                                                    {item.fields.state}
                                                </Text>
                                            </div>
                                        </div>
                                    </>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="empty-layout">
                        <Image src="open-ai-empty.svg" className="empty-img" />
                    </div>
                )}
            </div>
        );
    }

    protected footerContent(): JSX.Element | undefined {
        if (!this.state.loading && this.state.devOpsData?.length !== 0) {
            return (
                <Button
                    appearance="transparent"
                    icon={<ArrowRight16Filled />}
                    iconPosition="after"
                    size="small"
                    className={widgetStyle.footerBtn}
                    onClick={() => window.open(
                        "https://dev.azure.com/DemoContosoOrg/ContosoProject/_workitems/recentlyupdated/",
                        "_blank"
                    )} // navigate to detailed page
                >
                    View on Azure DevOps
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
            });
        }
    }

    private onSearchBtnClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const devOpsData: DevOpsModel[] = [];
            this.setState({
                devOpsData: devOpsData,
                inputFocused: false,
            });
            this.inputRef.current.value = "";
        }
    };

    private inputFocusedState = () => {
        this.setState({
            inputFocused: true,
        });
    };
}
