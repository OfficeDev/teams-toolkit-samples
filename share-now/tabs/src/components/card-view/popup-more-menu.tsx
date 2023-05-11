// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Popup, PopupProps } from "@fluentui/react-northstar";
import { MoreIcon } from "@fluentui/react-icons-northstar";
import { IDiscoverPost } from "./discover-wrapper-page";
import MoreMenuContent from "./more-menu-content";

import "../../styles/more-menu.css";

interface IPopupMoreMenu {
    cardDetails: IDiscoverPost;
    onMenuItemClick: (key: number) => void;
    onEditSubmit: (editedCardDetails: IDiscoverPost, isSuccess: boolean) => void;
}

const PopupMoreMenu: React.FunctionComponent<IPopupMoreMenu> = props => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  /**
    *Invoked while closing dialog. Set state to original values.
    */
  const onCancel = () => {
    setMenuOpen(false);
  }

  /**
	*Invoked when edit post detail is successful from dialog.
	*@param cardDetails Updated post details
	*@param isSuccess Boolean indication whether operation result
    */
  const onEditSubmit = (cardDetails: IDiscoverPost, isSuccess: boolean) => {
    setMenuOpen(false);
    props.onEditSubmit(cardDetails, isSuccess);
  }

  /**
	*Invoked when menu item is clicked and passes back to parent component.
	*@param key Selected menu item key
    */
  const onItemClick = (key: number) => {
    if (key === 1 || key === 3) {
      setMenuOpen(false);
    }
    props.onMenuItemClick(key);
  }

  return (
    <Popup
      onOpenChange={(_, props?: PopupProps) => setMenuOpen(props?.open ?? false)}
      open={menuOpen}
      content={
        <MoreMenuContent cardDetails={props.cardDetails} onCancel={onCancel} onEditSubmit={onEditSubmit} onMenuItemClick={onItemClick} />
      }
      trigger={<MoreIcon className="more-menu-icon" />}
    />
  );
}

export default React.memo(PopupMoreMenu);