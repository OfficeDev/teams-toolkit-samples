// <copyright file="command-bar.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Flex, Input, Button, Text } from "@fluentui/react-northstar";
import { SearchIcon } from "@fluentui/react-icons-northstar";
import { Icon } from "@fluentui/react/lib/Icon";
import { initializeIcons } from "@uifabric/icons";
import { useTranslation } from 'react-i18next';
import AddNewPostDialog from "../add-new-dialog/add-new-dialog";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";

import "../../styles/command-bar.css";

interface ICommandBarProps {
    onFilterButtonClick: () => void;
    onSearchInputChange: (searchString: string) => void;
    onNewPostSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
    searchFilterPostsUsingAPI: () => void;
    commandBarSearchText: string;
    showSolidFilterIcon: boolean;
    displayForTeam: boolean;
}

const CommandBar: React.FunctionComponent<ICommandBarProps> = props => {
    const localize = useTranslation().t;
    initializeIcons();

    /**
	* Invokes for key press
	* @param event Object containing event details
	*/
    const onTagKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            props.searchFilterPostsUsingAPI();
        }
    }

    return (
        <Flex gap="gap.small" vAlign="center" hAlign="end" className="command-bar-wrapper">
            {!props.displayForTeam && <AddNewPostDialog onSubmit={props.onNewPostSubmit} />}
        </Flex>
    );
}

export default CommandBar;