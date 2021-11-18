import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
	Image,
	Platform,
	SafeAreaView,
	Dimensions,
	ScrollView,
} from "react-native";
import {
	Card,
	Text,
	Input,
	Divider,
	Button,
	Layout,
	TopNavigation,
	TopNavigationAction,
	Toggle,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import { colorTheme } from "../../data/products";
import * as studyFlowActions from "../../store/actions/studyFlow";
import * as themeActions from "../../store/actions/theme";
import { LinearGradient } from "expo-linear-gradient";
import Carousel, { Pagination } from "react-native-snap-carousel";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const CarouselItem = (props) => {
	return (
		<LinearGradient
			colors={
				props.theme === "dark"
					? [
							colorTheme[props.colorThemeIndex].source["color-primary-600"],
							colorTheme[props.colorThemeIndex].source["color-primary-500"],
							colorTheme[props.colorThemeIndex].source["color-primary-400"],
					  ]
					: [
							colorTheme[props.colorThemeIndex].source["color-primary-500"],
							colorTheme[props.colorThemeIndex].source["color-primary-400"],
							colorTheme[props.colorThemeIndex].source["color-primary-300"],
					  ]
			}
			style={{
				height: Dimensions.get("window").height / 1.8,
				borderRadius: 12,
				padding: Dimensions.get("window").width / 20,
				marginTop: Dimensions.get("window").height / 12.9,
			}}
		>
			<View style={{ alignItems: "flex-end" }}>
				<TouchableWithoutFeedback onPress={props.item.onConfig}><Ionicons name="options-outline" size={22} color={"white"} /></TouchableWithoutFeedback>
			</View>
			<View style={{ alignItems: "center", marginTop: 6 }}>
				<Text
					style={{ fontSize: 22, fontFamily: "roboto-bold", color: "white" }}
				>
					{props.item.title}
				</Text>
			</View>
			<View
				style={{
					flex: 1,
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				<View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
					<LottieView
						source={props.item.source}
						style={props.item.animationStyle}
						autoPlay={true}
						loop={true}
					/>
				</View>
				<View style={{height: Dimensions.get('window').height / 14}}>
					<Button status="basic" onPress={() => {props.item.onStart()}}>Start Exercise</Button>
				</View>
			</View>
		</LinearGradient>
	);
};

const ModulesStarterPage = (props) => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	const theme = useSelector((state) => state.theme.theme);
	//const [entries, setEntries] = useState();
	const [activeSlide, setActiveSlide] = useState(0);

	const data = [
		{
			title: "Practice Questions",
			screen: "QuestionCards",
			source: require("../../assets/lottie/Practice.json"),
			animationStyle: { width: Dimensions.get("window").width / 1.2},
			onStart: () => {props.navigation.navigate('QuestionCards', {refresh: 'true'})},
			onConfig: () => {props.navigation.navigate('PracticeQuestionsConfig')}
		},
		{
			title: "Speed Reading",
			screen: "SpeedReading",
			source: require("../../assets/lottie/BookMeditation.json"),
			animationStyle: { width: Dimensions.get("window").width / 1.5 },
			onStart: () => {},
			onConfig: () => {}
		},
		{
			title: "Study Tips",
			source: require("../../assets/lottie/TeammateDiscussion.json"),
			animationStyle: { width: Dimensions.get("window").width / 1.2 },
			onStart: () => {},
			onConfig: () => {}
		},
	];

	const PaginationCmp = (props) => {
		return (
			<Pagination
				dotsLength={data.length}
				activeDotIndex={activeSlide}
				//containerStyle={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
				dotStyle={{
					width: 10,
					height: 10,
					borderRadius: 5,
					marginHorizontal: 8,
					backgroundColor: "rgba(255, 255, 255, 0.92)",
				}}
				inactiveDotStyle={
					{
						// Define styles for inactive dots here
					}
				}
				inactiveDotOpacity={0.4}
				inactiveDotScale={0.6}
			/>
		);
	};

	return (
		<Layout style={{ flex: 1 }}>
			<SafeAreaView style={{ flex: 1 }}>
				<TopNavigation
					//style={{flex: 1}}
					alignment="center"
					title={() => (
						<Text
							style={{
								fontFamily: "yellow-tail",
								fontSize: 32,
								color: colorTheme[colorThemeIndex].source["color-primary-500"],
								flex: 1,
								paddingHorizontal: 2,
							}}
						>
							Boosters
						</Text>
					)}
				/>
				<Layout
					level="2"
					style={{
						flex: 1,
						alignItems: "center",
						justifyContent: "flex-start",
					}}
				>
					<Carousel
						data={data}
						renderItem={({ item, index }) => {
							return (
								<CarouselItem
									item={item}
									index={index}
									colorThemeIndex={colorThemeIndex}
									theme={theme}
								/>
							);
						}}
						onSnapToItem={(index) => {
							setActiveSlide(index);
						}}
						sliderWidth={Dimensions.get("window").width}
						itemWidth={Dimensions.get("window").width / 1.2}
					/>
					<PaginationCmp />
				</Layout>
			</SafeAreaView>
		</Layout>
	);
};

export default ModulesStarterPage;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "space-between",
	},
});
