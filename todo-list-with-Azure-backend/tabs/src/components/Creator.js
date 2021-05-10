// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import './Creator.css';
import { createMicrosoftGraphClient, } from "teamsdev-client";

class Creator extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayName: "",
      photoObjectURL: "",
    }
  }

  async componentDidMount() {
    try {
      var graphClient = await createMicrosoftGraphClient(this.props.credential, this.props.scope);
      var displayName = (await graphClient.api(`/users/${this.props.objectId}`).get()).displayName;
      var photoBlob = await graphClient.api(`/users/${this.props.objectId}/photo/$value`).get()
      var photoObjectURL = URL.createObjectURL(photoBlob);
      this.setState({
        displayName,
        photoObjectURL,
      });
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    return (
      <div className="creator">
        <div>
          {this.state.photoObjectURL && <img src={this.state.photoObjectURL} alt="avatar" />}
        </div>
        <div className="name">{this.state.displayName}</div>
      </div>
    );
  }
}

export default Creator;