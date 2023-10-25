// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from "react";
import "./Creator.css";
import { Client } from "@microsoft/microsoft-graph-client";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import defaultPhoto from "../images/default-photo.png";

class Creator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      photoObjectURL: "",
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.objectId !== this.props.objectId) {
      this.fetchData();
    }
  }

  async fetchData() {
    try {
      // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
      const authProvider = new TokenCredentialAuthenticationProvider(
        this.props.credential,
        {
          scopes: this.props.scope,
        }
      );
      // Initialize the Graph client
      const graphClient = Client.initWithMiddleware({
        authProvider: authProvider,
      });
      const displayName = (
        await graphClient.api(`/users/${this.props.objectId}`).get()
      ).displayName;
      let photoObjectURL;
      try {
        const photoBlob = await graphClient
          .api(`/users/${this.props.objectId}/photo/$value`)
          .get();
        photoObjectURL = URL.createObjectURL(photoBlob);
      } catch (error) {}
      this.setState({
        displayName,
        photoObjectURL,
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div className="creator">
        <div>
          <img
            src={
              this.state.photoObjectURL
                ? this.state.photoObjectURL
                : defaultPhoto
            }
            alt="avatar"
          />
        </div>
        <div className="name">{this.state.displayName}</div>
      </div>
    );
  }
}

export default Creator;
