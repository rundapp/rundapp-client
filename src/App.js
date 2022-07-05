// Styles
import "./App.css";

// Installed Libraries
import { Routes, Route } from "react-router-dom";

// Components
import Layout from "./components/Layout";
import Home from "./components/Home";
import Challenge from "./components/Challenge";
import Claim from "./components/Claim";

const App = () => {
	return (
		<div>
			<header className="App-header">
				<Layout>
					<div className="App-container ">
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/challenge" element={<Challenge />} />
							<Route path="/claim" element={<Claim />} />
						</Routes>
					</div>
				</Layout>
			</header>
		</div>
	);
};

export default App;
