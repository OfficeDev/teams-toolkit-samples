import { ReactElement, useEffect, useState } from "react";
import { app, pages } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { AddSSO } from "./sample/AddSSO";
import { Deploy } from "./sample/Deploy";
import { EditCode } from "./sample/EditCode";
import { Publish } from "./sample/Publish";
import { Button, Menu } from "@fluentui/react-northstar";
import { constants } from "../constants";
/**
 * This component is used to display the selected record from Welcome.tsx page
 * using pages.navigateToApp();
 */
export default function NavigateWithinApp(props: { environment?: string }): ReactElement {
  const [context, setContext] = useState({} as app.Context);
  const { environment } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const appId = environment === "local" ? constants.TEAMS_APP_ID_LOCAL : constants.TEAMS_APP_ID_DEV;
  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string } = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => {
        setSelectedMenuItem(step);
      },
    };
  });

  useEffect(() => {
    if (!app.isInitialized()) {
      app.initialize();
    }
    app.getContext().then((context) => {
      setContext(context);
      console.log(context);
    }).catch((err) => {
      console.error("Error getting context -> ", err);
    });

  }, []);

  useEffect(() => {
    if (context && Object.keys(context).length > 0 && context.page.subPageId) {
      setSelectedMenuItem(context.page.subPageId);
    }

  }, [context])

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <p className="center">The deeplinking uses <code>page.subPageId</code> property from the Teams SDK <code>context</code> object which can be used to maintain the app state
          when a user clicks on the deeplink.</p>
        <div className="main-section">
          <div className="deeplink-functions-container">
            <div id="navigate-within-app">
              <h2>2. Navigate within the app</h2>
              <p>Open this <code>{friendlyStepsName[selectedMenuItem]}</code> tab contents in another tab.
                Click on the below button and it will navigate to the other tab displaying this current tab content.
              </p>
              <p>The below button uses <code>pages.navigateToApp()</code> function to navigate a user to another tab.</p>
              <Button primary content="Open in new tab" onClick={() => {
                const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html/tabdetails/${selectedMenuItem}`;
                pages.navigateToApp({ appId: appId, pageId: 'tabdetails', webUrl: encodeURI(baseUrl), subPageId: selectedMenuItem });
              }} />
            </div>
          </div>
          <div className="menu-container">
            <Menu activeIndex={steps.indexOf(selectedMenuItem)} items={items} underlined secondary />
            <div className="sections">
              {selectedMenuItem === "local" && (
                <div>
                  <EditCode />
                  <AddSSO />
                </div>
              )}
              {selectedMenuItem === "azure" && (
                <div>
                  <Deploy />
                </div>
              )}
              {selectedMenuItem === "publish" && (
                <div>
                  <Publish />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
