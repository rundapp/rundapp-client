// Installed Libraries
import React from "react";
import "semantic-ui-css/semantic.min.css";
import { Container } from "semantic-ui-react";

// Local Imports
import Header from "../components/Header";

const Layout = (props) => {
	return (
		<Container>
			<Header />
			{props.children}
		</Container>
	);
};
export default Layout;
