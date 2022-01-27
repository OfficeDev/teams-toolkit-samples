// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { Flex, Text } from "@fluentui/react-northstar";
import { PresenceAvailableIcon, ErrorIcon, CloseIcon } from '@fluentui/react-icons-northstar';

import "../../styles/alert.css";

interface INotificationMessageProps {
    notificationType: number;
    content: string;
    showAlert: boolean;
    onClose: () => void;
}

interface INotificationMessageState {
    showAlert: boolean;
}

export default class NotificationMessage extends React.Component<INotificationMessageProps, INotificationMessageState> {
  constructor(props: INotificationMessageProps) {
    super(props);

    this.state = {
      showAlert: false
    }
  }

  componentWillReceiveProps(nextProps: INotificationMessageProps):void {
    if (nextProps.showAlert !== this.props.showAlert) {
      this.setState({ showAlert: nextProps.showAlert })
    }
  }

  /**
    * Renders the component
    */
  public render(): JSX.Element {

    if (this.props.showAlert) {
      return (
        <div className="notification-container">
          <div className={`notification-${this.props.notificationType === 1 ? 'success' : 'error'}`}>
            <Flex gap="gap.smaller" vAlign="center">
              <Flex.Item>
                {
                  this.props.notificationType === 1 ? <PresenceAvailableIcon color="green" /> : <ErrorIcon color="red" />
                }
              </Flex.Item>
              <Flex.Item>
                <Text content={this.props.content} size="medium" />
              </Flex.Item>
              <Flex.Item push>
                <div></div>
              </Flex.Item>
              <CloseIcon className="close-button" onClick={this.props.onClose} />
            </Flex>
          </div>
        </div>
      );
    }
    else {
      return (<></>);
    }
  }
}