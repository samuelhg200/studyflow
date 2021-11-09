import React from "react";
import * as eva from "@eva-design/eva";
import {
	ApplicationProvider,
	IconRegistry,
	Layout,
	Text,
} from "@ui-kitten/components";
import { default as CustomTheme } from "./assets/UIkitten/custom-theme.json";
import ReduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider, useSelector } from "react-redux";
import AppLoading from "expo-app-loading";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ThemeContext } from "./helpers/theme-context";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useFonts } from "expo-font";

import AppNavigator from "./navigation/AppNavigator";
import tutorialReducer from "./store/reducers/tutorial";
import subjectReducer from "./store/reducers/subject";
import eventsReducer from "./store/reducers/events";
import studyFlowReducer from "./store/reducers/studyFlow";
import themeReducer from "./store/reducers/theme";
import eventHistoryReducer from "./store/reducers/eventHistory";
import currentEventRepeatReducer from "./store/reducers/currentEventRepeat";
import walletReducer from './store/reducers/wallet'
import productReducer from './store/reducers/product'

const rootReducer = combineReducers({
	tutorial: tutorialReducer,
	subject: subjectReducer,
	events: eventsReducer,
	studyFlow: studyFlowReducer,
	theme: themeReducer,
	eventHistory: eventHistoryReducer,
	currentEventRepeat: currentEventRepeatReducer,
	wallet: walletReducer,
	product: productReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

function App() {
	const theme = useSelector((state) => state.theme.theme);
	//const [theme, setTheme] = React.useState('dark');

	// const toggleTheme = () => {
	// 	const nextTheme = theme === 'light' ? 'dark' : 'light';
	// 	setTheme(nextTheme);
	//   };

	return (
		<ThemeContext.Provider value={{ theme }} value={{ theme }}>
			<IconRegistry icons={EvaIconsPack} />
			<ApplicationProvider {...eva} theme={{ ...eva[theme], ...CustomTheme }}>
				<SafeAreaProvider>
					<AppNavigator />
				</SafeAreaProvider>
			</ApplicationProvider>
		</ThemeContext.Provider>
	);
}

export default function AppWrapper() {
	let [fontsLoaded] = useFonts({
		"yellow-tail": require("./assets/fonts/Yellowtail-Regular.ttf"),
		roboto: require("./assets/fonts/Roboto-Regular.ttf"),
		"roboto-bold": require("./assets/fonts/Roboto-Bold.ttf"),
	});
	if (!fontsLoaded) {
		return <AppLoading />;
	}
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
}


