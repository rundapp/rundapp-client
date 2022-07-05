import React, { useState } from "react";
import { Form, Button, Message } from "semantic-ui-react";
import "./Styles/Challenge.css";
// import { useHistory } from "react-router-dom";
// import { formatEther } from "@ethersproject/units";

const Challenge = (props) => {
	// State Management
	const [challengerExtAdress, setChallengerExtAdress] = useState("");
	const [challengerEmailAdress, setChallengerEmailAdress] = useState("");
	const [recipientExtAddress, setRecipienExtAdress] = useState("");
	const [recipientEmailAddress, setRecipienEmailAdress] = useState("");
	const [amount, setAmount] = useState("");
	const [distance, setDistance] = useState("");
	const [pace, setPace] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const onSubmit = async (event) => {
		// When the form is submitted, we need to prevent the browser from
		// autormatically attempting to submit the form to a backend server.
		event.preventDefault();

		setLoading(true);
		setErrorMessage("");

		try {
			// Attempt to send transaction

			// Redirect user to the main page (Home)
			window.location.href = "/";
		} catch (err) {
			setErrorMessage(err.message);
		}

		setLoading(false);
	};

	return (
		<div className="Challenge-container">
			<h3 className="Challenge-header">Create a Challange</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label className="Challenge-label">
						Your Ethereum account address.
					</label>
					<input
						type="text"
						className="Challenge-input"
						value={challengerExtAdress}
						onChange={(event) =>
							setChallengerExtAdress(event.target.value)
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
						value={challengerEmailAdress}
						onChange={(event) =>
							setChallengerEmailAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label className="Challenge-label">
						The Ethereum account address of the recipient.
					</label>
					<input
						type="text"
						className="Challenge-input"
						value={recipientExtAddress}
						onChange={(event) =>
							setRecipienExtAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label className="Challenge-label">
						The email address of the recipient.
					</label>
					<input
						type="email"
						className="Challenge-input"
						value={recipientEmailAddress}
						onChange={(event) =>
							setRecipienEmailAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label className="Challenge-label">
						The distance the recipient must run(miles in decimal
						format).
					</label>
					<input
						type="number"
						className="Challenge-input"
						value={distance}
						onChange={(event) => setDistance(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label className="Challenge-label">
						The maximum average pace the recipient must run each
						mile at (mins/mile in decimal format).
					</label>
					<input
						type="number"
						className="Challenge-input"
						value={pace}
						onChange={(event) => setPace(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label className="Challenge-label">Amount (in ETH)</label>
					<input
						type="number"
						className="Challenge-input"
						value={amount}
						onChange={(event) => setAmount(event.target.value)}
					/>
				</Form.Field>
				<Message error={true} header="Oh no!" content={errorMessage} />
				<Button className="Challenge-button" loading={loading}>
					Challenge
				</Button>
			</Form>
		</div>
	);
};

export default Challenge;
