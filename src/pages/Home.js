// Installed Libraries
import React, { useEffect, useState } from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { useSelector } from "react-redux";

// Local Imports
import "../styles/Home.css";
import ChallengeCard from "../components/ChallengeCard";
import { secsToDate } from "../utils/Utils";
import RunChallenger from "../utils/RunChallenger.json";

const Home = ({ windowWidth }) => {
	// State Management
	const [challengesArray, setChallengesArray] = useState([]);

	const getChallengesArray = async () => {
		// Read-only provider
		const provider = new ethers.providers.JsonRpcProvider(
			process.env.REACT_APP_POLYGON_MUMBAI_NODE
		);

		// Read-only contract instance
		const runChallengerContract = new ethers.Contract(
			process.env.REACT_APP_POLYGON_MUMBAI_CONTRACT_ADDRESS,
			RunChallenger.abi,
			provider
		);

		// Get challenges from contract
		const challenges = await runChallengerContract.getChallenges();
		const reversedChallenges = [...challenges].reverse();
		setChallengesArray(reversedChallenges);
	};

	useEffect(() => {
		getChallengesArray();
	}, []);

	return (
		<div className="Home-main-container">
			<h1 className="Home-header">RunDapp</h1>
			<div className="Home-top-container">
				<div className="Home-button-Container">
					<Link to="/challenge" className="item">
						<Button className="Home-top-buttons">
							Create a Challenge
						</Button>
					</Link>
					<Link to="/claim" className="item">
						<Button className="Home-top-buttons">
							Claim a Bounty
						</Button>
					</Link>
				</div>
				<div className="Home-top-paragraph-container">
					<p className="Home-regular-text">
						RunDapp is an{" "}
						<a
							href="https://github.com/rundapp"
							target="_blank"
							rel="noopener noreferrer"
						>
							open-source
						</a>
						, Web3 platform focused on incentivizing people to run.
						The platform provides both social and monetary rewards
						to help you or your friends commit to running, which
						results in a positive health impact. You can challenge
						yourself or others to run by locking up money that's
						only retrievable upon completing a run. For added
						accountability, group challenges will be available soon!
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
					distance={challenge.distance}
					speed={challenge.speed}
					issuedAt={challenge.issuedAt}
					complete={challenge.complete}
					secsToDate={secsToDate}
					windowWidth={windowWidth}
				/>
			))}
		</div>
	);
};

export default Home;
