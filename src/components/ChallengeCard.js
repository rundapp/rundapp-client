// Installed Libraries
import React from "react";
import { Button, Message } from "semantic-ui-react";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/ChallengeCard.css";

const ChallengeCard = ({
	challengerAccount,
	challengeeAccount,
	challengeId,
	bounty,
	distance,
	speed,
	issuedAt,
	complete,
	secsToDate,
	isClaimBounty,
	onClaim,
	loading,
	windowWidth,
}) => {
	// Globals State Access
	const { account, chainId } = useSelector((state) => state.providerReducer);

	const formatPace = () => {
		const rawConvertedNumber = Number(speed * (60 / 160934.4)); // convert from cm/s to min/mile
		const numberPart = rawConvertedNumber.toFixed(0);
		const decimalPart = rawConvertedNumber % 1;

		const minutes = Number(numberPart).toLocaleString("en-US", {
			minimumIntegerDigits: 2,
			useGrouping: false,
		});
		const seconds = Number((decimalPart * 60).toFixed(0)).toLocaleString(
			"en-US",
			{
				minimumIntegerDigits: 2,
				useGrouping: false,
			}
		);
		return `${minutes}:${seconds}`;
	};

	return (
		<div
			className={
				windowWidth >= 625
					? "ChallengeCard-full-container"
					: "ChallengeCard-small-container"
			}
		>
			<p className="ChallengeCard-id-text">
				<span className="ChallengeCard-id-label">ID:</span>
				{challengeId.substring(0, 12)}
				...
				{challengeId.substring(Math.max(0, challengeId.length - 12))}
			</p>
			<p className="ChallengeCard-date-text">
				{secsToDate(parseInt(issuedAt))}
			</p>
			{complete ? (
				<Message
					className="ChallengeCard-completion-flag"
					color="green"
				>
					Complete
				</Message>
			) : (
				<Message className="ChallengeCard-completion-flag" color="red">
					Incomplete
				</Message>
			)}
			<div className="ChallengeCard-hstack">
				<div className="ChallengeCard-vstack">
					<p className="ChallengeCard-labels">Distance</p>
					<p className="ChallengeCard-details">
						{Number(distance / 160934.4).toFixed(2)} mi
					</p>
				</div>
				<div className="ChallengeCard-vstack">
					<p className="ChallengeCard-labels">Pace</p>
					<p className="ChallengeCard-details">{formatPace()} /mi</p>
				</div>
				<div className="ChallengeCard-vstack">
					<p className="ChallengeCard-labels">Bounty</p>
					<p className="ChallengeCard-details">
						{Number(bounty).toFixed(5)} MATIC
					</p>
				</div>
			</div>
			<div className="ChallengeCard-hstack">
				<div className="ChallengeCard-vstack">
					<p className="ChallengeCard-labels">Challenger</p>
					<p className="ChallengeCard-details">
						{challengerAccount.substring(0, 7)}
						...
						{challengerAccount.substring(
							Math.max(0, challengerAccount.length - 7)
						)}
					</p>
				</div>
				<div className="ChallengeCard-vstack">
					<p className="ChallengeCard-labels">Recipient</p>
					<p className="ChallengeCard-details">
						{challengeeAccount.substring(0, 7)}
						...
						{challengeeAccount.substring(
							Math.max(0, challengerAccount.length - 7)
						)}
					</p>
				</div>
			</div>
			{complete ? (
				isClaimBounty ? (
					<Button
						className="ChallengeCard-button"
						onClick={onClaim}
						loading={loading}
						disabled={
							loading || !account || chainId != 80001
								? true
								: false
						}
					>
						Claim Bounty
					</Button>
				) : null
			) : null}
		</div>
	);
};

export default ChallengeCard;
