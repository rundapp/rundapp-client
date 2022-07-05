import React from "react";
import "./Styles/Home.css";
import ChallengeCard from "./ChallengeCard";

const Home = () => {
	const challengesArray = [
		{
			challenger: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			challengee: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			challengeId: "1d3-4g2-523-2w23",
			bounty: 0.25,
			issuedAt: 1656676031000,
			complete: false,
		},
		{
			challenger: "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
			challengee: "0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db",
			challengeId: "5m1-32n-5v3-9093",
			bounty: 0.1,
			issuedAt: 1656589631000,
			complete: true,
		},
		{
			challenger: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4",
			challengee: "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
			challengeId: "9m4-lm6-4rt-089a",
			bounty: 0.005,
			issuedAt: 1656503231000,
			complete: false,
		},
	];

	const secsToDate = (secs) => {
		var date = new Date(secs).toLocaleString("en-US", {
			dateStyle: "medium",
		});
		return date;
	};

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
			{challengesArray.map((challenge) => (
				<ChallengeCard
					challenge={challenge}
					secsToDate={secsToDate}
					key={challenge.challengeId}
				/>
			))}
		</div>
	);
};

export default Home;
