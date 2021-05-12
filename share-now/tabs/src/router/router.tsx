// <copyright file="router.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Suspense } from "react";
import { BrowserRouter, Route, Switch, Redirect as RedirctOrigin } from "react-router-dom";
import DiscoverWrapperPage from "../components/card-view/discover-wrapper-page";
import DiscoverTeamWrapperPage from "../components/card-view/discover-teams-wrapper-page";
import TeamsConfigPage from "../components/teams-config-page"
import SignInPage from "../components/signin/signin";
import SignInSimpleStart from "../components/signin/signin-start";
import SignInSimpleEnd from "../components/signin/signin-end";
import PrivateListWrapperPage from "../components/user-private-list/private-list";
import configurepreference from "../components/configure-preference-dialog/configure-preference";
import "../i18n";
import Redirect from "../components/redirect";
import ErrorPage from "../components/error-page";

export const AppRoute: React.FunctionComponent<{}> = () => {

    return (
        <Suspense fallback={<div className="container-div"><div className="container-subdiv"></div></div>}>
            <BrowserRouter>
                <Route exact path="/">
                    <RedirctOrigin to="/tab" />
                </Route>
                <Switch>
                    <Route exact path="/" component={DiscoverWrapperPage} />
                    <Route exact path="/tab" component={DiscoverWrapperPage} />
                    <Route exact path="/discover" component={DiscoverWrapperPage} />
                    <Route exact path="/discover-team" component={DiscoverTeamWrapperPage} />
                    <Route exact path="/configtab" component={TeamsConfigPage} />
                    <Route exact path="/signin" component={SignInPage} />
                    <Route exact path="/signin-simple-start" component={SignInSimpleStart} />
                    <Route exact path="/signin-simple-end" component={SignInSimpleEnd} />
                    <Route exact path="/user-private-list" component={PrivateListWrapperPage} />
                    <Route exact path="/configurepreferences" component={configurepreference} />
                    <Route exact path="/errorpage" component={ErrorPage} />
                    <Route component={Redirect} />
                </Switch>
            </BrowserRouter>
        </Suspense>
    );
}