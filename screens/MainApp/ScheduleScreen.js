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
	Alert
} from "react-native";
import { Agenda } from "react-native-calendars";
import { Card, Layout, Button, Text } from "@ui-kitten/components";
import moment from "moment";
import { FloatingAction } from "react-native-floating-action";
import { useSelector, useDispatch } from "react-redux";
import { getIconStringBasedOnEventType } from "../../helpers/functions";
import { Ionicons } from "@expo/vector-icons";
import * as eventsActions from "../../store/actions/events";
import * as studyFlowActions from '../../store/actions/studyFlow'
import customTheme from "../../assets/UIkitten/custom-theme.json";
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

const actions = [
	{
		text: "Other",
		icon: require("../../assets/icons/other.png"),
		name: "other",
		position: 1,
		color: customTheme["color-primary-500"],
		iconName: "ellipsis-horizontal-outline",
	},
	{
		text: "Lecture",
		icon: require("../../assets/icons/book.png"),
		name: "lecture",
		position: 2,
		color: customTheme["color-primary-500"],
		iconName: "book-outline",
	},
	{
		text: "Homework",
		icon: require("../../assets/icons/reader.png"),
		name: "homework",
		position: 3,
		color: customTheme["color-primary-500"],
		iconName: "reader-outline",
	},
	{
		text: "Assessment",
		icon: require("../../assets/icons/school.png"),
		name: "assessment",
		position: 4,
		color: customTheme["color-primary-500"],
		iconName: "school-outline",
	},
	{
		text: "Study Session",
		icon: require("../../assets/icons/glasses.png"),
		name: "study-session",
		position: 5,
		color: customTheme["color-primary-500"],
		iconName: "glasses-outline",
	},
];

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
		{props.studyFlowActive ? <Button
			style={styles.footerControl}
			onPress={() => {
				props.previewHandler(props.item.id.toISOString());
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="eye-outline" size={14} /> Preview
		</Button> : <TouchableCmp onPress={() => {
			Alert.alert('Activate StudyFlow Mode?', 'Start using studyflow mode to improve your experience and get tailored statistics and feedback on your learning.', [{text: 'Activate', onPress:() => {props.toggleStudyFlow()}}, {text: 'Don\'t use'}])
			}}>
			<Button
			style={styles.footerControl}
			onPress={() => {
				props.previewHandler(props.item.id.toISOString());
			}}
			size="small"
			status="basic"
			disabled={true}
		>
			<Ionicons name="eye-outline" size={14} /> Preview
		</Button>
		</TouchableCmp>}
		<Button
			style={{ backgroundColor: props.color ,...styles.footerControl}}
			onPress={() => {
				props.deleteHandler(props.item.id);
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="trash-outline" color={props.theme === 'dark' ? 'black' : 'white'} size={15} />
			<Text style={{ color: props.theme === 'dark' ? 'black' : 'white' }}> Remove</Text>
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
			<Text
				category="s2"
				style={{ fontSize: 12, color: props.color }}
			>
				{props.item.timeRange}
			</Text>
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

const DayDisplayer = ({ day }) => {
	return (
		<View style={styles.dateDisplayer}>
			<Text category={"h6"} style={styles.dayNumber}>
				{moment(day).format("D")}
			</Text>
			<Text style={styles.writtenDay}>{moment(day).format("ddd")}</Text>
		</View>
	);
};

const ScheduleScreen = (props) => {
	// const subjects = useSelector((state) => state.subject.subjects);
	// const events = useSelector((state) => state.events.events);
	// //const [loadedEvents, setLoadedEvents] = useState([]);
	// const [items, setItems] = useState({});
	const dateToLoad = useSelector((state) => state.events.dateToTravelTo);
	const theme = useSelector((state) => state.theme.theme)
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const dispatch3 = useDispatch();
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
	const [loading, setLoading] = useState(true)

	const studyFlowActive = useSelector(state => state.studyFlow.active)
	const toggleStudyFlow = () => {
		dispatch3(studyFlowActions.toggleStudyFlow())
	}


	//const [monthToLoad, setMonthToLoad] = useState()

	const travelMonth = (int) => {
		dispatch2(
			eventsActions.updateDateToTravelTo(addMonths(new Date(dateToLoad), int))
		);
	};

	const loadingHandler = (bool) => {
		setLoading(bool)
	}

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

	useEffect(() => {
		//month to load
		//monthToLoadRoute = props.route.params.monthToLoad ? props.route.params.monthToLoad : newDate()
		//setMonthToLoad(monthToLoadRoute)
		//day to skip to
		//dayToTravelToRoute = props.route.params.dayToTravelTo ? props.route.params.dayToTravelTo : newDate().getDate()
		//setDayToTravelTo(dayToTravelToRoute)
	}, [props.route.params]);

	const deleteEventHandler = (id) => {
		dispatch(eventsActions.deleteEvent(id));
	};
	const previewEventHandler = (id) => {
		props.navigation.navigate("EventPreview", {
			id: id,
		});
	};

	const flatListRef = useRef(null);

	useEffect(() => {
		if (flatListRef.current) {
			try {
				setScrollingEnabled(false);
				setTimeout(
					() => flatListRef.current.scrollToIndex({ index: dayToTravelTo - 1 }),
					1200
				);
				setScrollingEnabled(true);
			} catch (err) {}
		}
	}, [dayToTravelTo]);

	function scrollToIndexFailed(error) {
		setScrollingEnabled(false);
		const offset = error.averageItemLength * error.index;
		flatListRef.current.scrollToOffset({ offset });

		setTimeout(
			() => flatListRef.current.scrollToIndex({ index: error.index }),
			100
		);
		setScrollingEnabled(true);
	}

	// useEffect(() => {
	// 	props.navigation.setOptions({
	// 		headerTitle: moment(monthDisplayed['currentMonth']).format("MMMM YYYY"),
	// 	});
	// }, [monthDisplayed, props.navigation]);

	//console.log(monthDisplayed)

	// const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
	// 	//console.log(viewableItems[0])
	// 	console.log(monthDisplayed)
	// 	const currentDateAtTop = new Date(Object.keys(viewableItems[0]["item"])[0]);
	// 	if (
	// 		currentDateAtTop.getMonth() !== monthDisplayed['currentMonth'].getMonth()
	// 	) {
	// 		//.log('not same month')
	// 		//console.log(currentDateAtTop.getMonth())
	// 		//console.log(monthDisplayed['currentMonth'].getMonth())
	// 		monthDisplayed = { 'currentMonth': currentDateAtTop };
	// 	}
	// 	//console.log("Visible items are", viewableItems);
	// 	//console.log("Changed in this iteration", changed);
	// }, []);

	useEffect(() => {
	
		setItems(getItems(events.slice(), dateToLoad));
		//setLoading(false)
		props.navigation.setOptions({
			headerTitle: moment(dateToLoad).format("MMMM YYYY"),
		});
	}, [events, dateToLoad]);

	// if(loading){
	// 	return <ActivityIndicator
	// 	animating={true}
	// 	style={styles.indicator}
	// 	size="large"
	// 	/>
	// }

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
							borderColor: customTheme["color-primary-400"],
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
								backgroundColor: theme === 'dark' ? customTheme["color-primary-600"] : customTheme["color-primary-300"],
								borderColor: theme === 'dark' ? customTheme["color-primary-400"] : customTheme["color-primary-600"],
								borderWidth: 1,
								marginBottom: 5
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
												<Layout style={{ borderRadius: 10, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
												<Ionicons
													name={action.iconName}
													color={theme === 'dark' ? 'white' : 'black'}
													size={18}
												/></Layout>
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
						keyExtractor={(item) => item.id.toISOString()}
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
									<Layout level="2" style={{flex: 1}}>
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
													color={theme === 'dark' ? 'white' : customTheme['color-primary-300']}
													studyFlowActive={studyFlowActive}
													toggleStudyFlow={toggleStudyFlow}
												/>
											)}
											header={(props) => (
												<Header {...props} item={itemData.item} color={theme === 'dark' ? 'white' : customTheme['color-primary-300']}/>
											)}
										>
											<View style={{ flexDirection: "row" }}>
												<Ionicons
													name={iconName}
													color={customTheme["color-primary-600"]}
													size={24}
												>
													<Text
														category="h6"
														style={{ color: theme === 'dark' ? 'white' : customTheme["color-primary-600"] }}
													>
														{" " + itemData.item.title}
													</Text>
												</Ionicons>
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
				keyExtractor={(item) => item["key"]}
				style={{ width: "100%" }}
				data={items}
				renderItem={EventItem}
				//getItemLayout={getItemLayout}
				scrollToIndexFailed={scrollToIndexFailed}
				scrollEnabled={scrollingEnabled}
			/>
			<FloatingAction
				color={customTheme["color-primary-600"]}
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
	return {
		headerTitle: navData.route.params
			? navData.route.params.currentMonth
			: moment().format("MMMM"),
		headerTitleStyle: { color: customTheme["color-primary-500"], fontFamily: 'yellow-tail', fontSize: 30, paddingHorizontal: 4 },
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
		color: '#ccc',
		fontSize: 19,
	},
	dayNumber: {
		color: customTheme["color-primary-500"],
		fontSize: 22,
	},
	indicator: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: 80
	  }
});

export default ScheduleScreen;
