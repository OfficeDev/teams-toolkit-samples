import "../styles/SampleDashboard.css";

import { CSSProperties } from "react";

import { Image, Spinner } from "@fluentui/react-components";

import { loginAction } from "../../internal/login";
import { TeamsUserCredentialContext } from "../../internal/singletonContext";
import { Dashboard } from "../lib/Dashboard";
import { DevOps } from "../widgets/DevOpsWidget";
import { GithubIssues } from "../widgets/GitHubWidget";
import { PlannerTask } from "../widgets/PlannerTask";
import { oneColumn } from "../lib/Dashboard.styles";

const scope = [
    "Tasks.ReadWrite",
    "Group.ReadWrite.All",
    "ExternalItem.Read.All",
    "Files.Read.All",
    "Sites.Read.All",
    "Files.ReadWrite.All",
    "Sites.ReadWrite.All",
    "User.Read.All",
];

export default class SampleDashboard extends Dashboard {
    protected rowHeights(): string | undefined {
        return "320px 400px";
    }

    protected columnWidths(): string | undefined {
        return "11fr 5fr";
    }

    protected dashboardLayout(): undefined | JSX.Element {
        return (
            <>
                {this.state.showLogin === false ? (
                    <>
                        <Image className="img-style" src="bg.png" />
                        <div className={oneColumn()}>
                            <DevOps />
                            <GithubIssues />
                        </div>
                        <div className={oneColumn()}>
                            <PlannerTask />
                        </div>
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
