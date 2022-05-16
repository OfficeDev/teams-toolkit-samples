import { Button, Image, Loader } from "@fluentui/react-northstar";
import "./Welcome.css";
import { Introduce } from "./Introduce";
import { Ingest } from "./Ingest";
import { useTeamsFx } from "./lib/useTeamsFx";
import { TeamsFx } from "@microsoft/teamsfx";
import { useData } from "./lib/useData";
import { Query } from "./Query";
import { useLogin } from "./lib/useLogin";
import { Scopes } from "./lib/constants";

export function Welcome() {
  let { needLogin, loading, reload } = useLogin(Scopes);
  const { isInTeams } = useTeamsFx();
  const userProfile = useData(async () => {
    const teamsfx = new TeamsFx();
    return isInTeams ? await teamsfx.getUserInfo() : undefined;
  })?.data;
  const userName = userProfile ? userProfile.displayName : "";

  async function login() {
    try {
      const teamsfx = new TeamsFx();
      await teamsfx.login(Scopes);
      reload();
    } catch (err: any) {
      if (err.message?.includes("CancelledByUser")) {
        const helpLink = "https://aka.ms/teamsfx-auth-code-flow";
        err.message +=
          "\nIf you see \"AADSTS50011: The reply URL specified in the request does not match the reply URLs configured for the application\" " +
          "in the popup window, you may be using unmatched version for TeamsFx SDK (version >= 0.5.0) and Teams Toolkit (version < 3.3.0) or " +
          `cli (version < 0.11.0). Please refer to the help link for how to fix the issue: ${helpLink}`;
      }

      alert("Login failed: " + err);
    }
  }

  return (
    <div>
      {loading && (
        <div>
          <Loader style={{ margin: 100 }} />
        </div>
      )}
      {!loading && needLogin === false && (
        <div className="welcome page">
          <div className="narrow page-padding">
            <Image src="hello.png" />
            <h1 className="center">Hello{userName ? ", " + userName : ""}!</h1>
            <p className="center">Let's build your first custom Microsoft Graph connector.</p>
            <div className="sections">
              <Introduce />
              <Ingest />
              <Query />
            </div>
          </div>
        </div>
      )}
      {!loading && needLogin && <div className="auth">
        <h2>Welcome to Graph Connector App!</h2>
        <Button primary onClick={() => login()}>Start</Button>
      </div>}
    </div>
  );
}
