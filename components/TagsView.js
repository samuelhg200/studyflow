import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
	View,
	StyleSheet,
	Button,
	TouchableOpacity,
	TouchableNativeFeedback,
	Text,
	Platform
} from "react-native";
import { useSelector } from "react-redux";
import BackgroundButton from "../components/BackgroundButton";
import CustomTheme from "../assets/UIkitten/custom-theme.json";

/*
      https://dev.to/onmyway133/how-to-make-tag-selection-view-in-react-native-24j
*/

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const TagsView = (props) => {
	//const [selectedItems, setSelectedItems] = useState(props.selected);
	const theme = useSelector((state) => state.theme.theme);

	let selectedItems = props.selected;
	let setSelectedItems = props.setSelectedItems;

	const addOrRemove = (array, item) => {
		const exists = array.includes(item);

		if (exists) {
			return array.filter((c) => {
				return c !== item;
			});
		} else {
			let result = array.concat(item);

			return result;
		}
	};

	return (
		<View style={styles.container}>
			
			
			{makeButtons()}
			{props.showAllMode && <TouchableCmp style={styles.touchable} onPress={props.onPressShowAll}>
				<View
					style={{
						...styles.view,
						backgroundColor: theme === "dark" ? "black" : "white",
						borderColor: CustomTheme["color-primary-500"],
					}}
				>
					<Ionicons
						name={props.showingAll ? 'eye-off-outline' :  "eye-outline"}
						size={18}
						color={CustomTheme["color-primary-500"]}
					/>
					<Text
						style={{
							...styles.text,
							color: CustomTheme["color-primary-500"],
						}}
					>
						{props.showingAll ? ' Hide non-assigned' :  " Show non-assigned"}
						
					</Text>
				</View>
			</TouchableCmp>}
			{!props.hideAddSubject &&
			<TouchableCmp style={styles.touchable} onPress={props.onPressAdd}>
				<View
					style={{
						...styles.view,
						backgroundColor: theme === "dark" ? "black" : "white",
						borderColor: CustomTheme["color-primary-500"],
					}}
				>
					<Ionicons
						name="add-outline"
						size={18}
						color={CustomTheme["color-primary-500"]}
					/>
					<Text
						style={{
							...styles.text,
							color: CustomTheme["color-primary-500"],
						}}
					>
						{" "}
						Add Subject
					</Text>
				</View>
			</TouchableCmp>}
		</View>
	);

	function onPress(tag) {
		let selected;
		if (props.isExclusive) {
			selected = [tag];
		} else {
			selected = addOrRemove(selectedItems, tag);
		}
		setSelectedItems(selected);
	}

	function makeButtons() {
		return props.all.map((tag, i) => {
			const on = selectedItems.includes(tag);
			/*
			const backgroundColor = on
				? 'R.colors.on.backgroundColor'
				: R.colors.off.backgroundColor;
			const textColor = on ? R.colors.on.text : R.colors.off.text;
			const borderColor = on ? R.colors.on.border : R.colors.off.border;
*/
			return (
				<BackgroundButton
					backgroundColor={tag.color}
					textColor={"white"}
					borderColor={"white"}
					onPress={() => {
						onPress(tag);
					}}
					key={i}
					showImage={on}
					title={tag.title}
				/>
			);
		});
	}
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		paddingVertical: 15,
		width: "100%",
		alignItems: "center",
	},
	view: {
		flexDirection: "row",
		borderRadius: 20,
		borderColor: "black",
		borderWidth: 2,
		backgroundColor: "white",
		height: 40,
		alignItems: "center",
		justifyContent: "center",
		paddingLeft: 12,
		paddingRight: 14,
	},
	touchable: {
		marginLeft: 3,
		marginRight: 3,
		marginBottom: 6,
	},
	image: {
		marginRight: 2,
		width: 28,
		height: "100%",
	},
	text: {
		fontSize: 16,
		textAlign: "center",
		color: "black",
	},
});

export default TagsView;
