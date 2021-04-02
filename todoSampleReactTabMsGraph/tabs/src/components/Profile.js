// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './Profile.css';
import defaultPhoto from '../images/default-photo.png'

class Profile extends React.Component {
  render() {
    return (
      <div className="profile">
        <div className="photo">
          <img src={this.props.photoObjectURL ? this.props.photoObjectURL : defaultPhoto} alt="avatar"/>
        </div>
        <div className="info">
          <div className="name">{this.props.userInfo.userName}</div>
          <div className="email">{this.props.userInfo.preferredUserName}</div>
          <div className="phone">{this.props.profile.mobilePhone}</div>
        </div>
      </div>
    );
  }
}

export default Profile;