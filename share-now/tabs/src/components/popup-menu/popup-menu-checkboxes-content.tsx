// <copyright file="popup-menu-checkboxes-content.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Flex, Input, Button, Provider, Divider } from "@fluentui/react-northstar";
import { CloseIcon, SearchIcon } from "@fluentui/react-icons-northstar";
import CheckboxWrapper from "../checkbox-wrapper";
import { useTranslation } from 'react-i18next';
import { ICheckBoxItem } from "../filter-bar/filter-bar";

import "../../styles/popup-menu.css";

interface IPopupMenuCheckboxesContentProps {
    showSearchBar: boolean,
    content: any,
    disableClear: boolean,
    onCheckboxStateChange: (checkboxState: Array<ICheckBoxItem>) => void
}

const PopupMenuCheckboxesContent: React.FunctionComponent<IPopupMenuCheckboxesContentProps> = props => {
    const localize = useTranslation().t;
    const [data, setCheckbox] = React.useState({ checkboxes: props.content.checkboxes });
    const [filteredCheckboxes, setFilteredCheckboxes] = React.useState(props.content.checkboxes);
    const [searchedString, setSearchString] = React.useState("");
    let [disableClear, setdisableClear] = React.useState(true);
    let [checkBoxClicked, setcheckBoxClicked] = React.useState(false);

	/**
	*Updates particular checkbox's isChecked state and passes changed state back to parent component.
	*@param key Unique key for checkbox which needs to be updated
	*@param checked Boolean indicating checkbox current value
    */
    const onCheckboxValueChange = (key: number, checked: boolean) => {
        let checkCount = 0;
        setcheckBoxClicked(true);
        let checkboxList = data.checkboxes.map((checkbox: ICheckBoxItem) => {
            if (checkbox.key === key) {
                checkbox.isChecked = checked;
            }
            return checkbox;
        });

        checkboxList.map((checkbox: ICheckBoxItem) => {
            if (checkbox.isChecked) {
                checkCount = checkCount + 1;
            }
        })

        if (checkCount > 0) {
            setdisableClear(false);
        }
        else {
            setdisableClear(true);
        }

        if (searchedString.trim().length) {
            let filteredAuthors = checkboxList.filter((author: ICheckBoxItem) => {
                return author.title.toLowerCase().includes(searchedString.toLowerCase());
            })
            setFilteredCheckboxes(filteredAuthors);
        }
        else {
            setFilteredCheckboxes(checkboxList);
        }

        props.onCheckboxStateChange(checkboxList);
    }

	/**
    *Sets all checkbox's isChecked to false to unselect all and passes changed state back to parent component.
    */
    const deSelectAll = () => {
        let checkboxList = filteredCheckboxes.map((checkbox: ICheckBoxItem) => {
            checkbox.isChecked = false
            return checkbox;
        });
        setFilteredCheckboxes(checkboxList);
        props.onCheckboxStateChange(checkboxList);
        setdisableClear(true);
        setcheckBoxClicked(true);
    }

    const onSearchChange = (text: string) => {
        setSearchString(text);
        if (text.trim().length > 0) {
            let filteredAuthors = filteredCheckboxes.filter((author: ICheckBoxItem) => {
                return author.title.toLowerCase().includes(text.toLowerCase()) === true;
            })
            setFilteredCheckboxes(filteredAuthors);
        }
        else {
            setFilteredCheckboxes([...data.checkboxes]);
        }
    }

    return (
        <Provider>
            <div className="content-items-wrapper">
                {props.showSearchBar && <div className="content-items-headerfooter">
                    <Input icon={<SearchIcon />} placeholder={localize("searchPlaceholder")} value={searchedString} fluid onChange={(event: any) => onSearchChange(event.target.value)} />
                </div>}
                <div className="content-items-body">
                    {
                        filteredCheckboxes.map((checkbox: ICheckBoxItem) => {
                            if (checkbox.title.trim().length) {
                                return (
                                    <CheckboxWrapper title={checkbox.checkboxLabel} isChecked={checkbox.isChecked} index={checkbox.key} onChange={(key, isChecked) => onCheckboxValueChange(key, isChecked)} />
                                );
                            }
                        })
                    }
                </div>
                <Divider className="filter-popup-menu-divider" />
                <div className="content-items-headerfooter">
                    <Flex gap="gap.small" vAlign="center" hAlign="end">
                        <Flex.Item push>
                            <div></div>
                        </Flex.Item>
                        <Button disabled={checkBoxClicked ? disableClear : props.disableClear} className="clear-button" icon={<CloseIcon />} size="small" text onClick={() => deSelectAll()} content={localize("unselectedAll")} />
                    </Flex>
                </div>
            </div>
        </Provider>
    );
}

export default React.memo(PopupMenuCheckboxesContent);