// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import * as React from 'react';
import { Text } from "@fluentui/react-northstar";
import { EyeIcon } from "@fluentui/react-icons-northstar";
import { useTranslation } from 'react-i18next';

import "../../styles/no-post-added-page.css";

// eslint-disable-next-line @typescript-eslint/ban-types
const FilterNoPostContentPage: React.FunctionComponent<{}> = () => {
  const localize = useTranslation().t;

  return (
    <div className="no-post-added-container">
      <div className="app-logo">
        <EyeIcon size="largest" />
      </div>
      <div className="no-data-preview">
        <Text content={localize("noDataPreviewNote")} />
      </div>
    </div>
  )
}

export default React.memo(FilterNoPostContentPage);