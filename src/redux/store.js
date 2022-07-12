import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import providerReducer from "./reducers/ProviderReducer";

const rootReducer = combineReducers({
	providerReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
