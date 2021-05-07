// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { useState } from "react";
import { Image, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import { PostFunctions } from "./PostFunctions";
import { useTeamsFx } from "./lib/useTeamsFx";
import { TeamsUserCredential } from "teamsdev-client";
import { useData } from "./lib/useData";
import { CreateFunctions } from "./CreateFunctions";
import { VoteFunctions } from "./VoteFunctions";

export function Welcome(props: {
  showFunction?: boolean;
  environment?: string;
}) {
  const { showFunction, environment } = {
    showFunction: true,
    environment: window.location.hostname === "localhost" ? "local" : "azure",
    ...props,
  };
  const friendlyEnvironmentName =
    {
      local: "local environment",
      azure: "Azure environment",
    }[environment] || "local environment";

  const steps = ["local", "azure", "publish"];
  const friendlyStepsName: { [key: string]: string; } = {
    local: "Build your app locally",
    azure: "Deploy to the Cloud",
    publish: "Publish to Teams",
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("local");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  const { isInTeams } = useTeamsFx();
  const credential = new TeamsUserCredential();
  const userProfile = useData(async () =>
    isInTeams ? await credential.getUserInfo() : undefined
  ).data;
  const userName = userProfile ? userProfile.displayName : "";
  return (
    <div className="welcome page">
      <div className="narrow page-padding">
        <h1 className="center">
          Congratulations{userName ? ", " + userName : ""}!
        </h1>
        <p className="center">
          Your app is running in your {friendlyEnvironmentName}
        </p>
        <div className="sections">
          <div>
            {showFunction && <PostFunctions />}
            {showFunction && <CreateFunctions />}
            {showFunction && <VoteFunctions />}
          </div>
        </div>
      </div>
    </div>
  );
}
