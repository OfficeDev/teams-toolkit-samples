import { useEffect, useState } from "react";
import { Button, Image, Menu, Alert } from "@fluentui/react-northstar";
import "./Welcome.css";
import { EditCode } from "./EditCode";
import { Deploy } from "./Deploy";
import { Publish } from "./Publish";
import { AddSSO } from "./AddSSO";
import { pages } from "@microsoft/teams-js";
import { useTeams } from "msteams-react-base-component";


export function Welcome(props: { environment?: string }) {

  const { context } = useTeams({})[0];
  const { environment } = {
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string } = {
    local: "1. Build your app locally",
    azure: "2. Provision and Deploy to the Cloud",
    publish: "3. Publish to Teams",
  };
  const [shareURL, setShareURL] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => {
        setSelectedMenuItem(step);
        setShareURL("");
      },
    };
  });

  console.log(context ? context : "")
  useEffect(() => {
    if (context && context.subEntityId) {
      setSelectedMenuItem(context.subEntityId);
    }

  }, [context])

  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <Image src="hello.png" />
        <h1 className="center">Congratulations!</h1>
        <p className="center">Your app is running in your {friendlyEnvironmentName}</p>
        <Menu activeIndex={steps.indexOf(selectedMenuItem)} items={items} underlined secondary />
        <div className="sections">
          <div>
            <h2>Generate Share URL to this tab</h2>
            <Button primary content="Generate Share URL" onClick={() => {
              console.log(context ? context : "");
              console.log(friendlyStepsName[selectedMenuItem]);
              const labelName = friendlyStepsName[selectedMenuItem];
              const baseUrl = `https://${window.location.hostname}:${window.location.port}/index.html#/tab?selectedTab=${selectedMenuItem}&label=${labelName}`;

              // const url = `https://teams.microsoft.com/l/entity/69e84217-e248-4c91-82a5-c8904443a009/${context ? context.entityId : "index"}?webUrl=${encodeURI(baseUrl)}&context=${encodeURI(`{"subEntityId": "${selectedMenuItem}"`)}}`;
              const url = `https://teams.microsoft.com/l/entity/${environment === "local" ? "69e84217-e248-4c91-82a5-c8904443a009" : "50bf1c82-4eab-4ab9-82eb-6d9235117891"}/${context ? context.entityId : "index"}?context=${encodeURI(`{"subEntityId": "${selectedMenuItem}"`)}}`;

              setShareURL(url);
              // pages.shareDeepLink({ subPageId: selectedMenuItem, subPageLabel: labelName, subPageWebUrl: encodeURI(baseUrl) });
              pages.shareDeepLink({ subPageId: selectedMenuItem, subPageLabel: labelName });

            }} />
            {shareURL && (<Alert content={shareURL} dismissible dismissAction="Close" />)}
          </div>
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
  );
}
