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


import {
	getStudyFlow,
	getIconStringBasedOnEventType,
} from "../../helpers/functions";
import HeaderButton from "../../components/HeaderButton";
import { FlatList, ScrollView } from "react-native-gesture-handler";

function timeToString2(time) {
	const date = new Date(time);
	// return date.toISOString().split("T")[0];

	let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(date - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

const Footer = (props) => (
	<View {...props} style={[props.style, styles.footerContainer]}>
		<Button
			style={styles.footerControl}
			onPress={() => {
				props.previewHandler(props.item.id.toISOString());
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="eye-outline" size={14} /> Preview
		</Button>
		<Button
			style={styles.footerControl}
			onPress={() => {
				props.deleteHandler(props.item.id);
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="trash-outline" size={14} /> Remove
		</Button>
	</View>
);

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
				{getRange(props.item.date, props.item.duration)}
			</Text>
		</View>
	);
};

// {eventsToday.map((event) => {
// 	const iconName = getIconStringBasedOnEventType(event.type);

// 	return (
// 		<View style={styles.cardContainer} key={event.id}>
// 			<Card
// 				style={styles.card}
// 				footer={(props) => (
// 					<Footer
// 						{...props}
// 						item={event} //deleteHandler={deleteEventHandler}
// 					/>
// 				)}
// 				header={(props) => <Header {...props} item={event} />}
// 			>
// 				<View style={{ flexDirection: "row" }}>
// 					<Ionicons name={iconName} size={18}>
// 						<Text category="h6">{" " + event.title}</Text>
// 					</Ionicons>
// 				</View>
// 			</Card>
// 		</View>
// 	);
// })}

const StartFlowScreen = (props) => {
	// get all events for today
	const dispatch = useDispatch();
	const eventsToday = useSelector((state) =>
		state.events.events.length > 0
			? state.events.events.filter(
					(event) =>
						moment(event.date).isSame(moment(), "day") &&
						(event.type === "study-session" ||
							event.type === "homework" ||
							event.type === "other")
			  )
			: state.events.events
	);

	const [selectedEventId, setSelectedEventId] = useState(null);
	const deleteEventHandler = (id) => {
		dispatch(eventsActions.deleteEvent(id));
	};
	const previewEventHandler = (id) => {
		props.navigation.navigate("EventPreview", {
			id: id,
		});
	};

	return eventsToday.length === 0 ? (
		<Layout level={"2"} style={styles.screen}>
			<TouchableWithoutFeedback
				onPress={() => {
					props.navigation.navigate("ChooseEventType");
				}}
				style={{flex: 1}}
			><View style={{ alignItems: "center", justifyContent: "center", flex: 1}}>
				<View style={{marginTop: 16, alignItems: "center", justifyContent: "center", width: '100%', backgroundColor: CustomTheme['color-primary-500'], padding: 7, borderRadius: 8}}>
				<Text category={"h6"} style={{ color: 'white' }}>
					No events planned for today
				</Text>
				</View>
				<View
					style={{ alignItems: "center", justifyContent: "center", flex: 1, marginTop: -38 }}
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
	) : (
		<Layout level={"2"} style={styles.screen}>
			<View style={{ marginTop: 12 }}>
				<Text category={"h5"} style={{ color: CustomTheme["color-primary-600"] }}>
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
						const iconName = getIconStringBasedOnEventType(itemData.item.type);

						return (
							<TouchableCmp
								onPress={() => {
									if (itemData.item.id === selectedEventId) {
										setSelectedEventId(null);
									} else {
										setSelectedEventId(itemData.item.id);
									}
								}}
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
										/>
									)}
									header={(props) => <Header {...props} item={itemData.item} />}
								>
									<View style={{ flexDirection: "row" }}>
										<Ionicons name={iconName} size={18}>
											<Text category="h6">{" " + itemData.item.title}</Text>
										</Ionicons>
									</View>
								</Card>
							</TouchableCmp>
						);
					}}
				></FlatList>
			</View>
			<Divider style={{ width: "95%" }} />
			<View style={styles.optionsContainer}>
				<Button style={{ marginTop: 30 }} size="giant" onPress={() => {}}>
					{"Start Session "} {" >"}
				</Button>
			</View>
		</Layout>
	);
};

export default StartFlowScreen;

export const screenOptions = (navData) => {
	return {
		headerTitle: () => (
			<View style={{flex: 1}}><Text style={{fontFamily: 'yellow-tail', fontSize: 30, color: CustomTheme['color-primary-500'], flex: 1, minWidth: 117}}>StudyFlow</Text></View>
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
		width: '80%'
		
	},
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
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
		shadowOffset: { width: 1, height: 4 },
		shadowOpacity: 5,
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
	footerControl: {
		marginHorizontal: 2,
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
