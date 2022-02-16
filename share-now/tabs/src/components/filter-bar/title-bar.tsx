// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import CommandBar from "./command-bar";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";

interface IFilterBarProps {
    onNewPostSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
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

  componentWillReceiveProps(nextProps: IFilterBarProps):void {
    if (nextProps.hideFilterbar !== this.props.hideFilterbar) {
      if (nextProps.hideFilterbar === true) {
        this.setState({ isOpen: false });
      }
    }
  }

  /**
	* Renders the component
	*/
  public render(): JSX.Element {
    return (
      <>
        <CommandBar
          onNewPostSubmit={this.props.onNewPostSubmit}
          showSolidFilterIcon={this.state.showSolidFilter}
          commandBarSearchText={this.props.commandBarSearchText}
          displayForTeam={false}
        />
      </>
    )
  }
}

export default TitleBar;