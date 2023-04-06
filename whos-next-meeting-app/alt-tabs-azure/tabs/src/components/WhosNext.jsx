import React from "react";
import { app, pages } from "@microsoft/teams-js";

import "./WhosNext.scss";
import FluidService from "../services/fluidAzure.js";

class WhosNextTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userPrincipalName: "",
      addedName: "",
      meetingId: "",
      containerId: "",
      people: [],
    };
    this.inputChange = this.inputChange.bind(this);
    this.keyDown = this.keyDown.bind(this);
  }

  componentDidMount() {
    app.initialize().then(async () => {
      const context = await app.getContext();
      const userPrincipalName = context?.user?.userPrincipalName.split("@")[0];
      const meetingId = context?.meeting?.id;
      const config = await pages.getConfig();
      const containerId = config?.entityId;
      await FluidService.useContainer(containerId);
      const people = await FluidService.getPersonList();
      this.setState({
        userPrincipalName: userPrincipalName,
        meetingId: meetingId,
        containerId: containerId,
        people: people,
      });

      // Update state when fluid data changes
      FluidService.onNewData((people) => {
        this.setState({
          people: people,
        });
      });
    });
    // Next steps: Error handling using the error object
  }

  //on text change in input box
  inputChange = (e) => {
    this.setState({
      addedName: e.target.value,
    });
  };

  //on key down enter in input box
  keyDown = async (e) => {
    if (e.key === "Enter") {
      await FluidService.addPerson(e.target.value);
      this.setState({
        addedName: "",
      });
    }
  };

  render() {
    const { addedName, userPrincipalName } = this.state;

    return (
      <div className="speaker-list">
        {/* Heading */}
        <h1>Who's next?</h1>

        {/* Current speaker (if any) */}
        {this.state.people.length > 0 && (
          <div className="speaker-box">
            <h2>Now speaking:</h2>
            <h1 className="reveal-text">{this.state.people[0]}</h1>
          </div>
        )}

        {/* Input box w/title and button */}
        <h2>Add your name to the list to speak</h2>
        <div className="add-name">
          <input
            type="text"
            onChange={this.inputChange}
            onKeyDown={this.keyDown}
            value={addedName}
          />
          <button
            type="submit"
            onClick={async () => {
              await FluidService.addPerson(
                addedName ? addedName : userPrincipalName
              );
              this.setState({ addedName: "" });
            }}
          >
            +
          </button>
          <hr />
        </div>

        {/* List heading */}
        <div className="display-list">
          {this.state.people.length > 1 && (
            <div>
              <div className="people-list ">
                <h2>
                  {this.state.people.length - 2
                    ? `${
                        this.state.people.length - 1
                      } more people waiting to speak`
                    : `1 person waiting to speak`}
                </h2>

                {/* List of people waiting to speak  */}
                {this.state.people.slice(1).map((item, index) => (
                  <li key={index} className="list-item">
                    {item}
                    <div
                      className="close"
                      onClick={async () => {
                        await FluidService.removePerson(item);
                      }}
                    >
                      x
                    </div>
                  </li>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Who's next button */}
        <div>
          <button
            onClick={async () => {
              await FluidService.nextPerson();
            }}
          >
            Next speaker
          </button>
        </div>

        {/* Shuffle button */}
        <div>
          <button
            className="shuffle"
            onClick={async () => {
              await FluidService.shuffle();
            }}
          >
            Shuffle
          </button>
        </div>
      </div>
    );
  }
}

export default WhosNextTab;
