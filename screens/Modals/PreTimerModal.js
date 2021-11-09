import React, { useState, useEffect } from "react";
import {
	Platform,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	TouchableOpacity,
	TouchableNativeFeedback,
} from "react-native";
import { Text, Layout, Toggle, Divider } from "@ui-kitten/components";
import LabelsList from "../../components/LabelsList";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import * as studyFlowActions from "../../store/actions/studyFlow";
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import HorizontalTimeline from "../../components/HorizontalTimeline";
import TagsView from "../../components/TagsView";
import {
	getFormattedEventType,
	getIconStringBasedOnEventType,
} from "../../helpers/functions";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const PreTimerModal = (props) => {
	const timeConfig = useSelector((state) => state.studyFlow.config);
	const theme = useSelector((state) => state.theme.theme);
	const events = useSelector((state) => state.events.events);
	const subjects = useSelector((state) => state.subject.subjects);
    const [currentEvent, setCurrentEvent] = useState(events.filter((event) => event.id.toString() === props.route.params.eventId)[0])
    console.log('hey1')
	console.log(currentEvent);
    console.log('ehy 3')
    const [showedSubjects, setshowedSubjects] = useState(currentEvent.subjects);
	const [selectedSubjects, setSelectedSubjects] = useState([]);
	const [showingAll, setShowingAll] = useState(false);
    console.log('hey1')
	console.log(currentEvent);
    console.log('ehy 3')

	const onPressShowAll = () => {
		if (showingAll) {
			setshowedSubjects(currentEvent.subjects);
			setShowingAll(false);
		} else {
			setshowedSubjects(subjects);
			setShowingAll(true);
		}
	};

    // useEffect(() => {
    //     setCurrentEvent(events.filter((event) => event.id.toISOString() === props.route.params.eventId)[0])
    // }, [props.route.params.eventId])

	const themeStylesLight = {
		divider: {
			backgroundColor: "#ddd",
			height: 1,
			alignSelf: "stretch",
		},
	};

	const themeStylesDark = {
		divider: {
			height: 1,
			alignSelf: "stretch",
		},
	};

	const studyTimeRepresentation = moment(
		new Date(0, 0, 0, 0, timeConfig.studyTime, 0)
	).format("HH:mm");
	const breakTimeRepresentation = moment(
		new Date(0, 0, 0, 0, timeConfig.breakTime, 0)
	).format("HH:mm");

	const handleStudyFlowPress = () => {
		props.navigation.navigate("EditStudyFlow");
	};

	return (
		<ScrollView contentContainerStyle={styles.screen}>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "center",
					right: 6,
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
							theme === "dark" ? "white" : CustomTheme["color-primary-500"],
					}}
				>
					{" "}
					{getFormattedEventType(currentEvent.type)}
				</Text>
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
			<HorizontalTimeline eventId={props.route.params.eventId} />

			<Divider
				style={
					theme === "dark" ? themeStylesDark.divider : themeStylesLight.divider
				}
			/>
			<View
				style={{
					width: "100%",
					paddingHorizontal: 8,
					marginVertical: Dimensions.get("window").height / 60,
					alignItems: "flex-start",
				}}
			>
				{/* <View style={{...styles.subjectTitleContainer, borderColor: theme === 'dark' ? 'white' :'black'}}><Text style={{...styles.subTitle, color: theme === 'dark' ? 'white' : 'black'}}>#1 Study Interval subject</Text></View> */}
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
				/>
			</View>
			<Divider
				style={
					theme === "dark" ? themeStylesDark.divider : themeStylesLight.divider
				}
			/>
			<View style={styles.timeConfigContainer}>
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
					<Text style={{ fontSize: 18, paddingHorizontal: 12, color: "white" }}>
						Edit
					</Text>
				</TouchableCmp>
			</View>

			<Divider
				style={
					theme === "dark" ? themeStylesDark.divider : themeStylesLight.divider
				}
			/>
			<View
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
						Start study time {">"}
					</Text>
				</TouchableCmp>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
		height: 200,
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
});

export default PreTimerModal;
