// <copyright file="signin-start.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import React, { useEffect } from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { getAuthenticationConsentMetadata } from '../../api/authentication-metadata-api';

const SignInSimpleStart: React.FunctionComponent = () => {
    useEffect(() => {
        microsoftTeams.initialize();
        microsoftTeams.getContext((context: microsoftTeams.Context) => {
            const windowLocationOriginDomain = window.location.origin.replace("https://", "");
            const login_hint = context.upn ? context.upn : "";

            getAuthenticationConsentMetadata(windowLocationOriginDomain, login_hint).then((result: any) => {
                window.location.assign(result.data);
            });
        });
    });

    return (
        <></>
    );
};

export default SignInSimpleStart;