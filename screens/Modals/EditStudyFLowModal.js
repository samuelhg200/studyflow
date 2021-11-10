import React, { useState, useEffect } from "react";
import {
	Platform,
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
} from "react-native";
import { Text, Layout, Toggle } from "@ui-kitten/components";
import LabelsList from "../../components/LabelsList";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as studyFlowActions from '../../store/actions/studyFlow'
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { colorTheme } from "../../data/products";

const EditStudyFLowModal = (props) => {
    const dispatch = useDispatch()
    const dispatch2 = useDispatch()
	//REDUX
	const studyFlowConfig = useSelector((state) => state.studyFlow.config);
	const theme = useSelector((state) => state.theme.theme);
	const eventConfig = useSelector((state) => state.studyFlow.eventConfig);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme)

	//times - local states
	const [studyTimeDuration, setStudyTimeDuration] = useState(
		new Date(0, 0, 0, 0, studyFlowConfig.studyTime, 0)
	);
	const [breakTimeDuration, setBreakTimeDuration] = useState(
		new Date(0, 0, 0, 0, studyFlowConfig.breakTime, 0)
	);
	// toggles - local states
	const [checkStudySession, setCheckStudySession] = useState(
		eventConfig.studySession
	);
	const [checkAssessment, setCheckAssessment] = useState(
		eventConfig.assessment
	);
	const [checkHomework, setCheckHomework] = useState(eventConfig.homework);
	const [checkLecture, setCheckLecture] = useState(eventConfig.lecture);
	const [checkOther, setCheckOther] = useState(eventConfig.other);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item
                            title="editstudyflow"
                            iconName={"save-outline"}
                            onPress={() => {
                                dispatch(
                                    studyFlowActions.updateEventConfig({
                                        studySession: checkStudySession,
                                        assessment: checkAssessment,
                                        homework: checkHomework,
                                        lecture: checkLecture,
                                        other: checkOther
                                    })
                                );
                                const studyTime = studyTimeDuration.getMinutes() + (studyTimeDuration.getHours() * 60)
                                const breakTime = breakTimeDuration.getMinutes() + (breakTimeDuration.getHours() * 60)
                                dispatch2(studyFlowActions.updateStudyFlowConfig(studyTime, breakTime))
                                props.navigation.goBack();
                            }}
                        />
                    </HeaderButtons>
                );
            },
        })
    }, [checkStudySession, checkAssessment, checkHomework, checkLecture, checkOther, studyTimeDuration, breakTimeDuration, dispatch2, dispatch])

	const handleStudyTime = (event, date) => {
		setStudyTimeDuration(date);
	};

	const handleBreakTime = (event, date) => {
		setBreakTimeDuration(date);
	};
	

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={styles.screen}>
			{/* <Text style={styles.title}>Study / Break</Text> */}
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					width: "85%",
					marginTop: 20,
					marginBottom: 10,
				}}
			>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						borderRightWidth: 1,
						paddingRight: 15,
						borderColor: theme === "dark" ? "white" : colorTheme[colorThemeIndex].source['color-primary-500'],
					}}
				>
					<View style={{ alignItems: "center", flexDirection: "column" }}>
						<Text style={{...styles.title, color: theme === 'dark' ? 'white' : colorTheme[colorThemeIndex].source['color-primary-500']}}>Study</Text>
						<DateTimePicker
							style={{ minWidth: 100 }}
							value={studyTimeDuration}
							minuteInterval={1}
							is24Hour={true}
							mode="time"
							display={Platform.OS === "android" ? "spinner" : "spinner"}
							onChange={handleStudyTime}
							themeVariant={theme}
                            textColor={theme === 'dark' ? 'white' : colorTheme[colorThemeIndex].source['color-primary-500']}
						/>
					</View>
					<View
						style={{
							borderRadius: 30,
							padding: 4,
							alignItems: "center",
							justifyContent: "center",
							top: 21,
						}}
					>
						<Ionicons
							name={"glasses-outline"}
							size={24}
							color={theme === "dark" ? "white" : colorTheme[colorThemeIndex].source['color-primary-600']}
						/>
					</View>
				</View>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "center",
						alignItems: "center",
						borderLeftWidth: 1,
						paddingLeft: 15,
						borderColor: theme === "dark" ? "white" : colorTheme[colorThemeIndex].source['color-primary-500'],
					}}
				>
					<View
						style={{
							borderRadius: 30,
							padding: 4,
							alignItems: "center",
							justifyContent: "center",
							top: 22,
						}}
					>
						<Ionicons
							name={"cafe-outline"}
							size={22}
							color={theme === "dark" ? "white" : colorTheme[colorThemeIndex].source['color-primary-600']}
						/>
					</View>
					<View style={{ alignItems: "center", flexDirection: "column" }}>
						<Text style={{...styles.title, color: theme === 'dark' ? 'white' : colorTheme[colorThemeIndex].source['color-primary-500']}}>Break</Text>
						<DateTimePicker
							style={{ minWidth: 100 }}
							value={breakTimeDuration}
							is24Hour={false}
							minuteInterval={1}
							mode="time"
							display={Platform.OS === "android" ? "spinner" : "spinner"}
							onChange={handleBreakTime}
							themeVariant={theme}
                            textColor={theme === 'dark' ? 'white' : colorTheme[colorThemeIndex].source['color-primary-500']}
						/>
					</View>
				</View>
			</View>
			<Toggle
				checked={checkStudySession}
				onChange={(prev) => setCheckStudySession(prev)}
				style={styles.checkbox}
			>
				{() => (
					<View style={styles.textContainer}>
						<Text
							style={{
								color: checkStudySession
									? colorTheme[colorThemeIndex].source["color-primary-600"]
									: theme === "dark"
									? "white"
									: "black",
							}}
						>
							Study Session
						</Text>
					</View>
				)}
			</Toggle>
			<Toggle
				checked={checkHomework}
				onChange={(prev) => setCheckHomework(prev)}
				style={styles.checkbox}
			>
				{() => (
					<View style={styles.textContainer}>
						<Text
							style={{
								color: checkHomework
									? colorTheme[colorThemeIndex].source["color-primary-600"]
									: theme === "dark"
									? "white"
									: "black",
							}}
						>
							Homework
						</Text>
					</View>
				)}
			</Toggle>
			<Toggle
				checked={checkAssessment}
				onChange={(prev) => setCheckAssessment(prev)}
				style={styles.checkbox}
			>
				{() => (
					<View style={styles.textContainer}>
						<Text
							style={{
								color: checkAssessment
									? colorTheme[colorThemeIndex].source["color-primary-600"]
									: theme === "dark"
									? "white"
									: "black",
							}}
						>
							Assessment
						</Text>
					</View>
				)}
			</Toggle>
			<Toggle
				checked={checkLecture}
				onChange={(prev) => setCheckLecture(prev)}
				style={styles.checkbox}
			>
				{() => (
					<View style={styles.textContainer}>
						<Text
							style={{
								color: checkLecture
									? colorTheme[colorThemeIndex].source["color-primary-600"]
									: theme === "dark"
									? "white"
									: "black",
							}}
						>
							Lecture
						</Text>
					</View>
				)}
			</Toggle>
			<Toggle
				checked={checkOther}
				onChange={(prev) => setCheckOther(prev)}
				style={styles.checkbox}
			>
				{() => (
					<View style={styles.textContainer}>
						<Text
							style={{
								color: checkOther
									? colorTheme[colorThemeIndex].source["color-primary-600"]
									: theme === "dark"
									? "white"
									: "black",
							}}
						>
							Other
						</Text>
					</View>
				)}
			</Toggle>
		</ScrollView>
	);
};

export default EditStudyFLowModal;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	title: {
		fontFamily: "roboto-bold",
		fontSize: 24,
		marginBottom: 15,
	},
	checkbox: {
		paddingVertical: Dimensions.get("window").height / 60,
		paddingHorizontal: 20,
		justifyContent: "flex-start",
		width: "70%",
	},
	textContainer: {
		alignItems: "flex-start",
		width: "100%",
		paddingLeft: "40%",
	},
});
