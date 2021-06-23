// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import './Profile.module.css';
import { ProfileProps } from './ProfileProps';

class Profile extends React.Component<ProfileProps> {
  public render() {
    const defaultPhoto:string = require('../images/default-photo.png');
    return (
      <div className="profile">
        <div>
          <img src={this.props.photoObjectURL ? this.props.photoObjectURL : defaultPhoto } alt="avatar"/>
        </div>
        <div className="name">{this.props.userName}</div>
      </div>
    );
  }
}

export default Profile;