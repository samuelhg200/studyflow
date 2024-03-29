import React from "react";
import { StyleSheet, Alert, Dimensions, SafeAreaView } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	BottomNavigation,
	BottomNavigationTab,
	Icon,
} from "@ui-kitten/components";

import MetricsScreen from "../screens/MainApp/MetricsScreen";
import ManagerScreen from "../screens/MainApp/ManagerScreen";
import StartFlowScreen, {
	screenOptions as startFlowScreenOptions,
} from "../screens/MainApp/StartFlowScreen";
import GoalsScreen from "../screens/MainApp/GoalsScreen";
import ScheduleScreen, {
	screenOptions as scheduleScreenOptions,
} from "../screens/MainApp/ScheduleScreen";
import StoreScreen from "../screens/MainApp/StoreScreen";
import ProfileScreen from "../screens/MainApp/ProfileScreen";
import AddItemToCalendarScreen, {
	screenOptions as AddItemToCalendarScreenOptions,
} from "../screens/MainApp/AddItemToCalendarScreen";
import ChooseEventTypeScreen from "../screens/Modals/ChooseEventType";
import TimerScreen from "../screens/MainApp/TimerScreen";
import EventPreviewScreen from "../screens/Modals/EventPreviewScreen";
import SubjectsModal from "../screens/Modals/SubjectsModal";
import TopicsModal from "../screens/Modals/TopicsModal";
import EditStudyFLowModal from "../screens/Modals/EditStudyFLowModal";
import MeditationModal from "../screens/Modals/MeditationModal";
import SessionFeedbackScreen from "../screens/MainApp/SessionFeedbackScreen";
import StudyTipsPopUp from "../screens/PopUp/StudyTipsPopUp";
import ChooseRepeatFrequency from "../screens/Modals/ChooseRepeatFrequency";
import CreateQuestion from "../screens/Modals/CreateQuestion";
import QuestionCards from "../screens/Modals/QuestionCards";
import PracticeQuestionsConfig from "../screens/Modals/PracticeQuestionsConfig";
import ModulesStarterPage from "../screens/MainApp/ModulesStarterPage";

import HeaderButton from "../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as subjectActions from "../store/actions/subject";
import * as studyFlowActions from "../store/actions/studyFlow";
import { colorTheme } from "../data/products";

import { useDispatch, useSelector } from "react-redux";

const MetricsStackNavigator = createStackNavigator();
const MetricsNavigator = () => (
	<MetricsStackNavigator.Navigator>
		<MetricsStackNavigator.Screen name="Metrics" component={MetricsScreen} />
	</MetricsStackNavigator.Navigator>
);

const ManagerStackNavigator = createStackNavigator();
const ManagerNavigator = () => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);

	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	return (
		<ManagerStackNavigator.Navigator>
			<ManagerStackNavigator.Screen
				name="Manager"
				component={ManagerScreen}
				options={{ headerShown: false }}
			/>
			<ManagerStackNavigator.Screen
				name="Subjects"
				component={SubjectsModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Manager",
				}}
			/>
			<ManagerStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: navData.route.params.subjectTitle,
					headerBackTitle: "Subjects",
					headerRight: () => {
						return (
							<HeaderButtons HeaderButtonComponent={HeaderButton}>
								<Item
									title="topics"
									iconName={"trash-outline"}
									onPress={() => {
										Alert.alert(
											`Delete subject '${navData.route.params.subjectTitle}'`,
											"Are you sure you want to delete this subject? You will loose all stats and linked topics!",
											[
												{
													text: "Delete",
													onPress: () => {
														dispatch(
															subjectActions.removeSubject(
																navData.route.params.subjectId
															)
														);
														navData.navigation.goBack();
													},
												},
												{ text: "Keep" },
											]
										);
									}}
								/>
							</HeaderButtons>
						);
					},
				})}
			/>
			<ManagerStackNavigator.Screen
				name="EditStudyFlow"
				component={EditStudyFLowModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Edit StudyFlow",
					headerBackTitle: "Manager",
				}}
			/>
			<ManagerStackNavigator.Screen
				name="PracticeQuestionsConfig"
				component={PracticeQuestionsConfig}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Practice Questions",
					headerBackTitle: " ",
				}}
			/>
			<ManagerStackNavigator.Screen
				name="CreateQuestion"
				component={CreateQuestion}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Create Question",
					headerBackTitle: " ",
				}}
			/>
			<ManagerStackNavigator.Screen
				name="QuestionCards"
				component={QuestionCards}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Questions",
					headerBackTitle: " ",
				}}
			/>
		</ManagerStackNavigator.Navigator>
	);
};

const StartFlowStackNavigator = createStackNavigator();
const StartFlowNavigator = () => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	return (
		<StartFlowStackNavigator.Navigator>
			<StartFlowStackNavigator.Screen
				name="StartFlow"
				component={StartFlowScreen}
				//options={startFlowScreenOptions}
				options={{ headerShown: false }}
			/>
			<StartFlowStackNavigator.Screen
				name="Store"
				component={StoreScreen}
				//options={startFlowScreenOptions}
				options={{
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Store",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="ChooseEventType"
				component={ChooseEventTypeScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="AddItemToCalendar"
				component={AddItemToCalendarScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="Subjects"
				component={SubjectsModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Manager",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: navData.route.params.subjectTitle,
					headerBackTitle: "Subjects",
					headerRight: () => {
						!navData.route.params.disableDelete ? (
							<HeaderButtons HeaderButtonComponent={HeaderButton}>
								<Item
									title="topics"
									iconName={"trash-outline"}
									onPress={() => {
										Alert.alert(
											`Delete subject '${navData.route.params.subjectTitle}'`,
											"Are you sure you want to delete this subject? You will loose all stats and linked topics!",
											[
												{
													text: "Delete",
													onPress: () => {
														dispatch(
															subjectActions.removeSubject(
																navData.route.params.subjectId
															)
														);
														navData.navigation.goBack();
													},
												},
												{ text: "Keep" },
											]
										);
									}}
								/>
							</HeaderButtons>
						) : (
							<View></View>
						);
					},
				})}
			/>
			<StartFlowStackNavigator.Screen
				name="EventPreview"
				component={EventPreviewScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Event Info",
					headerBackTitle: "Home",
				}}
			/>

			<StartFlowStackNavigator.Screen
				name="EditStudyFlow"
				component={EditStudyFLowModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Edit StudyFlow",
					headerBackTitle: "Event",
				}}
			/>

			<StartFlowStackNavigator.Screen
				name="Timer"
				component={TimerScreen}
				options={{ headerShown: false }}
			/>
			<StartFlowStackNavigator.Screen
				name="Profile"
				component={ProfileScreen}
			/>
			<StartFlowStackNavigator.Screen
				name="StudyTips"
				component={StudyTipsPopUp}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Study Tip",
					headerBackTitle: " ",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="Meditation"
				component={MeditationModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Meditation",
					headerBackTitle: " ",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="SessionFeedback"
				component={SessionFeedbackScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Feedback",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="ChooseRepeatFrequency"
				component={ChooseRepeatFrequency}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Repeat",
					headerBackTitle: "Event",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="CreateQuestion"
				component={CreateQuestion}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Create Question",
					headerBackTitle: " ",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="QuestionCards"
				component={QuestionCards}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Questions",
					headerBackTitle: " ",
				}}
			/>
		</StartFlowStackNavigator.Navigator>
	);
};

const ModulesStackNavigator = createStackNavigator();
const ModulesNavigator = () => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);

	return (
		<ModulesStackNavigator.Navigator>
			<ModulesStackNavigator.Screen
				options={{ headerShown: false }}
				name="ModulesStarter"
				component={ModulesStarterPage}
			/>
			
		</ModulesStackNavigator.Navigator>
	);
};

const ScheduleStackNavigator = createStackNavigator();
const ScheduleNavigator = () => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	return (
		<ScheduleStackNavigator.Navigator>
			<ScheduleStackNavigator.Screen
				name="Schedule"
				component={ScheduleScreen}
				options={scheduleScreenOptions}
			/>
			<ScheduleStackNavigator.Screen
				name="EventPreview"
				component={EventPreviewScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Event Info",
					headerBackTitle: "Agenda",
				}}
			/>

			<ScheduleStackNavigator.Screen
				name="AddItemToCalendar"
				component={AddItemToCalendarScreen}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Agenda",
					...AddItemToCalendarScreenOptions,
				}}
			/>
			<ScheduleStackNavigator.Screen
				name="Subjects"
				component={SubjectsModal}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Calendar",
				}}
			/>
			<ScheduleStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: navData.route.params.subjectTitle,
					headerBackTitle: "Subjects",
					headerRight: () => {
						return (
							<HeaderButtons HeaderButtonComponent={HeaderButton}>
								<Item
									title="PastMonth"
									iconName={"trash-outline"}
									onPress={() => {
										Alert.alert(
											`Delete subject '${navData.route.params.subjectTitle}'`,
											"Are you sure you want to delete this subject? You will loose all stats and linked topics!",
											[
												{
													text: "Delete",
													onPress: () => {
														dispatch(
															subjectActions.removeSubject(
																navData.route.params.subjectId
															)
														);
														navData.navigation.goBack();
													},
												},
												{ text: "Keep" },
											]
										);
									}}
								/>
							</HeaderButtons>
						);
					},
				})}
			/>
			<ScheduleStackNavigator.Screen
				name="ChooseRepeatFrequency"
				component={ChooseRepeatFrequency}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Repeat",
					headerBackTitle: "Event",
				}}
			/>
		</ScheduleStackNavigator.Navigator>
	);
};

const StudyFlowTabNavigator = createBottomTabNavigator();

const ManagerIcon = (props) => <Icon {...props} name="settings-outline" />;

const TimerIcon = (props) => <Icon {...props} name="home-outline" />;

const ModulesIcon = (props) => <Icon {...props} name="flash-outline" />;

const CalendarIcon = (props) => (
	<Icon {...props} name="calendar-outline" animation="zoom" />
);

const BottomTabBar = ({ navigation, state, managerIconRef }) => {
	return (
		//<SafeAreaView>
		<BottomNavigation
			style={{
				height: Dimensions.get("window").height / 10,
				alignItems: "flex-start",
				paddingTop: 15,
			}}
			selectedIndex={state.index}
			onSelect={(index) => navigation.navigate(state.routeNames[index])}
		>
			<BottomNavigationTab icon={TimerIcon} />
			<BottomNavigationTab icon={ModulesIcon} />
			<BottomNavigationTab icon={CalendarIcon} />
			<BottomNavigationTab icon={ManagerIcon} />
		</BottomNavigation> //</SafeAreaView>
	);
};

const StudyFlowNavigatorTab = ({ managerIconRef }) => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);
	return (
		<StudyFlowTabNavigator.Navigator
			initialRouteName="StartFlowStack"
			tabBar={(props) => <BottomTabBar {...props} />}
			screenOptions={({ route }) => ({
				tabBarStyle: {},
				//tabBarActiveTintColor: customTheme['color-primary-500'],
				headerShown: false,
				tabBarShowLabel: false,
			})}
		>
			<StudyFlowTabNavigator.Screen
				name="StartFlowStack"
				component={StartFlowNavigator}
			/>
			<StudyFlowTabNavigator.Screen
				name="ModulesStack"
				component={ModulesNavigator}
			/>

			<StudyFlowTabNavigator.Screen
				name="ScheduleStack"
				component={ScheduleNavigator}
				options={{
					tabBarActiveTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return (
							<Ionicons name="calendar-outline" color={color} size={size} />
						);
					},
				}}
			/>
			<StudyFlowTabNavigator.Screen
				name="ManagerStack"
				component={ManagerNavigator}
				options={{
					tabBarActiveTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return <Ionicons name="create-outline" color={color} size={size} />;
					},
				}}
			/>
		</StudyFlowTabNavigator.Navigator>
	);
};

const StudyFlowMainNavigator = createStackNavigator();
const StudyFlowNavigator = () => {
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);

	return (
		<StudyFlowMainNavigator.Navigator>
			<StudyFlowMainNavigator.Screen
				name="TabNavigator"
				component={StudyFlowNavigatorTab}
				options={{headerShown: false}}
			/>
			<StudyFlowMainNavigator.Screen
				name="PracticeQuestionsConfig"
				component={PracticeQuestionsConfig}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Practice Questions",
					headerBackTitle: " ",
				}}
			/>
			<StudyFlowMainNavigator.Screen
				name="CreateQuestion"
				component={CreateQuestion}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Create Question",
					headerBackTitle: " ",
				}}
			/>
			<StudyFlowMainNavigator.Screen
				name="QuestionCards"
				component={QuestionCards}
				options={{
					presentation: "modal",
					headerTintColor:
						colorTheme[colorThemeIndex].source["color-primary-500"],
					headerTitle: "Questions",
					headerBackTitle: " ",
				}}
			/>
		</StudyFlowMainNavigator.Navigator>
	);
};

const styles = StyleSheet.create({
	explosionLottie: {
		flex: 1,
		//overflow: "visible",
	},
	layout: {
		flex: 1,
		//alignItems: "flex-start",
		justifyContent: "flex-start",
	},
});

export default StudyFlowNavigator;
