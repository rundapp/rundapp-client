// Installed Libraries
import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Home.css";
import ChallengeCard from "../components/ChallengeCard";
import { secsToDate } from "../utils/Utils";

const Home = () => {
	// State Management
	const { providerInfo, account } = useSelector(
		(state) => state.providerReducer
	);
	const [challengesArray, setChallengesArray] = useState([]);
	const runChallengerContract = providerInfo.runChallengerContract;

	const getChallengesArray = async () => {
		const challenges = await runChallengerContract.getChallenges();
		setChallengesArray(challenges);
	};

	useEffect(() => {
		if (account) getChallengesArray();
	}, []);

	// On account change => probably not be needed if event listener is working properly in Header.js
	useEffect(() => {
		if (account) getChallengesArray();
	}, [account]);

	return (
		<div className="Home-main-container">
			<h1 className="Home-header">RunDapp</h1>
			<div className="Home-top-container">
				<Button className="Home-top-buttons">Create a Challenge</Button>
				<Button className="Home-top-buttons">Claim a Bounty</Button>
				<div className="Home-top-paragraph-container">
					<p style={{ fontSize: "16px" }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit,
						sed do eiusmod tempor incididunt ut labore et dolore
						magna aliqua. Consectetur a erat nam at lectus urna duis
						convallis. Cursus risus at ultrices mi tempus imperdiet
						nulla malesuada.
					</p>
				</div>
			</div>
			<h2>Challenge Board</h2>
			{challengesArray.map((challenge) => (
				<ChallengeCard
					key={challenge.challengeId}
					challengerAccount={challenge.challenger}
					challengeeAccount={challenge.challengee}
					challengeId={challenge.challengeId}
					bounty={ethers.utils.formatUnits(challenge.bounty, "ether")} // MATIC
					issuedAt={parseInt(challenge.issuedAt)}
					complete={challenge.complete}
					secsToDate={secsToDate}
				/>
			))}
		</div>
	);
};

export default Home;
