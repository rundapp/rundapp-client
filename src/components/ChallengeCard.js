import React from "react";
import "./Styles/ChallengeCard.css";

const ChallengeCard = ({ challenge, secsToDate }) => {
	return (
		<div className="ChallengeCard-container">
			<div className="ChallengeCard-hstack">
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Challenger:</b>
					{challenge.challenger.substring(0, 5)}
					...
					{challenge.challenger.substring(
						Math.max(0, challenge.challenger.length - 5)
					)}
				</p>
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Bounty:</b>
					{challenge.bounty} ETH
				</p>
			</div>
			<div className="ChallengeCard-hstack">
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Challengee:</b>
					{challenge.challengee.substring(0, 5)}
					...
					{challenge.challengee.substring(
						Math.max(0, challenge.challengee.length - 5)
					)}
				</p>
				<p className="ChallengeCard-regular-text">
					<b className="ChallengeCard-bold-text">Issued:</b>
					{secsToDate(challenge.issuedAt)}
				</p>
			</div>
			{challenge.complete ? (
				<p className="ChallengeCard-complete-text">
					<b className="ChallengeCard-bold-text">Complete:</b>
					Yes
				</p>
			) : (
				<p className="ChallengeCard-incomplete-text">
					<b className="ChallengeCard-bold-text">Complete:</b>
					No
				</p>
			)}
		</div>
	);
};

export default ChallengeCard;
