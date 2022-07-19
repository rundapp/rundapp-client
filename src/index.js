// Installed Libraries
import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { Provider } from "react-redux";

// Local Imports
import App from "./App";
import { store } from "./redux/store";

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(
	<Provider store={store}>
		<HashRouter>
			<App />
		</HashRouter>
	</Provider>
);
