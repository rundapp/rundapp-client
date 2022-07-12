// Installed Libraries
import { useState, useEffect } from "react";
import { Menu, Button, Icon, Popup } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useSelector, useDispatch } from "react-redux";
import Web3Modal from "web3modal";

// Local Imports
import "../styles/Header.css";
import { providerOptions } from "../utils/ProviderOptions";
import {
	getProviderInfo,
	getAccount,
	getChainId,
	clearAccount,
	clearChainId,
	providerError,
	clearProviderError,
} from "../redux/actions/ProviderActions";
import {
	toHex,
	truncateAddress,
	switchToSupportedNetwork,
} from "../utils/Utils";
import RunChallenger from "../utils/RunChallenger.json";
import logo from "../assets/runner-app-logo.png";

// Web3Modal Instantiation
const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
	theme: "dark",
});

// Header Function Component
const Header = () => {
	// State Management
	const { providerInfo, account, chainId, errorMessage } = useSelector(
		(state) => state.providerReducer
	);
	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	// Request that user connects wallet through Web3modal
	const connectWallet = async () => {
		setIsLoading(true);
		try {
			const provider = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			const accounts = await library.listAccounts();
			const network = await library.getNetwork();
			const signer = library.getSigner();

			const runChallengerContract = new ethers.Contract(
				process.env.REACT_APP_POLYGON_MUMBAI_CONTRACT_ADDRESS,
				RunChallenger.abi,
				signer
			);

			dispatch(
				getProviderInfo({
					provider: provider,
					library: library,
					signer: signer,
					runChallengerContract: runChallengerContract,
				})
			);

			if (accounts) {
				dispatch(getAccount(accounts[0]));
				if (network.chainId != toHex(80001)) {
					switchToSupportedNetwork(library, dispatch, providerError);
					dispatch(getChainId(network.chainId));
				} else {
					dispatch(getChainId(network.chainId));
				}
			}
		} catch (err) {
			dispatch(providerError(err));
			console.log("\n", err);
		}
		setIsLoading(false);
	};

	// We cannot disconnect the user, but we can mimic disconnecting by clearingthe state and cache
	const disconnect = () => {
		web3Modal.clearCachedProvider();
		dispatch(clearAccount());
		dispatch(clearChainId());
	};

	// Automatically connect to cached provider, so the user does not have to click "Connect Wallet"
	// again after refreshing the page
	useEffect(() => {
		if (web3Modal.cachedProvider) {
			connectWallet();
		}
	}, []);

	// Listen to and handle changes in account or network data
	useEffect(() => {
		// The ?. is the optional chaining operator
		if (providerInfo.provider?.on) {
			const handleAccountChanged = (accounts) => {
				if (accounts) dispatch(getAccount(accounts[0]));
			};
			const handleChainChanged = (chainId) => {
				dispatch(getChainId(chainId));
			};
			const handleDisconnect = () => {
				disconnect();
			};
			providerInfo.provider.on("accountChanged", handleAccountChanged);
			providerInfo.provider.on("chainChanged", handleChainChanged);
			providerInfo.provider.on("disconnect", handleDisconnect);

			return () => {
				if (providerInfo.provider.removeListener) {
					providerInfo.provider.removeListener(
						"accountsChanged",
						handleAccountChanged
					);
					providerInfo.provider.removeListener(
						"chainChanged",
						handleChainChanged
					);
					providerInfo.provider.removeListener(
						"disconnect",
						handleDisconnect
					);
				}
			};
		}
	}, [providerInfo.provider]);

	return (
		<Menu className="Header-menu">
			<Link to="/" className="item">
				<img alt="logo" src={logo} />
			</Link>

			<Link to="/challenge" className="Header-link item">
				Challenge
			</Link>

			<Link to="/claim" className="Header-link item">
				Claim Bounty
			</Link>
			<Menu.Menu position="right">
				{!account ? (
					<div className="Header-connection-div">
						<Button
							onClick={connectWallet}
							loading={isLoading}
							inverted
						>
							Connect Wallet
						</Button>
						<Icon
							className="Header-connection-icon"
							color="red"
							name="dot circle"
						/>
					</div>
				) : (
					<div className="Header-connection-div">
						{chainId != toHex(80001) ? (
							<Popup
								content="At present, the only network we support is Polygon Mumbai (ID=80001). Please switch to this network in your wallet."
								trigger={
									<p className="Header-unsupported-network">
										NETWORK NOT SUPPORTED
									</p>
								}
								position="bottom center"
								inverted
							/>
						) : null}
						<p className="Header-account-hex">
							{truncateAddress(account)}
						</p>
						<Button
							onClick={disconnect}
							loading={isLoading}
							inverted
						>
							Disconnect
						</Button>
						<Icon
							className="Header-connection-icon"
							color="green"
							name="dot circle"
						/>
					</div>
				)}
			</Menu.Menu>
		</Menu>
	);
};
export default Header;
