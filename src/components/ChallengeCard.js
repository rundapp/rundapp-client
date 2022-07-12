// Installed Libraries
import React from "react";
import { Button } from "semantic-ui-react";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/ChallengeCard.css";

const ChallengeCard = ({
	challengerAccount,
	challengeeAccount,
	challengeId,
	bounty,
	issuedAt,
	complete,
	secsToDate,
	isClaimBounty,
	onClaim,
	loading,
}) => {
	// Globals State Access
	const { account, chainId } = useSelector((state) => state.providerReducer);

	return (
		<div className="ChallengeCard-container">
			<div className="ChallengeCard-hstack">
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Challenger:</b>
					{challengerAccount.substring(0, 5)}
					...
					{challengerAccount.substring(
						Math.max(0, challengerAccount.length - 5)
					)}
				</p>
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Bounty:</b>
					{Number(bounty).toFixed(5)} MATIC
				</p>
			</div>
			<div className="ChallengeCard-hstack">
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Challengee:</b>
					{challengeeAccount.substring(0, 5)}
					...
					{challengeeAccount.substring(
						Math.max(0, challengeeAccount.length - 5)
					)}
				</p>
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Issued:</b>
					{secsToDate(issuedAt)}
				</p>
			</div>
			{complete ? (
				<div>
					<div className="ChallengeCard-hstack">
						<p className="ChallengeCard-complete-text">
							<b className="ChallengeCard-bold-text">Complete:</b>
							Yes
						</p>
						<p className="ChallengeCard-regular-text">
							<b className="ChallengeCard-bold-text">ID:</b>
							{challengeId.substring(0, 5)}
							...
							{challengeId.substring(
								Math.max(0, challengeId.length - 5)
							)}
						</p>
					</div>
					{isClaimBounty ? (
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
					) : null}
				</div>
			) : (
				<div className="ChallengeCard-hstack">
					<p className="ChallengeCard-incomplete-text">
						<b className="ChallengeCard-bold-text">Complete:</b>
						No
					</p>
					<p className="ChallengeCard-regular-text">
						<b className="ChallengeCard-bold-text">ID:</b>
						{challengeId.substring(0, 5)}
						...
						{challengeId.substring(
							Math.max(0, challengeId.length - 5)
						)}
					</p>
				</div>
			)}
		</div>
	);
};

export default ChallengeCard;
