// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import RadioGroupWrapper from "../radiogroup-wrapper";

import "../../styles/popup-menu.css";

interface IPopupMenuRadiogroupContentProps {
    content: any,
    selectedValue: number,
    onRadiogroupStateChange: (selectedValue: number) => void
}

const PopupMenuRadiogroupContent: React.FunctionComponent<IPopupMenuRadiogroupContentProps> = props => {

    return (
        <>
            <div className="content-items-wrapper radio-popup-content">
                <div className="content-items-body">
                    {
                        <RadioGroupWrapper selectedItem={props.selectedValue} radioItems={props.content.radioGroupItems} onChange={props.onRadiogroupStateChange} />
                    }
                </div>
            </div>
        </>
    );
}

export default React.memo(PopupMenuRadiogroupContent);