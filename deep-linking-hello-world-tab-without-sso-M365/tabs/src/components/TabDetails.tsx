import { Component, ReactNode } from "react";
import { withRouter } from "react-router";
import { app, pages } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { AddSSO } from "./sample/AddSSO";
import { Deploy } from "./sample/Deploy";
import { EditCode } from "./sample/EditCode";
import { Publish } from "./sample/Publish";
import { Button } from "@fluentui/react-northstar";
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
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html/tab`;

    // ${environment === "local" ? "69e84217-e248-4c91-82a5-c8904443a009" : "50bf1c82-4eab-4ab9-82eb-6d9235117891"}
    pages.navigateToApp({ appId: '045b2e71-7dd9-4652-9010-fc95542ebc47', pageId: 'index', webUrl: encodeURI(baseUrl) });
  }

  componentDidMount() {
    // Get the user context from Teams and set it in the state
    if (!app.isInitialized()) {
      app.initialize();
    }
    app.getContext().then((context) => {
      this.setState({
        context: context,
        subPageId: context.page.subPageId || this.props.match.params
      });
      console.log(context);
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
            <p className="center">{subPageId ? 'You opened a tab from' : 'Select a tab and Click on the "Open in new tab" from "Navigate within app" section from'}<Button content="Main Tab" primary size="small" text onClick={() => { this.navigateToTab() }} />.</p>
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