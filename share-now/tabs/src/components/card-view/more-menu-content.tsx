// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Flex, Text, Divider, Dialog, Provider } from "@fluentui/react-northstar";
import { TrashCanIcon } from "@fluentui/react-icons-northstar";
import EditItemDialog from "../edit-dialog/edit-dialog";
import { Container } from "react-bootstrap";
import { IDiscoverPost } from "./discover-wrapper-page";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../../styles/more-menu-content.css";
import Resources from "../../constants/resources";

interface IAppState {
    theme: string;
}

interface IMoreMenuContentProps extends WithTranslation {
    cardDetails: IDiscoverPost;
    onMenuItemClick: (key: number) => void;
    onCancel: () => void;
    onEditSubmit: (editedCardDetails: IDiscoverPost, isSuccess: boolean) => void;
}

class MoreMenuContent extends React.Component<IMoreMenuContentProps, IAppState> {
    localize: TFunction;

    constructor(props) {
      super(props);
      this.localize = this.props.t;
      this.state = {
        theme: Resources.default,
      }
    }

    /**
	* Renders the component
	*/
    public render(): JSX.Element {
      const className = this.state.theme === Resources.dark ? "dark-menu-items-wrapper" : this.state.theme === Resources.contrast ? "contrast-menu-items-wrapper" : "default-menu-items-wrapper";
      return (
        <Provider>
          <Container fluid className="popup-menu-content-wrapper">
            {this.props.cardDetails.isCurrentUserPost && <><EditItemDialog
              index={1}
              cardDetails={this.props.cardDetails}
              onSubmit={this.props.onEditSubmit}
              onCancel={this.props.onCancel}
            />
            <Divider />
            <Dialog
              className="dialog-container-discover-posts"
              cancelButton={this.localize("cancel")}
              confirmButton={this.localize("Confirm")}
              content={this.localize("deleteConfirmBodyText")}
              header={this.localize("deleteConfirmTitleText")}
              trigger={<Flex vAlign="center" className={className}><TrashCanIcon outline /> <Text className="popup-menu-item-text" content={this.localize("delete")} /></Flex>}
              onConfirm={() => this.props.onMenuItemClick(3)}
            /></>}
          </Container>
        </Provider>
      );
    }
}
export default withTranslation()(MoreMenuContent)