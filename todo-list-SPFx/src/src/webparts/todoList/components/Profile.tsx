// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import './Profile.module.css';
import { IProfileProps } from './ProfileProps';
import DefaultPhoto from "../images/default-photo.png";

class Profile extends React.Component<IProfileProps> {
  public render(): JSX.Element {
    return (
      <div className="profile">
        <div>
          <img src={this.props.photoObjectURL ? this.props.photoObjectURL : DefaultPhoto } alt="avatar"/>
        </div>
        <div className="name">{this.props.userName}</div>
      </div>
    );
  }
}

export default Profile;