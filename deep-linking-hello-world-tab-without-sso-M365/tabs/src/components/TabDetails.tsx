import { Component, ReactNode } from "react";
import { withRouter } from "react-router";
import { app, pages } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { Button } from "@fluentui/react-northstar";
import { constants } from "../constants";
import { SampleTabs } from "./sample/SampleTabs";
/**
 * This component is used to display the selected record from Welcome.tsx page
 * using pages.navigateToApp();
 */
class TabDetails extends Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      context: {},
      subPageId: "",
      selectedMenuItem: "tab1"
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
    const { subPageId, selectedMenuItem } = this.state;
    return (
      <div className="welcome page">
        <div className="narrow page-padding">
          {subPageId && (
            <>
              <h1 className="center">Congratulations!</h1>
              <p className="center">You opened a tab from <code><Button content="Navigate within app Tab" primary size="small" text onClick={() => { this.navigateToTab() }} /></code>.</p>
              <div className="sections">
                {subPageId === "tab1" && (
                  <div>
                    <p>You selected Tab 1</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                      quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                    </p>
                  </div>
                )}
                {subPageId === "tab2" && (
                  <div>
                    <p>You selected Tab 2</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                      quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                    </p>
                  </div>
                )}
                {subPageId === "tab3" && (
                  <div>
                    <p>You selected Tab 3</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Quis recusandae quibusdam doloremque repellendus voluptatibus eaque pariatur officia perferendis deleniti,
                      quasi numquam quas veniam quos maxime iusto delectus beatae dolores iste?
                    </p>
                  </div>
                )}
              </div>
              <Button primary content="Close this content" onClick={() => {
                this.setState({
                  selectedMenuItem: "tab1",
                  subPageId: ""
                })
              }} />
            </>
          )}

          {!subPageId && (<SampleTabs selectedTab={selectedMenuItem} onTabChange={(selectedTab: string) => {
            this.setState({
              selectedMenuItem: selectedTab
            })
          }} />)}
        </div>
      </div>
    );

  }
}


export default withRouter(TabDetails);