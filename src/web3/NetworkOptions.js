import optimismLogo from "../assets/optimismLogo.png";
import polygonLogo from "../assets/polygonLogo.png";
import ethereumLogo from "../assets/ethereumLogo.png";

export const networkOptions = [
	{
		key: "EthereumRinkebyChainId",
		text: "Ethereum",
		value: 4,
		image: (
			<img
				alt="ethereumLogo"
				src={ethereumLogo}
				style={{ paddingLeft: 6, paddingRight: 10 }}
			/>
		),
	},
	{
		key: "OptimismKovanChainId",
		text: "Optimism",
		value: 69,
		image: (
			<img
				alt="optimismLogo"
				src={optimismLogo}
				style={{ paddingRight: 5 }}
			/>
		),
	},
	{
		key: "PolygonMumbaiChainId",
		text: "Polygon",
		value: 80001,
		image: (
			<img
				alt="polygonLogo"
				src={polygonLogo}
				style={{ paddingRight: 5 }}
			/>
		),
	},
];
