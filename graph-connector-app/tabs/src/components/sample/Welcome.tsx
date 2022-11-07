import { useContext } from "react";
import { Button, Image, Loader } from "@fluentui/react-northstar";
import "./Welcome.css";
import { Introduce } from "./Introduce";
import { Ingest } from "./Ingest";
import { useGraph } from "@microsoft/teamsfx-react";
import { Query } from "./Query";
import { Scopes } from "./lib/constants";
import { TeamsFxContext } from "../Context";

export function Welcome() {
  const { teamsfx } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraph(
    async (graph, teamsfx, scope) => {
      // Call graph api directly to get user profile information
      const profile = await graph.api("/me").get();
      return { profile };
    },
    { scope: Scopes, teamsfx: teamsfx }
  );

  return (
    <div>
      {loading && (
        <div>
          <Loader style={{ margin: 100 }} />
        </div>
      )}
      {!loading && data && (
        <div className="welcome page">
          <div className="narrow page-padding">
            <Image src="hello.png" />
            <h1 className="center">Hello, {data.profile.displayName}!</h1>
            <p className="center">
              Let's build your first custom Microsoft Graph connector.
            </p>
            <div className="sections">
              <Introduce />
              <Ingest />
              <Query />
            </div>
          </div>
        </div>
      )}
      {!loading && !data && (
        <div className="auth">
          <h2>Welcome to Graph Connector App!</h2>
          <Button primary content="Start" disabled={loading} onClick={reload} />
        </div>
      )}
      {!loading && error && (
        <div className="error">
          Failed to get your profile. Please try again later. <br /> Details:{" "}
          {error.toString()}
        </div>
      )}
    </div>
  );
}
