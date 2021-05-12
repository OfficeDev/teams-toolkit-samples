// <copyright file="filter-bar.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Flex, Input, Status, Text } from "@fluentui/react-northstar";
import { CloseIcon } from "@fluentui/react-icons-northstar";
import { Icon } from "@fluentui/react/lib/Icon";
import { initializeIcons } from "@uifabric/icons";
import PopupMenuWrapper from "../../components/popup-menu/popup-menu-wrapper";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";
import { IPostType } from "../../constants/resources";
import { getLocalizedPostTypes, getLocalizedSortBy } from "../../helpers/helper";
import { IRadioGroupItem } from "../radiogroup-wrapper";

import "../../styles/filter-bar.css";

export interface ICheckBoxItem {
    key: number;
    title: string;
    checkboxLabel: JSX.Element,
    isChecked: boolean;
}

interface IFilterBarProps extends WithTranslation {
    isVisible: boolean;
    sharedByAuthorList: Array<string>;
    tagsList: Array<string>;
    onFilterBarCloseClick: () => void;
    onTypeCheckboxStateChange: (currentValues: Array<ICheckBoxItem>) => void;
    onSharedByCheckboxStateChange: (currentValues: Array<ICheckBoxItem>) => void;
    onSortByStateChange: (selectedValue: number) => void;
    onFilterSearchChange: (searchText: string) => void;
    onTagsStateChange: (currentValues: Array<ICheckBoxItem>) => void;
}

interface IFilterBarState {
    typeList: Array<ICheckBoxItem>;
    sharedByList: Array<ICheckBoxItem>;
    tagsList: Array<ICheckBoxItem>;
    sortBy: Array<IRadioGroupItem>;
    selectedSortBy: number;
    searchText: string;
    screenWidth: number;
}

class FilterBar extends React.Component<IFilterBarProps, IFilterBarState> {
    localize: TFunction;
    constructor(props: IFilterBarProps) {
        super(props);
        initializeIcons();
        this.localize = this.props.t;
        const postTypes: Array<ICheckBoxItem> = getLocalizedPostTypes(this.localize).map((postType: IPostType) => {
            return {
                key: postType.id,
                checkboxLabel: <Flex vAlign="center">
                    <Status styles={{ backgroundColor: postType.color }} />&nbsp;<Text content={postType.name} title={postType.name} />
                </Flex>,
                title: postType.name,
                isChecked: false
            }
        });
        const sortBy: Array<IRadioGroupItem> = getLocalizedSortBy(this.localize).map((sortBy: IPostType) => { return { key: sortBy.id, label: sortBy.name, value: sortBy.id, name: sortBy.name } });

        this.state = {
            selectedSortBy: sortBy[0].value,
            typeList: postTypes,
            sharedByList: this.props.sharedByAuthorList.map((value: string, index: number) => {
                return { isChecked: false, key: index, title: value, checkboxLabel: <Text content={value} /> };
            }),
            tagsList: this.props.tagsList.map((value: string, index: number) => {
                return { isChecked: false, key: index, title: value, checkboxLabel: <Text content={value} /> };
            }),
            sortBy: sortBy,
            searchText: "",
            screenWidth: 800
        }
    }

    componentDidMount() {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    resize = () => {
        if (window.innerWidth !== this.state.screenWidth) {
            this.setState({ screenWidth: window.innerWidth });
        }
    }

    componentWillReceiveProps(nextProps: IFilterBarProps) {
        if (nextProps.sharedByAuthorList !== this.props.sharedByAuthorList) {
            this.setState({
                sharedByList: nextProps.sharedByAuthorList.map((value: string, index: number) => {
                    return { isChecked: false, key: index, title: value, checkboxLabel: <Text content={value} /> };
                })
            })
        }

        if (nextProps.tagsList !== this.props.tagsList) {
            this.setState({
                tagsList: nextProps.tagsList.map((value: string, index: number) => {
                    return { isChecked: false, key: index, title: value, checkboxLabel: <Text content={value} /> };
                })
            })
        }
    }

	/**
	*Sets state of 'Type' filter item when checkbox value changes.
	*@param typeValues Array of 'post type' checkboxes with updated user selection
    */
    onTypeCheckboxStateChange = (typeValues: Array<ICheckBoxItem>) => {
        this.setState({ typeList: typeValues });
        this.props.onTypeCheckboxStateChange(typeValues);
    }

	/**
	*Sets state of 'Shared by' filter item when checkbox value changes.
	*@param sharedByValues Array of 'authors' checkboxes with updated user selection
    */
    onSharedByCheckboxStateChange = (sharedByValues: Array<ICheckBoxItem>) => {
        this.setState({ sharedByList: sharedByValues });
        this.props.onSharedByCheckboxStateChange(sharedByValues);
    }

	/**
	*Sets state of 'Tags' filter item when checkbox value changes.
	*@param tagsValues Array of 'tags' checkboxes with updated user selection
    */
    onTagsCheckboxStateChange = (tagsValues: Array<ICheckBoxItem>) => {
        this.setState({ tagsList: tagsValues });
        this.props.onTagsStateChange(tagsValues);
    }

	/**
	*Sets state of selected sort by item.
	*@param selectedSortBy Selected 'sort by' value
    */
    onSortByStateChange = (selectedSortBy: number) => {
        this.setState({ selectedSortBy: selectedSortBy });
        this.props.onSortByStateChange(selectedSortBy);
    }

	/**
	*Sets search text.
	*@param event Event object for input
    */
    onSearchStateChange = (event: any) => {
        this.setState({ searchText: event.target.value });
        this.props.onFilterSearchChange(event.target.value);
    }

	/**
	*Removes all filters and hides filter bar.
	*@param event Event object for input
    */
    onCloseIconClick = (event: any) => {
        if (this.state.searchText.trim().length > 0) {
            this.setState({ searchText: "" });
        }

        if (this.state.sharedByList.filter((sharedBy: ICheckBoxItem) => { return sharedBy.isChecked }).length) {
            let updatedList = this.state.sharedByList.map((sharedBy: ICheckBoxItem) => { sharedBy.isChecked = false; return sharedBy; });
            this.setState({ sharedByList: updatedList });
        }

        if (this.state.tagsList.filter((tag: ICheckBoxItem) => { return tag.isChecked }).length) {
            let updatedList = this.state.tagsList.map((tag: ICheckBoxItem) => { tag.isChecked = false; return tag; });
            this.setState({ tagsList: updatedList });
        }

        if (this.state.typeList.filter((postType: ICheckBoxItem) => { return postType.isChecked }).length) {
            let updatedList = this.state.typeList.map((postType: ICheckBoxItem) => { postType.isChecked = false; return postType; });
            this.setState({ typeList: updatedList });
        }

        this.setState({ selectedSortBy: this.state.sortBy[0].value });

        this.props.onFilterBarCloseClick();
    }

	/**
	* Renders the component
	*/
    public render(): JSX.Element {
        if (this.props.isVisible) {
            return (
                <Flex>
                    {this.state.screenWidth > 750 &&
                        <Flex gap="gap.small" vAlign="center" className="filter-bar-wrapper">
                            <Flex.Item grow>
                                <div className="searchbar-wrapper">
                                    <Input className="searchbar-input" value={this.state.searchText} inverted fluid icon={<Icon iconName="Filter" className="filter-icon" />} iconPosition="start" placeholder={this.localize("filterByKeywordPlaceholder")} onChange={this.onSearchStateChange} />
                                </div>
                            </Flex.Item>
                            <Flex.Item>
                                <>
                                    <div className="filter-bar-item-container">
                                        <PopupMenuWrapper title={this.localize("type")} showSearchBar={false} selectedSortBy={this.state.selectedSortBy!} checkboxes={this.state.typeList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTypeCheckboxStateChange} />
                                        <PopupMenuWrapper title={this.localize("sharedBy")} showSearchBar={true} selectedSortBy={this.state.selectedSortBy!} checkboxes={this.state.sharedByList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onSharedByCheckboxStateChange} />
                                        <PopupMenuWrapper title={this.localize("tagsLabel")} showSearchBar={true} selectedSortBy={this.state.selectedSortBy!} checkboxes={this.state.tagsList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTagsCheckboxStateChange} />
                                        <PopupMenuWrapper title={this.localize("sortBy")} selectedSortBy={this.state.selectedSortBy!} radioGroup={this.state.sortBy} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTagsCheckboxStateChange} />
                                    </div>
                                    <div>
                                        <CloseIcon className="close-icon" onClick={this.onCloseIconClick} />
                                    </div>
                                </>
                            </Flex.Item>

                        </Flex>}

                    {this.state.screenWidth <= 750 && <Flex gap="gap.small" vAlign="start" className="filter-bar-wrapper">
                        <Flex.Item grow>
                            <Flex column gap="gap.small" vAlign="stretch">
                                <div className="searchbar-wrapper-mobile">
                                    <Input value={this.state.searchText} inverted fluid icon={<Icon iconName="Filter" className="filter-icon" />} iconPosition="start" placeholder={this.localize("filterByKeywordPlaceholder")} onChange={this.onSearchStateChange} />
                                </div>
                                <Flex className="mobile-filterbar-wrapper">
                                    <PopupMenuWrapper title={this.localize("type")} showSearchBar={false} selectedSortBy={this.state.selectedSortBy} checkboxes={this.state.typeList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTypeCheckboxStateChange} />
                                    <PopupMenuWrapper title={this.localize("sharedBy")} showSearchBar={true} selectedSortBy={this.state.selectedSortBy} checkboxes={this.state.sharedByList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onSharedByCheckboxStateChange} />
                                    <PopupMenuWrapper title={this.localize("tagsLabel")} showSearchBar={true} selectedSortBy={this.state.selectedSortBy} checkboxes={this.state.tagsList} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTagsCheckboxStateChange} />
                                    <PopupMenuWrapper title={this.localize("sortBy")} selectedSortBy={this.state.selectedSortBy} radioGroup={this.state.sortBy} onRadiogroupStateChange={this.onSortByStateChange} onCheckboxStateChange={this.onTagsCheckboxStateChange} />
                                </Flex>
                            </Flex>
                        </Flex.Item>
                    </Flex>}
                </Flex>
            );
        }
        else {
            return (<></>);
        }
    }
}

export default withTranslation()(FilterBar)