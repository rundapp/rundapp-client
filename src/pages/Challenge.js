// Installed Libraries
import React, { useEffect, useState } from "react";
import { Form, Button, Message, Progress } from "semantic-ui-react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Challenge.css";
import rundappAxios from "../api/RundappAxios";
import { minOptions, secOptions } from "../utils/PaceOptions";
import {
	validateEmail,
	validateAccount,
	validateDistance,
	validateSpeed,
	validateAmount,
} from "../utils/Utils";

const Challenge = ({ windowWidth }) => {
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
	const [paceMinutes, setPaceMinutes] = useState("");
	const [paceSeconds, setPaceSeconds] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [statusMessage, setStatusMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState();
	const [isChallengerEmailValid, setIsChallengerEmailValid] = useState(false);
	const [isChallengeeEmailValid, setIsChallengeeEmailValid] = useState(false);
	const [isAccountValid, setIsAccountValid] = useState(false);
	const [isDistanceValid, setIsDistanceValid] = useState(false);
	const [isSpeedValid, setIsSpeedValid] = useState(false);
	const [isAmounttValid, setIsAmountValid] = useState(false);
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
				parseInt(distance * 160934.4), // Convert miles to cm
				parseInt((1 / speed) * (160934.4 / 60)), // Convert min/mile to cm/sec
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
					const response = await rundappAxios.post(
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
		setLoading(false);
	};

	// Convert pace from min:sec to min in decimal format
	useEffect(() => {
		const convertedSpeed = (+paceMinutes + +paceSeconds / 60).toFixed(2);
		validateSpeed(convertedSpeed, setSpeed, setIsSpeedValid);
	}, [paceMinutes, paceSeconds]);

	useEffect(() => {
		if (errorMessage) {
			setProgress(null);
			setStatusMessage("");
		}
	}, [errorMessage]);

	return (
		<div className="Challenge-main-container">
			<h1 className="Challenge-header">RunDapp</h1>
			{/*  */}
			{/*  */}
			{/*  */}
			<div className="Challenge-instructions-container">
				<h3 className="Challenge-instructions-label">Instructions</h3>
				<div className="Challenge-ol-text">
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "flex-start",
							marginTop: "10px",
						}}
					>
						<div style={{ marginRight: "15px" }}>
							<p style={{ fontSize: "28px" }}>1️⃣</p>
						</div>
						<p className="Challenge-list-item">
							Issue a running challenge to yourself or a friend.
						</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "flex-start",
							marginTop: "10px",
						}}
					>
						<div style={{ marginRight: "15px" }}>
							<p style={{ fontSize: "28px" }}>2️⃣</p>
						</div>
						<p className="Challenge-list-item">
							The recipient must log the run using{" "}
							<a
								href="https://strava.com"
								target="_blank"
								rel="noopener noreferrer"
							>
								Strava
							</a>
							. An email will be sent to the recipient, which will
							prompt the linking of a Strava account.
						</p>
					</div>
					<div
						style={{
							display: "flex",
							alignItems: "flex-start",
							justifyContent: "flex-start",
							marginTop: "10px",
						}}
					>
						<div style={{ marginRight: "15px" }}>
							<p style={{ fontSize: "28px" }}>3️⃣</p>
						</div>
						<p className="Challenge-list-item">
							If the recipient logs a run that satisfies the
							challenge, the recipient can claim run bounties{" "}
							<a href="/claim">here</a>.
						</p>
					</div>
				</div>
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
			<div
				className={
					windowWidth >= 625
						? "Challenge-full-form-container"
						: "Challenge-small-form-container"
				}
			>
				{progress == 100 ? null : (
					<h3 className="Challenge-form-header">
						Create a Challange
					</h3>
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
									type="text"
									placeholder="Ex:   Bob"
									value={challengerName}
									onChange={(event) =>
										setChallengerName(event.target.value)
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label className="Challenge-label">
									Your email:
								</label>
								<input
									className="Challenge-input"
									id="challengerEmail"
									type="email"
									placeholder="Ex:   bob@example.com"
									onChange={(event) =>
										validateEmail(
											event,
											setChallengerEmail,
											setChallengeeEmail,
											setIsChallengerEmailValid,
											setIsChallengeeEmailValid,
											{
												person: "challenger",
											}
										)
									}
								/>
							</Form.Field>
							<Form.Field>
								<label className="Challenge-label">
									Recipient name:
								</label>
								<input
									className="Challenge-input"
									id="challengeeName"
									type="text"
									placeholder="Ex:   Alice"
									value={challengeeName}
									onChange={(event) =>
										setChallengeeName(event.target.value)
									}
								/>
							</Form.Field>

							<Form.Field required>
								<label className="Challenge-label">
									Recipient email:
								</label>
								<input
									className="Challenge-input"
									id="challengeeEmail"
									type="email"
									placeholder="Ex:   alice@example.com"
									onChange={(event) =>
										validateEmail(
											event,
											setChallengerEmail,
											setChallengeeEmail,
											setIsChallengerEmailValid,
											setIsChallengeeEmailValid,
											{
												person: "challengee",
											}
										)
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label className="Challenge-label">
									Recipient public address:
								</label>
								<input
									className="Challenge-input"
									id="challengeeAccount"
									type="text"
									placeholder="Ex:   0xDa0123456789C1bwd1234B4W41C123A45Fc31a78"
									onChange={(event) =>
										validateAccount(
											event,
											setChallengeeAccount,
											setIsAccountValid
										)
									}
								/>
							</Form.Field>
							<Form.Field required>
								<label className="Challenge-label">
									Run distance:
								</label>
								<div className="Challenge-input-container">
									<input
										style={{ width: "75%" }}
										className="Challenge-input"
										id="distance"
										type="number"
										step="any"
										placeholder="Ex:   3.5"
										onWheel={(e) => e.target.blur()}
										onChange={(event) =>
											validateDistance(
												event,
												setDistance,
												setIsDistanceValid
											)
										}
										autoComplete="off"
									/>
									<div className="Challenge-units-label">
										<p className="Challenge-units-text ">
											miles
										</p>
									</div>
								</div>
							</Form.Field>
							<Form.Field required>
								<label className="Challenge-label">
									Average mile pace:
								</label>
								<div className="Challenge-input-container">
									<select
										className="Challenge-select"
										id="paceMinutes"
										value={paceMinutes}
										onChange={(event) =>
											setPaceMinutes(event.target.value)
										}
										required
									>
										<option value="" disabled>
											Min
										</option>
										{minOptions.map((minute) => (
											<option
												value={minute.value}
												key={minute.key}
											>
												{minute.text}
											</option>
										))}
									</select>
									<div>
										<p className="Challenge-pace-colon">
											:
										</p>
									</div>
									<select
										className="Challenge-select"
										id="paceSeconds"
										value={paceSeconds}
										onChange={(event) =>
											setPaceSeconds(event.target.value)
										}
										required
									>
										<option value="" disabled>
											Sec
										</option>
										{secOptions.map((second) => (
											<option
												value={second.value}
												key={second.key}
											>
												{second.text}
											</option>
										))}
									</select>
									<div className="Challenge-units-label">
										<p className="Challenge-units-text ">
											/ mile
										</p>
									</div>
								</div>
							</Form.Field>
							<Form.Field required>
								<label className="Challenge-label">
									Bounty amount:
								</label>
								<div className="Challenge-input-container">
									<input
										style={{ width: "75%" }}
										className="Challenge-input"
										id="amount"
										type="number"
										step="any"
										placeholder="Ex:   5"
										onWheel={(e) => e.target.blur()}
										onChange={(event) =>
											validateAmount(
												event,
												setAmount,
												setIsAmountValid
											)
										}
										autoComplete="off"
									/>
									<div className="Challenge-units-label">
										<p className="Challenge-units-text ">
											MATIC
										</p>
									</div>
								</div>
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
								!isChallengerEmailValid ||
								!isAccountValid ||
								!isChallengeeEmailValid ||
								!isDistanceValid ||
								!paceSeconds ||
								!isSpeedValid ||
								!isAmounttValid ||
								loading ||
								!account ||
								chainId != 80001
									? true
									: false
							}
						>
							Challenge
						</Button>
					)}
				</Form>
			</div>
		</div>
	);
};

export default Challenge;
