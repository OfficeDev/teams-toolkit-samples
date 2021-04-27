// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
/**
 * More information about Fluent UI: https://fluentsite.z22.web.core.windows.net/quick-start
 */
import { Provider, themes } from '@fluentui/react-northstar'

ReactDOM.render(
    <Provider theme={themes.teams}>
        <App />
    </Provider>, document.getElementById('root')
);
