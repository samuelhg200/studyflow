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
import * as subjectActions from "../store/actions/subject";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";

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
	const [showTopics, setShowTopics] = useState(false)
	return (
		<View style={{alignItems: 'flex-end'}}>
			<TouchableCmp
				style={{
					...styles.labelRowContainer,
					backgroundColor: props.item.color,
				}}
				onPress={() => setShowTopics(prev => !prev)}
			>
				<Ionicons name={showTopics ? "chevron-down-outline" : "chevron-up-outline"} color={'white'} size={18}><Text style={styles.subjectText}> {props.item.title}</Text></Ionicons>
				<View style={{ flexDirection: "row" }}>
					{/* <View style={{ paddingRight: 10 }}><RemoveIcon style={{ width: 22, height: 22}} /></View> */}

					<EditIcon style={{ width: 22, height: 22 }} />
				</View>
			</TouchableCmp>
			{showTopics && props.item.topics.map((topic) => {
				<View key={topic} style={styles.topic}></View>
			})}
			{showTopics && <TouchableCmp onPress={() => {props.onAddTopic(props.item.id)}} style={{...styles.topic, backgroundColor: '#ddd'}}><Ionicons name="add-outline" size={14}><Text style={{color: 'black'}}>Add new topic</Text></Ionicons></TouchableCmp>}
		</View>
	);
};

const LabelsList = ({ data, onAddTopic }) => {
	const theme = useSelector((state) => state.theme.theme);
	const [newSubject, setNewSubject] = useState("");
	const dispatch = useDispatch();

	const onSubmit = () => {
		dispatch(subjectActions.addSubject(newSubject));
	};

	return (
		<KeyboardAvoidingView
			keyboardVerticalOffset={Platform.select({ ios: 0, android: 200 })}
			behavior={Platform.OS === "ios" ? "padding" : null}
			style={{ flex: 1, alignItems: "center" }}
		>
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
			<FlatList
				contentContainerStyle={styles.list}
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					return <Label item={item} onAddTopic={onAddTopic} />;
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
		</KeyboardAvoidingView>
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
	topic: {
		width: Dimensions.get("window").width / 1.50,
		height: Dimensions.get("window").height / 22,
		backgroundColor: '#ddd',
		justifyContent: 'center',
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

export default LabelsList;
