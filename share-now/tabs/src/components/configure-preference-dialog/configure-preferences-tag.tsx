// <copyright file="configure-preferences-tag.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Label, Text } from "@fluentui/react-northstar";
import { CloseIcon } from "@fluentui/react-icons-northstar";

interface IConfigurePreferncesTagProps {
    tagContent: string;
    index: number;
    showRemoveIcon: boolean;
    onRemoveClick?: (index: number) => void
}

const Tag: React.FunctionComponent<IConfigurePreferncesTagProps> = props => {

	/**
    *Invoked when 'X' icon is clicked of the label and passes control back to parent component.
    */
    const onRemoveClick = () => {
        props.onRemoveClick!(props.index);
    }

    // Check whether remove icon is to be displayed or not
    return (
        <Label
            circular
            content={<Text content={props.tagContent} title={props.tagContent} size="small" />}
            className="tags-label-wrapper"
            icon={<CloseIcon key={props.index} onClick={onRemoveClick} />}
        />
    );
}

export default React.memo(Tag);