// Installed Libraries
import React, { useEffect, useState } from "react";
import { Form, Button, Message, Progress } from "semantic-ui-react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Challenge.css";
import blockrunnerAxios from "../api/BlockrunnerAxios";

const Challenge = () => {
	// Global State Management
	const { providerInfo, account, chainId } = useSelector(
		(state) => state.providerReducer
	);

	// Local State Management
	const [challengerName, setChallengerName] = useState("");
	const [challengerEmail, setChallengerEmail] = useState("");
	const [challengeeName, setChallengeeName] = useState("");
	const [challengeeAccount, setChallengeeAccount] = useState("");
	const [challengeeEmail, setChallengeeEmail] = useState("");
	const [amount, setAmount] = useState("");
	const [distance, setDistance] = useState("");
	const [speed, setSpeed] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [statusMessage, setStatusMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState();
	const runChallengerContract = providerInfo.runChallengerContract;
	const library = providerInfo.library;

	// Form Submit Button
	const onSubmit = async (event) => {
		// Prevent automatic form submission
		event.preventDefault();

		// Refresh state
		setLoading(true);
		setErrorMessage("");
		setStatusMessage("");

		// Start progress bar
		setProgress(10);

		// Generate new challengeId and timestamp
		const challengeId = crypto.randomUUID(); // Random 32-byte UUID
		const issuedAt = Math.round(Date.now()); // Epoch in milliseconds

		// Get latest nonce
		const nonce = await library.getTransactionCount(account, "latest");

		setProgress(30);
		try {
			// Attempt to create challenge on chain
			const txResponse = await runChallengerContract.issueChallenge(
				challengeeAccount,
				parseInt(distance),
				parseInt(speed),
				issuedAt,
				challengeId,
				{
					value: ethers.utils.parseUnits(amount, "ether"), // Matic ("ether" keyword converts to correct decimal)
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

			// If transaction completed successfully, send challenge info to server
			if (txReceipt.status == 1) {
				try {
					const response = await blockrunnerAxios.post(
						"/public/challenges/actions/create",
						{
							challenger_name: challengerName,
							challengee_name: challengeeName,
							challenger_email: challengerEmail,
							challengee_email: challengeeEmail,
							challenge_id: challengeId,
						}
					);
					if (response.status == 201) setProgress(100);
					setStatusMessage(
						"The challenge has been successfully created on chain, and an email was sent to the person you challenged."
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

		// Refresh state
		setChallengerName("");
		setChallengerEmail("");
		setChallengeeName("");
		setChallengeeAccount("");
		setChallengeeEmail("");
		setAmount("");
		setDistance("");
		setSpeed("");
		setErrorMessage("");
		setLoading(false);
	};

	useEffect(() => {
		if (errorMessage) {
			setProgress(null);
			setStatusMessage("");
		}
	}, [errorMessage]);

	return (
		<div className="Challenge-container">
			{progress == 100 ? null : (
				<h3 className="Challenge-header">Create a Challange</h3>
			)}
			<Form
				id="createChallengeForm"
				onSubmit={onSubmit}
				error={!!errorMessage}
				success={!!statusMessage}
			>
				{progress == 100 ? null : (
					<>
						<Form.Field>
							<label className="Challenge-label">
								Your name:
							</label>
							<input
								className="Challenge-input"
								id="challengerName"
								value={challengerName}
								onChange={(event) =>
									setChallengerName(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								Your email address.
							</label>
							<input
								type="email"
								className="Challenge-input"
								id="challengerEmail"
								value={challengerEmail}
								onChange={(event) =>
									setChallengerEmail(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								The name of the person you are challenging:
							</label>
							<input
								className="Challenge-input"
								id="challengeeName"
								value={challengeeName}
								onChange={(event) =>
									setChallengeeName(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								The Ethereum account address of the person you
								are challenging:
							</label>
							<input
								type="text"
								className="Challenge-input"
								id="challengeeAccount"
								value={challengeeAccount}
								onChange={(event) =>
									setChallengeeAccount(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								The email address of the person you are
								challenging:
							</label>
							<input
								type="email"
								className="Challenge-input"
								id="challengeeEmail"
								value={challengeeEmail}
								onChange={(event) =>
									setChallengeeEmail(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								Run distance (miles in decimal format):
							</label>
							<input
								type="number"
								className="Challenge-input"
								id="distance"
								value={distance}
								onChange={(event) =>
									setDistance(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								The maximum average speed the recipient must run
								each mile at (mins/mile in decimal format).
							</label>
							<input
								type="number"
								className="Challenge-input"
								id="speed"
								value={speed}
								onChange={(event) =>
									setSpeed(event.target.value)
								}
							/>
						</Form.Field>
						<Form.Field>
							<label className="Challenge-label">
								Amount (in MATIC)
							</label>
							<input
								type="number"
								className="Challenge-input"
								id="amount"
								value={amount}
								onChange={(event) =>
									setAmount(event.target.value)
								}
							/>
						</Form.Field>
					</>
				)}
				<Message
					className={"Challenge-status-message"}
					header={progress == 100 ? "Success" : null}
					content={statusMessage}
					success
				/>
				<Message
					className={"Challenge-status-message"}
					header="Error"
					content={errorMessage}
					error
				/>
				{progress ? (
					progress < 100 ? (
						<Progress
							className="Challenge-status-bar"
							percent={progress}
							color="green"
							inverted
							progress
							active={progress == 100 ? false : true}
						/>
					) : null
				) : null}
				{progress == 100 ? (
					<Button
						className="Challenge-button"
						onClick={() => window.location.reload(true)}
					>
						Create Another Challenge
					</Button>
				) : (
					<Button
						className="Challenge-button"
						loading={loading}
						disabled={
							loading || !account || chainId != 80001
								? true
								: false
						}
					>
						Challenge
					</Button>
				)}
			</Form>
		</div>
	);
};

export default Challenge;
