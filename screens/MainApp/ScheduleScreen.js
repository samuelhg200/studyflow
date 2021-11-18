import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Platform,
	TouchableOpacity,
	TouchableNativeFeedback,
	View,
	FlatList,
	ActivityIndicator,
	Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Card, Layout, Button, Text } from "@ui-kitten/components";
import moment from "moment";
import { FloatingAction } from "react-native-floating-action";
import { useSelector, useDispatch } from "react-redux";
import { getIconStringBasedOnEventType } from "../../helpers/functions";
import { Ionicons } from "@expo/vector-icons";
import * as eventsActions from "../../store/actions/events";
import * as studyFlowActions from "../../store/actions/studyFlow";
import { colorTheme } from "../../data/products";
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";



// const timeToString = (time) => {
// 	const date = new Date(time);
// 	return time.toISOString().split("T")[0];
// };

function timeToString2(time) {
	const date = new Date(time);
	// return date.toISOString().split("T")[0];

	let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(date - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

const timeToString = (date) => {
	return moment(date).format("h:mm");
};

const getDesiredDate = (date) => {
	return moment(date).format("YYYY-MM-DD");
};

const getDateToday = () => {
	const today = new Date();
	return moment(today).format("YYYY-MM-DD");
};

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

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

function getEventTimeString(eventDate) {
	let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(eventDate - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

function addMonths(date, months) {
	date.setMonth(date.getMonth() + months);
	return date;
}

Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

function getDates(startDate, stopDate) {
	var dateArray = [];
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
}

const Footer = (props) => (
	<View {...props} style={[props.style, styles.footerContainer]}>
		{props.studyFlowConfig[props.item.type] ? (
			<Button
				style={styles.footerControl}
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
				//style={{backgroundColor: props.color,}}
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
					style={styles.footerControl}
					onPress={() => {
						props.previewHandler(props.item.id.toString());
					}}
					size="small"
					status="basic"
					disabled={!props.studyFlowConfig[props.item.type]}
				>
					<Ionicons name="timer-outline" size={14} /> StudyFlow
				</Button>
			</TouchableCmp>
		)}
		<Button
			style={{ backgroundColor: props.color, ...styles.footerControl }}
			onPress={() => {
				props.deleteHandler(props.item.id, props.item.seriesId);
			}}
			size="small"
			status="basic"
		>
			<Ionicons
				name="trash-outline"
				color={props.theme === "dark" ? "black" : "white"}
				size={15}
			/>
			<Text style={{ color: props.theme === "dark" ? "black" : "white" }}>
				{" "}
				Remove
			</Text>
		</Button>
	</View>
);

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
			<Text category="s2" style={{ fontSize: 12, color: props.color }}>
				{props.item.timeRange}{" "}
			</Text>
			{props.item.seriesId ? (
				<Ionicons
					name="repeat-outline"
					color={
						props.theme === "dark" ? "white" : colorTheme[props.colorThemeIndex].source["color-primary-500"]
					}
				/>
			) : (
				<View></View>
			)}
		</View>
	);
};

function getItems(eventsCopy, date = new Date()) {
	let key = 0;
	date = new Date(date);

	const allItems = [];

	const minMonth = new Date(date.getFullYear(), date.getMonth(), 1);
	const maxMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const allDates = getDates(minMonth, maxMonth);
	for (let i = 0; i < allDates.length; i++) {
		const currentItem = {};

		key++;
		const currentDate = allDates[i].setHours(0, 0, 0, 0);

		const formatedCurrentDate = timeToString2(currentDate);

		currentItem[formatedCurrentDate] = [];
		currentItem["key"] = key.toString();
		if (eventsCopy.length > 0) {
			for (let j = 0; j < eventsCopy.length; j++) {
				if (currentDate === new Date(eventsCopy[j].date).setHours(0, 0, 0, 0)) {
					let range = getRange(eventsCopy[j].date, eventsCopy[j].duration);
					eventsCopy[j]["timeRange"] = range;
					currentItem[formatedCurrentDate].push(eventsCopy[j]);
				}
			}
		}
		allItems.push(currentItem);
	}
	return allItems;
}



const ScheduleScreen = (props) => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)

	const actions = [
		{
			text: "Other",
			icon: require("../../assets/icons/other.png"),
			name: "other",
			position: 1,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			iconName: "ellipsis-horizontal-outline",
		},
		{
			text: "Lecture",
			icon: require("../../assets/icons/book.png"),
			name: "lecture",
			position: 2,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			iconName: "book-outline",
		},
		{
			text: "Homework",
			icon: require("../../assets/icons/reader.png"),
			name: "homework",
			position: 3,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			iconName: "reader-outline",
		},
		{
			text: "Assessment",
			icon: require("../../assets/icons/school.png"),
			name: "assessment",
			position: 4,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			iconName: "school-outline",
		},
		{
			text: "Study Session",
			icon: require("../../assets/icons/glasses.png"),
			name: "studySession",
			position: 5,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			iconName: "glasses-outline",
		},
	];

	// const subjects = useSelector((state) => state.subject.subjects);
	// const events = useSelector((state) => state.events.events);
	// //const [loadedEvents, setLoadedEvents] = useState([]);
	// const [items, setItems] = useState({});
	const dateToLoad = useSelector((state) => state.events.dateToTravelTo);
	const theme = useSelector((state) => state.theme.theme);
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const dispatch3 = useDispatch();
	const dispatch4 = useDispatch();
	const animation = useRef(null);
	//const [currentDay, setCurrentDay] = useState(moment());
	const events = useSelector((state) => {
		return state.events.events;
	});
	const dayToTravelTo = useSelector((state) => {
		return state.events.dayToTravelTo;
	});
	const [items, setItems] = useState();
	const [dayPressed, setDayPressed] = useState(new Date());
	// const monthDisplayed = useRef({
	// 	'currentMonth': new Date(),
	// });
	const [scrollingEnabled, setScrollingEnabled] = useState(false);
	const [loading, setLoading] = useState(true);

	const studyFlowActive = useSelector((state) => state.studyFlow.active);
	const toggleStudyFlow = () => {
		dispatch3(studyFlowActions.toggleStudyFlow());
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

	//const [monthToLoad, setMonthToLoad] = useState()

	const travelMonth = (int) => {
		dispatch2(
			eventsActions.updateDateToTravelTo(addMonths(new Date(dateToLoad), int))
		);
	};

	const loadingHandler = (bool) => {
		setLoading(bool);
	};

	const DayDisplayer = ({ day }) => {
		return (
			<View style={styles.dateDisplayer}>
				<Text category={"h6"} style={{...styles.dayNumber, color: colorTheme[colorThemeIndex].source["color-primary-500"],}}>
					{moment(day).format("D")}
				</Text>
				<Text style={styles.writtenDay}>{moment(day).format("ddd")}</Text>
			</View>
		);
	};

	useEffect(() => {
		const items = getItems(events.slice(), dateToLoad);
		setItems(items);
		//travel to index
		// if (flatListRef.current) {
		// 	try {
		// 		setScrollingEnabled(false);
		// 		setTimeout(
		// 			() =>
		// 				flatListRef.current.scrollToIndex({ index: dayToTravelTo - 1 }),
		// 			100
		// 		);
		// 		setScrollingEnabled(true);
		// 	} catch (err) {}
		// }

		props.navigation.setOptions({
			headerTitle: moment(dateToLoad).format("MMMM YYYY"),
		});
	}, [events, dateToLoad]);

	useEffect(() => {
		props.navigation.setOptions({
			headerLeft: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="PastMonth"
						iconName={"arrow-back-outline"}
						onPress={() => {
							travelMonth(-1);
						}}
					/>
				</HeaderButtons>
			),
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="NextMonth"
						iconName={"arrow-forward-outline"}
						onPress={() => {
							travelMonth(1);
						}}
					/>
				</HeaderButtons>
			),
		});

		// props.navigation.setParams({
		// 	travelMonth: (int) => travelMonth(int),
		// });
	}, [dateToLoad, dispatch2]);

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

	const flatListRef = useRef(null);

	// useEffect(() => {
	// 	if (flatListRef.current) {
	// 		try {
	// 			setScrollingEnabled(false);
	// 			setTimeout(
	// 				() => flatListRef.current.scrollToIndex({ index: dayToTravelTo - 1 }),
	// 				400
	// 			);
	// 			setScrollingEnabled(true);
	// 		} catch (err) {}
	// 	}
	// }, [dayToTravelTo]);

	useEffect(() => {
		if (flatListRef.current) {
			try {
				setScrollingEnabled(false);
				setTimeout(
					() => flatListRef.current.scrollToIndex({ index: dayToTravelTo - 1 }),
					1000
				);
				setScrollingEnabled(true);
			} catch (err) {}
		}
	}, [dayToTravelTo]);

	function scrollToIndexFailed(error) {
		setScrollingEnabled(false);
		const offset = error.averageItemLength * error.index;
		//flatListRef.current.scrollToOffset({ offset });
		const wait = new Promise((resolve) => setTimeout(resolve, 200));
		wait.then(() => {
			flatListRef.current.scrollToIndex({ index: error.index });
		});
		setScrollingEnabled(true);
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

	const EventItem = (itemData) => {
		//console.log(itemData)
		let date = Object.keys(itemData.item)[0];
		let currentItem = itemData.item[date];
		if (currentItem.length === 0) {
			return (
				<View style={styles.dateRow}>
					<DayDisplayer day={date} />
					<Layout
						// onPress={() => {
						// 	setDayPressed(date);
						// 	animation.current.animateButton();
						// }}
						style={{
							flex: 1,
							borderLeftWidth: 1,
							borderColor: colorTheme[colorThemeIndex].source["color-primary-400"],
							paddingLeft: 15,
						}}
					>
						<Card
							// onPress={() => {
							// 	setDayPressed(date);
							// 	animation.current.animateButton();
							// }}
							disabled
							style={{
								...styles.card,
								height: 95,
								justifyContent: "center",
								backgroundColor:
									theme === "dark"
										? colorTheme[colorThemeIndex].source["color-primary-600"]
										: colorTheme[colorThemeIndex].source["color-primary-300"],
								borderColor:
									theme === "dark"
										? colorTheme[colorThemeIndex].source["color-primary-400"]
										: colorTheme[colorThemeIndex].source["color-primary-600"],
								borderWidth: 1,
								marginBottom: 5,
							}}
						>
							{/* <TouchableCmp
								onPress={() => {
									setDayPressed(date);
									animation.current.animateButton();
								}}
								style={{}}
							> */}
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									//marginRight: 3,
									justifyContent: "space-around",
								}}
							>
								{/* <Ionicons name="add-circle-outline" size={20} />
									<View
										style={{
											marginLeft: 4,
											marginBottom: 1,
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Text style={{ fontSize: 19, color: "black" }}>
											Add event
										</Text>
									</View> */}
								{actions
									.slice()
									.reverse()
									.map((action) => {
										return (
											<TouchableCmp
												key={action.name}
												onPress={() => {
													setDayPressed(date);
													props.navigation.navigate("AddItemToCalendar", {
														// screen: 'AddItemToCalendar',
														// params: {
														type: action.name,
														day: timeToString2(date),
														// }
													});
												}}
												style={{
													flex: 1,
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<Layout
													style={{
														borderRadius: 10,
														padding: 8,
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<Ionicons
														name={action.iconName}
														color={theme === "dark" ? "white" : "black"}
														size={18}
													/>
												</Layout>
											</TouchableCmp>
										);
									})}
							</View>
							{/* </TouchableCmp> */}
						</Card>
					</Layout>
				</View>
			);
		} else {
			//actual event
			return (
				<View style={{ flex: 1 }}>
					<FlatList
						keyExtractor={(item) => item.id.toString()}
						style={{ width: "100%", marginBottom: 10 }}
						data={currentItem}
						renderItem={(itemData) => {
							const iconName = getIconStringBasedOnEventType(
								itemData.item.type
							);
							return (
								<View style={styles.dateRow}>
									{itemData.index === 0 ? (
										<DayDisplayer day={date} />
									) : (
										<View style={styles.dateDisplayer}></View>
									)}
									<Layout level="2" style={{ flex: 1 }}>
										<TouchableCmp style={{ flex: 1, padding: 5 }}>
											<Card
												style={styles.card}
												disabled
												footer={(props) => (
													<Footer
														{...props}
														item={itemData.item}
														deleteHandler={deleteEventHandler}
														previewHandler={previewEventHandler}
														theme={theme}
														color={
															theme === "dark"
																? "white"
																: colorTheme[colorThemeIndex].source["color-primary-300"]
														}
														studyFlowActive={studyFlowActive}
														toggleStudyFlow={toggleStudyFlow}
														studyFlowConfig={studyFlowEventConfig}
														updateEventConfig={updateEventConfig}
													/>
												)}
												header={(props) => (
													<Header
														{...props}
														colorThemeIndex={colorThemeIndex}
														item={itemData.item}
														color={
															theme === "dark"
																? "white"
																: colorTheme[colorThemeIndex].source["color-primary-300"]
														}
													/>
												)}
											>
												<View
													style={{ flexDirection: "row", alignItems: 'center', justifyContent: "space-between" }}
												>
													<View style={{ flexDirection: "row", alignItems: "center" }}>
													<Ionicons
														name={iconName}
														color={colorTheme[colorThemeIndex].source["color-primary-600"]}
														size={24}
													/>
													<Text
														category="h6"
														style={{
															color:
																theme === "dark"
																	? "white"
																	: colorTheme[colorThemeIndex].source["color-primary-600"],
														}}
													>
														{" " + itemData.item.title}
													</Text>
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
														color={
															colorTheme[colorThemeIndex].source[
																"color-primary-500"
															]
														}
													/>
												</TouchableCmp>
												</View>
											</Card>
										</TouchableCmp>
									</Layout>
								</View>
							);
						}}
					/>
				</View>
			);
		}
	};

	return (
		<Layout level={"2"} style={{ flex: 1 }}>
			<SafeAreaView />
			<FlatList
				ref={flatListRef}
				//initialNumToRender={31}
				keyExtractor={(item) => item["key"]}
				style={{ width: "100%" }}
				data={items}
				renderItem={EventItem}
				//getItemLayout={getItemLayout}
				scrollToIndexFailed={scrollToIndexFailed}
				scrollEnabled={scrollingEnabled}
			/>
			<FloatingAction
				color={colorTheme[colorThemeIndex].source["color-primary-600"]}
				ref={animation}
				actions={actions}
				onClose={() => setDayPressed(new Date())}
				onPressItem={(name) => {
					props.navigation.navigate("AddItemToCalendar", {
						type: name,
						day: timeToString2(dayPressed),
					});
				}}
			/>
		</Layout>
	);
};

export const screenOptions = (navData) => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)
	return {
		headerTitle: navData.route.params
			? navData.route.params.currentMonth
			: moment().format("MMMM"),
		headerTitleStyle: {
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
			fontFamily: "yellow-tail",
			fontSize: 30,
			paddingHorizontal: 4,
		},
		//headerLeft: () => null,
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="PastMonth"
					iconName={"arrow-back-outline"}
					onPress={() => {
						navData.route.params.travelMonth(-1);
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="NextMonth"
					iconName={"arrow-forward-outline"}
					onPress={() => {
						navData.route.params.travelMonth(1);
					}}
				/>
			</HeaderButtons>
		),
	};
};

const styles = StyleSheet.create({
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	card: {
		flex: 1,
		marginRight: 5,
		marginTop: 10,
		borderRadius: 10,
	},
	itemContainer: {
		backgroundColor: "white",
		margin: 4,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
		flex: 1,
	},
	footerControl: {
		marginHorizontal: 2,
	},
	headerContainer: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "flex-start",
	},
	dateRow: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	dateDisplayer: {
		width: 60,
		alignItems: "center",
		justifyContent: "center",
	},
	writtenDay: {
		color: "#ccc",
		fontSize: 19,
	},
	dayNumber: {
		fontSize: 22,
	},
	indicator: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		height: 80,
	},
});

export default ScheduleScreen;
