// Installed Libraries
import React, { useEffect, useState } from "react";
import { Button, Accordion, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

// Local Imports
import "../styles/Home.css";
import ChallengeCard from "../components/ChallengeCard";
import { secsToDate } from "../utils/Utils";
import { faqPanels } from "../utils/FaqPanels";
import RunChallenger from "../utils/RunChallenger.json";

const Home = ({ windowWidth }) => {
	// State Management
	const [challengesArray, setChallengesArray] = useState([]);
	const [activeFaqIndex, setActiveFaqIndex] = useState();

	// Read Challenges from Smart Contract
	const getChallengesArray = async () => {
		// Read-only provider
		const provider = new ethers.providers.JsonRpcProvider(
			process.env.REACT_APP_POLYGON_MAINNET_NODE
		);

		// Read-only contract instance
		const runChallengerContract = new ethers.Contract(
			process.env.REACT_APP_POLYGON_MAINNET_CONTRACT_ADDRESS,
			RunChallenger.abi,
			provider
		);

		// Get challenges from contract
		const challenges = await runChallengerContract.getChallenges();
		const reversedChallenges = [...challenges].reverse();
		setChallengesArray(reversedChallenges);
	};

	// Handle FAQ Dropdown
	const handleFaqClick = (index) => {
		const newIndex = activeFaqIndex == index ? -1 : index;
		setActiveFaqIndex(newIndex);
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
					<p className="Home-top-paragraph-text">
						RunDapp is an{" "}
						<a
							style={{ color: "#74bbed" }}
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
				<div
					className={
						windowWidth >= 625
							? "Home-faq-container-full"
							: "Home-faq-container-small"
					}
				>
					<Accordion
						className="Home-faq-accordion"
						fluid
						styled
						inverted
					>
						{faqPanels.map((panel, index) => (
							<div className="Home-faq-panel" key={panel.key}>
								<Accordion.Title
									className={
										activeFaqIndex == index
											? "Home-faq-title-active"
											: "Home-faq-title-inactive"
									}
									active={activeFaqIndex == index}
									index={activeFaqIndex}
									onClick={() => handleFaqClick(index)}
								>
									<div className="Home-faq-title-align">
										<Icon name="dropdown" />
										<p>{panel.title}</p>
									</div>
								</Accordion.Title>
								<Accordion.Content
									className="Home-faq-content"
									active={activeFaqIndex == index}
								>
									<div className="Home-faq-title-align">
										<div className="Home-faq-content-placeholder" />
										<p>{panel.content}</p>
									</div>
								</Accordion.Content>
							</div>
						))}
					</Accordion>
				</div>
			</div>
			<div className="Home-challenges-container">
				<h2 className="Home-challenges-header">Challenge Board</h2>
				{challengesArray.map((challenge) => (
					<ChallengeCard
						key={challenge.challengeId}
						challengerAccount={challenge.challenger}
						challengeeAccount={challenge.challengee}
						challengeId={challenge.challengeId}
						bounty={ethers.utils.formatUnits(
							challenge.bounty,
							"ether"
						)} // MATIC
						distance={challenge.distance}
						speed={challenge.speed}
						issuedAt={challenge.issuedAt}
						complete={challenge.complete}
						secsToDate={secsToDate}
						windowWidth={windowWidth}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
