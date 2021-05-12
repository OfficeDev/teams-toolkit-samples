// <copyright file="no-private-posts.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from 'react';
import { Text } from "@fluentui/react-northstar";
import { EyeIcon } from "@fluentui/react-icons-northstar";
import { useTranslation } from 'react-i18next';

import "../../styles/no-post-added-page.css";

const NoPrivatePosts: React.FunctionComponent<{}> = props => {
    const localize = useTranslation().t;

    return (
        <div className="no-post-added-container">
            <div className="app-logo">
                <EyeIcon size="largest" />
            </div>
            <div className="no-data-preview">
                <Text content={localize("noDataPreviewNotePrivateList")} /><br />
                <Text content={localize("letsGetStartedMessage")} />
            </div>
        </div>
    )
}

export default React.memo(NoPrivatePosts);