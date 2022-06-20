import React from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { useEthers } from "@usedapp/core";

const Claim = () => {
	// Destructure properties out of useEthers
	const { activateBrowserWallet, account, deactivate } = useEthers();

	return (
		<div>
			<h3>Claim a Prize</h3>
			{account ? (
				<div>
					<p>Your connected account address: {account}</p>
					<Button
						onClick={() => deactivate()}
						secondary={true}
						style={{ backgroundColor: "#5c0e08" }}
					>
						Disconnect your wallet.
					</Button>
				</div>
			) : (
				<Button
					onClick={() => activateBrowserWallet()}
					secondary={true}
				>
					Connect your wallet.
				</Button>
			)}
		</div>
	);
};

export default Claim;
