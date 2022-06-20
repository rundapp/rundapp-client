import React, { useState } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import { useHistory } from "react-router-dom";
import { formatEther } from "@ethersproject/units";

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
		<div>
			<h3>Create a Challange</h3>
			<Form onSubmit={onSubmit} error={!!errorMessage}>
				<Form.Field>
					<label>Your Ethereum account address.</label>
					<Input
						value={challengerExtAdress}
						onChange={(event) =>
							setChallengerExtAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label>Your email address.</label>
					<Input
						value={challengerEmailAdress}
						onChange={(event) =>
							setChallengerEmailAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label>
						The Ethereum account address of the recipient.
					</label>
					<Input
						value={recipientExtAddress}
						onChange={(event) =>
							setRecipienExtAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label>The email address of the recipient.</label>
					<Input
						value={recipientEmailAddress}
						onChange={(event) =>
							setRecipienEmailAdress(event.target.value)
						}
					/>
				</Form.Field>
				<Form.Field>
					<label>
						The distance the recipient must run(in decimal format).
					</label>
					<Input
						label="Miles"
						labelPosition="right"
						value={distance}
						onChange={(event) => setDistance(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>
						The pace the recipient must run each mile at (in decimal
						format).
					</label>
					<Input
						label="Minutes/Mile"
						labelPosition="right"
						value={pace}
						onChange={(event) => setPace(event.target.value)}
					/>
				</Form.Field>
				<Form.Field>
					<label>Amount</label>
					<Input
						label="ETH"
						labelPosition="right"
						value={amount}
						onChange={(event) => setAmount(event.target.value)}
					/>
				</Form.Field>
				<Message error={true} header="Oh no!" content={errorMessage} />
				<Button secondary={true} loading={loading}>
					Challenge
				</Button>
			</Form>
		</div>
	);
};

export default Challenge;
