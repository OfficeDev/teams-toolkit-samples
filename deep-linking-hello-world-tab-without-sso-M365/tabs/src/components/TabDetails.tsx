import { useTeams } from "msteams-react-base-component";
import './sample/Welcome.css'
import { useParams } from 'react-router-dom'
import { AddSSO } from "./sample/AddSSO";
import { Deploy } from "./sample/Deploy";
import { EditCode } from "./sample/EditCode";
import { Publish } from "./sample/Publish";
import { Button } from "@fluentui/react-northstar";
import { pages } from "@microsoft/teams-js";
/**
 * This component is used to display the selected record from Welcome.tsx page
 * using pages.navigateToApp();
 */
export default function TabDetails(props: any) {

  const { context } = useTeams({})[0];

  const navigateToTab = () => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#/tab`;

    // ${environment === "local" ? "69e84217-e248-4c91-82a5-c8904443a009" : "50bf1c82-4eab-4ab9-82eb-6d9235117891"}
    pages.navigateToApp({ appId: '980e4d1c-2122-4588-9fd6-f3327a401506', pageId: 'index', webUrl: baseUrl });
  }
  // @ts-ignore
  const { typeOfTab } = useParams();
  const selectedTab = context?.subEntityId || typeOfTab;
  return (
    <div>
      <div className="welcome page">
        <div className="narrow page-padding">
          <h1 className="center">{selectedTab ? 'Congratulations!' : 'Oops!'}</h1>
          <p className="center">{selectedTab ? 'You opened a tab from' : 'Select a tab and Click on the "Open in new tab" from "Navigate within app" section from'}<Button content="Personal Tab" primary size="small" text onClick={navigateToTab} />.</p>
          <div className="sections">

            {selectedTab === "local" && (
              <div>
                <EditCode />
                <AddSSO />
              </div>
            )}
            {selectedTab === "azure" && (
              <div>
                <Deploy />
              </div>
            )}
            {selectedTab === "publish" && (
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
