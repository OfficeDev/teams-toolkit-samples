// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Popup, Button, Text } from "@fluentui/react-northstar";
import { ChevronDownIcon } from "@fluentui/react-icons-northstar";
import PopupMenuCheckboxesContent from "./popup-menu-checkboxes-content";
import PopupMenuRadiogroupContent from "./popup-menu-radiogroup-content";
import { ICheckBoxItem } from "../filter-bar/filter-bar";

import "../../styles/popup-menu.css";

interface IPopupMenuWrapperProps {
    checkboxes?: Array<any>,
    radioGroup?: Array<any>,
    title: string,
    selectedSortBy?: number,
    showSearchBar?: boolean,
    onCheckboxStateChange: (typeState: Array<any>) => void,
    onRadiogroupStateChange: (selectedValue: number) => void,
}

const PopupMenuWrapper: React.FunctionComponent<IPopupMenuWrapperProps> = props => {
    const [popup, onOpenChange] = React.useState({ isOpen: false });
    let [disableClear, setdisableClear] = React.useState(true);

    const onFilterClick = () => {
        let checkCount = 0;
        let checkBox = props.checkboxes!;
        checkBox.map((checkbox: ICheckBoxItem) => {
            if (checkbox.isChecked) {
                checkCount = checkCount + 1;
            }
        });
        if (checkCount > 0) {
            setdisableClear(false);
        }
        else {
            setdisableClear(true);
        }
    }

    if (props.checkboxes) {
        return (
            <Popup
                open={popup.isOpen}
                align="end"
                position="below"
                onOpenChange={(e, { open }: any) => onOpenChange({ isOpen: open })}
                trigger={<Button className={`mobile-button ${popup.isOpen ? "gray-background" : "no-background"}`} onClick={() => onFilterClick()} content={<Text content={props.title} />} iconPosition="after" icon={<ChevronDownIcon className={popup.isOpen ? "gray-background" : "no-background"} />} text />}
                content={<PopupMenuCheckboxesContent disableClear={disableClear} showSearchBar={props.showSearchBar!} content={{ checkboxes: props.checkboxes, title: props.title }} onCheckboxStateChange={props.onCheckboxStateChange} />}
                trapFocus
            />
        );
    }
    else if (props.radioGroup) {
        return (
            <Popup
                open={popup.isOpen}
                align="end"
                position="below"
                onOpenChange={(e, { open }: any) => onOpenChange({ isOpen: open })}
                trigger={<Button icon={<ChevronDownIcon className={popup.isOpen ? "gray-background" : "no-background"} />} className={`mobile-button ${popup.isOpen ? "gray-background" : "no-background"}`} iconPosition="after" content={<Text content={props.title} />} text />}
                content={<PopupMenuRadiogroupContent selectedValue={props.selectedSortBy!} content={{ radioGroupItems: props.radioGroup, title: props.title }} onRadiogroupStateChange={props.onRadiogroupStateChange} />}
                trapFocus
            />
        );
    }
    else {
        return (<></>);
    }
}

export default React.memo(PopupMenuWrapper);