import React from "react";
import * as eva from "@eva-design/eva";
import {
	ApplicationProvider,
	IconRegistry,
	Layout,
	Text,
} from "@ui-kitten/components";
import { default as theme } from "./assets/UIkitten/custom-theme.json";
import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";

import AppNavigator from "./navigation/AppNavigator";
import tutorialReducer from "./store/reducers/tutorial";

const rootReducer = combineReducers({
	tutorial: tutorialReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	return (
		<Provider store={store}>
			<ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
				<AppNavigator />
			</ApplicationProvider>
		</Provider>
	);
}
