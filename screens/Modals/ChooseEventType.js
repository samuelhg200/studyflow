import React from "react";
import {
	StyleSheet,
	View,
	TouchableNativeFeedback,
	TouchableOpacity,
	Dimensions,
	Platform
} from "react-native";
import {
	Layout,
	Text,
	Divider,
	Input,
	Datepicker,
	Button,
} from "@ui-kitten/components";
import { useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { colorTheme } from "../../data/products";

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


const ChooseEventType = (props) => {
	const theme = useSelector(state => state.theme.theme)
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)


	const actions = [
		{
			text: "Study Session",
			icon: "glasses-outline",
			name: "studySession",
			position: 5,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
		},{
			text: "Assessment",
			icon: "school-outline",
			name: "assessment",
			position: 4,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
		},
		{
			text: "Homework",
			icon: "reader-outline",
			name: "homework",
			position: 3,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
		},
		{
			text: "Lecture",
			icon: "book-outline",
			name: "lecture",
			position: 2,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
		},
		{
			text: "Other",
			icon: "ellipsis-horizontal-outline",
			name: "other",
			position: 1,
			color: colorTheme[colorThemeIndex].source["color-primary-500"],
		},
	];

	return (
		<Layout style={styles.screen}>
			<View style={{marginVertical: 20}}><Text style={{color: colorTheme[colorThemeIndex].source['color-primary-600']}}category={"h5"}>Choose an event type</Text></View>
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
						style={{borderColor: colorTheme[colorThemeIndex].source['color-primary-500'] ,...styles.rowContainer}}
					>
						<View style={styles.row}>
							<View style={{ flex: 1, alignItems: "center" }}>
								<Ionicons name={type.icon} color={theme === 'dark' ?  'white' : 'black'} size={22} />
							</View>
							<View style={{ flex: 2 }}>
								<Text
									style={{
										fontSize: 22,
										color: theme === 'dark' ?  'white' : 'black',
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
		height: Dimensions.get('screen').height > 800 ? 60 : 55,
		margin: Dimensions.get('screen').height > 800 ? 18 : 10,
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
