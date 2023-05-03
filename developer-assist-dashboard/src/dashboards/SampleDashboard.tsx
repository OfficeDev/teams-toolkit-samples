import "../styles/SampleDashboard.css";

import { Image, Spinner } from "@fluentui/react-components";
import { BaseDashboard } from "@microsoft/teamsfx-react";

import { loginAction } from "../internal/login";
import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { DevOps } from "../widgets/DevOps";
import { GithubIssues } from "../widgets/GitHubIssues";
import { PlannerTask } from "../widgets/PlannerTask";

const scope = ["Tasks.ReadWrite", "Group.ReadWrite.All", "User.Read.All"];

export default class SampleDashboard extends BaseDashboard<any, any> {
  override layout(): JSX.Element | undefined {
    return (
      <>
        {this.state.showLogin === false ? (
          <>
            <Image className="img-style" src="bg.png" />
            <div className="one-column">
              <DevOps />
              <GithubIssues />
            </div>
            <PlannerTask />
          </>
        ) : (
          <div className="spinner-layout">
            <Spinner size="huge" />
          </div>
        )}
      </>
    );
  }

  async componentDidMount() {
    super.componentDidMount();
    if (await this.checkIsConsentNeeded()) {
      await loginAction(scope);
    }
    this.setState({ showLogin: false });
  }

  override styling(): string {
    return this.state.isMobile === true ? "dashboard-mobile" : "dashboard";
  }

  /**
   * Checks if user consent is needed for the specified scopes.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether user consent is needed.
   */
  async checkIsConsentNeeded(): Promise<boolean> {
    let needConsent = false;
    try {
      // Try to get a token for the specified scopes using the TeamsUserCredentialContext singleton instance.
      await TeamsUserCredentialContext.getInstance().getCredential().getToken(scope);
    } catch (error) {
      // If an error occurs, it means that user consent is needed.
      needConsent = true;
    }
    return needConsent;
  }
}
