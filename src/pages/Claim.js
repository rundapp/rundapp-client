// Installed Libraries
import React, { useEffect, useState } from "react";
import { Button, Message, Progress } from "semantic-ui-react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Claim.css";
import ChallengeCard from "../components/ChallengeCard";
import rundappAxios from "../api/RundappAxios";
import { secsToDate } from "../utils/Utils";

const Claim = ({ windowWidth }) => {
	// State Management
	const { providerInfo, account, chainId } = useSelector(
		(state) => state.providerReducer
	);
	const [verifiedBounties, setVerfiedBounties] = useState([]);
	const [errorMessage, setErrorMessage] = useState("");
	const [statusMessage, setStatusMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState();
	const runChallengerContract = providerInfo.runChallengerContract;
	const library = providerInfo.library;

	const retrieveUnpayedChallenges = async () => {
		try {
			const response = await rundappAxios.get(
				`/public/challenges/actions/claim?address=${account}`
			);
			if (response.status == 200) {
				setVerfiedBounties(response.data.verified_bounties);
			}
		} catch (serverErr) {
			if (
				(serverErr.response.status =
					404 || serverErr.message.includes("Network Error"))
			) {
				// Do nothing
			} else {
				setErrorMessage(serverErr.message);
			}
		}
	};

	const onClaim = async ({ challengeId, hashedMessage, signature }) => {
		setLoading(true);
		setErrorMessage("");
		setStatusMessage("");

		// Start progress bar
		setProgress(10);

		// Get latest nonce
		const nonce = await library.getTransactionCount(account, "latest");

		setProgress(30);

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

			setProgress(50);
			setStatusMessage(
				"Doing magic blockchain stuff. This may take a minute."
			);

			// Wait for transaction to successfully complete
			const txReceipt = await txResponse.wait();
			setProgress(80);

			if (txReceipt.status == 1) {
				try {
					// Send post request to server to update payment complete flag
					const response = await rundappAxios.patch(
						`/public/challenges/${challengeId}`
					);
					if (response.status == 204) setProgress(100);
					setStatusMessage(
						"You have successfully claimed the bounty of a challenge you completed."
					);
				} catch (serverErr) {
					setProgress(null);
					setErrorMessage(serverErr.message);
				}
			}
		} catch (err) {
			setProgress(null);
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
			setStatusMessage("");
		}
	}, [errorMessage]);

	return (
		<div className="Claim-main-container">
			<h1 className="Claim-header ">RunDapp</h1>
			{statusMessage ? (
				<Message className={"Claim-status-message"} success>
					<Message.Header>
						{progress == 100 ? "Success" : null}
					</Message.Header>
					<Message.Content>
						{statusMessage.includes("You have successfully") ? (
							<p>
								{statusMessage} Check your wallet or {"  "}
								<a
									style={{ color: "#74bbed" }}
									href={`https://polygonscan.com/address/${account}#internaltx`}
									target="_blank"
									rel="noopener noreferrer"
								>
									PolygonScan
								</a>
								{"  "} to verify.
							</p>
						) : (
							<p>{statusMessage}</p>
						)}
					</Message.Content>
				</Message>
			) : null}
			{errorMessage ? (
				<Message
					className={"Claim-status-message"}
					header="Error"
					content={errorMessage}
					error
				/>
			) : null}
			{progress ? (
				progress < 100 ? (
					<Progress
						className="Claim-status-bar"
						percent={progress}
						color="green"
						inverted
						progress
						active={progress == 100 ? false : true}
					/>
				) : null
			) : null}
			{progress == 100 ? (
				verifiedBounties.length > 1 ? (
					<>
						<Button
							className="Claim-challenge-button"
							onClick={() => window.location.reload(true)}
						>
							Claim Another Bounty
						</Button>
						<Link to="/challenge" className="item">
							<Button className="Claim-challenge-button">
								Create a Challenge
							</Button>
						</Link>
					</>
				) : (
					<Link to="/challenge" className="item">
						<Button className="Claim-challenge-button">
							Create a Challenge
						</Button>
					</Link>
				)
			) : null}
			{account &&
			chainId ==
				parseInt(process.env.REACT_APP_POLYGON_MAINNET_CHAIN_ID) ? (
				verifiedBounties.length > 0 ? (
					progress == 100 ? null : (
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
								bounty={verifiedBounty.challenge.bounty / 1e18} //Matic
								distance={verifiedBounty.challenge.distance}
								speed={verifiedBounty.challenge.pace}
								issuedAt={Date.parse(
									verifiedBounty.challenge.created_at
								)}
								complete={verifiedBounty.challenge.complete}
								secsToDate={secsToDate}
								isClaimBounty={true}
								onClaim={async () => {
									onClaim({
										challengeId:
											verifiedBounty.challenge.id,
										hashedMessage:
											verifiedBounty.hashed_message,
										signature: verifiedBounty.signature,
									});
								}}
								loading={loading}
								windowWidth={windowWidth}
							/>
						))
					)
				) : (
					<>
						<Message
							className="Claim-no-challenges-message"
							header="No Completed Challenges"
							content="You have no bounties to claim on completed challenges at this time."
						/>
						<Link to="/challenge" className="item">
							<Button className="Claim-challenge-button">
								Create a Challenge
							</Button>
						</Link>
					</>
				)
			) : (
				<Message
					className="Claim-not-connected-message"
					header="Connect your wallet to retrieve challenges 👆"
					content="Make sure that your network is Polygon Mainnet (ID: 137)."
				/>
			)}
		</div>
	);
};

export default Claim;
