// <copyright file="app.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { AppRoute } from "./router/router";
import Resources from "./constants/resources";
import * as microsoftTeams from "@microsoft/teams-js";
import { Provider, themes } from "@fluentui/react-northstar";

import "./styles/site.css";

export interface IAppState {
    theme: string;
}

export default class App extends React.Component<{}, IAppState> {
    theme?: string | null;

    constructor(props: any) {
        super(props);
        let search = window.location.search;
        let params = new URLSearchParams(search);
        this.theme = params.get("theme");

        this.state = {
            theme: this.theme ? this.theme : Resources.default,
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context: microsoftTeams.Context) => {
            this.setState({ theme: context.theme! });
        });

        microsoftTeams.registerOnThemeChangeHandler((theme: string) => {
            this.setState({ theme: theme! }, () => {
                this.forceUpdate();
            });
        });
    }

    public setThemeComponent = () => {
        if (this.state.theme === Resources.dark) {
            return (
                <Provider theme={themes.teamsDark}>
                    <div className="dark-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
        else if (this.state.theme === Resources.contrast) {
            return (
                <Provider theme={themes.teamsHighContrast}>
                    <div className="high-contrast-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        } else {
            return (
                <Provider theme={themes.teams}>
                    <div className="default-container">
                        {this.getAppDom()}
                    </div>
                </Provider>
            );
        }
    }

    public getAppDom = () => {
        return (
            <div className="appContainer">
                <AppRoute />
            </div>);
    }

	/**
	* Renders the component
	*/
    public render(): JSX.Element {
        return (
            <div>
                {this.setThemeComponent()}
            </div>
        );
    }
}