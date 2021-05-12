// <copyright file="preferences-suggestion-list.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/configure-preferences.css";
import "../../styles/teams-config-tab.css";

interface IPreferencesSuggestionListProps extends WithTranslation {
    digestFrequency: string;
    savedTagItems: Array<string>;
    node: any;
    showSuggestion: boolean;
    onTagAddClick: (value: string) => void;
    closeSuggestionBox: () => void;
}

interface IPreferencesSuggestionListState {
    isOpen: boolean;
}

class PreferencesSuggestionList extends React.Component<IPreferencesSuggestionListProps, IPreferencesSuggestionListState> {
    localize: TFunction;
    constructor(props: IPreferencesSuggestionListProps) {
        super(props);
        this.localize = this.props.t;
        this.state = {
            isOpen: true
        }
    }

    /**
     * add event listener for clicks
     */
    componentWillMount() {
        document.addEventListener('click', this.handleClick, false);
    }

    /**
     * remove the listener when the component is destroyed.
     */
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false);
    }


    /**
     * the click outside your component.
     */
    handleClick = (event) => {

        if (!this.props.node.contains(event.target)) {
            this.props.closeSuggestionBox();
        }
    }

    /**
     * Renders the component.
     */
    public render(): JSX.Element {
        return (
            <div className={this.props.digestFrequency.length ? "tag-list-box" : "tag-list-box-config"}>
                {
                    this.props.savedTagItems.map((value: string) => {
                        return <div onClick={() => this.props.onTagAddClick(value)} className="auto-suggestion-list-item" >{value}</div>
                    })
                }
            </div>
        )

    }
}

export default withTranslation()(PreferencesSuggestionList)
