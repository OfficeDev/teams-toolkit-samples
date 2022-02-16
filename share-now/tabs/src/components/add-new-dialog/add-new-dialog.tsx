// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Dialog, Button } from "@fluentui/react-northstar";
import AddNewItemDialogContent from "./add-new-dialog-content";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/edit-dialog.css";

interface IAddNewPostProps extends WithTranslation {
    onSubmit: (isSuccess: boolean, getSubmittedPost: IDiscoverPost) => void;
}

interface IAddNewDialogState {
    editDialogOpen: boolean;
}

class AddNewPostDialog extends React.Component<IAddNewPostProps, IAddNewDialogState> {
    localize: TFunction;

    constructor(props) {
      super(props);

      this.localize = this.props.t;
      this.state = {
        editDialogOpen: false
      }
    }

    /**
	*Changes dialog open state to show and hide dialog.
	*@param isOpen Boolean indication whether to show dialog
	*/
    changeDialogOpenState = (isOpen: boolean) => {
      this.setState({ editDialogOpen: isOpen })
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
      return (
        <Dialog
          className="dialog-container"
          content={
            <AddNewItemDialogContent
              onSubmit={this.props.onSubmit}
              changeDialogOpenState={this.changeDialogOpenState}
            />
          }
          open={this.state.editDialogOpen}
          onOpen={() => this.setState({ editDialogOpen: true })}
          trigger={<Button className="mobile-button" content={this.localize("addNew")} onClick={() => this.changeDialogOpenState(true)} primary />}
        />
      );
    }
}
export default withTranslation()(AddNewPostDialog)