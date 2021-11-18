import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
	TouchableOpacity,
	TouchableNativeFeedback
} from "react-native";
import {
	Layout,
	Text,
	Divider,
	Input,
	Datepicker,
	Button,
} from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";
import TagsView from "../../components/TagsView";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as eventsActions from "../../store/actions/events";
import { combineDateWithTime } from "../../helpers/functions";
import * as currentEventRepeatActions from "../../store/actions/currentEventRepeat";
import { colorTheme } from "../../data/products";


//const tags = ["IT", "Maths", "Biology", "History", "English", "ESL", "OOPS", "Calculus", "Principles of Computing"];

const CalendarIcon = (props) => {
	return <Ionicons name="calendar-outline" color={props.color} size={16} />;
};

const PencilIcon = (props) => {
	return <Ionicons name="pencil-outline" color={props.color} size={16} />;
};

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const AddItemToCalendarScreen = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const dispatch3 = useDispatch();
	const dispatch4 = useDispatch()
	const dateLoaded = useSelector((state) => state.events.dateToTravelTo);
	const theme = useSelector((state) => state.theme.theme);
	const tags = useSelector((state) => state.subject.subjects);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)
	const repeatOn = useSelector(
		(state) => state.currentEventRepeat.repeatConfig
	);
	const [selectedSubjects, setSelectedSubjects] = useState([]);
	const [firstClear, setFirstClear] = useState(false);
	const [date, setDate] = useState(
		props.route.params.day ? new Date(props.route.params.day) : new Date()
	);
	const [time, setTime] = useState(new Date());
	const [duration, setDuration] = useState(new Date("12/12/2021 01:30:00"));
	const [show, setShow] = useState(Platform.OS === "ios");

	const setSelectedSubjectsHandler = (selected) => {
		setSelectedSubjects(selected);
	};

	const type = props.route.params.type;
	let titleMessage = "What subjects will you study?";
	let customName = "study session";
	let initialTitle = "Study Session";
	let exclusive = false;
	let studyFlowMode = true;
	switch (type) {
		case "assessment":
			titleMessage = "What subject is this assessment for?";
			customName = "assessment";
			exclusive = true;
			initialTitle = "Assessment";
			break;
		case "homework":
			titleMessage = "What subject is this homework from?";
			customName = "homework event";
			initialTitle = "Homework";
			break;
		case "other":
			titleMessage = "Select relevant subjects:";
			customName = "event";
			initialTitle = "";
			break;
		case "lecture":
			titleMessage = "Select relevant Lecture: ";
			customName = "lecture";
			initialTitle = "Lecture";
			exclusive = true;
			break;
	}

	const onChangeTime = (event, selectedTime) => {
		setShow(Platform.OS === "ios");
		setTime(selectedTime);
	};

	const onChangeDurationHandler = (event, selectedDuration) => {
		setDuration(selectedDuration);
	};

	const [eventTitle, setEventTitle] = useState(initialTitle);

	const handlePress = () => {
		const selectedDate = combineDateWithTime(date, time);
		let finalTitle = "Event";
		if (eventTitle === "") {
			switch (type) {
				case "study-session":
					finalTitle = "Study Session";
					break;
				case "assessment":
					finalTitle = "Assessment";
					break;
				case "homework":
					finalTitle = "Homework";
					break;
			}
		} else {
			finalTitle = eventTitle;
		}
		dispatch(
			eventsActions.addEvent(
				finalTitle,
				duration,
				selectedDate,
				selectedSubjects,
				type,
				studyFlowMode,
				repeatOn
			)
		);
		let copyOfSelectedDate = new Date(selectedDate);

		if (dateLoaded !== copyOfSelectedDate.setDate(1)) {
			dispatch3(eventsActions.updateDateToTravelTo(copyOfSelectedDate));
		}
		dispatch2(eventsActions.updateDayToTravelTo(selectedDate.getDate()));
		// props.navigation.navigate("StartFlowStack", {
		// 	screen: 'StartFlow',
		// });

		props.navigation.goBack();

		//props.navigation.replace("Schedule");
	};

	useEffect(() => {
		dispatch4(currentEventRepeatActions.setEventRepeat([]))
	}, [])

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<HeaderButtons HeaderButtonComponent={HeaderButton}>
					<Item
						title="Add"
						iconName={"add-circle-outline"}
						onPress={handlePress}
					/>
				</HeaderButtons>
			),
		});
	}, [eventTitle, duration, date, time, selectedSubjects, type, studyFlowMode]);
	return (
		<Layout level="2" style={{ flex: 1 }}>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.screen}>
							<View
								style={{
									marginTop: 20,
									marginBottom: 8,

									width: "100%",
									alignItems: "flex-start",
								}}
							>
								<Text style={styles.textTitle}>
									Title {"&"} Duration {">"}
								</Text>
							</View>
							<Divider style={{ alignSelf: "stretch", marginBottom: 15 }} />
							<View
								style={{
									flexDirection: "row",
									width: "100%",
									justifyContent: "space-around",
									alignItems: "center",
								}}
							>
								<Input
									placeholder=""
									value={eventTitle}
									onChangeText={(text) => setEventTitle(text)}
									style={{ flex: 2 }}
									onFocus={() => {
										if (!firstClear) {
											setFirstClear(true);
											setEventTitle("");
										}
									}}
									textStyle={{ minHeight: 42 }}
									accessoryLeft={
										<PencilIcon color={theme === "dark" ? "white" : "black"} />
									}
									multiline={true}
								/>
								{show && (
									<View
										style={{
											flex: 1,
											marginLeft: 10,
											flexDirection: "row",
											alignItems: "center",
											borderColor: colorTheme[colorThemeIndex].source["color-primary-500"],
											borderLeftWidth: 1,
											paddingLeft: 4,
										}}
									>
										<Ionicons
											name="timer-outline"
											color={theme === "dark" ? "white" : "black"}
											size={16}
										/>
										<DateTimePicker
											style={{
												flex: 2,
												minWidth: 65,
												marginLeft: 6,
												marginRight: 2,
											}}
											value={duration}
											is24Hour={true}
											mode="time"
											display={
												Platform.OS === "android" ? "spinner" : "default"
											}
											onChange={onChangeDurationHandler}
											themeVariant={theme}
										/>
										<Text>Hrs</Text>
									</View>
								)}
							</View>
							<View
								style={{
									marginTop: 20,
									marginBottom: 8,

									width: "100%",
									alignItems: "flex-start",
								}}
							>
								<Text style={styles.textTitle}>
									Date {"&"} Time{" >"}
								</Text>
							</View>
							<Divider style={{ alignSelf: "stretch", marginBottom: 15 }} />
							<View
								style={{
									flexDirection: "row",
									width: "100%",
									justifyContent: "space-around",
									alignItems: "center",
								}}
							>
								<Datepicker
									style={{ flex: 2, textAlign: "left" }}
									date={date}
									onSelect={(nextDate) => setDate(nextDate)}
									accessoryLeft={
										<CalendarIcon
											color={theme === "dark" ? "white" : "black"}
										/>
									}
									accessoryRight={<View></View>}
									min={
										new Date(
											new Date().setFullYear(new Date().getFullYear() - 2)
										)
									}
									max={
										new Date(
											new Date().setFullYear(new Date().getFullYear() + 2)
										)
									}
								/>
								{show && (
									<View
										style={{
											flex: 1,
											marginLeft: 10,
											flexDirection: "row",
											alignItems: "center",
											borderColor: colorTheme[colorThemeIndex].source["color-primary-500"],
											borderLeftWidth: 1,
											paddingLeft: 4,
										}}
									>
										<Ionicons
											name="alarm-outline"
											color={theme === "dark" ? "white" : "black"}
											size={16}
										/>
										<DateTimePicker
											style={{
												flex: 1,
												minWidth: 65,
												marginLeft: 6,
												marginRight: 2,
											}}
											value={time}
											is24Hour={true}
											mode="time"
											display={
												Platform.OS === "android" ? "spinner" : "default"
											}
											onChange={onChangeTime}
											themeVariant={theme}
										/>
										<View stle={{ flex: 1 }}>
											<Text>Hrs</Text>
										</View>
									</View>
								)}
							</View>

							<View
								style={{
									marginTop: 25,
									marginBottom: 8,

									width: "100%",
									alignItems: "flex-start",
								}}
							>
								<Text style={styles.textTitle}>Subjects {">"}</Text>
							</View>
							<Divider style={{ alignSelf: "stretch" }} />
							<TagsView
								all={tags}
								selected={selectedSubjects}
								setSelectedItems={setSelectedSubjects}
								isExclusive={exclusive}
								onPressAdd={() => {
									props.navigation.navigate("Subjects");
								}}
							/>
							<Divider style={{ alignSelf: "stretch" }} />
							<TouchableCmp
								onPress={() => {
									props.navigation.navigate("ChooseRepeatFrequency");
								}}
							>
								<View
									style={{
										marginTop: 8,
										marginBottom: 8,
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
								>
									<Text style={styles.textTitle}>Repeat {">"}</Text>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "center",
										}}
									>
										<Text style={{ fontSize: 15 }}>
											{repeatOn.length === 0 ? "Never" : (repeatOn.length === 7 ? 'Daily' : repeatOn.length + ' days')}
										</Text>
										<View
											style={{
												backgroundColor: colorTheme[colorThemeIndex].source["color-primary-500"],
												padding: 4,
												borderRadius: 10,
												paddingLeft: 12,
												paddingRight: 10,
												marginLeft: 10,
											}}
										>
											<Ionicons name="repeat-outline" color="white" size={24} />
										</View>
									</View>
								</View>
							</TouchableCmp>
							<Divider style={{ alignSelf: "stretch" }} />
							<Button
								style={{ marginTop: 20 }}
								size="giant"
								onPress={handlePress}
							>
								{"Add " + customName} {" >"}
							</Button>
						</View>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</Layout>
	);
};

export const screenOptions = () => {
	return {
		headerTitle: "Add event",
	};
};

const styles = StyleSheet.create({
	screen: {
		marginHorizontal: 15,
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: "flex-start",
		justifyContent: "center",
	},
	title: {
		marginBottom: 50,
	},
	textTitle: {
		fontSize: 16,
		fontWeight: "500",
	},
});

export default AddItemToCalendarScreen;
