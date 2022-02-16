// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Dialog, Text, Flex } from "@fluentui/react-northstar";
import { EditIcon } from "@fluentui/react-icons-northstar";
import EditItemDialogContent from "./edit-dialog-content";
import { IDiscoverPost } from "../card-view/discover-wrapper-page";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/edit-dialog.css";
import Resources from "../../constants/resources";

interface IEditItemProps extends WithTranslation {
    index: number;
    cardDetails: IDiscoverPost;
    onSubmit: (editedCardDetails: IDiscoverPost, isSuccess: boolean) => void;
    onCancel: () => void;
}

interface IEditDialogStateState {
    editDialogOpen: boolean;
    theme: string;
}

class EditItemDialog extends React.Component<IEditItemProps, IEditDialogStateState> {
    localize: TFunction;

    constructor(props) {
      super(props);

      this.localize = this.props.t;
      this.state = {
        editDialogOpen: false,
        theme: Resources.default
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
	*Invoked while closing dialog. Set state to original values.
	*/
    onCancel = () => {
      this.props.onCancel();
      this.changeDialogOpenState(false);
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
      const className = this.state.theme === Resources.dark ? "dark-menu-items-wrapper" : this.state.theme === Resources.contrast ? "contrast-menu-items-wrapper" : "default-menu-items-wrapper";
      return (
        <Dialog
          className="dialog-container"
          content={
            <EditItemDialogContent
              onSubmit={this.props.onSubmit}
              onCancel={this.onCancel}
              cardDetails={this.props.cardDetails}
              changeDialogOpenState={this.changeDialogOpenState}
            />
          }
          open={this.state.editDialogOpen}
          onOpen={() => this.setState({ editDialogOpen: true })}
          trigger={
            <Flex vAlign="center" className={className} onClick={() => this.changeDialogOpenState(true)}>
              <EditIcon outline /> <Text className="trigger-text" content={this.localize("edit")} />
            </Flex>}
        />
      );
    }
}
export default withTranslation()(EditItemDialog)