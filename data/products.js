import { Dimensions } from "react-native";

export const timerSkins = [
	{
		id: 1,
		name: "Purple World",
		source: require("../assets/lottie/CircleLines.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
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
		type: "break",
		price: 2500,
	},
	{
		id: 2,
		name: "The Minimalist",
		source: require("../assets/lottie/MinimalistCircleTimer.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 2.5,
			marginTop: Dimensions.get('window').height / 70
		},
		modalBackground: 'white',
		type: "Study",
		price: 1000,
	},
	{
		id: 3,
		name: "Loopy Cat",
		source: require("../assets/lottie/catLoader.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 2.5,
			position: "absolute",
			top: -10, //- (Dimensions.get("window").height / 81)
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 5,
			position: "absolute",
			left: Dimensions.get("window").width / 25,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 1.8,
		},
		type: "Study",
		price: 0,
	},
	{
		id: 4,
		name: "Planet Chill",
		source: require("../assets/lottie/chillGuyRed.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
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
	},
	{
		id: 5,
		name: "Disco Learner",
		source: require("../assets/lottie/DiscoLearner.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		type: "Study",
		price: 9500,
	},
	{
		id: 6,
		name: "Neon Ripple",
		source: require("../assets/lottie/NeonRipple.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		styleBuyModal: {
			width: Dimensions.get("window").width / 1.6,
		},
		type: "Study",
		price: 5000,
	},
	{
		id: 7,
		name: "Shadow Dreamer",
		source: require("../assets/lottie/ShadowDreamer.json"),
		styleTimerConfig: {
			height: Dimensions.get("window").height / 3.5,
			position: "absolute",
			top: 7, //- (Dimensions.get("window").height / 81)
			left: Dimensions.get("window").width / 19,
		},
		styleShopConfig: {
			height: Dimensions.get("window").width / 3,
			position: "absolute",
			left: Dimensions.get("window").width / 45,
		},
		modalBackground: 'white',
		type: "Study",
		price: 3000,
	},
];
