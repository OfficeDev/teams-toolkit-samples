// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Flex } from "@fluentui/react-northstar";
import { initializeIcons } from "@uifabric/icons";
import AddNewPostDialog from "../add-new-dialog/add-new-dialog";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";

import "../../styles/command-bar.css";

interface ICommandBarProps {
    onNewPostSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
    commandBarSearchText: string;
    showSolidFilterIcon: boolean;
    displayForTeam: boolean;
}

const CommandBar: React.FunctionComponent<ICommandBarProps> = props => {
  initializeIcons();

  return (
    <Flex gap="gap.small" vAlign="center" hAlign="end" className="command-bar-wrapper">
      {!props.displayForTeam && <AddNewPostDialog onSubmit={props.onNewPostSubmit} />}
    </Flex>
  );
}

export default CommandBar;