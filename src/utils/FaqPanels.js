export const faqPanels = [
	{
		key: "q1",
		title: "Where does RunDapp store users' money?",
		content: "RunDapp stores users' money in a smart contract account.",
	},
	{
		key: "q2",
		title: "How does RunDapp make money?",
		content:
			"RunDapp takes a 4% service fee and users must pay any applicable transaction gas fees.",
	},
	{
		key: "q3",
		title: "What networks does RunDapp support?",
		content:
			"Currently, we only support Polygon Mainnet, but we intend to expand to other networks soon.",
	},
	{
		key: "q4",
		title: "How do I record a run on Strava?",
		content: (
			<a
				style={{ color: "#74bbed" }}
				href="https://support.strava.com/hc/en-us/articles/216917397-Recording-an-Activity"
				target="_blank"
				rel="noopener noreferrer"
			>
				See Strava's documentation on recording an activity.
			</a>
		),
	},
	{
		key: "q5",
		title: "Can I record my run with a wearable device?",
		content: (
			<a
				style={{ color: "#74bbed" }}
				href="https://support.strava.com/hc/en-us/articles/223297187-How-to-get-your-Activities-to-Strava"
				target="_blank"
				rel="noopener noreferrer"
			>
				Yes. See Strava's documentation on importing activities.
			</a>
		),
	},
];
