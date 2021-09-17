import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Platform,
	TouchableOpacity,
	TouchableNativeFeedback,
	View,
} from "react-native";
import { Agenda } from "react-native-calendars";
import { Card, Layout, Button, Text } from "@ui-kitten/components";
import moment from "moment";
import { FloatingAction } from "react-native-floating-action";
import { useSelector, useDispatch } from "react-redux";
import { getIconStringBasedInEventType } from "../../helpers/functions";
import { Ionicons } from "@expo/vector-icons";
import * as eventsActions from "../../store/actions/events";

const actions = [
	{
		text: "Other",
		icon: require("../../assets/icons/other.png"),
		name: "other",
		position: 1,
	},
	{
		text: "Homework",
		icon: require("../../assets/icons/reader.png"),
		name: "homework",
		position: 2,
	},
	{
		text: "Assessment",
		icon: require("../../assets/icons/school.png"),
		name: "assessment",
		position: 3,
	},
	{
		text: "Study Session",
		icon: require("../../assets/icons/glasses.png"),
		name: "study-session",
		position: 4,
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

const Footer = (props) => (
	<View {...props} style={[props.style, styles.footerContainer]}>
		<Button
			style={styles.footerControl}
			onPress={() => {
				props.deleteHandler(props.item.id);
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="trash-outline" size={14} />
			Remove
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
			<Text category="s2" style={{ fontSize: 12 }}>
				{props.item.timeRange}
			</Text>
		</View>
	);
};

function getEventTimeString(eventDate) {
	let tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(eventDate - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

function rowHasChanged(r1, r2) {
	return !(r1.id !== r2.id);
}

const ScheduleScreen = (props) => {
	const subjects = useSelector((state) => state.subject.subjects);
	const events = useSelector((state) => state.events.events);
	//const [loadedEvents, setLoadedEvents] = useState([]);
	const [items, setItems] = useState({});
	const [currentMonth, setCurrentMonth] = useState();
	const dispatch = useDispatch();
	const animation = useRef(null);
	const [dayPressed, setDayPressed] = useState(new Date());

	const deleteEventHandler = (id) => {
		dispatch(eventsActions.deleteEvent(id));
	};

	useEffect(() => {
		setItems({});
	}, [events]);

	useEffect(() => {
		if (Object.keys(items).length === 0) {
			loadItemsMonth();
		}
	}, [items]);

	function loadItemsMonth(day) {
		console.log(items)
		setTimeout(() => {
			//console.log(day);
			let date;
			if (day) {
				date = day.timestamp;
				setCurrentMonth(day.timestamp);
			} else {
				date = currentMonth;
			}

			if (!date) {
				date = Date.now();
			}
			//loading empty items 365 days prior and 365 days after(if not already)
			for (let i = -60; i < 85; i++) {
				let strTime;

				//date = Date.now();
				const time = date + i * 24 * 60 * 60 * 1000;
				strTime = timeToString2(time);
				//console.log(strTime);

				if (!items[strTime]) {
					items[strTime] = [];
					events.map((event) => {
						const eventTime = getEventTimeString(event.date);
						if (eventTime === strTime) {
							let range = getRange(event.date, event.duration);
							items[strTime].push({
								id: event.id,
								title: event.title,
								timeRange: range,
								subjects: event.subjects,
								type: event.type,
								height: 200,
							});
						}
					});
					// if (items[strTime].length === 0){
					// 	items[strTime].push({height: 200})
					// }
				}
			}

			// addEvent = true;
			// for (let j = 0; j < events.lenght; j++) {
			// 	for (let i = 0; i < loadedEvents.length; i++) {
			// 		if (events[j].id === loadedEvents[i].id) {
			// 			console.log(false)
			// 			addEvent = false;
			// 		}
			// 	}
			// 	if (addEvent) {
			// 		console.log('added event')
			// 		strTime = getEventTimeString(events[j]);
			// 		items[strTime] = [{ title: events[i].title, height: 200 }];
			// 		loadedEvents.push(events[i]);
			// 	}
			// }

			// update state -> loadedEvents
			// const newLoadedEvents = loadedEvents.slice();
			// setLoadedEvents(newLoadedEvents);

			// update state -> items
			const newItems = {};
			Object.keys(items).forEach((key) => {
				newItems[key] = items[key];
			});
			setItems(newItems);
		}, 500);
	}

	const renderItem = (item) => {
		const iconName = getIconStringBasedInEventType(item.type);
		return (
			<TouchableCmp>
				<Card
					style={styles.card}
					footer={(props) => (
						<Footer {...props} item={item} deleteHandler={deleteEventHandler} />
					)}
					header={(props) => <Header {...props} item={item} />}
				>
					<View style={{ flexDirection: "row" }}>
						<Ionicons name={iconName} size={18}>
							<Text category="h6">{" " + item.title}</Text>
						</Ionicons>
					</View>
				</Card>
			</TouchableCmp>
		);
	};

	const renderEmptyDate = (info) => {
		return (
			<TouchableCmp
				onPress={() => {
					setDayPressed(info);
					animation.current.animateButton();
				}}
			>
				<Card
					onPress={() => {
						setDayPressed(info);
						animation.current.animateButton();
					}}
					style={{
						...styles.card,
						height: 95,
						justifyContent: "center",
						backgroundColor: "#F0F0F2",
						borderColor: "white",
						borderWidth: 2,
					}}
				>
					<TouchableCmp
						onPress={() => {
							setDayPressed(info);
							animation.current.animateButton();
						}}
						style={{}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								marginRight: 3,
							}}
						>
							<Ionicons name="add-circle-outline" size={20} />
							<View
								style={{
									marginLeft: 4,
									marginBottom: 1,
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Text style={{ fontSize: 19 }}>Add event</Text>
							</View>
						</View>
					</TouchableCmp>
				</Card>
			</TouchableCmp>
		);
	};

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView />
			<Agenda
				items={items}
				loadItemsForMonth={(day) => {
					loadItemsMonth(day);
				}}
				renderEmptyDate={renderEmptyDate}
				selected={() => getDateToday()}
				renderItem={(item) => {
					return renderItem(item);
				}}
				showClosingKnob={true}
				//hideExtraDays={false}
				pastScrollRange={6}
				//futureScrollRange={12}
				rowHasChanged={rowHasChanged}
				// minDate={"2021-08-10"}
				// Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
				// maxDate={"2012-05-30"}
				styles={{ justifyContent: "center", alignItems: "center" }}
			/>
			<FloatingAction
				ref={animation}
				actions={actions}
				onClose={() => setDayPressed(new Date())}
				onPressItem={(name) => {
					props.navigation.navigate("AddItemToCalendar", {
						type: name,
						day: dayPressed.toISOString(),
					});
				}}
			/>
		</Layout>
	);
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
});

export default ScheduleScreen;
