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
				4: "https://speedy-nodes-nyc.moralis.io/cc23f13275cfc7ea924d4930/eth/rinkeby", //// Moralis Ethereum Rinkeby Full Node
				69: "https://kovan.optimism.io/", // Optimism Kovan (obtained from chainlist.org)
				80001: "https://speedy-nodes-nyc.moralis.io/cc23f13275cfc7ea924d4930/polygon/mumbai", // Moralis Polygon Mumbai Full Node
			},
		},
		display: {
			description: " ",
		},
	},
	coinbasewallet: {
		package: CoinbaseWalletSDK,
		options: {
			appName: "blockrunner.quest",
			rpc: {
				4: "https://speedy-nodes-nyc.moralis.io/cc23f13275cfc7ea924d4930/eth/rinkeby", //// Moralis Ethereum Rinkeby Full Node
				69: "https://kovan.optimism.io/", // Optimism Kovan (obtained from chainlist.org)
				80001: "https://speedy-nodes-nyc.moralis.io/cc23f13275cfc7ea924d4930/polygon/mumbai", // Moralis Polygon Mumbai Full Node
			},
			darkMode: true,
		},
		display: {
			description: " ",
		},
	},
};
