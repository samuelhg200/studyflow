import React, { useState, useEffect, useRef } from "react";
import {
	Platform,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	TouchableNativeFeedback,
	Alert,
	SafeAreaView,
	PixelRatio,
} from "react-native";
import {
	Text,
	Layout,
	Toggle,
	Divider,
	TopNavigation,
	TopNavigationAction,
} from "@ui-kitten/components";
//import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import LabelsList from "../../components/LabelsList";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import * as studyFlowActions from "../../store/actions/studyFlow";
import * as eventsActions from "../../store/actions/events";
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import LottieView from "lottie-react-native";
import BottomSheet from "reanimated-bottom-sheet";

import { convertActivityToTimeline } from "../../helpers/functions";
import HorizontalTimeline from "../../components/HorizontalTimeline";
import TagsView from "../../components/TagsView";
import { getStudyFlow, generateTimeline } from "../../helpers/functions";
import {
	getFormattedEventType,
	getIconStringBasedOnEventType,
	getFormattedActivityType,
} from "../../helpers/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { differenceInSeconds, differenceInMinutes } from "date-fns";
import Activity from "../../models/activity";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const getCurrentMiniSession = (activity) => {
	let timeAccumulated = 0;
	for (let i = 0; i < activity.miniSessions.length; i++) {
		if (
			activity.miniSessions[i].duration + timeAccumulated >
			Math.floor(activity.secondStamp / 60)
		) {
			return { ...activity.miniSessions[i], minuteStart: timeAccumulated };
		} else {
			timeAccumulated += activity.miniSessions[i].duration;
		}
	}
	return { type: "feedback", minuteStart: timeAccumulated };
};

//theming related stuff
const themeStylesLight = {
	divider: {
		backgroundColor: "#ddd",
		height: 1,
		alignSelf: "stretch",
	},
};

const themeStylesDark = {
	divider: {
		height: 0.5,
		alignSelf: "stretch",
		backgroundColor: CustomTheme["color-primary-800"],
	},
};

const TimerScreen = (props) => {
	const dispatch = useDispatch();
	//states
	const timeConfig = useSelector((state) => state.studyFlow.config);
	const theme = useSelector((state) => state.theme.theme);
	const events = useSelector((state) => state.events.events);
	const currentActivity = useSelector(
		(state) =>
			state.events.activities.filter(
				(activity) =>
					activity.eventId.toISOString() === props.route.params.eventId
			)[0]
	);
	const subjects = useSelector((state) => state.subject.subjects);

	const [currentEvent, setCurrentEvent] = useState(
		events.filter(
			(event) => event.id.toISOString() === props.route.params.eventId
		)[0]
	);
	const [showedSubjects, setshowedSubjects] = useState(currentEvent.subjects);
	const [selectedSubjects, setSelectedSubjects] = useState([]);
	const [showingAll, setShowingAll] = useState(false);
	const [timeline, setTimeline] = useState(null);
	const [blurBackground, setBlurBackground] = useState(true);
	const [miniSession, setMiniSession] = useState(null);

	
	//modal
	const renderContent = () => {
		const currentMiniSession = currentActivity
			? getCurrentMiniSession(currentActivity)
			: null;
		return (
			<Layout
				level="1"
				style={{
					padding: 10,
					height: Dimensions.get("window").height / 1.8 - 15,
					alignItems: "center",
					paddingTop: 15,
				}}
			>
				<Text
					category={"h6"}
					style={{ color: CustomTheme["color-primary-500"], fontSize: 22 }}
				>{`Block #${currentMiniSession ? currentMiniSession.id : "1"}`}</Text>
				{timeline && currentMiniSession && (
					<Text
						style={{
							color: CustomTheme["color-primary-500"],
							fontSize: 18,
							padding: 4,
						}}
					>{`${timeline[currentMiniSession.id - 1].time} - ${
						timeline[currentMiniSession.id].time
					}`}</Text>
				)}
				<Divider
					style={
						theme === "dark"
							? {
									...themeStylesDark.divider,
									marginTop: Dimensions.get("window").height / 50,
									backgroundColor: CustomTheme["color-primary-500"],
							  }
							: {
									...themeStylesLight.divider,
									marginTop: Dimensions.get("window").height / 80,
							  }
					}
				/>
				{currentActivity &&
					getCurrentMiniSession(currentActivity).type === "study" && (
						<View
							style={{
								width: "100%",
								marginVertical: Dimensions.get("window").height / 60,
								alignItems: "flex-start",
							}}
						>
							{/* <View style={{...styles.subjectTitleContainer, borderColor: theme === 'dark' ? 'white' :'black'}}><Text style={{...styles.subTitle, color: theme === 'dark' ? 'white' : 'black'}}>#1 Study Interval subject</Text></View> */}
							<View
								style={{
									width: "100%",
									alignItems: "center",
									justifyContent: "center",
									opacity: 0.7,
								}}
							>
								<Text
									style={{
										color:
											theme === "dark"
												? "white"
												: CustomTheme["color-primary-700"],
										fontSize: 14.5,
									}}
								>{`Choose subject you will be working on`}</Text>
							</View>
							<TagsView
								all={showedSubjects}
								selected={selectedSubjects}
								setSelectedItems={setSelectedSubjects}
								isExclusive={true}
								onPressAdd={() => {
									props.navigation.navigate("Subjects");
								}}
								showAllMode={true}
								onPressShowAll={onPressShowAll}
								showingAll={showingAll}
								hideAddSubject={true}
							/>
						</View>
					)}
			</Layout>
		);
	};

	const sheetRef = useRef(null);

	//Timer related stuff
	const appState = useRef(AppState.currentState);
	const [elapsed, setElapsed] = useState(0);
	const [countdown, setCountdown] = useState(0);


	const getElapsedTime = async () => {
		try {
			const startTime = await AsyncStorage.getItem("@start_time");
			const now = new Date();
			return differenceInSeconds(now, Date.parse(startTime));
		} catch (err) {
			// TODO: handle errors from setItem properly
			console.warn(err);
		}
	};

	const handleAppStateChange = async (nextAppState) => {
		if (
			appState.current.match(/inactive|background/) &&
			nextAppState === "active"
		) {
			// We just became active again: recalculate elapsed time based
			// on what we stored in AsyncStorage when we started.
			const elapsed = await getElapsedTime();
			// Update the elapsed seconds state
			setElapsed(elapsed);
		}
		appState.current = nextAppState;

		reEvalutateAll();
	};

	function reEvalutateAll() {
		//re evaluate after app revisit
		let timeline = generateTimeline(
			getStudyFlow(currentEvent, timeConfig.studyTime, timeConfig.breakTime),
			timeConfig.studyTime,
			timeConfig.breakTime,
			currentEvent.date
		);
		const miniSessions = timeline.map((miniSession, index) => {
			if (miniSession.eventType !== "feedback") {
				return {
					id: index + 1,
					type: miniSession.eventType,
					duration: miniSession.duration,
				};
			}
		});
		const cleanMiniSessions = miniSessions.filter(
			(session) => session !== undefined
		);

		const getTime = async () => {
			const startTime = await AsyncStorage.getItem("@start_time");
			return startTime;
		};
		const doAll = async () => {
			const time = await getTime();
			const elapsed = await getElapsedTime();
			const activityToUpdate = new Activity(
				currentEvent.id,
				time,
				elapsed,
				cleanMiniSessions
			);
			dispatch(eventsActions.updateActivity(activityToUpdate));
			setTimeline(convertActivityToTimeline(activityToUpdate));
		};
		doAll();
	}

	useEffect(() => {
		if (selectedSubjects.length > 0) {
			
				sheetRef.current.snapTo(2);
				if (blurBackground) {
					setBlurBackground(false);
				}
			
		}
	}, [selectedSubjects]);
	
	

	// every ten seconds update current mini session
	useEffect(() => {
		const updateCurrentMiniSession = () => {
			if (currentActivity) {
				const temp = getCurrentMiniSession(currentActivity);
				//console.log(temp)
				if (!miniSession) {
					setMiniSession(temp);
				} else if (miniSession.id !== temp.id) {
					setMiniSession(temp);
				}
			}
		};
		updateCurrentMiniSession();
	}, [currentActivity]);

	useEffect(() => {
		if (sheetRef.current?.contentPosition === 2) {
			if (blurBackground) {
				setBlurBackground(false);
			}
		}
	}, [sheetRef.current?.contentPosition]);

	useEffect(() => {
		reEvalutateAll();
		if (selectedSubjects.length === 0) {
			sheetRef.current.snapTo(0);
			setBlurBackground(true)
		}
		//listen to when app is left
		AppState.addEventListener("change", handleAppStateChange);
		return () => AppState.removeEventListener("change", handleAppStateChange);
	}, []);

	useEffect(() => {
		//update activity state every 10 seconds
		const interval = setInterval(() => {
			reEvalutateAll();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	// let elapsedTime = getElapsedTime()
	// console.log(elapsed)

	useEffect(() => {
		if (currentActivity) {
			//get current minisession
			const currentMiniSession = getCurrentMiniSession(currentActivity);
			//countdown
			const timeRemaining =
				currentMiniSession.minuteStart * 60 +
				currentMiniSession.duration * 60 -
				currentActivity.secondStamp;
			setCountdown(timeRemaining);

			let interval = setInterval(() => {
				setCountdown((prev) => {
					if (prev > 1) {
						return prev - 1;
					} else {
						reEvalutateAll();
					}
				});
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [elapsed, currentActivity]);

	

	const onPressShowAll = () => {
		if (showingAll) {
			setshowedSubjects(currentEvent.subjects);
			setShowingAll(false);
		} else {
			setshowedSubjects(subjects);
			setShowingAll(true);
		}
	};

	// const studyTimeRepresentation = moment(
	// 	new Date(0, 0, 0, 0, timeConfig.studyTime, 0)
	// ).format("HH:mm");
	// const breakTimeRepresentation = moment(
	// 	new Date(0, 0, 0, 0, timeConfig.breakTime, 0)
	// ).format("HH:mm");

	// const handleStudyFlowPress = () => {
	// 	props.navigation.navigate("EditStudyFlow");
	// };

	

	//console.log(getCurrentMiniSession(currentActivity))
	//console.log(currentActivity)
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<TopNavigation
				alignment="center"
				title={() => (
					<View
						style={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "center",
							right: 6,
							flex: 1,
						}}
					>
						{/* <Ionicons
								name={getIconStringBasedOnEventType(currentEvent.type)}
								size={30}
								color={CustomTheme['color-primary-500']}
							/> */}
						<Text
							style={{
								...styles.title,
								color: CustomTheme["color-primary-500"],
							}}
						>
							{" "}
							{currentActivity
								? getFormattedActivityType(
										getCurrentMiniSession(currentActivity).type
								  )
								: getFormattedEventType(currentEvent.type)}
						</Text>
					</View>
				)}
				accessoryLeft={() => {
					return (
						<TouchableCmp
							style={{ padding: 2, paddingHorizontal: 10  }}
							onPress={() => {
								Alert.alert("Are you sure you want to leave?", "", [
									{
										text: "Leave",
										onPress: () => {
											props.navigation.goBack();
										},
									},
									{ text: "Stay" },
								]);
							}}
							
						>
							<Ionicons
								name="close-circle"
								color={
									theme === "dark"
										? CustomTheme["color-primary-500"]
										: CustomTheme["color-primary-500"]
								}
								size={32}
							/>
						</TouchableCmp>
					);
				}}
				accessoryRight={() =>
					miniSession && miniSession.type === "break" ? (
						<TouchableCmp
							style={{ paddingHorizontal: 4 }}
							onPress={() => {
								const currentMiniSession =
									getCurrentMiniSession(currentActivity);
								//countdown
								const timeRemaining =
									currentMiniSession.minuteStart * 60 +
									currentMiniSession.duration * 60 -
									currentActivity.secondStamp;
								props.navigation.navigate("Meditation", {
									timeLeft: timeRemaining,
								});
							}}
						>
							<Ionicons
								name="pulse"
								color={
									theme === "dark"
										? CustomTheme["color-primary-500"]
										: CustomTheme["color-primary-500"]
								}
								size={32}
							/>
						</TouchableCmp>
					) : (
						<View></View>
					)
				}
			/>

			<Layout style={{ flex: 1 }} level="2">
				<TouchableWithoutFeedback
					disabled={!blurBackground}
					style={{ flex: 1 }}
					onPress={() => {
						sheetRef.current.snapTo(2);
						if (blurBackground) {
							setBlurBackground(false);
						}
					}}
				>
					<View
						style={{
							alignItems: "flex-end",
							justifyContent: "center",
							alignItems: "center",
							padding: 30,
							flexDirection: "row",
							marginLeft: 10,
							opacity: blurBackground ? 0.1 : 1,
							height: Dimensions.get("window").height / 3,
						}}
					>
						{miniSession && miniSession.type === "study" && (
							<LottieView
								style={styles.catLoaderLottie}
								source={require("../../assets/lottie/catLoader.json")}
								autoPlay={true}
								loop={true}
								speed={0.5}
							/>
						)}
						{miniSession && miniSession.type === "break" && (
							<LottieView
								style={styles.coffeeLottie}
								source={require("../../assets/lottie/chillGuyRed.json")}
								autoPlay={true}
								loop={true}
								speed={0.5}
							/>
						)}
						<View style={{ flexDirection: "row", alignItems: "center" }}>
							<Text
								style={{
									...styles.countdownNumber,

									color:
										theme === "dark"
											? "white"
											: CustomTheme["color-primary-500"],
								}}
							>
								{moment(
									new Date(0, 0, 0, 0, Math.floor(countdown / 60))
								).format("mm")}
							</Text>

							<Text
								style={{
									...styles.countdownNumber,
									fontSize: 15,
									paddingBottom: Dimensions.get("window").height / 100,
									opacity: 0.5,
									color:
										theme === "dark"
											? "white"
											: CustomTheme["color-primary-500"],
								}}
							>
								{moment(
									new Date(0, 0, 0, 0, 0, Math.floor(countdown % 60))
								).format("ss")}
							</Text>
						</View>
					</View>
					<Divider
							style={
								theme === "dark"
									? {
											...themeStylesDark.divider,
											marginTop: Dimensions.get("window").height / 50,
									  }
									: {
											...themeStylesLight.divider,
											marginTop: Dimensions.get("window").height / 80,
									  }
							}
						/>
						<HorizontalTimeline
							eventId={props.route.params.eventId}
							miniSessionId={
								currentActivity
									? getCurrentMiniSession(currentActivity).id
									: null
							}
						/>

						<Divider
							style={
								theme === "dark"
									? themeStylesDark.divider
									: themeStylesLight.divider
							}
						/>
					<ScrollView
						contentContainerStyle={styles.screen}
						style={{ opacity: blurBackground ? 0.1 : 1 }}
					>
						{/* <View style={{ width: "100%", paddingLeft: 10, paddingTop: 6 }}>
							<Ionicons
							name="close-circle"
							color={CustomTheme["color-primary-500"]}
							size={32}
						/>
						</View> */}
						{/* <View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "center",
								right: 6,
								marginTop: 5,
							}}
						>
							<Ionicons
								name={getIconStringBasedOnEventType(currentEvent.type)}
								size={30}
								color={CustomTheme["color-primary-500"]}
							/>
							<Text
								style={{
									...styles.title,
									color:
										theme === "dark"
											? "white"
											: CustomTheme["color-primary-500"],
								}}
							>
								{" "}
								{getFormattedEventType(currentEvent.type)}
							</Text>
						</View> */}
						
						{currentActivity && getCurrentMiniSession(currentActivity).type === "study" && (
							<TouchableCmp
								style={{ width: "100%" }}
								onPress={() => {
									if (sheetRef.current) {
										setBlurBackground(true)
										sheetRef.current.snapTo(0);
									}
								}}
							>
								<View
									style={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
										width: "100%",
										paddingHorizontal: Dimensions.get("window").width / 30,
										paddingVertical: Dimensions.get("window").height / 40,
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Ionicons
											name="library-outline"
											color={
												selectedSubjects[0]?.color
													? selectedSubjects[0].color
													: theme === "dark"
													? "white"
													: CustomTheme["color-primary-400"]
											}
											size={Dimensions.get("window").width / 11.5}
										/>
										<View
											style={{
												backgroundColor: selectedSubjects[0]?.color
													? selectedSubjects[0].color
													: theme === "dark"
													? "white"
													: CustomTheme["color-primary-400"],
												padding: 4,
												borderRadius: 10,
												marginLeft: Dimensions.get("window").width / 50,
											}}
										>
											<Text
												style={{
													fontFamily: "yellow-tail",
													paddingHorizontal: 6,
													paddingRight: 10,
													fontSize: 24,
													textAlign: 'center',
													color: selectedSubjects[0]?.color
													? 'white'
													: theme === "dark"
													? CustomTheme['color-primary-500']
													: 'white',
												}}
											>
												{selectedSubjects[0]
													? selectedSubjects[0].title
													: "Press to select subject"}
											</Text>
										</View>
									</View>
									<Ionicons
										name="chevron-forward-circle-outline"
										color={
											selectedSubjects.length === 0
												? theme === "dark"
													? CustomTheme["color-primary-500"]
													: CustomTheme["color-primary-400"]
												: theme === "dark"
												? "white"
												: CustomTheme["color-primary-400"]
										}
										size={Dimensions.get("window").width / 12}
									/>
								</View>
							</TouchableCmp>
						)}
						<Divider
							style={
								theme === "dark"
									? themeStylesDark.divider
									: themeStylesLight.divider
							}
						/>
						{/* <View style={styles.timeConfigContainer}>
							<TouchableCmp
								onPress={handleStudyFlowPress}
								style={{ ...styles.iconContainer }}
							>
								<Ionicons
									name="glasses-outline"
									color={theme === "dark" ? "white" : "black"}
									size={28}
								/>
								<Text
									style={{
										fontSize: 22,
										color: theme === "dark" ? "white" : "black",
									}}
								>
									{" "}
									{studyTimeRepresentation}{" "}
								</Text>
							</TouchableCmp>
							<TouchableCmp
								onPress={handleStudyFlowPress}
								style={{ ...styles.iconContainer }}
							>
								<Ionicons
									name="cafe-outline"
									color={theme === "dark" ? "white" : "black"}
									style={{ fontSize: 22 }}
								>
									{" "}
									{breakTimeRepresentation}{" "}
								</Ionicons>
							</TouchableCmp>
							<TouchableCmp
								onPress={handleStudyFlowPress}
								style={{
									...styles.iconContainer,
									backgroundColor: CustomTheme["color-primary-500"],
								}}
							>
								<Text
									style={{
										fontSize: 18,
										paddingHorizontal: 12,
										color: "white",
									}}
								>
									Edit
								</Text>
							</TouchableCmp>
						</View> */}

						<Divider
							style={
								theme === "dark"
									? themeStylesDark.divider
									: themeStylesLight.divider
							}
						/>
						{/* <View
						style={{
							...styles.shadow,
							shadowColor:
								theme === "dark" ? CustomTheme["color-primary-600"] : "#bbb",
							flex: 1,
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<TouchableCmp
							style={{
								padding: 5,
								borderRadius: 10,
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: CustomTheme["color-primary-500"],
								marginVertical: Dimensions.get("window").height / 40,
							}}
						>
							<Text
								style={{
									fontSize: 26,
									paddingHorizontal: 12,
									paddingVertical: 3,
									color: "white",
								}}
							>
								Pause {""}
							</Text>
						</TouchableCmp>
					</View> */}
					</ScrollView>
				</TouchableWithoutFeedback>
				
					<BottomSheet
						ref={sheetRef}
						style={{ overflow: "hidden" }}
						snapPoints={[
							Dimensions.get("window").height / 1.8,
							Dimensions.get("window").height / 2.5,
							0,
						]}
						borderRadius={20}
						initialSnap={2}
						renderContent={renderContent}
						onCloseStart={() => {
							
								if (blurBackground) {
									setBlurBackground(false);
								}
							
						}}
						onCloseEnd={() => {
							
								if (blurBackground) {
									setBlurBackground(false);
								}
						
						}}
						renderHeader={() => {
							return (
								<View
									style={{ width: "100%", alignItems: "center", padding: 5 }}
								>
									<View
										style={{
											backgroundColor:
												theme === "dark"
													? "white"
													: CustomTheme["color-primary-500"],
											width: 50,
											height: 4,
											borderRadius: 5,
										}}
									></View>
								</View>
							);
						}}
					/>
				
			</Layout>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	timeConfigContainer: {
		flexDirection: "row",
		height: Dimensions.get("window").height / 11,
		width: "85%",
		alignItems: "center",
		justifyContent: "space-between",
	},
	iconContainer: {
		padding: 5,
		borderRadius: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 32,
		fontFamily: "yellow-tail",
		paddingRight: 4,
		alignItems: "center",
	},
	subjectTitleContainer: {
		width: "100%",
	},
	subTitle: {
		fontSize: 26,
		fontFamily: "yellow-tail",
		paddingRight: 10,
		alignItems: "center",
	},
	shadow: {
		shadowColor: "#bbb",
		shadowOffset: { width: 1, height: 0 },
		shadowOpacity: 5,
		shadowRadius: 15,
		elevation: 4,
	},
	countdownNumber: {
		fontSize: 45,
		fontFamily: "roboto-bold",
	},
	catLoaderLottie: {
		height: Dimensions.get("window").height / 2.5,
		position: "absolute",
		top: -10, //- (Dimensions.get("window").height / 81)
	},
	coffeeLottie: {
		height: Dimensions.get("window").height / 3.5,
		position: "absolute",
		top: 7, //- (Dimensions.get("window").height / 81)
		left: 20,
	},
	timerBackground: {
		backgroundColor: "black",
		padding: 15,
		borderRadius: 40,
	},
});

export default TimerScreen;
