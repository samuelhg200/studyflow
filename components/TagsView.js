import React, { useState, useEffect } from "react";
import { View, StyleSheet, Button } from "react-native";
import BackgroundButton from "../components/BackgroundButton";

/*
      https://dev.to/onmyway133/how-to-make-tag-selection-view-in-react-native-24j
*/

const TagsView = (props) => {
	//const [selectedItems, setSelectedItems] = useState(props.selected);

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

	return <View style={styles.container}>{makeButtons()}</View>;

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
		alignItems: 'center',
	},
});

export default TagsView;
