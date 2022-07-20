import optimismLogo from "../assets/optimismLogo.png";
import polygonLogo from "../assets/polygonLogo.png";
import ethereumLogo from "../assets/ethereumLogo.png";

// When we want to support multiple networks, these options can be fed
// to a dropdown for the user to select the desired supported network
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
		key: "PolygonMainnetChainId",
		text: "Polygon",
		value: parseInt(process.env.REACT_APP_POLYGON_MAINNET_CHAIN_ID),
		image: (
			<img
				alt="polygonLogo"
				src={polygonLogo}
				style={{ paddingRight: 5 }}
			/>
		),
	},
];
