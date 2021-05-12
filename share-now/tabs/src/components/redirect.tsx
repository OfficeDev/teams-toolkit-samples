// <copyright file="redirect.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import { Loader } from "@fluentui/react-northstar";

class Redirect extends React.Component<{}, {}> {

    constructor(props: any) {
        super(props);

        const lastSlash = window.location.href.lastIndexOf("/");
        window.location.href = window.location.href.substring(lastSlash);
    }

    /**
    * Renders the component
    */
    public render(): JSX.Element {
        return (
            <div className="container-div">
                <div className="container-subdiv">
                    <Loader />
                </div>
            </div>
        );
    }
}

export default Redirect;