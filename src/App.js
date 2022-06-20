import { DAppProvider, Rinkeby, Kovan, Goerli, Mainnet } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Challenge from "./components/Challenge";
import Claim from "./components/Claim";

const App = () => {
	// Configuration object for DAppProvider
	const config = {
		// Specify all the networks that we want to support
		networks: [Mainnet, Rinkeby, Kovan, Goerli],

		// Allow people to interact with the blockchain in read-only
		// mode (no browser wallet).
		readOnlyChainId: Mainnet.chainId,

		// We need to specify a provider for each network.
		// We could use Infura or getDefaultProvider() from the ehters.js library
		readOnlyUrls: {
			[Mainnet.chainId]: getDefaultProvider("mainnet"),
			[Rinkeby.chainId]: process.env.REACT_APP_INFURA_RINKEBY_ENDPOINT,
			[Kovan.chainId]: process.env.REACT_APP_INFURA_KOVAN_ENDPOINT,
			[Goerli.chainId]: process.env.REACT_APP_INFURA_GOERLI_ENDPOINT,
		},
	};

	return (
		<DAppProvider config={config}>
			<div className="App">
				<header className="App-header">
					<Layout>
						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/challenge" element={<Challenge />} />
							<Route path="/claim" element={<Claim />} />
						</Routes>
					</Layout>
				</header>
			</div>
		</DAppProvider>
	);
};

export default App;
