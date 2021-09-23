import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
	Image,
	Platform,
} from "react-native";
import {
	Card,
	Text,
	Input,
	Divider,
	Button,
	Layout,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import { LinearGradient } from "expo-linear-gradient";

const ManagerScreen = () => {
	const subjects = useSelector((state) => state.subject.subjects);
	return (
		<Layout level={"2"} style={styles.screen}>
			<View style={styles.module}>
				<View style={styles.leftColumn}>
					<Text style={styles.title}>Subjects</Text>
					<LottieView
						style={styles.booksAnimation}
						source={require("../../assets/lottie/bookAnimationRed.json")}
						autoPlay={true}
						loop={true}
						speed={1}
					/>
				</View>
				<View
					style={{
						//flexDirection: "row",
						//flexWrap: "wrap",
						margin: 1,
						flex: 1,
						padding: 6,
					}}
				>
					{subjects ? (
						subjects.slice(0, 6).map((subject) => {
							return (
								<View
									key={subject.id}
									style={{
										padding: 4,
										margin: 2,
										backgroundColor: subject.color,
										borderRadius: 6,
										alignContent: "center",
										alignItems: "center",
										borderLeftWidth: 3,
										borderRightWidth: 3,
										borderColor: "white",
									}}
								>
									<Text style={styles.subjectText}>{subject.title}</Text>
								</View>
							);
						})
					) : (
						<View style={{ flex: 1 }}>
							<Text style={{ fontSize: 22, color: "white" }}>
								Click to start adding your subjects!
							</Text>
						</View>
					)}
				</View>
			</View>
			<View style={styles.modulePomodoro}>
				<View>
					<View>
						<Text style={styles.title}>Pomodoro</Text>
						{/* <LottieView
							style={styles.booksAnimation}
							source={require("../../assets/lottie/bookAnimationRed.json")}
							autoPlay={true}
							loop={true}
							speed={1}
						/> */}
					</View>
                    <View>
                    <Text style={{ fontSize: 22, color: "white" }}>
								Click to start adding your subjects!
							</Text>
                    </View>
				</View>
			</View>
		</Layout>
	);
};

export default ManagerScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		padding: 25,
	},
	subjectText: {
		fontSize: 14,
		color: "white",
		fontFamily: "roboto",
	},
	module: {
		flexDirection: "row",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		shadowColor: "#bbb",
		shadowOffset: { width: 3, height: 4 },
		shadowOpacity: 8,
		shadowRadius: 5,
		elevation: 4,
		padding: 6,
		backgroundColor: CustomTheme["color-primary-200"],
		borderColor: CustomTheme["color-primary-600"],
		borderLeftWidth: 10,
		marginBottom: 25,
        
	},
    modulePomodoro: {
		padding: 20,
		borderRadius: 10,
		width: "50%",
		shadowColor: "#bbb",
		shadowOffset: { width: 3, height: 4 },
		shadowOpacity: 8,
		shadowRadius: 5,
		elevation: 4,
		padding: 6,
		backgroundColor: CustomTheme["color-primary-200"],
		borderColor: CustomTheme["color-primary-600"],
		borderTopWidth: 10,
		marginBottom: 25,
	},
	title: {
		fontFamily: "roboto-bold",
		fontSize: 26,
		color: CustomTheme["color-primary-600"],
	},
	leftColumn: {
		flex: 0.8,
		padding: 10,
		justifyContent: "space-between",
		alignItems: "flex-start",
		borderRightWidth: 1,
		borderColor: CustomTheme["color-primary-600"],
	},
	booksAnimation: {
		width: "85%",
	},
});
