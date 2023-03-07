import "../styles/GitHub.css";

import React from "react";

import { Button, Image, Text } from "@fluentui/react-components";
import {
    Add20Filled,
    ArrowRight16Filled,
    MoreHorizontal32Regular,
    Open16Regular,
} from "@fluentui/react-icons";
import { GitHubLogoIcon } from "@fluentui/react-icons-mdl2";

import { githubIssuesModel } from "../../models/githubIssuesModel";
import { createIssue, getIssues } from "../../services/githubService";
import { EmptyThemeImg } from "../components/EmptyThemeImg";
import { Widget } from "../lib/Widget";
import { widgetStyle } from "../lib/Widget.styles";
import { mergeStyles } from "@fluentui/react";

interface IIssueState {
    issues?: githubIssuesModel[];
    loading: boolean;
    inputFocused?: boolean;
    addBtnOver?: boolean;
}

export class GithubIssues extends Widget<IIssueState> {
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

    async getData(): Promise<IIssueState> {
        return {
            issues: await getIssues(),
            inputFocused: false,
            addBtnOver: false,
            loading: false,
        };
    }

    headerContent(): JSX.Element | undefined {
        return (
            <div className={widgetStyle.headerContent}>
                <GitHubLogoIcon key={`icon-github-issues`} className="github-header-icon" />
                <Text key="text-issue-title" className={widgetStyle.headerText}>
                    GitHub Repository Issues
                </Text>
                <Button
                    key="bt-issue-more"
                    icon={<MoreHorizontal32Regular />}
                    appearance="transparent"
                />
            </div>
        );
    }

    bodyContent(): JSX.Element | undefined {
        const hasIssue = this.state.issues?.length !== 0;
        return (
            <div className={hasIssue ? "has-issue-layout" : "no-issue-layout"}>
                {this.inputLayout()}
                {hasIssue ? (
                    this.state.issues?.map((item: githubIssuesModel, index) => {
                        return (
                            <div
                                key={`div-issue-${item.title}`}
                                className={
                                    index % 2 === 0
                                        ? "issue-item-even-layout"
                                        : "issue-item-odd-layout"
                                }
                            >
                                <Image src="issue.svg" className="img-issue" />
                                <div
                                    className="issue-content-layout"
                                    onClick={() => window.open(item.url, "_blank")}
                                >
                                    <div>
                                        <Text
                                            key={`cb-issue-state-${index}`}
                                            className="issue-state"
                                        >
                                            [{item.state}]&nbsp;
                                        </Text>
                                        {item.title}
                                    </div>
                                    {item.body && (
                                        <Text
                                            key={`div-issue-${item.title}`}
                                            className="issue-desc"
                                        >
                                            {item.body}
                                        </Text>
                                    )}
                                </div>
                                <Button
                                    key={`bt-issue-${item.title}`}
                                    className="btn-issue-share"
                                    icon={<Open16Regular />}
                                    onClick={() => window.open(item.url, "_blank")}
                                    appearance="transparent"
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-layout">
                        <EmptyThemeImg key="img-empty" />
                        <Text key="text-empty" weight="semibold" className="empty-text">
                            Once you have a issue, you'll find it here
                        </Text>
                    </div>
                )}
            </div>
        );
    }

    footerContent(): JSX.Element | undefined {
        if (!this.state.loading && this.state.issues?.length !== 0) {
            return (
                <Button
                    appearance="transparent"
                    icon={<ArrowRight16Filled />}
                    iconPosition="after"
                    size="small"
                    className={widgetStyle.footerBtn}
                    onClick={() =>
                        window.open(
                            "https://github.com/aycabasDemo/ContosoProject/issues",
                            "_blank"
                        )
                    } // navigate to detailed page
                >
                    View on GitHub
                </Button>
            );
        } else {
            return undefined;
        }
    }

    private inputLayout(): JSX.Element | undefined {
        return (
            <div
                ref={this.inputDivRef}
                className={mergeStyles(
                    "div-issue-add-layout",
                    this.state.inputFocused ? "div-issue-add-focused" : "div-issue-add-unfocused"
                )}
            >
                {!this.state.inputFocused && <Add20Filled className="issue-add-icon" />}

                <input
                    ref={this.inputRef}
                    type="text"
                    className={
                        this.state.inputFocused ? "input-issue-focused" : "input-issue-unfocused"
                    }
                    onFocus={() => this.inputFocusedState()}
                    placeholder="Create new"
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
                issues: this.state.issues,
                inputFocused: false,
                addBtnOver: this.state.addBtnOver,
                loading: false,
            });
            this.clearQuestion();
        }
    }

    private onAddButtonClick = async () => {
        if (this.inputRef.current && this.inputRef.current.value.length > 0) {
            const issues: githubIssuesModel[] = await createIssue(this.inputRef.current.value);
            this.setState({
                issues: issues,
                inputFocused: false,
                addBtnOver: false,
                loading: false,
            });
            this.clearQuestion();
        }
    };

    private clearQuestion() {
        if (this.inputRef.current) {
            this.inputRef.current.value = "";
        }
    }

    private inputFocusedState = () => {
        this.setState({
            issues: this.state.issues,
            inputFocused: true,
            addBtnOver: this.state.addBtnOver,
            loading: false,
        });
    };

    private mouseEnterState = () => {
        this.setState({
            issues: this.state.issues,
            inputFocused: this.state.inputFocused,
            addBtnOver: true,
            loading: false,
        });
    };

    private mouseLeaveState = () => {
        this.setState({
            issues: this.state.issues,
            inputFocused: this.state.inputFocused,
            addBtnOver: false,
            loading: false,
        });
    };
}
