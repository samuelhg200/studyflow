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
	Platform,
} from "react-native";
import { Layout, Text, Icon, Input } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import * as subjectActions from "../store/actions/subject";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { colorTheme } from "../data/products";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const EditIcon = (props) => {
	return <Icon {...props} name="edit-outline" fill="white" />;
};

const RemoveIcon = (props) => {
	return <Icon {...props} name="trash-outline" fill="white" />;
};

const Label = (props) => {
	const [showTopics, setShowTopics] = useState(false);
	const topics = useSelector((state) =>
		state.subject.topics.filter((topic) => topic.subjectId === props.item.id)
	);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	const isSelected = (topicId) => {
		if (props.selectedTopics.find((topic) => topic.id === topicId)) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<View style={{ alignItems: "flex-end" }}>
			<TouchableCmp
				style={{
					...styles.labelRowContainer,
					backgroundColor: props.item.color,
				}}
				onPress={() => setShowTopics((prev) => !prev)}
			>
				<View
					style={
						Platform.OS === "android"
							? {
									...styles.labelRowContainer,
									backgroundColor: props.item.color,
							  }
							: { ...styles.touchableContainer, flex: 1 }
					}
				>
					<Ionicons
						name={showTopics ? "chevron-up-outline" : "chevron-down-outline"}
						color={"white"}
						size={18}
					>
						<Text style={styles.subjectText}> {props.item.title}</Text>
					</Ionicons>

					<TouchableWithoutFeedback
						onPress={() => {
							props.onAddTopic(
								props.item.id,
								props.item.title,
								props.item.color
							);
						}}
						style={{ flexDirection: "row" }}
					>
						{/* <View style={{ paddingRight: 10 }}><RemoveIcon style={{ width: 22, height: 22}} /></View> */}

						<EditIcon style={{ width: 22, height: 22 }} />
					</TouchableWithoutFeedback>
				</View>
			</TouchableCmp>
			{showTopics &&
				topics.map((topic) => {
					const selected = props.selectableMode ? isSelected(topic.id) : false;

					return (
						<TouchableCmp
							key={topic.id}
							disabled={!props.selectableMode}
							onPress={() => props.onTopicPress(topic)}
						>
							<View
								style={{
									...styles.topic,
									backgroundColor: selected
										? colorTheme[colorThemeIndex].source["color-primary-500"]
										: props.item.color,
								}}
							>
								<Ionicons
									name={
										props.selectableMode
											? selected
												? "checkbox-outline"
												: "square-outline"
											: "book-outline"
									}
									size={12.8}
									color={"white"}
								>
									<Text style={{ color: "white", fontSize: 14 }}>
										{" "}
										{topic.title}
									</Text>
								</Ionicons>
							</View>
						</TouchableCmp>
					);
				})}
			{showTopics && (
				<TouchableCmp
					onPress={() => {
						props.onAddTopic(props.item.id, props.item.title, props.item.color);
					}}
					style={{ ...styles.topic, backgroundColor: "#ddd" }}
				>
					<Ionicons name="add-outline" size={14}>
						<Text style={{ color: "black", fontSize: 14 }}>Add new topic</Text>
					</Ionicons>
				</TouchableCmp>
			)}
		</View>
	);
};

const LabelsList = ({
	data,
	onAddTopic,
	disableInput,
	selectableTopics,
	selectedTopics,
	onTopicPressHandler,
}) => {
	const theme = useSelector((state) => state.theme.theme);
	const [newSubject, setNewSubject] = useState("");
	const dispatch = useDispatch();
	//console.log(data)

	const onSubmit = () => {
		dispatch(subjectActions.addSubject(newSubject));
	};

	return (
		<TouchableWithoutFeedback
			//keyboardVerticalOffset={Platform.select({ ios: 0, android: 200 })}
			//behavior={Platform.OS === "ios" ? "padding" : null}
			onPress={() => {
				Keyboard.dismiss();
			}}
			style={{ flex: 1, alignItems: "center", height: 300 }}
		>
			{!disableInput && (
				<Input
					placeholder={"Enter new subject"}
					value={newSubject}
					onChangeText={(nextValue) => setNewSubject(nextValue)}
					style={styles.input}
					size="large"
					//autoFocus={true}
					accessoryRight={() => {
						return (
							<TouchableWithoutFeedback
								onPress={() => {
									onSubmit();
									setNewSubject("");
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
			)}

			<FlatList
				contentContainerStyle={styles.list}
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					return (
						<Label
							item={item}
							onAddTopic={onAddTopic}
							selectableMode={selectableTopics}
							onTopicPress={onTopicPressHandler}
							selectedTopics={selectedTopics}
						/>
					);
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
	);
};

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
	touchableContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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
	topicTouchable: {
		width: Dimensions.get("window").width / 1.5,
		height: Dimensions.get("window").height / 22,
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

export default LabelsList;
