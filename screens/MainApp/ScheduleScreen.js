import React, { useState } from "react";
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

const actions = [
	{
		text: "Other",
		icon: require("../../assets/icons/other.png"),
		name: "other",
		position: 1,
	},
	{
		text: "Lecture",
		icon: require("../../assets/icons/school.png"),
		name: "lecture",
		position: 2,
	},
	{
		text: "Assessment",
		icon: require("../../assets/icons/reader.png"),
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

const timeToString = (time) => {
	const date = new Date(time);
	return date.toISOString().split("T")[0];
};

const getDateToday = () => {
	return moment(new Date()).format("YYYY-MM-DD");
};

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	touchableCmp = TouchableNativeFeedback;
}

const Footer = (props) => (
	<View {...props} style={[props.style, styles.footerContainer]}>
		<Button style={styles.footerControl} size="small" status="basic">
			Remove
		</Button>
		<Button style={styles.footerControl} size="small">
			Edit
		</Button>
	</View>
);

const ScheduleScreen = (props) => {
	const [items, setItems] = useState({});

	const loadItems = (day) => {
		setTimeout(() => {
			for (let i = -15; i < 85; i++) {
				const time = day.timestamp + i * 24 * 60 * 60 * 1000;
				const strTime = timeToString(time);
				if (!items[strTime]) {
					items[strTime] = [];
					const numItems = Math.floor(Math.random() * 3 + 1);
					for (let j = 0; j < numItems; j++) {
						items[strTime].push({
							name: "Item for " + strTime + " #" + j,
							height: Math.max(50, Math.floor(Math.random() * 150)),
						});
					}
				}
			}
			const newItems = {};
			Object.keys(items).forEach((key) => {
				newItems[key] = items[key];
			});
			setItems(newItems);
		}, 1000);
	};

	const renderItem = (item) => {
		return (
			<TouchableCmp>
				<Card style={styles.card} footer={Footer}>
					<Text>{item.name}</Text>
				</Card>
			</TouchableCmp>
		);
	};

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView />
			<Agenda
				items={items}
				loadItemsForMonth={loadItems}
				selected={getDateToday()}
				renderItem={renderItem}
				showClosingKnob={true}
			/>
			<FloatingAction
				actions={actions}
				onPressItem={(name) => {
					console.log(`selected button: ${name}`);
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
		marginRight: 10,
		marginTop: 15,
	},
	footerControl: {
		marginHorizontal: 2,
	},
});

export default ScheduleScreen;
