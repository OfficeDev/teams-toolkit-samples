// <copyright file="router.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Suspense } from "react";
import { HashRouter as Router, Route, Switch, Redirect as RedirctOrigin } from "react-router-dom";
import DiscoverWrapperPage from "../components/card-view/discover-wrapper-page";
import SignInPage from "../components/signin/signin";
import SignInSimpleStart from "../components/signin/signin-start";
import SignInSimpleEnd from "../components/signin/signin-end";
import "../i18n";
import Redirect from "../components/redirect";
import ErrorPage from "../components/error-page";

export const AppRoute: React.FunctionComponent<{}> = () => {
    return (
        <Suspense fallback={<div className="container-div"><div className="container-subdiv"></div></div>}>
            <Router>
                <Route exact path="/" component={DiscoverWrapperPage} />
                <Route exact path="/tab" component={DiscoverWrapperPage} />
                <Route exact path="/discover" component={DiscoverWrapperPage} />
                <Route exact path="/errorpage" component={ErrorPage} />
            </Router>
        </Suspense>
    );
}