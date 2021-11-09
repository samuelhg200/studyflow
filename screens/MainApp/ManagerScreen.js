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
	SafeAreaView,
	Dimensions,
} from "react-native";
import {
	Card,
	Text,
	Input,
	Divider,
	Button,
	Layout,
	TopNavigation,
	TopNavigationAction,
	Toggle,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import * as studyFlowActions from "../../store/actions/studyFlow";
import * as themeActions from "../../store/actions/theme";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const ManagerScreen = (props) => {
	//REDUX
	const subjects = useSelector((state) => state.subject.subjects);
	const theme = useSelector((state) => state.theme.theme);
	const timeConfig = useSelector((state) => state.studyFlow.config);

	const studyTimeRepresentation = moment(
		new Date(0, 0, 0, 0, timeConfig.studyTime, 0)
	).format("HH:mm");
	const breakTimeRepresentation = moment(
		new Date(0, 0, 0, 0, timeConfig.breakTime, 0)
	).format("HH:mm");

	//Change from dark theme to light and viceversa
	const dispatch2 = useDispatch();
	const onToggleTheme = () => {
		dispatch2(themeActions.toggleTheme());
	};

	//Handle Click on Subjects Module
	const onClickSubjects = () => {
		props.navigation.navigate("Subjects");
	};

	//styling responsible for choosing the color of the modules depending on the theme
	const colorsModule = {
		backgroundColor:
			theme === "dark"
				? CustomTheme["color-primary-600"]
				: CustomTheme["color-primary-100"],
		borderColor: theme === "dark" ? "white" : CustomTheme["color-primary-600"],
		shadowColor: theme === "dark" ? CustomTheme["color-primary-600"] : "#bbb",
	};

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation
					//style={{flex: 1}}
					alignment="center"
					title={() => (
						<Text
							style={{
								fontFamily: "yellow-tail",
								fontSize: 32,
								color: CustomTheme["color-primary-500"],
								flex: 1,
								paddingHorizontal: 2,
							}}
						>
							Manager
						</Text>
					)}
					//subtitle='Enhance your learning'
					// accessoryLeft={renderBackAction}
					// accessoryRight={renderRightActions}
				/>
				<Layout level={"2"} style={styles.screen}>
					<TouchableCmp
						style={{ ...colorsModule, ...styles.module }}
						onPress={onClickSubjects}
					><View style={Platform.OS === 'android' ? {flexDirection: 'row', ...colorsModule, ...styles.module} : {flexDirection: 'row'}}>
						
						<View
							style={{
								...styles.leftColumn,
								borderColor:
									theme === "dark" ? "white" : CustomTheme["color-primary-500"],
							}}
						>
							<Text
								style={{
									...styles.title,
									color:
										theme === "dark"
											? "white"
											: CustomTheme["color-primary-500"],
								}}
							>
								Subjects
							</Text>
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
								padding: 14,
							}}
						>
							{subjects.length > 0 ? (
								// 	<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
								// 	<Text style={{fontFamily: 'yellow-tail', fontSize: 110, color: theme === 'dark' ? 'white' : CustomTheme['color-primary-500'], textAlign: 'center', paddingHorizontal: 22}}>{subjects.length}</Text>
								// </View>
								subjects.slice(0, 6).map((subject) => {
									return (
										<View
											key={subject.id}
											style={{
												padding: 3,
												margin: 2,
												//backgroundColor: 'black',
												borderRadius: 10,
												alignContent: "center",
												alignItems: "center",
												backgroundColor:
													theme === "dark"
														? "#224"
														: CustomTheme["color-primary-200"],
												borderRightWidth: 5,
												borderLeftWidth: 5,
												// borderTopWidth:1,
												// borderBottomWidth: 1,
												borderColor: subject.color,
											}}
										>
											<Text style={{...styles.subjectText, color: theme === 'dark' ? 'white' : CustomTheme['color-primary-700']}}>{subject.title}</Text>
										</View>
									);
								})
							) : (
								<View
									style={{
										flex: 1,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text
										style={{
											fontFamily: "yellow-tail",
											fontSize: 26,
											color: "white",
											textAlign: "center",
											paddingHorizontal: 4,
										}}
									>
										Click to start adding your subjects!
									</Text>
								</View>
							)}
						</View>
					</View></TouchableCmp>
					<TouchableCmp
						onPress={() => {
							props.navigation.navigate("EditStudyFlow");
						}}
						style={{ ...styles.modulePomodoro, ...colorsModule }}
					>
						<View style={{}}>
							<View style={{ alignItems: "center" }}>
								<Text
									style={{
										...styles.title,
										color:
											theme === "dark"
												? "white"
												: CustomTheme["color-primary-500"],
									}}
								>
									StudyFlow
								</Text>
								<Divider
									style={{
										alignSelf: "stretch",
										backgroundColor:
											theme === "dark"
												? "white"
												: CustomTheme["color-primary-600"],
										margin: 5,
										marginBottom: 20,
									}}
								/>
								<View
									style={{
										height: 55,
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Ionicons
										name="glasses-outline"
										color={theme === "dark" ? "white" : CustomTheme['color-primary-500']}
										size={18}
									>
										{" "}
										{studyTimeRepresentation}
									</Ionicons>
									<Ionicons
										name="cafe-outline"
										size={18}
										color={theme === "dark" ? "white" : CustomTheme['color-primary-500']}
									>
										{" "}
										{breakTimeRepresentation}
									</Ionicons>
								</View>
								<LottieView
									style={styles.settingsAnimation}
									source={require("../../assets/lottie/handPressing.json")}
									autoPlay={true}
									loop={true}
									speed={1}
									resizeMode="contain"
								/>
							</View>
						</View>
					</TouchableCmp>
					<View style={{ ...styles.modulePomodoro, ...colorsModule }}>
						<View style={{}}>
							<View style={{ alignItems: "center" }}>
								<Text
									style={{
										...styles.title,
										color:
											theme === "dark"
												? "white"
												: CustomTheme["color-primary-500"],
									}}
								>
									Dark Theme
								</Text>
								<Divider
									style={{
										alignSelf: "stretch",
										backgroundColor:
											theme === "dark"
												? "white"
												: CustomTheme["color-primary-600"],
										margin: 5,
										marginBottom: 15,
									}}
								/>

								<Toggle
									checked={theme === "dark"}
									onChange={onToggleTheme}
									style={styles.checkbox}
								></Toggle>
							</View>
						</View>
					</View>
				</Layout>
			</SafeAreaView>
		</Layout>
	);
};

export default ManagerScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		flexWrap: "wrap",
		alignItems: "flex-start",
		justifyContent: "space-between",
		padding: 25,
		flexDirection: "row",
	},
	subjectText: {
		fontSize: 16,
		color: "white",
		fontFamily: "yellow-tail",
		paddingHorizontal: 2,
		alignItems: 'center',
		justifyContent: 'center'
	},
	module: {
		flexDirection: "row",
		padding: 10,
		borderRadius: 24,
		width: "100%",
		//shadowColor: CustomTheme["color-primary-600"],
		shadowOffset: { width: 2, height: 0 },
		shadowOpacity: 8,
		shadowRadius: 5,
		elevation: 4,
		padding: 6,
		borderLeftWidth: 5,
		marginBottom: 25,
	},
	modulePomodoro: {
		borderRadius: 24,
		width: "47%",
		height: 145,
		shadowColor: "#bbb",
		shadowOffset: { width: 2, height: 0 },
		shadowOpacity: 8,
		shadowRadius: 5,
		elevation: 4,
		padding: 6,
		backgroundColor: CustomTheme["color-primary-200"],
		borderColor: CustomTheme["color-primary-600"],
		borderLeftWidth: 3,
		borderRightWidth: 3,
		marginBottom: 25,
	},
	title: {
		fontFamily: "roboto-bold",
		fontSize: 20,
		color: CustomTheme["color-primary-600"],
	},
	leftColumn: {
		flex: 0.9,
		padding: 8,
		justifyContent: "space-around",
		alignItems: "flex-start",
		borderRightWidth: 1,
		borderColor: CustomTheme["color-primary-600"],
	},
	booksAnimation: {
		width: "100%",
		right: 4,
		top: 1,
	},
	settingsAnimation: {
		width: 110,
		position: "absolute",
		top: 19,
	},
	checkbox: {
		padding: 10,
	},
});
