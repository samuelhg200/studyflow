import React from "react";
import {
	StyleSheet,
	View,
	TouchableNativeFeedback,
	TouchableOpacity,
} from "react-native";
import {
	Layout,
	Text,
	Divider,
	Input,
	Datepicker,
	Button,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import customTheme from "../../assets/UIkitten/custom-theme.json";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

function timeToString2(time) {
	const date = new Date(time);
	// return date.toISOString().split("T")[0];

	let tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
	let localISOTime = new Date(date - tzoffset).toISOString();
	return localISOTime.split("T")[0];
}

const actions = [
	{
		text: "Study Session",
		icon: "glasses-outline",
		name: "study-session",
		position: 4,
		color: customTheme["color-primary-500"],
	},{
		text: "Assessment",
		icon: "school-outline",
		name: "assessment",
		position: 3,
		color: customTheme["color-primary-500"],
	},
	{
		text: "Homework",
		icon: "reader-outline",
		name: "homework",
		position: 2,
		color: customTheme["color-primary-500"],
	},
	
	{
		text: "Other",
		icon: "ellipsis-horizontal-outline",
		name: "other",
		position: 1,
		color: customTheme["color-primary-500"],
	},
];

const ChooseEventType = (props) => {
	return (
		<Layout style={styles.screen}>
			<View style={{marginVertical: 20}}><Text style={{color: customTheme['color-primary-400']}}category={"h5"}>Choose an event type</Text></View>
			{actions.map((type) => {
				return (
					<TouchableCmp
						key={type.name}
						onPress={() => {
                            props.navigation.goBack()
							props.navigation.navigate("AddItemToCalendar", {
                                // screen: 'AddItemToCalendar',
                                // params: {
                                    type: type.name,
								day: timeToString2(new Date()),
                               // }
								
							});
						}}
						style={styles.rowContainer}
					>
						<View style={styles.row}>
							<View style={{ flex: 1, alignItems: "center" }}>
								<Ionicons name={type.icon} size={22} />
							</View>
							<View style={{ flex: 2 }}>
								<Text
									style={{
										fontSize: 22,
										color: customTheme["color-primary-400"],
									}}
								>
									{type.text}
								</Text>
							</View>
						</View>
					</TouchableCmp>
				);
			})}
		</Layout>
	);
};

export default ChooseEventType;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	rowContainer: {
		height: 60,
		margin: 20,
		borderColor: customTheme["color-primary-400"],
		borderWidth: 1,
		borderRadius: 4,
		width: "80%",
	},
	row: {
		flex: 1,
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
});
