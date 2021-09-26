import React from "react";
import { StyleSheet, View, SafeAreaView, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";

const WelcomeScreen = (props) => {

	return (
		<Layout style={styles.screen} level="1">
			<SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start'  }}>
				<View style={styles.contentContainer}>
					<Text style={styles.title} category="h4">
						Welcome to StudyFlow
					</Text>

					<Layout
						level="4"
						style={{
							padding: 5,
							borderRadius: 4,
							backgroundColor: CustomTheme["color-primary-200"],
						}}
					>
						<Text style={{ fontSize: 16, color: "black" }}>
							{"- "}Boosting your learning{" -"}
						</Text>
					</Layout>
					<LottieView
						style={styles.guyStudyingLottie}
						source={require("../../assets/lottie/guyFlies.json")}
						autoPlay
						speed={0.7}
					/>
				</View>
				<Button
					style={{ width: '50%'}}
					size="giant"
					onPress={() => props.navigation.navigate("Improvement")}
				>
					Start journey {">"}
				</Button>
				{/* <LottieView
				style={styles.guyStudyingLottie}
				source={require("../../assets/lottie/guyFlies.json")}
				autoPlay
				speed={1}
			/> */}
			</SafeAreaView>
		</Layout>
	);
};

export default WelcomeScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	title: {
		marginBottom: 20,
		marginTop: 60,
		textAlign: "center",
		fontFamily: "yellow-tail",
		fontSize: 35,
		paddingHorizontal: 2,
	},
	contentContainer: {
		justifyContent: "flex-start",
		alignItems: "center",
	},
	guyStudyingLottie: {
		width: Dimensions.get("window").height > 728 ? "95%" : "85%",
		right: 1,
		marginTop: Dimensions.get("window").height > 728 ? 15 : 10,
		marginBottom: Dimensions.get("window").height > 728 ? 85 : 50,
	},
});
