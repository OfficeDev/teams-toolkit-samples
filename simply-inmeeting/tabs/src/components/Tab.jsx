import React from "react";
import './App.css';
import MediaQuery from 'react-responsive';

export default function Tab() {
  return (
    <div>
      <h1>In-meeting app sample</h1>
      <MediaQuery maxWidth={280}>
        <h3>In-meeting app side panel</h3>
        <p>Need more info, please go to document.microsoft.com</p>
      </MediaQuery>
    </div>
  );
}
