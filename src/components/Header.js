// Installed Libraries
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { Menu, Button, Icon, Dropdown } from "semantic-ui-react";
import Web3Modal from "web3modal";

// Local Imports
import { providerOptions } from "../web3/ProviderOptions";
import { toHex, truncateAddress } from "../web3/Utils";
import { networkOptions } from "../web3/NetworkOptions";
import logo from "../assets/runner-app-logo.png";
import "./Styles/Header.css";

// Web3Modal Instantiation
const web3Modal = new Web3Modal({
	cacheProvider: true,
	providerOptions,
	theme: "dark",
});

// Header Function Component
const Header = () => {
	// State Management
	const [provider, setProvider] = useState();
	const [library, setLibrary] = useState();
	const [account, setAccount] = useState();
	const [network, setNetwork] = useState();
	const [chainId, setChainId] = useState();
	const [switchToNetwork, setSwitchToNetwork] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	const connectWallet = async () => {
		setIsLoading(true);
		try {
			const provider = await web3Modal.connect();
			const library = new ethers.providers.Web3Provider(provider);
			const accounts = await library.listAccounts();
			const network = await library.getNetwork();

			// Store provider and library in state to reuse throughout app
			setProvider(provider);
			setLibrary(library);

			// Store user's accounts and current network
			if (accounts) setAccount(accounts[0]);
			setChainId(network.chainId);
			// accounts ?? setAccount(accounts[0]);
			// setChainId(network.chainId);
		} catch (err) {
			setError(err);
			console.log("\n", err);
		}
		setIsLoading(false);
	};

	// If user is not on the network we support, request to change it
	const switchNetwork = async () => {
		try {
			await library.provider.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: toHex(80001) }], // Polygon Mumbai Testnet
			});
		} catch (switchError) {
			// Code 4902 means the network has not been added to user's Metamask,
			// so we can request to add it to their wallet
			if (switchError.code === 4902) {
				try {
					await library.provider.request({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: toHex(80001), // Polygon Mumbai Testnet
								chainName: "Polygon",
								rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
								blockExplorerUrls: ["https://polygonscan.com/"],
							},
						],
					});
				} catch (err) {
					setError(err);
					console.log("\n", err);
				}
			}
		}
	};

	const refreshState = () => {
		setAccount();
		setChainId();
		setNetwork("");
	};

	// We cannot disconnect the user because he must do it himself,
	// but we can mimic disconnecting by clearingthe state and cache
	const disconnect = async () => {
		await web3Modal.clearCachedProvider();
		refreshState();
	};

	// Automatically connect to cached provider, which is important
	// in case the user refreshes the page
	useEffect(() => {
		if (web3Modal.cachedProvider) {
			connectWallet();
		}
	}, []);

	// Listen to and handle changes in account or network data
	useEffect(() => {
		// The ?. is the optional chaining operator
		if (provider?.on) {
			const handleAccountChanged = (accounts) => {
				if (accounts) setAccount(accounts[0]);
			};
			const handleChainChanged = (chainId) => {
				setChainId(chainId);
			};
			const handleDisconnect = () => {
				disconnect();
			};
			provider.on("accountChanged", handleAccountChanged);
			provider.on("chainChanged", handleChainChanged);
			provider.on("disconnect", handleDisconnect);

			return () => {
				if (provider.removeListener) {
					provider.removeListener(
						"accountsChanged",
						handleAccountChanged
					);
					provider.removeListener("chainChanged", handleChainChanged);
					provider.removeListener("disconnect", handleDisconnect);
				}
			};
		}
	}, [provider]);

	return (
		<Menu style={menu}>
			<Link to="/" className="item" style={link}>
				<img alt="logo" src={logo} />
			</Link>

			<Link to="/challenge" className="item" style={link}>
				Challenge
			</Link>

			<Link to="/claim" className="item" style={link}>
				Claim Bounty
			</Link>
			<Menu.Menu position="right">
				{!account ? (
					<div style={connectionDiv}>
						<Button
							onClick={connectWallet}
							loading={isLoading}
							inverted
						>
							Connect Wallet
						</Button>
						<Icon
							color="red"
							name="dot circle"
							style={connectionIcon}
						/>
					</div>
				) : (
					<div style={connectionDiv}>
						<Dropdown
							text="Switch Network"
							value={switchToNetwork}
							onChange={(e, { value }) => {
								setSwitchToNetwork(value);
								console.log("value", value);
							}}
							floating
							button
							className="link item"
							style={{
								backgroundColor: "transparent",
								color: "white",
								fontWeight: "bold",
							}}
						>
							<Dropdown.Menu>
								{networkOptions.map((option) => (
									<Dropdown.Item
										key={option.value}
										{...option}
									/>
								))}
							</Dropdown.Menu>
						</Dropdown>
						<p style={accountHex}>{truncateAddress(account)}</p>
						<Button
							onClick={disconnect}
							loading={isLoading}
							inverted
						>
							Disconnect
						</Button>
						<Icon
							color="green"
							name="dot circle"
							style={connectionIcon}
						/>
						{switchToNetwork ?? <p>{switchToNetwork}</p>}
					</div>
				)}
			</Menu.Menu>
		</Menu>
	);
};
export default Header;
//
//
//
//
//
//
//********** Styles **********//

const link = {
	color: "white",
	fontWeight: "bold",
};

const menu = {
	marginTop: 10,
	height: 15,
	border: 0,
	boxShadow: "none",
	backgroundColor: "transparent",
};

const connectionDiv = {
	display: "flex",
};

const accountHex = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	marginRight: 11,
};

const connectionIcon = {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100%",
	marginLeft: 5,
};
