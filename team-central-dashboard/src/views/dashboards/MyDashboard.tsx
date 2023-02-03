import "../styles/MyDashboard.css";

import { CSSProperties } from "react";

import { Image, Spinner } from "@fluentui/react-components";

import { loginAction } from "../../internal/login";
import { TeamsUserCredentialContext } from "../../internal/singletonContext";
import { Dashboard } from "../lib/Dashboard";
import { oneColumn } from "../lib/Dashboard.styles";
import { Calendar } from "../widgets/Calendar";
import { Chart } from "../widgets/Chart";
import { Collaboration } from "../widgets/Collaboration";
import { Documents } from "../widgets/Document";
import { Task } from "../widgets/Task";

const scope = ["Files.Read", "Tasks.ReadWrite", "Calendars.Read"];

export default class MyDashboard extends Dashboard {
  protected dashboardLayout(): JSX.Element | undefined {
    return (
      <>
        {this.state.showLogin === false ? (
          <>
            <Image className="img-style" src="bg.png" />
            <Chart />
            <div style={oneColumn()}>
              <Calendar />
              <Task />
            </div>
            <Collaboration />
            <Documents />
          </>
        ) : (
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Spinner size="huge" />
          </div>
        )}
      </>
    );
  }

  protected columnWidths(): string | undefined {
    return "7fr 3fr";
  }

  async componentDidMount() {
    super.componentDidMount();
    if (await this.checkIsConsentNeeded()) {
      await loginAction(scope);
    }
    this.setState({ showLogin: false });
  }

  protected customiseDashboardStyle(): CSSProperties | undefined {
    return this.state.showLogin === false
      ? {
          marginTop: "5%",
        }
      : {
          padding: 0,
          marginTop: 0,
        };
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
