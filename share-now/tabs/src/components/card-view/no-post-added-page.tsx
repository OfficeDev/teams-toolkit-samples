// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import { Text } from "@fluentui/react-northstar";
import { EyeIcon } from "@fluentui/react-icons-northstar";
import AddNewPostDialog from "../add-new-dialog/add-new-dialog";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/no-post-added-page.css";

interface INoPostAddedProps extends WithTranslation {
    onNewPostSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
    showAddButton: boolean;
}

class TeamsConfigPage extends React.Component<INoPostAddedProps> {
    localize: TFunction;
    constructor(props) {
      super(props);
      this.localize = this.props.t;
    }

    public render(): JSX.Element {
      return (
        <div className="no-post-added-container">
          <div className="app-logo">
            <EyeIcon size="largest" />
          </div>
          <div className="add-new-post">
            <Text content={this.localize("addNewPostNote")} />
          </div>
          {this.props.showAddButton && <div className="add-new-post-btn">
            <AddNewPostDialog onSubmit={this.props.onNewPostSubmit} />
          </div>}
        </div>
      )
    }
}

export default withTranslation()(TeamsConfigPage)