// Installed Libraries
import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

// Local Imports
import Header from "../components/Header";

const Layout = ({ windowWidth, children }) => {
	return (
		<Container>
			<Header windowWidth={windowWidth} />
			{children}
		</Container>
	);
};
export default Layout;
