import {
	GET_PROVIDER_INFO,
	GET_ACCOUNT,
	GET_CHAIN_ID,
	CLEAR_ACCOUNT,
	CLEAR_CHAIN_ID,
	PROVIDER_ERROR,
	CLEAR_PROVIDER_ERROR,
} from "../actions/ProviderActions";

// Declare initial state
const initialState = {
	providerInfo: {
		provider: null,
		library: null,
		signer: null,
		runChallengerContract: null,
	},
	account: null,
	chainId: null,
	errorMessage: "",
};

// Reducer
function providerReducer(state = initialState, action) {
	switch (action.type) {
		case GET_PROVIDER_INFO:
			return { ...state, providerInfo: action.payload };
		case GET_ACCOUNT:
			return { ...state, account: action.payload };
		case GET_CHAIN_ID:
			return { ...state, chainId: action.payload };
		case CLEAR_ACCOUNT:
			return { ...state, account: "" };
		case CLEAR_CHAIN_ID:
			return { ...state, chainId: "" };
		case PROVIDER_ERROR:
			return { ...state, errorMessage: action.payload };
		case CLEAR_PROVIDER_ERROR:
			return { ...state, errorMessage: "" };
		default:
			return state;
	}
}

export default providerReducer;
