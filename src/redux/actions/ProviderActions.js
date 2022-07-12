export const GET_PROVIDER_INFO = "GET_PROVIDER_INFO";
export const GET_ACCOUNT = "GET_ACCOUNT";
export const GET_CHAIN_ID = "GET_CHAIN_ID";
export const CLEAR_ACCOUNT = "CLEAR_ACCOUNT";
export const CLEAR_CHAIN_ID = "CLEAR_CHAIN_ID";
export const PROVIDER_ERROR = "PROVIDER_ERROR";
export const CLEAR_PROVIDER_ERROR = "CLEAR_PROVIDER_ERROR";

export const getProviderInfo = (providerInfo) => (dispatch) => {
	dispatch({
		type: GET_PROVIDER_INFO,
		payload: providerInfo,
	});
};

export const getAccount = (account) => (dispatch) => {
	dispatch({
		type: GET_ACCOUNT,
		payload: account,
	});
};

export const getChainId = (chainId) => (dispatch) => {
	dispatch({
		type: GET_CHAIN_ID,
		payload: chainId,
	});
};

export const clearAccount = () => (dispatch) => {
	dispatch({
		type: CLEAR_ACCOUNT,
	});
};

export const clearChainId = () => (dispatch) => {
	dispatch({
		type: CLEAR_CHAIN_ID,
	});
};

export const providerError = (errorMessage) => (dispatch) => {
	dispatch({
		type: PROVIDER_ERROR,
		payload: errorMessage,
	});
};

export const clearProviderError = () => (dispatch) => {
	dispatch({
		type: CLEAR_PROVIDER_ERROR,
	});
};
