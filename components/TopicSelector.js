import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, List, Text, Layout } from "@ui-kitten/components";
import { useSelector } from "react-redux";



const TopicSelector = (props) => {
	const topics = useSelector((state) => state.subject.subjects);
	
	const renderItem = (info) => {
		return (
			<View style={{ ...{ backgroundColor: info.item.color }, ...styles.item }}>
				<Text style={styles.text}>{info.item.title}</Text>
			</View>
		);
	};
	return (
		<View style={{ flex: 1 }}>
			<Text></Text>
			<List
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				data={topics}
				renderItem={renderItem}
			/>
		</View>
	);
};

export default TopicSelector;

const styles = StyleSheet.create({
	container: { flex: 1, maxHeight: 250, minWidth: '80%'  },
	contentContainer: { padding: 12, alignItems: 'center' },
	item: { padding: 5, borderRadius: 8, marginVertical: 8, width: 180 },
    text: { fontSize: 17}
});
