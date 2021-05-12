// <copyright file="index.tsx" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./app";


ReactDOM.render(
	<Router>
		<App />
	</Router>, document.getElementById("root"));