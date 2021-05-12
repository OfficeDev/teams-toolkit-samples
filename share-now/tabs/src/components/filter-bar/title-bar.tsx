// <copyright file="title-bar.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import FilterBar from "./filter-bar";
import CommandBar from "./command-bar";
import { ICheckBoxItem } from "./filter-bar"
import { getAuthors, getTags } from "../../api/discover-api";
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

    componentDidMount() {
        this.getAuthors();
        this.getTags();
    }

    componentWillReceiveProps(nextProps: IFilterBarProps) {
        if (nextProps.hideFilterbar !== this.props.hideFilterbar) {
            if (nextProps.hideFilterbar === true) {
                this.setState({ isOpen: false });
                this.getAuthors();
                this.getTags();
            }
        }
    }

	/**
    * Fetch list of authors from API
    */
    getAuthors = async () => {
        let response = await getAuthors();
        if (response.status === 200 && response.data) {
            this.setState({
                sharedByAuthorList: response.data.map((author: string) => { return author.trim() })
            });
        }
    }

	/**
    * Fetch list of tags from API
    */
    getTags = async () => {
        let response = await getTags();
        if (response.status === 200 && response.data) {
            this.setState({
                tagsList: response.data
            });
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
                <FilterBar
                    tagsList={this.state.tagsList}
                    onFilterSearchChange={this.props.onFilterSearchChange}
                    onSortByStateChange={this.props.onSortByChange}
                    sharedByAuthorList={this.state.sharedByAuthorList}
                    isVisible={this.state.isOpen}
                    onFilterBarCloseClick={this.onOpenStateChange}
                    onSharedByCheckboxStateChange={this.props.onSharedByCheckboxStateChange}
                    onTypeCheckboxStateChange={this.props.onTypeCheckboxStateChange}
                    onTagsStateChange={this.props.onTagsStateChange} />
            </>
        )
    }
}

export default TitleBar;