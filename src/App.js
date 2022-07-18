// Installed Libraries
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Local Imports
import "./styles/App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import Claim from "./pages/Claim";

const App = () => {
	// State Management
	const [windowWidth, setWindowWidth] = useState(0);

	// Update screen dimensions to change layout based on screen size
	const updateDimensions = () => {
		const width = window.innerWidth;
		setWindowWidth(width);
	};

	// Listen to and update screen dimensions
	useEffect(() => {
		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, []);

	return (
		<div className="App-container">
			<header className="App-header">
				<Layout windowWidth={windowWidth}>
					<div className="App-body ">
						<Routes>
							<Route
								path="/"
								element={<Home windowWidth={windowWidth} />}
							/>
							<Route
								path="/challenge"
								element={
									<Challenge windowWidth={windowWidth} />
								}
							/>
							<Route
								path="/claim"
								element={<Claim windowWidth={windowWidth} />}
							/>
						</Routes>
					</div>
				</Layout>
			</header>
		</div>
	);
};

export default App;
