// Installed Libraries
import { Routes, Route } from "react-router-dom";

// Local Imports
import "./styles/App.css";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Challenge from "./pages/Challenge";
import Claim from "./pages/Claim";

const App = () => {
	return (
		<div className="App-container">
			<header className="App-header">
				<Layout>
					<div className="App-body ">
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
