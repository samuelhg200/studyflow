import React, { useState, useEffect, useRef } from "react";
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
import { Layout, Text, Icon, Input, Button } from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { colorTheme } from "../../data/products";
import TagsView from "../../components/TagsView";
import LabelsList from "../../components/LabelsList";
import * as questionActions from "../../store/actions/question";
import LottieView from "lottie-react-native";

import Carousel from "react-native-snap-carousel";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

// const carouselItems = [
// 	{
// 		title: "Item 1",
// 		text: "Text 1",
// 	},
// 	{
// 		title: "Item 2",
// 		text: "Text 2",
// 	},
// 	{
// 		title: "Item 3",
// 		text: "Text 3",
// 	},
// 	{
// 		title: "Item 4",
// 		text: "Text 4",
// 	},
// 	{
// 		title: "Item 5",
// 		text: "Text 5",
// 	},
// ];

// const carouselItems = [
// 	{
// 		question: "What is OOSD?",
// 		subjectTitle: "Computer Science",
// 		subjectColor: "#b3202f",
// 		topicTitle: "OOSD",
// 		status: 0,
// 	},
// 	{
// 		question: "Explain how async storage works in React Native",
// 		subjectTitle: "Computer Science",
// 		subjectColor: "#b3202f",
// 		topicTitle: "App Development",
// 		status: 1,
// 	},
// 	{
// 		question: "How did Napolean win the great war of 1836?",
// 		subjectTitle: "History",
// 		subjectColor: "#1A0C0E",
// 		topicTitle: "France",
// 		status: 2,
// 	},
// ];

/*
    carouselItem structure 
    {
        question: ...,
        subjectTitle: ...,
        subjectColor: ...,
        topicTitle: ...,
        status: ...,

    }
*/

const CarouselItem = (props) => {
	return (
		<View
			style={{
				backgroundColor:
					colorTheme[props.colorThemeIndex].source["color-primary-500"],
				borderRadius: 10,
				height: Dimensions.get("window").height * 0.4,
			}}
		>
			<View
				style={{
					backgroundColor:
						colorTheme[props.colorThemeIndex].source["color-primary-500"],
					height: Dimensions.get("window").height * 0.29,
					paddingHorizontal: 25,
					paddingVertical: 25,
					borderRadius: 10,
				}}
			>
				<View
					style={{
						backgroundColor: props.item.subjectColor,
						borderRadius: 4,
						padding: 3.5,
						alignSelf: "center",
					}}
				>
					<Text style={{ fontSize: 14 }}>{props.item.subjectTitle}</Text>
				</View>
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<Text style={{ fontSize: 23, color: "white", textAlign: "center" }}>
						{props.item.question}
					</Text>
				</View>
			</View>
			<View
				style={{
					backgroundColor: "white",
					height: Dimensions.get("window").height * 0.11,
					paddingHorizontal: 20,
					borderBottomRightRadius: 10,
					borderBottomLeftRadius: 10,
					flexDirection: "row",
					justifyContent: "space-around",
					alignItems: "center",
				}}
			>
				<TouchableCmp
					onPress={() => {
						props.handleDownVote(props.item.id, props.index);
					}}
				>
					<View
						style={{
							backgroundColor:
								colorTheme[props.colorThemeIndex].source["color-primary-500"],
							padding: 10,
							borderRadius: 40,
						}}
					>
						<Ionicons name={"sad"} color={"white"} size={38} />
					</View>
				</TouchableCmp>
				<TouchableCmp
					onPress={() => {
						props.handleUpVote(props.item.id, props.index);
					}}
				>
					<View
						style={{
							backgroundColor:
								colorTheme[props.colorThemeIndex].source["color-primary-500"],
							padding: 10,
							borderRadius: 40,
						}}
					>
						<Ionicons name={"happy"} color={"white"} size={38} />
					</View>
				</TouchableCmp>
			</View>
		</View>
	);
};

const QuestionCards = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const [activeIndex, setActiveIndex] = useState(0);
	const carouselRef = useRef(null);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	const subjects = useSelector((state) => state.subject.subjects);
	const topics = useSelector((state) => state.subject.topics);

	const questions = useSelector((state) =>
		props.route.params?.subjectId !== undefined
			? state.question.questions.filter(
					(question) =>
						question.subjectId === props.route.params.subjectId &&
						question.status < 3
			  )
			: state.question.questions.filter((question) => question.status < 3)
	);

	const convertQuestionsToItems = (questions) => {
		const items = questions.map((question) => {
			const subject = subjects.find(
				(subject) => subject.id === question.subjectId
			);
			const topic = topics.find((topic) => question.id === topic.id);
			return {
				id: question.id,
				question: question.text,
				subjectTitle: subject ? subject.title : null,
				subjectColor: subject ? subject.color : null,
				topicTitle: topic ? topic.title : null,
				status: question.status,
			};
		});
		return items;
	};

	const [carouselItems, setCarouselItems] = useState(() => {
		return convertQuestionsToItems(questions);
	});

	useEffect(() => {
		if (props.route.params.refresh) {
			setCarouselItems(() => {
				return convertQuestionsToItems(questions);
			});
		}
	}, [props.route.params.refresh]);

	const handleUpVote = (id, index) => {
		const questionToUpVote = questions.find((question) => question.id === id);
		if (questionToUpVote.status < 3) {
			questionToUpVote.status += 1;
		}
		dispatch(
			questionActions.setStatus(questionToUpVote.id, questionToUpVote.status)
		);
		if (index === carouselItems.length - 1) {
			endQuestions();
		} else {
			carouselRef.current.snapToNext();
		}
	};

	const handleDownVote = (id, index) => {
		const questionToDownVote = questions.find((question) => question.id === id);
		if (questionToDownVote.status > 0) {
			questionToDownVote.status -= 1;
		}
		dispatch2(
			questionActions.setStatus(
				questionToDownVote.id,
				questionToDownVote.status
			)
		);
		if (index === carouselItems.length - 1) {
			endQuestions();
		} else {
			carouselRef.current.snapToNext();
		}
	};

	function endQuestions() {
		props.navigation.goBack();
	}

	return questions.length !== 0 ? (
		<Layout style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
			<View style={{ height: Dimensions.get("window").height * 0.5 }}>
				<Carousel
					layout={"stack"}
					layoutCardOffset={12}
					ref={carouselRef}
					data={carouselItems}
					sliderWidth={Dimensions.get("window").width}
					itemWidth={Dimensions.get("window").width / 1.15}
					renderItem={({ item, index }) => {
						return (
							<CarouselItem
								item={item}
								index={index}
								colorThemeIndex={colorThemeIndex}
								handleUpVote={handleUpVote}
								handleDownVote={handleDownVote}
							/>
						);
					}}
					onSnapToItem={(index) => setActiveIndex(index)}
				/>
			</View>
			<Button
				onPress={() => {
					if (activeIndex === carouselItems.length - 1) {
						props.navigation.goBack();
					} else {
						carouselRef.current.snapToNext();
					}
				}}
				size={"giant"}
			>
				{activeIndex === carouselItems.length - 1 ? "End" : "Skip"}
			</Button>
		</Layout>
	) : (
		<Layout
			style={{
				flex: 1,
				alignItems: "center",
				justifyContent: "center",
				marginBottom: Dimensions.get("window").height / 20,
			}}
		>
			<TouchableWithoutFeedback
				onPress={() => {
					props.navigation.navigate("CreateQuestion", {
						selectedSubjects: [],
						eventSubjects: [],
					});
				}}
			>
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<LottieView
						style={styles.buttonAnimationLottie}
						source={colorTheme[colorThemeIndex].addAnimationSource}
						autoPlay={true}
						loop={true}
						speed={0.5}
					/>
					<Text
						style={{
							color: colorTheme[colorThemeIndex].source["color-primary-600"],
						}}
						category={"h5"}
					>
						ADD QUESTIONS
					</Text>
				</View>
			</TouchableWithoutFeedback>
		</Layout>
	);
};

export default QuestionCards;

const styles = StyleSheet.create({
	buttonAnimationLottie: {
		width: "95%",
	},
});
