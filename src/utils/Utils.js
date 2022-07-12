export const truncateAddress = (address) => {
	if (!address) return "No Account";
	const match = address.match(
		/^(0x[a-zA-Z0-9]{3})[a-zA-Z0-9]+([a-zA-Z0-9]{5})$/
	);
	if (!match) return address;
	return `${match[1]}…${match[2]}`;
};

export const toHex = (num) => {
	const val = Number(num);
	return "0x" + val.toString(16);
};

export const secsToDate = (time) => {
	const date = new Date(time).toLocaleString("en-US", {
		dateStyle: "medium",
	});
	return date;
};

export const switchToSupportedNetwork = async (
	tempLibrary,
	dispatch,
	providerError
) => {
	try {
		await tempLibrary.provider.request({
			method: "wallet_switchEthereumChain",
			params: [{ chainId: toHex(80001) }], // Polygon Mumbai Testnet (only supported network at present)
		});
	} catch (switchError) {
		// Code 4902 means the network has not been added to user's Metamask,
		// so we can request to add it to their wallet
		if (switchError.code === 4902) {
			try {
				await tempLibrary.provider.request({
					method: "wallet_addEthereumChain",
					params: [
						{
							chainId: toHex(80001), // Polygon Mumbai Testnet (only supported network at present)
							chainName: "Polygon",
							rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
							blockExplorerUrls: ["https://polygonscan.com/"],
						},
					],
				});
			} catch (err) {
				// setError(err);
				dispatch(providerError(err));
				console.log("\n", err);
			}
		} else {
			// setError(switchError);
			dispatch(providerError(switchError));
			console.log(switchError);
		}
	}
};
