import React, { useState, useEffect } from "react";
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
	Alert,
} from "react-native";
import { Layout, Text, Icon, Input } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { colorTheme } from "../../data/products";
import TagsView from "../../components/TagsView";
import LabelsList from "../../components/LabelsList";
import * as questionActions from "../../store/actions/question";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const Label = (props) => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);

	const topics = useSelector((state) =>
		state.subject.topics.filter((topic) => topic.subjectId === props.item.id)
	);
	const isSelected = (topicId) => {
		if (props.selectedTopics.find((topic) => topic.id === topicId)) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<View style={{ alignItems: "center" }}>
			{topics.map((topic) => {
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
			<TouchableCmp
				onPress={() => {
					props.onAddTopic(props.item.id, props.item.title, props.item.color);
				}}
				style={{ ...styles.topic, backgroundColor: "#ddd" }}
			>
				<Ionicons name="add-outline" size={14}>
					<Text style={{ color: "black", fontSize: 14 }}>
						Add new topic ({props.item.title})
					</Text>
				</Ionicons>
			</TouchableCmp>
		</View>
	);
};

const CreateQuestion = (props) => {
	const dispatch = useDispatch();
	const theme = useSelector((state) => state.theme.theme);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	const subjects = useSelector((state) => state.subject.subjects);
	const [selectedTopics, setSelectedTopics] = useState([]);
	const [selectedSubjects, setSelectedSubjects] = useState(
		props.route.params.selectedSubjects
	);
	const [showingAll, setShowingAll] = useState(false);
	const [showedSubjects, setshowedSubjects] = useState(
		props.route.params.eventSubjects
	);
	const [newQuestion, setNewQuestion] = useState("");
	const questions = useSelector((state) => state.question.questions);

	const onPressShowAll = () => {
		if (showingAll) {
			setshowedSubjects(props.route.params.eventSubjects);
			setShowingAll(false);
		} else {
			setshowedSubjects(subjects);
			setShowingAll(true);
		}
	};

    const addQuestion = () => {
        dispatch(
            questionActions.addQuestion(
                newQuestion,
                selectedSubjects.length > 0 ? selectedSubjects[0].id : null,
                selectedTopics.length ? selectedTopics[0].id : null
            )
        );
    }

	const onSubmit = () => {
		if (selectedTopics.length === 0 && selectedSubjects.length === 0){
			Alert.alert('Subject & Topics Missing', 'Are you sure you want to submit this question without linking it to a subject or topic?', [{text: 'Fix Now'}, {text: 'Submit Anyways', onPress: () => {addQuestion()}}, ])
		} else if (selectedTopics.length === 0) {
            Alert.alert('Topics Missing', 'Are you sure you want to submit this question without linking it to a topic?', [{text: 'Fix Now'}, {text: 'Submit Anyways', onPress: () => {addQuestion()}}])
        } else {
            addQuestion()
        }
	};

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<TouchableCmp
					onPress={() => {
						props.navigation.navigate("QuestionCards", {refresh: true});
					}}
				>
					<Layout
						level="2"
						style={{
							padding: Dimensions.get("window").width / 70,
							flexDirection: "row",
							alignItems: "center",
							borderWidth: 1,
							marginRight: Dimensions.get("window").width / 25,
							borderRadius: 12,
							paddingLeft: Dimensions.get("window").width / 50,
							borderColor:
								colorTheme[colorThemeIndex].source["color-primary-500"],
						}}
					>
						<Ionicons
							name="help-circle-outline"
							color={theme === "dark" ? "white" : "black"}
							size={18}
						/>
						<Text> {questions.length}</Text>
					</Layout>
				</TouchableCmp>
			),
		});
	}, [questions]);

	return (
		<Layout style={{ flex: 1, alignItems: "center" }}>
			<TouchableWithoutFeedback
				onPress={() => {
					Keyboard.dismiss();
				}}
			>
				<Input
					placeholder={"Enter new Question"}
					value={newQuestion}
					onChangeText={(nextValue) => setNewQuestion(nextValue)}
					style={styles.input}
					size="large"
					//autoFocus={true}
					accessoryRight={() => {
						return (
							<TouchableWithoutFeedback
								onPress={() => {
									onSubmit();
									setNewQuestion("");
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
				<View style={{ width: Dimensions.get("window").width / 1.1 }}>
					<Text
						style={{
							fontSize: 18,
							fontFamily: "roboto-bold",
							paddingLeft: Dimensions.get("window").width * 0.025,
							marginTop: 10,
						}}
					>
						Subject {">"}
					</Text>
					<TagsView
						all={subjects}
						selected={selectedSubjects}
						setSelectedItems={setSelectedSubjects}
						isExclusive={true}
						onPressAdd={() => {
							props.navigation.navigate("Subjects");
						}}
						showAllMode={false}
						onPressShowAll={onPressShowAll}
						showingAll={showingAll}
						//hideAddSubject={true}
					/>
					{selectedSubjects.length > 0 && (
						<View>
							<Text
								style={{
									fontSize: 18,
									fontFamily: "roboto-bold",
									paddingLeft: Dimensions.get("window").width * 0.025,
									marginTop: 10,
									marginBottom: Dimensions.get("window").height / 45,
								}}
							>
								Topics {">"}
							</Text>
							<Label
								item={selectedSubjects[0]}
								onAddTopic={(subjectId, subjectTitle, subjectColor) => {
									props.navigation.navigate("Topics", {
										subjectId: subjectId,
										subjectTitle: subjectTitle,
										subjectColor: subjectColor,
										disableDelete: true,
									});
								}}
								selectableMode={true}
								onTopicPress={(newTopic) => {
									if (selectedTopics.find((t) => t.id === newTopic.id)) {
										setSelectedTopics((prev) =>
											prev.filter((topic) => topic.id !== newTopic.id)
										);
									} else {
										setSelectedTopics((prev) => [...prev, newTopic]);
									}
								}}
								selectedTopics={selectedTopics}
							/>
						</View>
					)}
				</View>
			</TouchableWithoutFeedback>
		</Layout>
	);
};

export default CreateQuestion;

const styles = StyleSheet.create({
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
	topic: {
		width: Dimensions.get("window").width / 1.15,
		height: Dimensions.get("window").height / 22,
		backgroundColor: "#ddd",
		justifyContent: "center",
		marginBottom: 9,
		paddingLeft: 7,
		paddingRight: 12,
		borderRadius: 4,
	},
});
