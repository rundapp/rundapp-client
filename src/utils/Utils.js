import validator from "validator";

export const validateEmail = (
	event,
	setChallengerEmail,
	setChallengeeEmail,
	setIsChallengerEmailValid,
	setIsChallengeeEmailValid,
	{ person }
) => {
	const email = event.target.value;
	if (validator.isEmail(email)) {
		if (person == "challenger") {
			setChallengerEmail(email);
			setIsChallengerEmailValid(true);
		} else if (person == "challengee") {
			setChallengeeEmail(email);
			setIsChallengeeEmailValid(true);
		}
	} else {
		if (person == "challenger") {
			setChallengerEmail(email);
			setIsChallengerEmailValid(false);
		} else if (person == "challengee") {
			setChallengeeEmail(email);
			setIsChallengeeEmailValid(false);
		}
	}
};

export const validateAccount = (
	event,
	setChallengeeAccount,
	setIsAccountValid
) => {
	const account = event.target.value;
	if (validator.isEthereumAddress(account)) {
		setChallengeeAccount(account);
		setIsAccountValid(true);
	} else {
		setChallengeeAccount(account);
		setIsAccountValid(false);
	}
};

export const validateDistance = (event, setDistance, setIsDistanceValid) => {
	const distance = event.target.value;
	if (distance >= 0.25) {
		setDistance(distance);
		setIsDistanceValid(true);
	} else {
		setDistance(distance);
		setIsDistanceValid(false);
	}
};

export const validateSpeed = (event, setSpeed, setIsSpeedValid) => {
	const speed = event.target.value;
	if (speed >= 3.5 && speed <= 30) {
		setSpeed(speed);
		setIsSpeedValid(true);
	} else {
		setSpeed(speed);
		setIsSpeedValid(false);
	}
};

export const validateAmount = (event, setAmount, setIsAmountValid) => {
	const amount = event.target.value;
	if (amount >= 4) {
		setAmount(amount);
		setIsAmountValid(true);
	} else {
		setAmount(amount);
		setIsAmountValid(false);
	}
};

export const secsToDate = (time) => {
	const date = new Date(time).toLocaleString("en-US", {
		dateStyle: "medium",
	});
	return date;
};

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
