import { Dimensions } from "react-native";
import ThemeRed from "../assets/UIkitten/custom-theme.json";
import ThemeGreen from "../assets/UIkitten/custom-theme(green).json";
import ThemePurple from "../assets/UIkitten/custom-theme(purple).json";
import ThemeBlue from "../assets/UIkitten/custom-theme(blue).json";
import ThemeGold from "../assets/UIkitten/custom-theme(gold).json";

export const timerSkins = [
	{
		id: 1,
		name: "Purple World",
		source: require("../assets/lottie/CircleLines.json"),
		styleTimerConfig: {
			flex: 1,
		},
		styleShopConfig: {
			width: Dimensions.get("window").width / 2.2,
			position: "absolute",
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 1.1,
		},
		containerStyleShop: {
			paddingLeft: 0,
		},
		price: 2500,
		resizeMode: "cover",
	},
	{
		id: 2,
		name: "The Minimalist",
		source: require("../assets/lottie/MinimalistCircleTimer.json"),
		styleTimerConfig: {
			flex: 1,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 2.5,
			marginTop: Dimensions.get("window").height / 70,
		},
		modalBackground: "white",
		price: 1000,
		resizeMode: "contain",
	},

	{
		id: 5,
		name: "Disco Learner",
		source: require("../assets/lottie/DiscoLearner.json"),
		styleTimerConfig: {
			flex: 1,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},

		price: 9500,
		resizeMode: "cover",
	},
	{
		id: 6,
		name: "Neon Ripple",
		source: require("../assets/lottie/NeonRipple.json"),
		styleTimerConfig: {
			flex: 1,
			//marginRight: Dimensions.get('window').width / 50
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 1.6,
		},
		modalBackground: "white",
		price: 5000,
		resizeMode: "cover",
	},
	{
		id: 7,
		name: "Shadow Dreamer",
		source: require("../assets/lottie/ShadowDreamer.json"),
		styleTimerConfig: {
			//height: Dimensions.get("window").height / 2,
			flex: 1,
			//position: 'absolute'
			//- (Dimensions.get("window").height / 81)
			//left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		modalBackground: "white",
		price: 3000,
		resizeMode: "cover",
	},

	{
		id: 9,
		name: "Spectrum Beat",
		source: require("../assets/lottie/SpectrumBeat.json"),
		styleTimerConfig: {
			//height: Dimensions.get("window").height / 2,
			flex: 1,
			//position: 'absolute'
			//- (Dimensions.get("window").height / 81)
			//left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		modalBackground: "white",
		type: "Study",
		price: 3000,
		resizeMode: "contain",
	},
	{
		id: 3,
		name: "Loopy Cat",
		source: require("../assets/lottie/catLoader.json"),
		styleTimerConfig: {
			flex: 1,
			//height: Dimensions.get("window").height / 2.5,
			//position: "absolute",
			//top: -10,//- (Dimensions.get("window").height / 81)
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 2.5,
			marginTop: Dimensions.get("window").height / 20,
		},
		type: "Study",
		price: 0,
		resizeMode: "contain",
	},
	{
		id: 4,
		name: "Planet Chill",
		source: require("../assets/lottie/chillGuyRed.json"),
		styleTimerConfig: {
			flex: 1,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 2,
		},
		type: "Study",
		price: 0,
		resizeMode: "contain",
	},
];

export const colorTheme = [
	{
		name: "Red Theme",
		source: ThemeRed,
		addAnimationSource: require("../assets/lottie/addEventRed.json"),
		storeAnimation: require("../assets/lottie/RedColorStore.json"),
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		price: 0,
	},
	{
		name: "Blue Theme",
		source: ThemeBlue,
		addAnimationSource: require("../assets/lottie/addEventBlue.json"),
		storeAnimation: require("../assets/lottie/BlueColorStore.json"),
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		price: 5000,
	},
	{
		name: "Green Theme",
		source: ThemeGreen,
		addAnimationSource: require("../assets/lottie/addEventGreen.json"),
		storeAnimation: require("../assets/lottie/GreenColorStore.json"),
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		price: 10000,
	},
	{
		name: "Purple Theme",
		source: ThemePurple,
		addAnimationSource: require("../assets/lottie/addEventPurple.json"),
		storeAnimation: require("../assets/lottie/PurpleColorStore.json"),
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		price: 15000,
	},
	{
		name: "Golden Theme",
		source: ThemeGold,
		addAnimationSource: require("../assets/lottie/addEventGold.json"),
		storeAnimation: require("../assets/lottie/GoldColorStore.json"),
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		price: 99999,
	},
];

export const themeProd = {
	source: require("../assets/lottie/DarkLightThemeToggle.json"),
	styleBuyModal: {
		width: Dimensions.get("window").width / 3.5,
		marginLeft: -(Dimensions.get("window").width / 60),
	},
	price: 1000,
};
