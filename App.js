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
import AppLoading from "expo-app-loading";
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { useFonts } from "expo-font";

import AppNavigator from "./navigation/AppNavigator";
import tutorialReducer from "./store/reducers/tutorial";
import subjectReducer from "./store/reducers/subject";
import eventsReducer from "./store/reducers/events";
import studyFlowReducer from "./store/reducers/studyFlow";

const rootReducer = combineReducers({
	tutorial: tutorialReducer,
	subject: subjectReducer,
	events: eventsReducer,
	studyFlow: studyFlowReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
	let [fontsLoaded] = useFonts({
		"yellow-tail": require("./assets/fonts/Yellowtail-Regular.ttf"),
		"roboto": require("./assets/fonts/Roboto-Regular.ttf"),
		"roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
	});

	if (!fontsLoaded) {
		return <AppLoading />;
	}
	return (
		<Provider store={store}>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={{ ...eva.dark, ...theme }}>
				<AppNavigator />
			</ApplicationProvider>
		</Provider>
	);
}
