import { ReactElement, useEffect, useState } from "react";
import { app, pages } from "@microsoft/teams-js";
import './sample/Welcome.css'
import { Button } from "@fluentui/react-northstar";
import { constants } from "../constants";
import { SampleTabs } from "./sample/SampleTabs";
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

  const friendlyStepsName: { [key: string]: string } = {
    tab1: "Tab 1",
    tab2: "Tab 2",
    tab3: "Tab 3",
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState("tab1");

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
        <div className="main-section">
          <div className="deeplink-functions-container">
            <div id="navigate-within-app">
              <h2>2. Navigate within the app</h2>
              <p>Open this <code>{friendlyStepsName[selectedMenuItem]}</code> tab contents in another tab.
                Click on the below button and it will navigate to the other tab displaying this current tab content.
              </p>
              <p>The below button uses <code>pages.navigateToApp()</code> function to navigate a user to another tab passing <code>page.subPageId</code> which will open the selected tab contents of in the <code>Details Tab</code>.</p>
              <Button primary content="Open in details tab" onClick={() => {
                const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html/tabdetails/${selectedMenuItem}`;
                pages.navigateToApp({ appId: appId, pageId: 'tabdetails', webUrl: encodeURI(baseUrl), subPageId: selectedMenuItem });
              }} />
            </div>
          </div>
          <SampleTabs selectedTab={selectedMenuItem} onTabChange={(selectedTab: string) => {
            setSelectedMenuItem(selectedTab);
          }} />
        </div>
      </div>
    </div>
  );
}
