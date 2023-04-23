import "../styles/MyDashboard.css";

import { Image, Spinner } from "@fluentui/react-components";
import { BaseDashboard } from "@microsoft/teamsfx-react";

import { loginAction } from "../internal/login";
import { TeamsUserCredentialContext } from "../internal/singletonContext";
import { Calendar } from "../widgets/Calendar";
import { Chart } from "../widgets/Chart";
import { Collaboration } from "../widgets/Collaboration";
import { Documents } from "../widgets/Document";
import { Task } from "../widgets/Task";

const scope = ["Files.Read", "Tasks.ReadWrite", "Calendars.Read", "User.Read"];

export default class MyDashboard extends BaseDashboard<any, any> {
  override layout(): JSX.Element | undefined {
    return (
      <>
        {this.state.showLogin === false ? (
          <>
            <Image className="img-style" src="bg.png" />
            <Chart />
            <div className="one-column">
              <Calendar />
              <Task />
            </div>
            <Collaboration />
            <Documents />
          </>
        ) : (
          <div className="spinner-layout">
            <Spinner size="huge" />
          </div>
        )}
      </>
    );
  }

  override styling(): string {
    return this.state.isMobile === true ? "dashboard-mobile" : "dashboard";
  }

  async componentDidMount() {
    super.componentDidMount();
    if (await this.checkIsConsentNeeded()) {
      await loginAction(scope);
    }
    this.setState({ showLogin: false });
  }

  async checkIsConsentNeeded() {
    let needConsent = false;
    try {
      await TeamsUserCredentialContext.getInstance().getCredential().getToken(scope);
    } catch (error) {
      needConsent = true;
    }
    return needConsent;
  }
}
