import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { Text, Divider } from "@ui-kitten/components";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import {
	getStudyFlow,
	generateTimeline,
	convertActivityToTimeline,
} from "../helpers/functions";
import { Ionicons } from "@expo/vector-icons";
import { default as CustomTheme } from "../assets/UIkitten/custom-theme.json";

const Interval = (props) => {
	
	let itemColor;
	switch (props.item.eventType) {
		case "study":
			itemColor =
				props.theme === "dark" ? "white" : CustomTheme["color-primary-500"];
			break;
		case "break":
			itemColor =
				props.theme === "dark" ? CustomTheme["color-primary-500"] : "black";
			break;
		case "feedback":
			itemColor = "black";
			break;
		default:
			itemColor = "#bbb";
	}
	let lineColor =
		props.theme === "dark" ? "white" : CustomTheme["color-primary-500"];
	return (
		<View
			style={
				props.selected
					? {
							...styles.intervalContainer,
							...styles.shadow,
							shadowColor: lineColor,
					  }
					: { ...styles.intervalContainer }
			}
		>
			<Divider style={{ height: 2, backgroundColor: lineColor, width: 75 }} />
			<View style={{ alignItems: "center", justifyContent: "center" }}>
				<View
					style={{
						position: "absolute",
						width: 70,
						top: 48,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							flex: 1,
							fontSize: 14,
							color:
								props.theme === "dark"
									? props.item.eventType === "break"
										? CustomTheme["color-primary-500"]
										: "white"
									: props.item.eventType === "break"
									? "black"
									: props.item.eventType === "feedback"
									? "black"
									: CustomTheme["color-primary-500"],
						}}
					>
						{props.item.time}
					</Text>
				</View>
				<View
					style={{
						position: "absolute",
						width: 140,
						top: -34,
						alignItems: "center",
					}}
				>
					<Text
						style={{
							flex: 1,
							fontFamily: "yellow-tail",
							fontSize: 20,
							paddingHorizontal: 2,
							color:
								props.theme === "dark"
									? props.item.eventType === "break"
										? CustomTheme["color-primary-500"]
										: "white"
									: props.item.eventType === "break"
									? "black"
									: props.item.eventType === "feedback"
									? "black"
									: CustomTheme["color-primary-500"],
						}}
					>
						{props.item.title}
					</Text>
				</View>
				<View
					style={
						props.selected
							? {
									...styles.shadow,
									shadowColor: lineColor,
									borderRadius: 22,
									padding: 9,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: itemColor,
							  }
							: {
									borderRadius: 22,
									padding: 9,
									alignItems: "center",
									justifyContent: "center",
									backgroundColor: itemColor,
							  }
					}
				>
					<Ionicons
						name={props.item.iconName}
						color={
							props.item.eventType === "break"
								? props.theme === "dark"
									? "white"
									: "white"
								: props.theme === "dark"
								? props.item.eventType === "feedback"
									? "white"
									: "black"
								: "white"
						}
						size={22}
					/>
				</View>
			</View>
			{props.item.duration && (
				<View
					style={{
						position: "absolute",
						width: 45,
						right: -25,
						top: 60,
						alignItems: "center",

						borderRadius: 10,
						padding: 2.5,
					}}
				>
					<Text style={{ flex: 1, fontSize: 12 }}>{props.item.duration}m</Text>
				</View>
			)}

			<Divider style={{ height: 2, backgroundColor: lineColor, width: 65 }} />
		</View>
	);
};

const getItemLayout = (data, index) => ({
	length: 145,
	offset: 145 * index,
	index,
});

const HorizontalTimeline = (props) => {
	const flatListRef = useRef(null);
	const [newIndex, setNewIndex] = useState(1);
	
	const event = useSelector((state) =>
		state.events.events.find(
			(event) => event.id.toString() === props.eventId
		)
	);
	const activity = useSelector(
		(state) =>
			state.events.activities.filter(
				(activity) => activity.eventId.toString() === props.eventId
			)[0]
	);
	const studyFlowConfig = useSelector((state) => state.studyFlow.config);
	const theme = useSelector((state) => state.theme.theme);
	const [initialData, setInitialData] = useState(
		generateTimeline(
			getStudyFlow(event, studyFlowConfig.studyTime, studyFlowConfig.breakTime),
			studyFlowConfig.studyTime,
			studyFlowConfig.breakTime,
			new Date(event.date)
		)
	);
	// useEffect(() => {
	// 	const sessionPreview = getStudyFlow(
	// 		event,
	// 		studyFlowConfig.studyTime,
	// 		studyFlowConfig.breakTime
	// 	);
	// 	const data = generateTimeline(
	// 		sessionPreview,
	// 		studyFlowConfig.studyTime,
	// 		studyFlowConfig.breakTime,
	// 		new Date(event.date)
	// 	);
	// });

	//JSO - description, icon, time, title
	//activity && console.log(convertActivityToTimeline(event.date, activity))


	useEffect(() => {
		
		if (props.miniSessionId !== newIndex) {
			setNewIndex(props.miniSessionId);
		}
	}, [props.miniSessionId]);


	useEffect(() => {
		if (flatListRef.current && newIndex >= 1) {
			try {
				setTimeout(
					() => flatListRef.current.scrollToIndex({ index: newIndex - 1 }),
					100
				);
			} catch (err) {}
		}
	}, [newIndex]);

	return (
		<FlatList
			ref={flatListRef}
			style={{ flexGrow: 0, height: 160, width: "100%", opacity: props.blur ? 0.1 : 1}}
			contentContainerStyle={{ height: 160 }}
			data={activity ? convertActivityToTimeline(activity) : initialData}
			keyExtractor={
				activity ? (item) => item.id.toString() : (item) => item.time
			}
			
			renderItem={(itemData) => {
				let selected;
				if (activity) {
					selected = props.miniSessionId
						? props.miniSessionId === itemData.item.id
							? true
							: false
						: false;
				} else {
					selected = false;
				}
				return (
					<Interval item={itemData.item} theme={theme} selected={selected} />
				);
			}}
			horizontal={true}
			showsHorizontalScrollIndicator={false}
			getItemLayout={getItemLayout}
		></FlatList>
	);
};

export default HorizontalTimeline;

const styles = StyleSheet.create({
	intervalContainer: {
		width: 145,
		height: 160,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		flexGrow: 0,
	},
	shadow: {
		shadowColor: "red",
		shadowOffset: { width: 0, height: -0.5 },
		shadowOpacity: 1,
		shadowRadius: 27,
		elevation: 24,
	},
});
