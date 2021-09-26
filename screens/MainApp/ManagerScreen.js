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
	Toggle
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import * as studyFlowActions from '../../store/actions/studyFlow'
import * as themeActions from '../../store/actions/theme'

let TouchableCmp = TouchableOpacity;
if (Platform.OS === 'android'){
	TouchableCmp = TouchableNativeFeedback;
}

const ManagerScreen = props => {
	//REDUX
	const subjects = useSelector((state) => state.subject.subjects);
	const theme = useSelector((state) => state.theme.theme);
	const studyFlowActive = useSelector(state => state.studyFlow.active)

	//Activate or deactivate studyflow mode 
	//This disables the preview button on the event cards for example
	const dispatch = useDispatch()
	const onToggleStudyFLow = () => {
		dispatch(studyFlowActions.toggleStudyFlow())
	}

	//Change from dark theme to light and viceversa
	const dispatch2 = useDispatch()
	const onToggleTheme = () => {
		dispatch2(themeActions.toggleTheme())
	}

	//Handle Click on Subjects Module
	const onClickSubjects = () => {
		props.navigation.navigate('Subjects');
	}

	//styling responsible for choosing the color of the modules depending on the theme
	const colorsModule = {
		backgroundColor:
			theme === "dark"
				? CustomTheme["color-primary-600"]
				: CustomTheme["color-primary-200"],
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
					<TouchableCmp style={{ ...colorsModule, ...styles.module }} onPress={onClickSubjects}>
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
							{subjects ? (
								subjects.slice(0, 6).map((subject) => {
									return (
										<View
											key={subject.id}
											style={{
												padding: 3,
												margin: 2,
												backgroundColor: subject.color,
												borderRadius: 12,
												alignContent: "center",
												alignItems: "center",
												borderRightWidth: 3,
												borderLeftWidth: 3,
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
					</TouchableCmp>
					<View style={{ ...styles.modulePomodoro, ...colorsModule }}>
						<View style={{}}>
							<View style={{alignItems: 'center'}}>
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
								<Divider style={{ alignSelf: "stretch", backgroundColor: theme === 'dark' ? 'white' : CustomTheme['color-primary-600'], margin: 5, marginBottom: 15 }} />
								<Toggle checked={studyFlowActive} onChange={onToggleStudyFLow} style={styles.checkbox}>
								</Toggle>
							</View>
						</View>
					</View>
					<View style={{ ...styles.modulePomodoro, ...colorsModule }}>
						<View style={{}}>
							<View style={{alignItems: 'center'}}>
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
								<Divider style={{ alignSelf: "stretch", backgroundColor: theme === 'dark' ? 'white' : CustomTheme['color-primary-600'], margin: 5, marginBottom: 15 }} />
								<Toggle checked={theme === 'dark'} onChange={onToggleTheme} style={styles.checkbox}>
					
								</Toggle>
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
		flexWrap:"wrap",
		alignItems: "flex-start",
		justifyContent: "space-between",
		padding: 25,
		flexDirection: "row",
	},
	subjectText: {
		fontSize: 14,
		color: "white",
		fontFamily: "roboto",
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
		padding: 10,
		borderRadius: 24,
		width: "47%",
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
		fontSize: 22,
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
	checkbox: {
		padding: 10,
		
	}
});
