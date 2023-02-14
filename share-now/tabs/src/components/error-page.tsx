// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Text } from "@fluentui/react-northstar";
import { WithTranslation, withTranslation } from "react-i18next";
import { TFunction } from "i18next";

import "../styles/site.css";

interface IErrorPageProps extends WithTranslation, RouteComponentProps {
}

// eslint-disable-next-line @typescript-eslint/ban-types
class ErrorPage extends React.Component<IErrorPageProps, {}> {
    localize: TFunction;

    constructor(props) {
      super(props);

      this.localize = this.props.t;
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {

      const params = this.props.match.params;
      let message = this.localize("generalErrorMessage");

      if ("message" in params) {
        message = decodeURIComponent(params["message"] as string);
      }

      return (
        <div className="container-div">
          <div className="container-subdiv">
            <div className="error-message">
              <Text content={message} error size="medium" />
            </div>
          </div>
        </div>
      );
    }
}

export default withTranslation()(ErrorPage)