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
	Alert,
} from "react-native";
import {
	Layout,
	Text,
	Icon,
	Input,
	Button,
	Divider,
	ButtonGroup,
} from "@ui-kitten/components";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import { colorTheme } from "../../data/products";
import TagsView from "../../components/TagsView";
import LabelsList from "../../components/LabelsList";
import * as questionActions from "../../store/actions/question";
import LottieView from "lottie-react-native";
import Slider from "@react-native-community/slider";
import Carousel from "react-native-snap-carousel";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const PracticeQuestionsConfig = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	const theme = useSelector((state) => state.theme.theme);

	const quantity = useSelector((state) => state.question.quantity);
	const harshness = useSelector((state) => state.question.harshness);

	return (
		<Layout
			style={{ flex: 1, alignItems: "center", justifyContent: "flex-start" }}
		>
			<Divider
				style={{
					backgroundColor:
						theme === "dark"
							? "white"
							: colorTheme[colorThemeIndex].source["color-primary-500"],
					height: 0.5,
					alignSelf: "stretch",
				}}
			/>
			<View>
				<View style={{ marginVertical: 25 }}>
					<Text
						style={{
							fontSize: 20,
							fontFamily: "roboto-bold",
							alignSelf: "center",
						}}
					>
						Questions per Study Block
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-around",
						alignItems: "center",
						width: "80%",
						marginLeft: Dimensions.get("window").width / 22,
					}}
				>
					<TouchableCmp
						onPress={() => {
							dispatch(questionActions.setQuantity(1));
						}}
					>
						<View
							style={{
								backgroundColor:
									quantity === 1
										? theme === "dark"
											? "white"
											: "black"
										: colorTheme[colorThemeIndex].source["color-primary-500"],
								width: Dimensions.get("window").width / 9,
								height: Dimensions.get("window").height / 19,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									fontFamily: "roboto-bold",
									fontSize: 22,
									color:
										quantity === 1
											? colorTheme[colorThemeIndex].source["color-primary-500"]
											: "white",
								}}
							>
								1
							</Text>
						</View>
					</TouchableCmp>
					<TouchableCmp
						onPress={() => {
							dispatch(questionActions.setQuantity(3));
						}}
					>
						<View
							style={{
								backgroundColor:
									quantity === 3
										? theme === "dark"
											? "white"
											: "black"
										: colorTheme[colorThemeIndex].source["color-primary-500"],
								width: Dimensions.get("window").width / 9,
								height: Dimensions.get("window").height / 19,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									fontFamily: "roboto-bold",
									fontSize: 22,
									color:
										quantity === 3
											? colorTheme[colorThemeIndex].source["color-primary-500"]
											: "white",
								}}
							>
								3
							</Text>
						</View>
					</TouchableCmp>
					<TouchableCmp
						onPress={() => {
							dispatch(questionActions.setQuantity(5));
						}}
					>
						<View
							style={{
								backgroundColor:
									quantity === 5
										? theme === "dark"
											? "white"
											: "black"
										: colorTheme[colorThemeIndex].source["color-primary-500"],
								width: Dimensions.get("window").width / 9,
								height: Dimensions.get("window").height / 19,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									fontFamily: "roboto-bold",
									fontSize: 22,
									color:
										quantity === 5
											? colorTheme[colorThemeIndex].source["color-primary-500"]
											: "white",
								}}
							>
								5
							</Text>
						</View>
					</TouchableCmp>
					<TouchableCmp
						onPress={() => {
							dispatch(questionActions.setQuantity("∞"));
						}}
					>
						<View
							style={{
								backgroundColor:
									quantity === "∞"
										? theme === "dark"
											? "white"
											: "black"
										: colorTheme[colorThemeIndex].source["color-primary-500"],
								width: Dimensions.get("window").width / 9,
								height: Dimensions.get("window").height / 19,
								alignItems: "center",
								justifyContent: "center",
								borderRadius: 8,
							}}
						>
							<Text
								style={{
									fontFamily: "roboto-bold",
									fontSize: 22,
									color:
										quantity === "∞"
											? colorTheme[colorThemeIndex].source["color-primary-500"]
											: "white",
								}}
							>
								∞
							</Text>
						</View>
					</TouchableCmp>
				</View>
			</View>
			<Divider
				style={{
					backgroundColor:
						theme === "dark"
							? "white"
							: colorTheme[colorThemeIndex].source["color-primary-500"],
					height: 0.5,
					alignSelf: "stretch",
					marginVertical: 25,
					marginTop: 35,
				}}
			/>
			<View style={{ marginVertical: 25, marginTop: 20 }}>
				<Text
					style={{
						fontSize: 20,
						fontFamily: "roboto-bold",
						alignSelf: "center",
					}}
				>
					Harshness
				</Text>
			</View>
			<Slider
				style={{ width: Dimensions.get("window").width / 1.5, height: 40 }}
				minimumValue={1}
				maximumValue={3}
				value={harshness}
				onSlidingComplete={(newHarshness) => {
					dispatch2(questionActions.setHarshness(newHarshness));
				}}
				minimumTrackTintColor={
					colorTheme[colorThemeIndex].source["color-primary-500"]
				}
				maximumTrackTintColor="#000000"
			/>

			<Divider
				style={{
					backgroundColor:
						theme === "dark"
							? "white"
							: colorTheme[colorThemeIndex].source["color-primary-500"],
					height: 0.5,
					alignSelf: "stretch",
					marginVertical: 25,
					marginTop: 35,
				}}
			/>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "space-around",
					marginBottom: Dimensions.get('window').height / 15,
					marginTop: Dimensions.get('window').height / 30
				}}
			>
				<Button
					status={theme === "dark" ? "basic" : "primary"}
					style={{ height: 45, minWidth: 230 }}
					onPress={() => {
						props.navigation.navigate("QuestionCards", { refresh: false });
					}}
				>
					Practice Existing Questions
				</Button>
				<Button
					status={"info"}
					style={{ height: 45, minWidth: 230 }}
					onPress={() => {
						props.navigation.navigate("CreateQuestion", {
							selectedSubjects: [],
							eventSubjects: [],
						});
					}}
				>
					Add New Questions
				</Button>
			</View>
		</Layout>
	);
};

export default PracticeQuestionsConfig;

const styles = StyleSheet.create({});
