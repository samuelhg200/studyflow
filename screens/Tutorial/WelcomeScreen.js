import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import CustomTheme from '../../assets/UIkitten/custom-theme.json';


const WelcomeScreen = (props) => {
	return (
		<Layout style={styles.screen} level="1">
			<SafeAreaView />

			<View style={styles.contentContainer}>
				<Text style={styles.title} category="h4">
					Welcome to StudyFlow
				</Text>

				<Layout level="4" style={{ padding: 5, borderRadius: 4, backgroundColor:CustomTheme['color-primary-200'] }}>
					<Text style={{ fontSize: 16, color:'black' }}>
						#Lets start by customizing your experience!
					</Text>
				</Layout>
				<Button
					style={{ marginTop: 150, marginBottom: 65 }}
					size="giant"
					onPress={() => props.navigation.navigate("Improvement")}
				>
					Start journey {">"}
				</Button>
			</View>

			<LottieView
				style={styles.guyStudyingLottie}
				source={require("../../assets/lottie/GuyStudyingLowRes.json")}
				autoPlay
				speed={1}
			/>
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
		marginTop: 65,
        textAlign: 'center'
	},
	contentContainer: {
		justifyContent: "flex-start",
		alignItems: "center",
	},
	guyStudyingLottie: {
		width: "95%",
	},
});
