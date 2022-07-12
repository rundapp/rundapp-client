// Installed Libraries
import React, { useEffect, useState } from "react";
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
		<div className="Home-container">
			<h3 className="Home-header">BlockRunner.Quest</h3>
			<ol className="Home-regular-text">
				<h3 className="Home-section-header">How it works:</h3>
				<li className="Home-indented-text">
					Create a <a href="https://www.strava.com/">Strava </a>
					account (if you don't have one).
				</li>
				<li className="Home-indented-text">
					Grant BlockRunner.Quest permission to read your Strava data
					via this{" "}
					<a href="https://www.strava.com/oauth/authorize?client_id=88040&response_type=code&redirect_uri=http://4f2b-2600-1700-cc20-2d00-29aa-c46c-eecd-8e55.ngrok.io&approval_prompt=force&scope=read_all,activity:read_all">
						link
					</a>
					.
				</li>
				<li className="Home-indented-text">
					Challenge your friends (or yourself) to go on a run by
					locking up some money that can only be obtained after the
					run has been completed by the challengee.
				</li>
				<li className="Home-indented-text">
					The challengee must log the run in Strava. The run can be
					recorded with the{" "}
					<a href="https://www.strava.com/mobile">
						Strava mobile app
					</a>{" "}
					or uploaded from a fitness wearable (i.e., Apple Watch). The
					run gets validated almost immediately after it is logged
					into Strava.
				</li>
				<li className="Home-indented-text">
					The challengee can claim the funds <a href="/claim">here</a>
					.
				</li>
			</ol>
			<h3 className="Home-section-header">
				Check out some of the latest challenges:
			</h3>
			{challengesArray.map((challenge, index) => (
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
