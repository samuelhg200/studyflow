import React, { useState } from "react";
import {
	StyleSheet,
	View,
	FlatList,
	KeyboardAvoidingView,
	Dimensions,
	Keyboard,
	TouchableOpacity,
	TouchableNativeFeedback,
} from "react-native";
import { Layout, Text, Icon, Input } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import * as subjectActions from "../../store/actions/subject";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const Label = (props) => {
	return (
		<View style={{ alignItems: "flex-end" }}>
			<TouchableCmp
				style={{
					...styles.labelRowContainer,
					backgroundColor: props.color,
				}}
				//onPress={() => setShowTopics(prev => !prev)}
			>
				<View style={{ flexDirection: "row" }}>
					{/* <View style={{ paddingRight: 10 }}><RemoveIcon style={{ width: 22, height: 22}} /></View> */}
					<Text style={{ color: "white" }}>{props.item.title}</Text>
				</View>
				<TouchableCmp onPress={() => {props.onDelete(props.item.id)}}><Ionicons name="trash-outline" size={16} color="white" /></TouchableCmp>
			</TouchableCmp>
		</View>
	);
};

const TopicsModal = (props) => {
	const topics = useSelector(
		(state) =>
			state.subject.topics.filter(
				(topic) => topic.subjectId === props.route.params.subjectId
			)
	);
	const theme = useSelector((state) => state.theme.theme);
	const [newTopic, setNewTopic] = useState("");
	const dispatch = useDispatch();
    const dispatch2 = useDispatch();

	const onSubmit = (subjectId, topicTitle) => {
		dispatch(subjectActions.addTopic(subjectId, topicTitle));
	};

    const onDelete = (subjectId, topicId) => {
        dispatch2(subjectActions.removeTopic(subjectId, topicId))
    }

	return (
		<View style={{ flex: 1 }}>
			<TouchableWithoutFeedback
				//keyboardVerticalOffset={Platform.select({ ios: 0, android: 200 })}
				//behavior={Platform.OS === "ios" ? "padding" : null}
				onPress={() => {
					Keyboard.dismiss();
				}}
				style={{ flex: 1, alignItems: "center" }}
			>
				<Input
					placeholder={`Enter new topic for ${props.route.params.subjectTitle.toLowerCase()}`}
					value={newTopic}
					onChangeText={(nextValue) => setNewTopic(nextValue)}
					style={styles.input}
					size="large"
					//autoFocus={true}
					accessoryRight={() => {
						return (
							<TouchableWithoutFeedback
								onPress={() => {
									onSubmit(props.route.params.subjectId, newTopic);
									setNewTopic("");
									Keyboard.dismiss();
								}}
							>
								<Ionicons
									name={"chevron-forward-circle-outline"}
									size={22}
									color={theme === "dark" ? "white" : "black"}
								/>
							</TouchableWithoutFeedback>
						);
					}}
				/>
				<FlatList
					contentContainerStyle={styles.list}
					data={topics}
					renderItem={({ item }) => {
						return <Label item={item} color={props.route.params.subjectColor} onDelete={onDelete} />;
					}}
				/>
				{/* <Input
						placeholder={"Enter new subject"}
						value={newSubject}
						onChangeText={(nextValue) => setNewSubject(nextValue)}
                        style={styles.input}
                        size="large"
                        
                        accessoryRight={() => {
                            return (<Ionicons name={"chevron-forward-circle-outline"} size={22} color={theme === 'dark' ? 'white' : 'black'} />)
                        }}
					/> */}
			</TouchableWithoutFeedback>
		</View>
	);
};

export default TopicsModal;

const styles = StyleSheet.create({
	labelRowContainer: {
		width: Dimensions.get("window").width / 1.15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		height: Dimensions.get("window").height / 18,
		marginBottom: 8,
		paddingLeft: 15,
		paddingRight: 20,
		borderRadius: 10,
	},
	topic: {
		width: Dimensions.get("window").width / 1.5,
		height: Dimensions.get("window").height / 22,
		backgroundColor: "#ddd",
		justifyContent: "center",
		marginBottom: 6,
		paddingLeft: 7,
		paddingRight: 12,
		borderRadius: 4,
	},
	input: {
		width: Dimensions.get("window").width / 1.15,
		height: Dimensions.get("window").height / 15,
		marginTop: 20,
	},
	list: {
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
		padding: 20,
	},
	subjectText: {
		color: "white",
		fontFamily: "yellow-tail",
		fontSize: 20,
		paddingHorizontal: 4,
	},
});
