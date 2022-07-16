import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";

// Web3Modal Provider Setup
// We currently support Metamask (injected), WalletConnect, and CoinbaseWallet
//https://github.com/web3modal/web3modal
export const providerOptions = {
	injected: {
		display: {
			description: " ",
		},
	},
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			rpc: {
				80001: process.env.REACT_APP_POLYGON_MUMBAI_NODE, // Moralis Polygon Mumbai Full Node
			},
		},
		display: {
			description: " ",
		},
	},
	coinbasewallet: {
		package: CoinbaseWalletSDK,
		options: {
			appName: "Rundapp",
			rpc: {
				80001: process.env.REACT_APP_POLYGON_MUMBAI_NODE, // Moralis Polygon Mumbai Full Node
			},
			darkMode: true,
		},
		display: {
			description: " ",
		},
	},
};
