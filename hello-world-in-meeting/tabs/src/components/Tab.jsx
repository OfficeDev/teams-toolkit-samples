import React from "react";
import { app } from "@microsoft/teams-js";
import MediaQuery from 'react-responsive';
import './App.css';

class Tab extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      context: {}
    }
  }

  //React lifecycle method that gets called once a component has finished mounting
  //Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount(){
    app.initialize().then(() => {
      // Get the user context from Teams and set it in the state
      app.getContext().then(async (context) => {
        this.setState({
          meetingId: context.meeting.id,
          userName: context.user.userPrincipalName
        });
      });
    });
    // Next steps: Error handling using the error object
  }

  render() {
    let meetingId = this.state.meetingId ?? "";
    let userPrincipleName = this.state.userName ?? "";

    return (
    <div>
      <h1>In-meeting app sample</h1>
      <h3>Principle Name:</h3>
      <p>{userPrincipleName}</p>
      <h3>Meeting ID:</h3>
      <p>{meetingId}</p>
      <MediaQuery maxWidth={280}>
        <h3>This is the side panel</h3>
        <a href="https://docs.microsoft.com/en-us/microsoftteams/platform/apps-in-teams-meetings/teams-apps-in-meetings">Need more info, open this document in new tab or window.</a>
      </MediaQuery>
    </div>
    );
  }
}

export default Tab;