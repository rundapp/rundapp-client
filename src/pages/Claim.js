// Installed Libraries
import React, { useEffect, useState } from "react";
import { Button, Message, Progress } from "semantic-ui-react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Claim.css";
import ChallengeCard from "../components/ChallengeCard";
import rundappAxios from "../api/RundappAxios";
import { secsToDate } from "../utils/Utils";

const Claim = () => {
	// State Management
	const { providerInfo, account, chainId } = useSelector(
		(state) => state.providerReducer
	);
	const [verifiedBounties, setVerfiedBounties] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState();
	const runChallengerContract = providerInfo.runChallengerContract;
	const library = providerInfo.library;

	const retrieveUnpayedChallenges = async () => {
		try {
			const response = await rundappAxios.get(
				`/public/challenges/actions/claim?address=${account}`
			);

			if (response.status == 200)
				setVerfiedBounties(response.data.verified_bounties);
		} catch (serverErr) {
			console.log(serverErr);
		}
	};

	const onClaim = async ({ challengeId, hashedMessage, signature }) => {
		setLoading(true);
		setErrorMessage("");
		setSuccessMessage("");

		// Get latest nonce
		const nonce = await library.getTransactionCount(account, "latest");

		// Format arguments
		const bytes32hashedMessage = ethers.utils.hexZeroPad(hashedMessage, 32);

		try {
			// Attempt to claim bounty
			const txResponse = await runChallengerContract.claimBounty(
				challengeId,
				bytes32hashedMessage,
				signature,
				{
					gasLimit: 3000000,
					nonce: nonce,
				}
			);

			// Wait for transaction to successfully complete
			const txReceipt = await txResponse.wait();
			console.log("\ntxResponse: ", txResponse);
			console.log("\ntxReceipt: ", txReceipt);

			if (txReceipt.status == 1) {
				try {
					console.log("\nchallengeId: ", challengeId);
					// send post request to server to update payment complete flag
					const response = await rundappAxios.patch(
						`/public/challenges/${challengeId}`
					);
					console.log("Response Data: ", response.data);
					console.log("Response Status: ", response.status);
					if (response.status == 204)
						console.log("Successful bounty payment");
				} catch (serverErr) {
					console.log(serverErr.message);
					setErrorMessage(serverErr.message);
				}
			}
		} catch (err) {
			console.log(err.message);
			setErrorMessage(err.message);
		}
		setLoading(false);
	};

	// On first render and reloads
	useEffect(() => {
		if (account) retrieveUnpayedChallenges();
	}, []);

	// On account change => probably not be needed if event listener is working properly in Header.js
	useEffect(() => {
		if (account) retrieveUnpayedChallenges();
	}, [account]);

	useEffect(() => {
		if (errorMessage) {
			setProgress(null);
			// setStatusMessage("");
		}
	}, [errorMessage]);

	return (
		<div>
			<h3 style={header}>Claim Bounty</h3>
			{account && chainId == 80001 ? (
				verifiedBounties.length > 0 ? (
					verifiedBounties.map((verifiedBounty) => (
						<ChallengeCard
							key={verifiedBounty.challenge.id}
							challengerAccount={
								verifiedBounty.challenge.challenger_address
							}
							challengeeAccount={
								verifiedBounty.challenge.challengee_address
							}
							challengeId={verifiedBounty.challenge.id}
							bounty={ethers.utils.formatUnits(
								verifiedBounty.challenge.bounty,
								"ether"
							)} //Matic
							issuedAt={verifiedBounty.challenge.created_at}
							complete={verifiedBounty.challenge.complete}
							secsToDate={secsToDate}
							isClaimBounty={true}
							onClaim={async () => {
								onClaim({
									challengeId: verifiedBounty.challenge.id,
									hashedMessage:
										verifiedBounty.hashed_message,
									signature: verifiedBounty.signature,
								});
							}}
							loading={loading}
						/>
					))
				) : (
					<div>
						<span style={{ fontSize: "16px" }}>
							You have no bounties to claim on completed
							challenges. If you want to challenge yourself, you
							can do so here (insert button).
						</span>
					</div>
				)
			) : (
				<div>
					<span style={{ fontSize: "16px" }}>
						Please make sure your wallet is connected and you are on
						Polygon Mainnet (ID: 137)
					</span>
				</div>
			)}
		</div>
	);
};

export default Claim;
//
//
//
//
//
//
//********** Styles **********//
const header = {
	marginTop: 25,
	marginBottom: 25,
};
//****************************//
