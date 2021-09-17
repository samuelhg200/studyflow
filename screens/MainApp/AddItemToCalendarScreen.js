import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
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

//const tags = ["IT", "Maths", "Biology", "History", "English", "ESL", "OOPS", "Calculus", "Principles of Computing"];

const calendarIcon = (props) => {
	return <Ionicons name="calendar-outline" color={"black"} size={16} />;
};

const pencilIcon = (props) => {
	return <Ionicons name="pencil-outline" color={"black"} size={16} />;
};

const AddItemToCalendarScreen = (props) => {
	const dispatch = useDispatch();

	const tags = useSelector((state) => state.subject.subjects);
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
			initialTitle = "";
			studyFlowMode = false;
			break;
		case "homework":
			titleMessage = "What subject is this homework from?";
			customName = "homework event";
			initialTitle = "";
			break;
		case "other":
			titleMessage = "Select relevant subjects:";
			customName = "event";
			initialTitle = "";
			studyFlowMode = false;
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
		dispatch(
			eventsActions.addEvent(
				eventTitle,
				duration,
				combineDateWithTime(date, time),
				selectedSubjects,
				type,
				studyFlowMode
			)
		);
		props.navigation.navigate("Schedule");
	};
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
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollView>
				<Layout level="2" style={styles.container}>
					<View style={styles.screen}>
						<View
							style={{
								marginTop: 20,
								marginBottom: 6,

								width: "100%",
								alignItems: "flex-start",
							}}
						>
							<Text style={styles.textTitle}>
								What title and duration would you want for your {customName}?
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
								accessoryLeft={pencilIcon}
								multiline={true}
							/>
							{show && (
								<View
									style={{
										flex: 1,
										marginLeft: 10,
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Ionicons name="timer-outline" color={"black"} size={16} />
									<DateTimePicker
										style={{ flex: 2, marginLeft: 6, marginRight: 2 }}
										value={duration}
										is24Hour={true}
										mode="time"
										display={Platform.OS === "android" ? "spinner" : "default"}
										onChange={onChangeDurationHandler}
									/>
									<Text>Hrs</Text>
								</View>
							)}
						</View>
						<View
							style={{
								marginTop: 20,
								marginBottom: 6,

								width: "100%",
								alignItems: "flex-start",
							}}
						>
							<Text style={styles.textTitle}>
								When do you want to schedule it for?{" "}
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
								accessoryLeft={calendarIcon}
								accessoryRight={<View></View>}
							/>
							{show && (
								<View
									style={{
										flex: 1,
										marginLeft: 10,
										flexDirection: "row",
										alignItems: "center",
									}}
								>
									<Ionicons name="alarm-outline" color={"black"} size={16} />
									<DateTimePicker
										style={{ flex: 1, marginLeft: 6, marginRight: 2 }}
										value={time}
										is24Hour={true}
										mode="time"
										display={Platform.OS === "android" ? "spinner" : "default"}
										onChange={onChangeTime}
									/>
									<Text>Hrs</Text>
								</View>
							)}
						</View>

						<View
							style={{
								marginTop: 25,
								marginBottom: 6,

								width: "100%",
								alignItems: "flex-start",
							}}
						>
							<Text style={styles.textTitle}>{titleMessage} </Text>
						</View>
						<Divider style={{ alignSelf: "stretch" }} />
						<TagsView
							all={tags}
							selected={selectedSubjects}
							setSelectedItems={setSelectedSubjects}
							isExclusive={exclusive}
						/>
						<Divider style={{ alignSelf: "stretch" }} />
						<Button
							style={{ marginTop: 20 }}
							size="giant"
							onPress={handlePress}
						>
							{"Add " + customName} {" >"}
						</Button>
					</View>
				</Layout>
			</ScrollView>
		</TouchableWithoutFeedback>
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
		fontSize: 18,
		fontWeight: "600",
	},
});

export default AddItemToCalendarScreen;
