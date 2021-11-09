import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	ScrollView,
	Modal,
	Pressable,
	TouchableWithoutFeedback,
} from "react-native";
import { Layout, Divider } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import { BarChart } from "react-native-chart-kit";
import moment from "moment";
import LottieView from "lottie-react-native";

import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import {
	convertStudyStatsToChartData,
	getSubjectStudyTime,
} from "../../helpers/functions";

const SessionFeedbackScreen = (props) => {
	const studyTimes = props.route.params.subjectStudyTime
		? props.route.params.subjectStudyTime
		: null;
	const startTime = props.route.params.startTime
		? props.route.params.startTime
		: null;
	const endTime = props.route.params.endTime
		? props.route.params.endTime
		: null;

	const subjects = useSelector((state) => state.subject.subjects);
	const theme = useSelector((state) => state.theme.theme);
	const [modalVisible, setModalVisible] = useState(true);

	const data = convertStudyStatsToChartData(studyTimes, subjects);
	//calculate total studyTime and total Break Time
	let totalStudyTime = 0;
	let totalBreakTime = 0;
	Object.keys(studyTimes).forEach((key) => {
		if (key !== "null") {
			totalStudyTime += studyTimes[key];
		} else {
			totalBreakTime = studyTimes[key];
		}
	});

	//studyTimes

	//calculate how many points in x axis to display
	let min = Number.POSITIVE_INFINITY;
	//let max = 0;
	for (let i = 0; i < data.datasets[0].data.length; i++) {
		//console.log(data.datasets[0].data[i])
		if (data.datasets[0].data[i] < min) {
			min = data.datasets[0].data[i];
		}
		// if (data.datasets[0].data[i] > max) {
		// 	max = data.datasets[0].data[i];
		// }
	}

	let notEnoughDataPoints = false;
	if (min < 5) {
		notEnoughDataPoints = true;
	}

	//theme colours
	const themeStyle = {
		supportiveText: theme === "dark" ? "white" : "black",
	};

	return (
		<Layout style={styles.screen}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert("Modal has been closed.");
					setModalVisible(!modalVisible);
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						modalVisible && setModalVisible(false);
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: 22,
						}}
					>
						<View
							style={{
								...styles.modal,
								backgroundColor:
									theme === "dark" ? CustomTheme["color-primary-500"] : CustomTheme["color-primary-200"] ,
							}}
						>
							<Text
								style={{
									paddingHorizontal: 10,
									fontFamily: "yellow-tail",
									fontSize: 30,
									color: theme == "dark" ? "white" : "white",
								}}
							>
								Well Done!
							</Text>
							<LottieView
								style={styles.coin}
								source={require("../../assets/lottie/CoinPopUp.json")}
								autoPlay={true}
								loop={false}
							/>
							<LottieView
								style={{width: '100%', position: 'absolute', top: Dimensions.get("window").height / 90}}
								source={require("../../assets/lottie/confetti.json")}
								autoPlay={true}
								loop
							/>
							<View style={{ bottom: Dimensions.get("window").height / 11 }}>
								<Text
									style={{
										fontFamily: "roboto-bold",
										fontSize: 28,
										color: theme == "dark" ? "white" : "white",
									}}
								>
									+<Text style={{ fontSize: 38 }}>{(totalBreakTime + totalStudyTime)*7} </Text>
								</Text>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>

			<ScrollView
				contentContainerStyle={{
					alignItems: "center",
					justifyContent: "flex-start",
					flex: 1,
					opacity: modalVisible ? 0.1 : 1,
				}}
			>
				<View
					style={{
						width: "100%",
						paddingVertical: 10,
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 20,
					}}
				>
					<View>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "yellow-tail",
								fontSize: 23,
								paddingHorizontal: 4,
								paddingBottom: 2,
							}}
						>
							Start
						</Text>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "roboto-bold",
								fontSize: 28,
								paddingHorizontal: 5,
								color: themeStyle.supportiveText,
							}}
						>
							{moment(new Date(startTime)).format("hh:mm")}
						</Text>
					</View>
					<View>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "yellow-tail",
								fontSize: 23,
								paddingHorizontal: 4,
								paddingBottom: 2,
							}}
						>
							End
						</Text>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "roboto-bold",
								fontSize: 28,
								paddingHorizontal: 5,
								color: themeStyle.supportiveText,
							}}
						>
							{moment(new Date(endTime)).format("hh:mm")}
						</Text>
					</View>
				</View>
				<View
					style={{
						width: "100%",
						paddingVertical: 10,
						flexDirection: "row",
						justifyContent: "space-between",
						paddingHorizontal: 20,
					}}
				>
					<View>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "yellow-tail",
								fontSize: 23,
								paddingHorizontal: 4,
								paddingBottom: 2,
							}}
						>
							Productivity
						</Text>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "roboto-bold",
								fontSize: 28,
								paddingHorizontal: 5,
								color: themeStyle.supportiveText,
							}}
						>
							{totalStudyTime}
							<Text
								style={{
									color: CustomTheme["color-primary-500"],
									fontFamily: "roboto",
									fontSize: 12,
									color: themeStyle.supportiveText,
								}}
							>
								mins
							</Text>
						</Text>
					</View>
					<View>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "yellow-tail",
								fontSize: 23,
								paddingHorizontal: 4,
								paddingBottom: 2,
							}}
						>
							Breaks
						</Text>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "roboto-bold",
								fontSize: 28,
								paddingHorizontal: 5,
								color: themeStyle.supportiveText,
							}}
						>
							{totalBreakTime}
							<Text
								style={{
									color: CustomTheme["color-primary-500"],
									fontFamily: "roboto",
									fontSize: 12,
									color: themeStyle.supportiveText,
								}}
							>
								mins
							</Text>
						</Text>
					</View>
				</View>
				<View>
					<View style={{ width: "100%", paddingVertical: 10 }}>
						<Text
							style={{
								color: CustomTheme["color-primary-500"],
								fontFamily: "yellow-tail",
								fontSize: 23,
								paddingHorizontal: 4,
								paddingBottom: 2,
							}}
						>
							Subject Times
						</Text>
					</View>
					{/* <Divider style={{height: 0.5, alignSelf: 'stretch', marginBottom: 20, marginTop: 1, backgroundColor: CustomTheme['color-primary-500']}}/> */}
					<BarChart
						style={{ borderRadius: 15 }}
						data={data}
						width={Dimensions.get("window").width * 0.9}
						height={220}
						yAxisSuffix="m"
						fromZero
						chartConfig={{
							backgroundColor: "red",
							backgroundGradientFrom: CustomTheme["color-primary-500"],
							backgroundGradientFromOpacity: 0.7,
							backgroundGradientTo: CustomTheme["color-primary-600"],
							backgroundGradientToOpacity: 0.25,
							decimalPlaces: notEnoughDataPoints ? 1 : 0, // optional, defaults to 2dp
							color: (opacity = 1) =>
								theme === "light"
									? `rgba(0, 0, 0, ${opacity})`
									: `rgba(255, 255, 255, ${opacity})`,
							labelColor: (opacity = 1) =>
								theme === "light"
									? `rgba(0, 0, 0, ${opacity})`
									: `rgba(255, 255, 255, ${opacity})`,
						}}
						verticalLabelRotation={0}
					/>
				</View>
			</ScrollView>
		</Layout>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	modal: {
		width: Dimensions.get("window").width / 1.2,
		height: Dimensions.get("window").height / 2.5,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 30,
		alignItems: "center",
		shadowColor: CustomTheme["color-primary-500"],
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 5,
		overflow: "visible",
	},
	coin: {
		width: "100%",
		bottom: Dimensions.get("window").height / 70,
	},
});

export default SessionFeedbackScreen;
