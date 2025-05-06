import { useContext } from "react";
import { Button, Image, Spinner } from "@fluentui/react-components";
import "./Welcome.css";
import { Introduce } from "./Introduce";
import { Ingest } from "./Ingest";
import { useGraphWithCredential } from "@microsoft/teamsfx-react";
import { Query } from "./Query";
import { Scopes } from "./lib/constants";
import { TeamsFxContext } from "../Context";

export function Welcome() {
  const { teamsUserCredential } = useContext(TeamsFxContext);
  const { loading, error, data, reload } = useGraphWithCredential(
    async (graph, teamsUserCredential, scope) => {
      // Call graph api directly to get user profile information
      const profile = await graph.api("/me").get();
      return { profile };
    },
    { scope: Scopes, credential: teamsUserCredential }
  );

  return (
    <>
      {loading && (
        <div>
          <Spinner style={{ margin: 100 }} />
        </div>
      )}
      {!loading && data && (
        <div className="welcome page">
          <div className="narrow page-padding">
            <Image src="hello.png" />
            <h1 className="center">Hello, {data.profile.displayName}!</h1>
            <p className="center">
              Let's build your first custom Microsoft Copilot connector.
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
          <h2>Welcome to Copilot connector App!</h2>
          <Button appearance="primary" disabled={loading} onClick={reload}>
            Start
          </Button>
        </div>
      )}
      {!loading && error && (
        <div className="error">
          Failed to get your profile. Please try again later. <br /> Details:{" "}
          {error.toString()}
        </div>
      )}
    </>
  );
}
