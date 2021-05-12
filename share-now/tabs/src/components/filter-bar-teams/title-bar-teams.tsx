// <copyright file="title-bar-teams.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import FilterBar from "../filter-bar/filter-bar";
import CommandBar from "../filter-bar/command-bar";
import { ICheckBoxItem } from "../filter-bar/filter-bar";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { getTeamConfiguredTags, getTeamAuthorsData } from "../../api/discover-api";

interface IFilterBarProps {
    onTypeCheckboxStateChange: (currentValues: Array<ICheckBoxItem>) => void
    onSharedByCheckboxStateChange: (currentValues: Array<ICheckBoxItem>) => void
    onSearchInputChange: (searchString: string) => void;
    onSortByChange: (selectedValue: number) => void;
    onNewPostSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
    onFilterSearchChange: (searchText: string) => void;
    onTagsStateChange: (currentValues: Array<ICheckBoxItem>) => void;
    searchFilterPostsUsingAPI: () => void;
    onFilterClear: (isFilterOpened: boolean) => void;
    commandBarSearchText: string;
    hideFilterbar: boolean;
}

interface IFilterBarState {
    isOpen: boolean;
    sharedByAuthorList: Array<string>;
    tagsList: Array<string>;
    showSolidFilter: boolean;
}

class TitleBar extends React.Component<IFilterBarProps, IFilterBarState> {
    teamId: string;

    constructor(props: IFilterBarProps) {
        super(props);
        this.teamId = "";
        this.state = {
            isOpen: false,
            sharedByAuthorList: [],
            tagsList: [],
            showSolidFilter: false
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context: microsoftTeams.Context) => {
            this.teamId = context.teamId!;
            this.getTeamConfigTags();
            this.getTeamAuthors();
        });
    }

    componentWillReceiveProps(nextProps: IFilterBarProps) {
        if (nextProps.hideFilterbar !== this.props.hideFilterbar) {
            if (nextProps.hideFilterbar === true) {
                this.setState({ isOpen: false });
                this.getTeamAuthors();
                this.getTeamConfigTags();
            }
        }
    }

	/**
    * Fetch list of authors from API
    */
    getTeamAuthors = async () => {
        let response = await getTeamAuthorsData(this.teamId);
        if (response.status === 200 && response.data) {
            this.setState({
                sharedByAuthorList: response.data
            });
        }
    }

	/**
    * Fetch list of tags from API
    */
    getTeamConfigTags = async () => {
        let response = await getTeamConfiguredTags(this.teamId);
        if (response.status === 200 && response.data) {
            this.setState({
                tagsList: response.data
            });
        }
    }

    changeOpenState = () => {
        this.setState({ showSolidFilter: !this.state.showSolidFilter });
        this.setState({ isOpen: !this.state.isOpen });
        this.props.onFilterClear(!this.state.isOpen);
    }

	/**
	* Renders the component
	*/
    public render(): JSX.Element {
        return (
            <>
                <CommandBar
                    onFilterButtonClick={this.changeOpenState}
                    onNewPostSubmit={this.props.onNewPostSubmit}
                    onSearchInputChange={this.props.onSearchInputChange}
                    showSolidFilterIcon={this.state.showSolidFilter}
                    searchFilterPostsUsingAPI={this.props.searchFilterPostsUsingAPI}
                    commandBarSearchText={this.props.commandBarSearchText}
                    displayForTeam={true}
                />

                <FilterBar
                    tagsList={this.state.tagsList}
                    onFilterSearchChange={this.props.onFilterSearchChange}
                    onSortByStateChange={this.props.onSortByChange}
                    sharedByAuthorList={this.state.sharedByAuthorList}
                    isVisible={this.state.isOpen}
                    onFilterBarCloseClick={this.changeOpenState}
                    onSharedByCheckboxStateChange={this.props.onSharedByCheckboxStateChange}
                    onTypeCheckboxStateChange={this.props.onTypeCheckboxStateChange}
                    onTagsStateChange={this.props.onTagsStateChange} />
            </>
        )
    }
}

export default TitleBar;