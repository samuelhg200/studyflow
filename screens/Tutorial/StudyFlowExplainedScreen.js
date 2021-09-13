import React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { Layout, Text, Button } from "@ui-kitten/components";
import { useDispatch } from "react-redux";

import LottieView from "lottie-react-native";
import * as tutorialActions from '../../store/actions/tutorial'

const StudyFlowExplainedScreen = (props) => {
	const dispatch = useDispatch();

	return (
		<Layout style={styles.screen}>
			<SafeAreaView />
			<LottieView
				style={styles.rocketLottie}
				source={require("../../assets/lottie/rocket.json")}
				autoPlay
				
			/>
			<Text category="h5" style={styles.title}>The Flowtime Technique</Text>
			<Layout style={styles.textContainer}>
				<Text style={styles.paragraph}>
					At StudyFlow we have adopted the flowtime technique. An improved
					version of the widely adopted Pomodoro technique.
				</Text>
				<Text style={styles.paragraph}>
					During a StudyFLow you will have a series of small study sessions,
					each of these sessions will consist of a studying period, followed
					by a relax/break period.
				</Text>
				<Text style={styles.paragraph}>
					You will be able to choose the length and frequency of these sessions. We will
					quickly ask for your feedback after a StudyFlow and adapt
					your future sessions to help you remain focused and engaged.
				</Text>
			</Layout>
			<Button
				style={{ marginTop: 80 }}
				size="giant"
				onPress={() => {
					dispatch(tutorialActions.completeTutorial())
				}}
			>
				Start StudyFlow {">"}
			</Button>
		</Layout>
	);
};

export default StudyFlowExplainedScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		marginBottom: 50,
	},
	textContainer: {
		width: '95%'
	},
	paragraph: {
		fontSize: 17,
		padding: 10,
		textAlign: 'justify'
	},
	rocketLottie: {
		width: '25%'
	}

});
