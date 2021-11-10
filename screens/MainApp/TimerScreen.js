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
} from "react-native";
import { Text, Layout, Divider, TopNavigation } from "@ui-kitten/components";
import LabelsList from "../../components/LabelsList";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { colorTheme } from "../../data/products";
import * as eventsActions from "../../store/actions/events";
import * as eventHistoryActions from "../../store/actions/eventHistory";
import moment from "moment";
import LottieView from "lottie-react-native";
import BottomSheet from "reanimated-bottom-sheet";

import { convertActivityToTimeline } from "../../helpers/functions";
import HorizontalTimeline from "../../components/HorizontalTimeline";
import TagsView from "../../components/TagsView";
import {
	getStudyFlow,
	generateTimeline,
	getSubjectStudyTime,
} from "../../helpers/functions";
import {
	getFormattedEventType,
	getFormattedActivityType,
} from "../../helpers/functions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { differenceInSeconds } from "date-fns";
import Activity from "../../models/activity";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { timerSkins } from "../../data/products";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

function fetchTimerIndex(id) {
	return timerSkins.findIndex((timerSkin) => timerSkin.id === id);
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


const TimerScreen = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	//states
	const timeConfig = useSelector((state) => state.studyFlow.config);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)
	const theme = useSelector((state) => state.theme.theme);
	const events = useSelector((state) => state.events.events);
	const currentActivity = useSelector(
		(state) =>
			state.events.activities.filter(
				(activity) => activity.eventId.toString() === props.route.params.eventId
			)[0]
	);
	const subjects = useSelector((state) => state.subject.subjects);
	//timer skins
	const studyTimerSelected = useSelector(
		(state) => state.product.studyTimerSkin
	);
	const breakTimerSelected = useSelector(
		(state) => state.product.breakTimerSkin
	);

	const [currentEvent, setCurrentEvent] = useState(
		events.filter(
			(event) => event.id.toString() === props.route.params.eventId
		)[0]
	);
	const [showedSubjects, setshowedSubjects] = useState(currentEvent.subjects);
	const [selectedSubjects, setSelectedSubjects] = useState([]);
	const [selectedTopics, setSelectedTopics] = useState([]);
	const [showingAll, setShowingAll] = useState(false);
	const [timeline, setTimeline] = useState(null);
	const [blurBackground, setBlurBackground] = useState(true);
	const [miniSession, setMiniSession] = useState(null);
	const [studyLog, setStudyLog] = useState([]);

	//pausing functionality
	const [paused, setPaused] = useState(false);


	//console.log(studyTimerSelected)

	const themeStylesDark = {
		divider: {
			height: 0.5,
			alignSelf: "stretch",
			backgroundColor: colorTheme[colorThemeIndex].source["color-primary-800"],
		},
	};

	//Subjects modal renderer function
	const renderSubjectsContent = () => {
		const currentMiniSession = currentActivity
			? getCurrentMiniSession(currentActivity)
			: null;
		return (
			<Layout
				level="1"
				style={{
					padding: 10,
					height: Dimensions.get("window").height / 1.8 - 15, //dependent on maximum snap point - padding
					alignItems: "center",
					paddingTop: 15,
				}}
			>
				<Text
					category={"h6"}
					style={{ color: colorTheme[colorThemeIndex].source["color-primary-500"], fontSize: 22 }}
				>{`Block #${
					currentMiniSession ? Math.ceil(currentMiniSession.id / 2) : "1"
				}`}</Text>
				{timeline && currentMiniSession && (
					<Text
						style={{
							color: colorTheme[colorThemeIndex].source["color-primary-500"],
							fontSize: 18,
							padding: 4,
						}}
					>
						{currentMiniSession.type !== "feedback"
							? `${timeline[currentMiniSession.id - 1].time} - ${
									timeline[currentMiniSession.id].time
							  }`
							: ""}
					</Text>
				)}
				<Divider
					style={
						theme === "dark"
							? {
									...themeStylesDark.divider,
									marginTop: Dimensions.get("window").height / 50,
									backgroundColor: colorTheme[colorThemeIndex].source["color-primary-500"],
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
												: colorTheme[colorThemeIndex].source["color-primary-700"],
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

	//Topics modal render function
	const renderTopicsContent = () => {
		const currentMiniSession = currentActivity
			? getCurrentMiniSession(currentActivity)
			: null;
		return (
			<Layout
				level="1"
				style={{
					padding: 10,
					height: Dimensions.get("window").height / 1.55 - 15, //dependent on maximum snap point - padding
					alignItems: "center",
					paddingTop: 15,
				}}
			>
				<Text
					category={"h6"}
					style={{ color: colorTheme[colorThemeIndex].source["color-primary-500"], fontSize: 22 }}
				>{`Block #${
					currentMiniSession ? Math.ceil(currentMiniSession.id / 2) : "1"
				}`}</Text>
				{timeline && currentMiniSession && (
					<Text
						style={{
							color: colorTheme[colorThemeIndex].source["color-primary-500"],
							fontSize: 18,
							padding: 4,
						}}
					>
						{currentMiniSession.type !== "feedback"
							? `${timeline[currentMiniSession.id - 1].time} - ${
									timeline[currentMiniSession.id].time
							  }`
							: ""}
					</Text>
				)}
				<Divider
					style={
						theme === "dark"
							? {
									...themeStylesDark.divider,
									marginTop: Dimensions.get("window").height / 50,
									backgroundColor: colorTheme[colorThemeIndex].source["color-primary-500"],
							  }
							: {
									...themeStylesLight.divider,
									marginTop: Dimensions.get("window").height / 80,
							  }
					}
				/>
				{
					currentActivity && (
						//getCurrentMiniSession(currentActivity).type === "study" && (
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
												: colorTheme[colorThemeIndex].source["color-primary-700"],
										fontSize: 14.5,
										textAlign: "center",
									}}
								>{`Choose all the topics you have worked on or plan to work on now`}</Text>
							</View>
							<View>
								<LabelsList
									data={selectedSubjects}
									onAddTopic={(subjectId, subjectTitle, subjectColor) => {
										props.navigation.navigate("Topics", {
											subjectId: subjectId,
											subjectTitle: subjectTitle,
											subjectColor: subjectColor,
											disableDelete: true,
										});
									}}
									selectableTopics
									disableInput
									onTopicPressHandler={(newTopic) => {
										if (selectedTopics.find((t) => t.id === newTopic.id)) {
											setSelectedTopics((prev) =>
												prev.filter((topic) => topic.id !== newTopic.id)
											);
										} else {
											setSelectedTopics((prev) => [...prev, newTopic]);
										}
									}}
									selectedTopics={selectedTopics}
								/>
							</View>
						</View>
					)
					//)
				}
			</Layout>
		);
	};

	const sheetRef = useRef(null);
	const topicsSheetRef = useRef(null);

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
		//console.log(timeline[timeline.length - 1])
		const miniSessions = timeline.map((miniSession, index) => {
			if (miniSession.eventType !== "feedback") {
				return {
					id: index + 1,
					type: miniSession.eventType,
					duration: miniSession.duration,
				};
			} else {
				return {
					id: index + 1,
					type: miniSession.eventType,
					duration: null,
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
				cleanMiniSessions,
				studyLog
			);
			dispatch(eventsActions.updateActivity(activityToUpdate));
			setTimeline(convertActivityToTimeline(activityToUpdate));
		};
		doAll();
	}

	useEffect(() => {
		if (selectedSubjects.length > 0) {
			//hide lower module
			sheetRef.current.snapTo(2);
			setTimeout(() => {
				topicsSheetRef.current.snapTo(0);
				setBlurBackground(true);
			}, 200);
			//log new study change in app
			setStudyLog(() =>
				studyLog.concat({
					subjectId: selectedSubjects[0].id,
					startTime: Date.now(),
				})
			);
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
		// if (selectedSubjects.length === 0) {
		// 	sheetRef.current.snapTo(0);
		// 	setBlurBackground(true);
		// }
		//listen to when app is left
		AppState.addEventListener("change", handleAppStateChange);
		return () => AppState.removeEventListener("change", handleAppStateChange);
	}, []);

	useEffect(() => {
		if (miniSession?.type === "study") {
			setTimeout(() => {
				setSelectedSubjects([]);
				setBlurBackground(true);
				sheetRef.current.snapTo(0);
			}, 100);
			//should also account for end of study session
		} else if (
			miniSession?.type === "break" ||
			miniSession?.type === "feedback"
		) {
			//add null record to signify break to the study log (for easier calculation)
			setStudyLog(() =>
				studyLog.concat({
					subjectId: null,
					startTime: Date.now(),
				})
			);
		}
		if (miniSession?.type === "feedback") {
			endSession();
		}
	}, [miniSession]);

	useEffect(() => {
		//update activity state every 10 seconds
		reEvalutateAll();
		const interval = setInterval(() => {
			reEvalutateAll();
		}, 10000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (currentActivity) {
			//get current minisession
			const currentMiniSession = getCurrentMiniSession(currentActivity);
			//countdown
			const timeRemaining =
				currentMiniSession.minuteStart * 60 +
				currentMiniSession.duration * 60 -
				currentActivity.secondStamp;
			if (timeRemaining > 1) {
				setCountdown(timeRemaining);
			} else {
				reEvalutateAll();
			}

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

	//when session ends handle navigation to feedback screen and calculate stats
	function endSession() {
		//calculate and submit stats for current session
		const subjectStudyTime = getSubjectStudyTime(studyLog, Date.now());
		//console.log(new Date(currentActivity.startTime).toISOString())
		const currST = currentActivity.startTime; //avoid accessing data on an already closed screen
		//dispatch current event history to state
		dispatch2(
			eventHistoryActions.addEventHistory(
				props.route.params.eventId,
				currentActivity.startTime,
				Date.now(),
				currentActivity.miniSessions,
				studyLog
			)
		);

		//navigate to feedback page and pass stats
		props.navigation.pop();
		props.navigation.navigate("SessionFeedback", {
			subjectStudyTime: subjectStudyTime,
			startTime: currST,
			endTime: Date.now(),
		});
	}

	function stopTimer(){
		//console.log()
	}

	function toggleTimer(){
		console.log(paused);
		if(paused){
		  paused = false;
		  startTimer();
		} else {
		  paused = true;
		  stopTimer();
		}
	  }

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
						
						<Text
							style={{
								...styles.title,
								color: colorTheme[colorThemeIndex].source["color-primary-500"],
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
							style={{ padding: 2, marginHorizontal: 10 }}
							onPress={() => {
								Alert.alert("Are you sure you want to leave?", "", [
									{
										text: "Leave",
										onPress: () => {
											// dispatch2(
											// 	eventHistoryActions.addEventHistory(
											// 		props.route.params.eventId,
											// 		currentActivity.startTime,
											// 		Date.now(),
											// 		currentActivity.miniSessions,
											// 		studyLog
											// 	)
											// );
											// props.navigation.goBack();
											endSession();
										},
									},
									{ text: "Stay" },
								]);
							}}
						>
							<Ionicons
								name="close-circle"
								color={colorTheme[colorThemeIndex].source["color-primary-500"]}
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
										? colorTheme[colorThemeIndex].source["color-primary-500"]
										: colorTheme[colorThemeIndex].source["color-primary-500"]
								}
								size={32}
							/>
						</TouchableCmp>
					) : (
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
								props.navigation.navigate("StudyTips", {
									timeLeft: timeRemaining,
								});
							}}
						>
							<Ionicons
								name="bulb-outline"
								color={
									theme === "dark"
										? colorTheme[colorThemeIndex].source["color-primary-500"]
										: colorTheme[colorThemeIndex].source["color-primary-500"]
								}
								size={30}
							/>
						</TouchableCmp>
					)
				}
			/>

			<Layout style={{ flex: 1 }} level="2">
				<TouchableWithoutFeedback
					disabled={!blurBackground}
					style={{ flex: 1 }}
					onPress={() => {
						sheetRef.current.snapTo(2);
						topicsSheetRef.current.snapTo(2);
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
								style={
									timerSkins[fetchTimerIndex(studyTimerSelected)]
										.styleTimerConfig
								}
								source={timerSkins[fetchTimerIndex(studyTimerSelected)].source}
								resizeMode={
									timerSkins[fetchTimerIndex(studyTimerSelected)].resizeMode
								}
								autoPlay={true}
								loop={true}
								speed={0.5}
							/>
						)}
						{miniSession && miniSession.type === "break" && (
							<LottieView
								style={
									timerSkins[fetchTimerIndex(breakTimerSelected)]
										.styleTimerConfig
								}
								source={timerSkins[fetchTimerIndex(breakTimerSelected)].source}
								resizeMode={
									timerSkins[fetchTimerIndex(breakTimerSelected)].resizeMode
								}
								autoPlay={true}
								loop={true}
								speed={0.5}
							/>
						)}
						<View style={{ flexDirection: "row", alignItems: "center", paddingLeft:  Dimensions.get('window').width / 35}}>
							<Text
								style={{
									...styles.countdownNumber,

									color:
										theme === "dark"
											? "white"
											: colorTheme[colorThemeIndex].source["color-primary-500"],
								}}
							>
								{countdown > 0
									? moment(
											new Date(0, 0, 0, 0, Math.floor(countdown / 60))
									  ).format("mm")
									: "00"}
							</Text>

							<Text
								style={{
									...styles.countdownNumber,
									fontSize: 14,
									paddingBottom: Dimensions.get("window").height / 100,
									opacity: 0.5,
									color:
										theme === "dark"
											? "white"
											: colorTheme[colorThemeIndex].source["color-primary-500"],
								}}
							>
								{countdown > 0
									? moment(
											new Date(0, 0, 0, 0, 0, Math.floor(countdown % 60))
									  ).format("ss")
									: "00"}
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
							currentActivity ? getCurrentMiniSession(currentActivity).id : null
						}
						blur={blurBackground}
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
							color={colorTheme[colorThemeIndex].source["color-primary-500"]}
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
								color={colorTheme[colorThemeIndex].source["color-primary-500"]}
							/>
							<Text
								style={{
									...styles.title,
									color:
										theme === "dark"
											? "white"
											: colorTheme[colorThemeIndex].source["color-primary-500"],
								}}
							>
								{" "}
								{getFormattedEventType(currentEvent.type)}
							</Text>
						</View> */}

						{currentActivity &&
							getCurrentMiniSession(currentActivity).type === "study" && (
								<TouchableCmp
									style={{ width: "100%" }}
									onPress={() => {
										if (sheetRef.current) {
											setBlurBackground(true);
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
														: colorTheme[colorThemeIndex].source["color-primary-400"]
												}
												size={Dimensions.get("window").width / 12}
											/>
											<View
												style={{
													backgroundColor: selectedSubjects[0]?.color
														? selectedSubjects[0].color
														: theme === "dark"
														? "white"
														: colorTheme[colorThemeIndex].source["color-primary-400"],
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
														fontSize: 22,
														textAlign: "center",
														color: selectedSubjects[0]?.color
															? "white"
															: theme === "dark"
															? colorTheme[colorThemeIndex].source["color-primary-500"]
															: "white",
													}}
												>
													{selectedSubjects[0]
														? selectedSubjects[0].title
														: "Press to select subject"}
												</Text>
											</View>
										</View>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Text
												style={{
													fontSize: Dimensions.get("window").width / 23.5,
													color:
														selectedSubjects.length === 0
															? theme === "dark"
																? colorTheme[colorThemeIndex].source["color-primary-500"]
																: colorTheme[colorThemeIndex].source["color-primary-400"]
															: theme === "dark"
															? "white"
															: colorTheme[colorThemeIndex].source["color-primary-400"],
												}}
											>
												Update
											</Text>
											<Ionicons
												name="chevron-forward-outline"
												color={
													selectedSubjects.length === 0
														? theme === "dark"
															? colorTheme[colorThemeIndex].source["color-primary-500"]
															: colorTheme[colorThemeIndex].source["color-primary-400"]
														: theme === "dark"
														? "white"
														: colorTheme[colorThemeIndex].source["color-primary-400"]
												}
												size={Dimensions.get("window").width / 14}
											/>
										</View>
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
						{currentActivity &&
							getCurrentMiniSession(currentActivity).type === "study" && (
								<TouchableCmp
									style={{ width: "100%" }}
									onPress={() => {
										if (sheetRef.current) {
											setBlurBackground(true);
											topicsSheetRef.current.snapTo(0);
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
												name="list-outline"
												color={
													selectedTopics.length > 0
														? selectedSubjects[0].color
														: theme === "dark"
														? "white"
														: colorTheme[colorThemeIndex].source["color-primary-400"]
												}
												size={Dimensions.get("window").width / 12}
											/>
											<View
												style={{
													backgroundColor:
														selectedTopics.length > 0
															? selectedSubjects[0].color
															: theme === "dark"
															? "white"
															: colorTheme[colorThemeIndex].source["color-primary-400"],
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
														fontSize: 22,
														textAlign: "center",
														color:
															selectedTopics.length > 0
																? "white"
																: theme === "dark"
																? colorTheme[colorThemeIndex].source["color-primary-500"]
																: "white",
													}}
												>
													{selectedTopics.length > 0
														? `${selectedTopics.length} Topic${
																selectedTopics.length > 1 ? "s" : ""
														  } covered`
														: "Press to update topics"}
												</Text>
											</View>
										</View>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "center",
											}}
										>
											<Text
												style={{
													fontSize: Dimensions.get("window").width / 23.5,
													color:
														selectedTopics.length === 0
															? theme === "dark"
																? colorTheme[colorThemeIndex].source["color-primary-500"]
																: colorTheme[colorThemeIndex].source["color-primary-400"]
															: theme === "dark"
															? "white"
															: colorTheme[colorThemeIndex].source["color-primary-400"],
												}}
											>
												Update
											</Text>
											<Ionicons
												name="chevron-forward-outline"
												color={
													selectedTopics.length === 0
														? theme === "dark"
															? colorTheme[colorThemeIndex].source["color-primary-500"]
															: colorTheme[colorThemeIndex].source["color-primary-400"]
														: theme === "dark"
														? "white"
														: colorTheme[colorThemeIndex].source["color-primary-400"]
												}
												size={Dimensions.get("window").width / 14}
											/>
										</View>
									</View>
								</TouchableCmp>
							)}
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
									backgroundColor: colorTheme[colorThemeIndex].source["color-primary-500"],
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
								theme === "dark" ? colorTheme[colorThemeIndex].source["color-primary-600"] : "#bbb",
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
								backgroundColor: colorTheme[colorThemeIndex].source["color-primary-500"],
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
					renderContent={renderSubjectsContent}
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
							<View style={{ width: "100%", alignItems: "center", padding: 5 }}>
								<View
									style={{
										backgroundColor:
											theme === "dark"
												? "white"
												: colorTheme[colorThemeIndex].source["color-primary-500"],
										width: 50,
										height: 4,
										borderRadius: 5,
									}}
								></View>
							</View>
						);
					}}
				/>
				<BottomSheet
					ref={topicsSheetRef}
					style={{ overflow: "hidden" }}
					snapPoints={[
						Dimensions.get("window").height / 1.55,
						Dimensions.get("window").height / 1.9,
						0,
					]}
					borderRadius={20}
					initialSnap={2}
					renderContent={renderTopicsContent}
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
							<View style={{ width: "100%", alignItems: "center", padding: 5 }}>
								<View
									style={{
										backgroundColor:
											theme === "dark"
												? "white"
												: colorTheme[colorThemeIndex].source["color-primary-500"],
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
		left: Dimensions.get("window").width / 19,
	},
	timerBackground: {
		backgroundColor: "black",
		padding: 15,
		borderRadius: 40,
	},
});

export default TimerScreen;
