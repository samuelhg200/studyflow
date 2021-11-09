import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Alert,
	Platform,
	SafeAreaView,
} from "react-native";
import {
	Card,
	Text,
	Input,
	TopNavigation,
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
import * as studyFlowActions from "../../store/actions/studyFlow";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getIconStringBasedOnEventType } from "../../helpers/functions";
import HeaderButton from "../../components/HeaderButton";
import { FlatList } from "react-native-gesture-handler";

function timeToString2(time) {
	const date = new Date(time);
	// return date.toISOString().split("T")[0];
	let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(date - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

const recordStartTime = async () => {
	try {
		const now = new Date();
		await AsyncStorage.setItem("@start_time", now.toISOString());
	} catch (err) {
		// TODO: handle errors from setItem properly
		console.warn(err);
	}
};

const Footer = (props) => {
	return (
		<View {...props} style={[props.style, styles.footerContainer]}>
			{props.studyFlowConfig[props.item.type] ? (
				<Button
					style={styles.button}
					onPress={() => {
						props.previewHandler(props.item.id.toString());
					}}
					size="small"
					status="basic"
				>
					<Ionicons name="eye-outline" size={14} /> Preview
				</Button>
			) : (
				<TouchableCmp
					onPress={() => {
						Alert.alert(
							`Activate StudyFlow Mode for ${props.item.type}?`,
							"Start using studyflow mode to improve your experience and get tailored statistics and feedback on your learning.",
							[
								{
									text: "Activate",
									onPress: () => {
										props.updateEventConfig(
											props.item.type,
											!props.studyFlowConfig[props.item.type]
										);
									},
								},
								{ text: "Don't use" },
							]
						);
					}}
				>
					<Button
						style={styles.button}
						onPress={() => {
							props.previewHandler(props.item.id.toString());
						}}
						size="small"
						status="basic"
						disabled={true}
					>
						<Ionicons name="timer-outline" size={14} /> StudyFlow
					</Button>
				</TouchableCmp>
			)}
			<Button
				style={styles.button}
				onPress={() => {
					props.deleteHandler(props.item.id, props.item.seriesId);
				}}
				size="small"
				status="basic"
			>
				<Ionicons name="trash-outline" size={14} /> Remove
			</Button>
		</View>
	);
};

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const getRange = (date, duration) => {
	let durationRepresentation = new Date();
	durationRepresentation.setHours(duration.getHours());
	durationRepresentation.setMinutes(duration.getMinutes());

	let end = moment(date).add(durationRepresentation.getMinutes(), "minutes");
	end = end.add(durationRepresentation.getHours(), "hours");
	const range =
		moment(date).format("HH:mm") + " - " + moment(end).format("HH:mm");
	return range;
};

const Header = (props) => {
	return (
		<View {...props} style={[props.style, styles.headerContainer]}>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginRight: 1,
					flex: 1,
				}}
			>
				{props.item.subjects.map((subject) => {
					return (
						<View
							key={subject.id}
							style={{
								padding: 2,
								margin: 2,
								backgroundColor: subject.color,
								borderRadius: 2,
							}}
						>
							<Text style={{ fontSize: 11, color: "white" }}>
								{subject.title}
							</Text>
						</View>
					);
				})}
			</View>

			<Text category="s2" style={{ fontSize: 12 }}>
				{getRange(props.item.date, props.item.duration)}{" "}
			</Text>
			{props.item.seriesId ? (
				<Ionicons
					name="repeat-outline"
					color={
						props.theme === "dark" ? "white" : CustomTheme["color-primary-500"]
					}
				/>
			) : (
				<View></View>
			)}
		</View>
	);
};

const StartFlowScreen = (props) => {
	// get all events for today
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const dispatch3 = useDispatch();
	const theme = useSelector((state) => state.theme.theme);
	const eventsToday = useSelector((state) =>
		state.events.events.length > 0
			? state.events.events.filter((event) =>
					moment(event.date).isSame(moment(), "day")
			  )
			: state.events.events
	);

	const studyFlowActive = useSelector((state) => state.studyFlow.active);
	const toggleStudyFlow = () => {
		dispatch2(studyFlowActions.toggleStudyFlow());
	};

	const studyFlowEventConfig = useSelector(
		(state) => state.studyFlow.eventConfig
	);
	const updateEventConfig = (type, newValue) => {
		dispatch3(
			studyFlowActions.updateEventConfig({
				...studyFlowEventConfig,
				[type]: newValue,
			})
		);
	};

	const [selectedEventId, setSelectedEventId] = useState(null);
	const deleteEventHandler = (id, seriesId) => {
		if (seriesId) {
			Alert.alert(
				"Remove event or series",
				"Do you wish to delete only this event or events in the series too",
				[
					{
						text: "Series",
						onPress: () => {
							dispatch(eventsActions.deleteEventSeries(seriesId));
						},
					},
					{
						text: "Event",
						onPress: () => {
							dispatch(eventsActions.deleteEvent(id));
						},
					},
				]
			);
		} else {
			dispatch(eventsActions.deleteEvent(id));
		}
	};
	const previewEventHandler = (id) => {
		props.navigation.navigate("EventPreview", {
			id: id,
		});
	};
	useEffect(() => {
		if (eventsToday.length > 0) {
			if (!selectedEventId) {
				setSelectedEventId(eventsToday[0].id);
			}
		} else {
			setSelectedEventId(null);
		}
	}, [eventsToday]);

	return eventsToday.length === 0 ? (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation
					//style={{flex: 1}}
					alignment="center"
					title={() => (
						<View style={{ flex: 1 }}>
							<Text
								style={{
									fontFamily: "yellow-tail",
									fontSize: 32,
									color: CustomTheme["color-primary-500"],
									flex: 1,
									paddingHorizontal: 2,
								}}
							>
								StudyFlow
							</Text>
						</View>
					)}
					accessoryRight={() => (
						<TouchableCmp
							style={{ paddingHorizontal: 4 }}
							onPress={() => {
								props.navigation.navigate('Store')
							}}
						>
							<Ionicons
								name="wallet-outline"
								color={
									theme === "dark"
										? CustomTheme["color-primary-500"]
										: CustomTheme["color-primary-500"]
								}
								size={32}
							/>
						</TouchableCmp>
					)}

					//subtitle='Enhance your learning'
					// accessoryLeft={renderBackAction}
					// accessoryRight={renderRightActions}
				/>
				<Layout level={"2"} style={styles.screen}>
					<TouchableWithoutFeedback
						onPress={() => {
							props.navigation.navigate("ChooseEventType");
						}}
						style={{ flex: 1 }}
					>
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								flex: 1,
							}}
						>
							<View
								style={{
									marginTop: 16,
									alignItems: "center",
									justifyContent: "center",
									width: "100%",
									backgroundColor: CustomTheme["color-primary-500"],
									padding: 7,
									borderRadius: 8,
								}}
							>
								<Text category={"h6"} style={{ color: "white" }}>
									No events planned for today
								</Text>
							</View>

							<View
								style={{
									alignItems: "center",
									justifyContent: "center",
									flex: 1,
									marginTop: -38,
								}}
							>
								<LottieView
									style={styles.buttonAnimationLottie}
									source={require("../../assets/lottie/addEventRed.json")}
									autoPlay={true}
									loop={true}
									speed={0.5}
								/>
								<Text
									style={{ color: CustomTheme["color-primary-600"] }}
									category={"h5"}
								>
									ADD NEW EVENT
								</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Layout>
			</SafeAreaView>
		</Layout>
	) : (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation
					//style={{flex: 1}}
					alignment="center"
					title={() => (
						<View style={{ flex: 1 }}>
							<Text
								style={{
									fontFamily: "yellow-tail",
									fontSize: 32,
									color: CustomTheme["color-primary-500"],
									flex: 1,
									paddingHorizontal: 2,
								}}
							>
								StudyFlow
							</Text>
						</View>
					)}
					accessoryRight={() => (
						<TouchableCmp
							style={{ paddingHorizontal: 4 }}
							onPress={() => {
								props.navigation.navigate('Store')
							}}
						>
							<Ionicons
								name="wallet-outline"
								color={
									theme === "dark"
										? CustomTheme["color-primary-500"]
										: CustomTheme["color-primary-500"]
								}
								size={32}
							/>
						</TouchableCmp>
					)}

					//subtitle='Enhance your learning'
					// accessoryLeft={renderBackAction}
					// accessoryRight={renderRightActions}
				/>
				<Layout level={"2"} style={styles.screen}>
					<View style={{ marginTop: 12 }}>
						<Text
							category={"h5"}
							style={{ color: CustomTheme["color-primary-600"] }}
						>
							Events for Today
						</Text>
					</View>
					<Divider style={{ width: "95%", marginTop: 10 }} />

					<View style={styles.listContainer}>
						<FlatList
							style={{ width: "90%" }}
							data={eventsToday}
							keyExtractor={(item) => item.id.toString()}
							renderItem={(itemData) => {
								const iconName = getIconStringBasedOnEventType(
									itemData.item.type
								);
								return (
									<View
										style={
											selectedEventId === itemData.item.id
												? { ...styles.cardContainer, ...styles.selected }
												: { ...styles.cardContainer }
										}
										key={itemData.item.id}
									>
										<Card
											style={styles.card}
											disabled
											footer={(props) => (
												<Footer
													{...props}
													item={itemData.item}
													deleteHandler={deleteEventHandler}
													previewHandler={previewEventHandler}
													studyFlowConfig={studyFlowEventConfig}
													updateEventConfig={updateEventConfig}
												/>
											)}
											header={(props) => (
												<Header {...props} item={itemData.item} theme={theme} />
											)}
										>
											<View
												style={{
													flex: 1,
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-between",
												}}
											>
												<View
													style={{ flexDirection: "row", alignItems: "center" }}
												>
													<Ionicons
														name={iconName}
														color={CustomTheme["color-primary-500"]}
														size={24}
													/>
													<Text category="h5">{" " + itemData.item.title}</Text>
												</View>
												<TouchableCmp
													onPress={() => {
														recordStartTime().then(
															props.navigation.navigate("Timer", {
																eventId: itemData.item.id.toString(),
															})
														);
														//console.log(itemData.item.id.toISOString())
													}}
												>
													<Ionicons
														name="play-circle-outline"
														size={40}
														color={CustomTheme["color-primary-500"]}
													/>
												</TouchableCmp>
											</View>
										</Card>
									</View>
								);
							}}
						></FlatList>
					</View>
					<Divider style={{ width: "95%" }} />
					<View style={styles.optionsContainer}>
						<Button
							style={{ marginTop: 30 }}
							size="giant"
							onPress={() => {
								props.navigation.navigate("Timer", {
									eventId: selectedEventId.toString(),
								});
							}}
						>
							{"Start Session "} {" >"}
						</Button>
					</View>
				</Layout>
			</SafeAreaView>
		</Layout>
	);
};

export default StartFlowScreen;

export const screenOptions = (navData) => {
	return {
		headerTitle: () => (
			<View style={{ flex: 1 }}>
				<Text
					style={{
						fontFamily: "yellow-tail",
						fontSize: 30,
						color: CustomTheme["color-primary-500"],
						flex: 1,
						minWidth: 117,
					}}
				>
					StudyFlow
				</Text>
			</View>
			// style={{ width: Platform.OS === "android" ? 160 : 150, height: 50 }}
			// source={require("../../assets/branding/logoColoured.png")}
		),
		//headerTitle: "Study Flow",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Store"
					iconName={"cafe-outline"}
					onPress={() => {
						navData.navigation.navigate("Store");
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Profile"
					iconName={"person-outline"}
					onPress={() => {
						navData.navigation.navigate("Profile");
					}}
				/>
			</HeaderButtons>
		),
		headerTitleAlign: "center",
	};
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	buttonContainer: {
		width: "100%",
	},
	buttonAnimationLottie: {
		width: "80%",
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "center",
	},
	card: {
		borderRadius: 10,
		overflow: "hidden",
	},
	cardContainer: {
		marginVertical: 6,
		padding: 18,
		overflow: "visible",
	},
	selected: {
		shadowColor: "#bbb",
		shadowOffset: { width: 1, height: 0 },
		shadowOpacity: 8,
		shadowRadius: 4,
		elevation: 5,
		padding: 6,
	},
	itemContainer: {
		backgroundColor: "white",
		margin: 4,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
	},
	footerControl: {},
	button: {
		marginHorizontal: 5,
	},
	headerContainer: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "flex-start",
	},
	listContainer: {
		width: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
		flex: 3,
		marginTop: 20,
	},
	optionsContainer: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
});
