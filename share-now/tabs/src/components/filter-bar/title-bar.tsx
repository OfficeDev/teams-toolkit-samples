// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import CommandBar from "./command-bar";
import { ICheckBoxItem } from "./filter-bar"
import { IDiscoverPost } from "../card-view/discover-wrapper-page";

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
    constructor(props: IFilterBarProps) {
        super(props);

        this.state = {
            isOpen: false,
            sharedByAuthorList: [],
            tagsList: [],
            showSolidFilter: false
        }
    }

    componentWillReceiveProps(nextProps: IFilterBarProps) {
        if (nextProps.hideFilterbar !== this.props.hideFilterbar) {
            if (nextProps.hideFilterbar === true) {
                this.setState({ isOpen: false });
            }
        }
    }

	/**
    * Sets state to show/hide filter bar
    */
    onOpenStateChange = () => {
        this.setState({ showSolidFilter: !this.state.showSolidFilter, isOpen: !this.state.isOpen });
        this.props.onFilterClear(!this.state.isOpen);
    }

	/**
	* Renders the component
	*/
    public render(): JSX.Element {
        return (
            <>
                <CommandBar
                    onFilterButtonClick={this.onOpenStateChange}
                    onNewPostSubmit={this.props.onNewPostSubmit}
                    onSearchInputChange={this.props.onSearchInputChange}
                    showSolidFilterIcon={this.state.showSolidFilter}
                    searchFilterPostsUsingAPI={this.props.searchFilterPostsUsingAPI}
                    commandBarSearchText={this.props.commandBarSearchText}
                    displayForTeam={false}
                />
            </>
        )
    }
}

export default TitleBar;