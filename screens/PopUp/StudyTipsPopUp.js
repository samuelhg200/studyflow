import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { Text, Layout, Divider } from "@ui-kitten/components";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";
import * as Animatable from "react-native-animatable";

import { studyTips } from "../../data/study-tips";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { colorTheme } from "../../data/products";

const StudyTipsPopUp = (props) => {
	const theme = useSelector((state) => state.theme.theme);
	const [currentTip, setCurrentTip] = useState(
		studyTips[Math.floor(Math.random() * studyTips.length)]
	);
	const textRef = useRef();
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)

	useEffect(() => {
		const timeout = setTimeout(() => {
			props.navigation.goBack();
		}, props.route.params.timeLeft * 1000);

		return () => clearTimeout(timeout);
	}, [props.route.params.timeLeft]);

	const updateTipToRandom = () => {
		setCurrentTip((prev) => {
			let newTip = studyTips[Math.floor(Math.random() * studyTips.length)];
			while (newTip === prev) {
				newTip = studyTips[Math.floor(Math.random() * studyTips.length)];
			}
			return newTip;
		});
		if (textRef.current) {
			textRef.current.fadeInUp(400);
		}
	};

	// useEffect(() => {
	// 	if (textRef.current){
	// 		textRef.current.fadeInUp(400)
	// 	}
	// }, [currentTip])

	return (
		<Layout style={styles.screen}>
			{theme === "dark" ? (
				<LottieView
					style={styles.meditationLottie}
					source={require("../../assets/lottie/catSleeping.json")}
					autoPlay={true}
					loop={true}
					speed={1}
				/>
			) : (
				<LottieView
					style={styles.meditationLottie}
					source={require("../../assets/lottie/catSleeping.json")}
					autoPlay={true}
					loop={true}
					speed={1}
				/>
			)}
			<View
				style={{
					marginHorizontal: Dimensions.get("window").width / 15,
				}}
			>
				<Animatable.Text
					animation="swing"
					easing="ease-out"
					iterationCount={1}
					ref={textRef}
					style={{
						fontSize: 21,
						color: theme === "dark" ? "white" : "black",
						fontFamily: "roboto-bold",
						textAlign: "center",
					}}
				>
					{studyTips[Math.floor(Math.random() * studyTips.length)]}
				</Animatable.Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "flex-start",
				}}
			>
				<Divider
					style={{
						backgroundColor:
							theme === "dark" ? "white" : colorTheme[colorThemeIndex].source["color-primary-500"],
						height: 1,
						width: Dimensions.get("window").width / 2,
						marginBottom: Dimensions.get("window").height / 20,
					}}
				/>
				<View
					style={{
						...styles.lightBulb,
						marginBottom: Dimensions.get("window").height / 20,
						backgroundColor: theme === 'dark' ? 'white' : colorTheme[colorThemeIndex].source['color-primary-500']
					}}
				>
					<TouchableWithoutFeedback onPress={updateTipToRandom}>
						<Ionicons
							name="bulb-outline"
							size={38}
							color={theme === 'dark' ? colorTheme[colorThemeIndex].source['color-primary-500'] : 'white'}
						/>
					</TouchableWithoutFeedback>
				</View>
				<Divider
					style={{
						backgroundColor:
							theme === "dark" ? "white" : colorTheme[colorThemeIndex].source["color-primary-500"],
						height: 1,
						width: Dimensions.get("window").width / 2,
						marginBottom: Dimensions.get("window").height / 20,
					}}
				/>
			</View>
		</Layout>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
	},
	meditationLottie: {
		height: Dimensions.get("window").width / 4,

		marginTop: 10,
	},
	lightBulb: {
		backgroundColor: "white",
		padding: 8,
		borderRadius: 60,
	},
});

export default StudyTipsPopUp;
