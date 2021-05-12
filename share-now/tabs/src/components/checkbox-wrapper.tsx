// <copyright file="checkbox-wrapper.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Flex, Checkbox } from "@fluentui/react-northstar";
import '../styles/card.css';

interface ICheckboxProps {
    title: JSX.Element;
    index: number;
    isChecked: boolean;
    onChange: (key: number, isChecked: boolean) => void
}

const CheckboxWrapper: React.FunctionComponent<ICheckboxProps> = props => {
    return (
        <Flex gap="gap.small">
            <Checkbox className="checkbox-wrapper" label={props.title} key={props.index} checked={props.isChecked} onChange={(event, data: any) => props.onChange(props.index, data.checked)} />
        </Flex>
    );
}

export default React.memo(CheckboxWrapper);