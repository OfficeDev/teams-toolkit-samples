import { Component, ReactNode } from "react";
import { withRouter } from "react-router";
import { app, pages } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { AddSSO } from "./sample/AddSSO";
import { Deploy } from "./sample/Deploy";
import { EditCode } from "./sample/EditCode";
import { Publish } from "./sample/Publish";
import { Button } from "@fluentui/react-northstar";
import { constants } from "../constants";
/**
 * This component is used to display the selected record from Welcome.tsx page
 * using pages.navigateToApp();
 */
class TabDetails extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      context: {},
      subPageId: ""
    }
  }

  navigateToTab() {
    const { environment } = {
      environment: window.location.hostname === "localhost" ? "local" : "azure",
      ...this.props,
    };
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html/navigateWithinApp`;
    const appId = environment === "local" ? constants.TEAMS_APP_ID_LOCAL : constants.TEAMS_APP_ID_DEV;
    pages.navigateToApp({ appId: appId, pageId: 'navigateWithinApp', webUrl: encodeURI(baseUrl) });
  }

  componentDidMount() {
    // Get the user context from Teams and set it in the state
    if (!app.isInitialized()) {
      app.initialize();
    }
    app.getContext().then((context) => {
      this.setState({
        context: context,
        subPageId: context.page.subPageId || this.props.match.params.id
      });
    }).catch((err) => {
      console.error("Error getting context -> ", err);
    });
  }

  render(): ReactNode {
    const { subPageId } = this.state;
    return (
      <div>
        <div className="welcome page">
          <div className="narrow page-padding">
            <h1 className="center">{subPageId ? 'Congratulations!' : 'Oops!'}</h1>
            <p className="center">{subPageId ? 'You opened a tab from' : 'Select a tab and Click on the "Open in new tab" from "Navigate within app" section from'}<Button content="Navigate within app Tab" primary size="small" text onClick={() => { this.navigateToTab() }} />.</p>
            <div className="sections">

              {subPageId === "local" && (
                <div>
                  <EditCode />
                  <AddSSO />
                </div>
              )}
              {subPageId === "azure" && (
                <div>
                  <Deploy />
                </div>
              )}
              {subPageId === "publish" && (
                <div>
                  <Publish />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );

  }
}


export default withRouter(TabDetails);