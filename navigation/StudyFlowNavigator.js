import React, { useRef, useState, useEffect } from "react";
import {
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	Alert,
} from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LottieView from "lottie-react-native";
import {
	BottomNavigation,
	BottomNavigationTab,
	Icon,
	Layout,
	Text,
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
import PreTimerModal from "../screens/Modals/PreTimerModal";
import MeditationModal from "../screens/Modals/MeditationModal";
import HeaderButton from "../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import customTheme from "../assets/UIkitten/custom-theme.json";

import CustomTheme from "../assets/UIkitten/custom-theme.json";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as subjectActions from "../store/actions/subject";
import * as studyFlowActions from "../store/actions/studyFlow";

import { useDispatch } from "react-redux";

const MetricsStackNavigator = createStackNavigator();
const MetricsNavigator = () => (
	<MetricsStackNavigator.Navigator>
		<MetricsStackNavigator.Screen name="Metrics" component={MetricsScreen} />
	</MetricsStackNavigator.Navigator>
);

const ManagerStackNavigator = createStackNavigator();
const ManagerNavigator = () => {
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
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Manager",
				}}
			/>
			<ManagerStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
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
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Edit StudyFlow",
					headerBackTitle: "Manager",
				}}
			/>
		</ManagerStackNavigator.Navigator>
	);
};

const StartFlowStackNavigator = createStackNavigator();
const StartFlowNavigator = () => {
	
	return (
		<StartFlowStackNavigator.Navigator>
			<StartFlowStackNavigator.Screen
				name="StartFlow"
				component={StartFlowScreen}
				//options={startFlowScreenOptions}
				options={{ headerShown: false }}
			/>
			<StartFlowStackNavigator.Screen
				name="ChooseEventType"
				component={ChooseEventTypeScreen}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="AddItemToCalendar"
				component={AddItemToCalendarScreen}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="Subjects"
				component={SubjectsModal}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Manager",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
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
			<StartFlowStackNavigator.Screen
				name="EventPreview"
				component={EventPreviewScreen}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Event Info",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="PreTimer"
				component={PreTimerModal}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "",
					headerBackTitle: "Home",
				}}
			/>
			<StartFlowStackNavigator.Screen
				name="EditStudyFlow"
				component={EditStudyFLowModal}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Edit StudyFlow",
					headerBackTitle: "Event",
				}}
			/>

			<StartFlowStackNavigator.Screen
				name="Timer"
				component={TimerScreen}
				options={{ headerShown: false }}
			/>
			<StartFlowStackNavigator.Screen name="Store" component={StoreScreen} />
			<StartFlowStackNavigator.Screen
				name="Profile"
				component={ProfileScreen}
			/>
			<StartFlowStackNavigator.Screen
				name="Meditation"
				component={MeditationModal}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Meditation",
					headerBackTitle: " ",
				}}
			/>
		</StartFlowStackNavigator.Navigator>
	);
};

const GoalsStackNavigator = createStackNavigator();
const GoalsNavigator = () => (
	<GoalsStackNavigator.Navigator>
		<GoalsStackNavigator.Screen name="Goals" component={GoalsScreen} />
	</GoalsStackNavigator.Navigator>
);

const ScheduleStackNavigator = createStackNavigator();
const ScheduleNavigator = () => {
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
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Event Info",
					headerBackTitle: "Agenda",
				}}
			/>

			<ScheduleStackNavigator.Screen
				name="AddItemToCalendar"
				component={AddItemToCalendarScreen}
				options={{
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
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
					headerTintColor: customTheme["color-primary-500"],
					headerTitle: "Subjects",
					headerBackTitle: "Calendar",
				}}
			/>
			<ScheduleStackNavigator.Screen
				name="Topics"
				component={TopicsModal}
				options={(navData) => ({
					presentation: "modal",
					headerTintColor: customTheme["color-primary-500"],
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
		</ScheduleStackNavigator.Navigator>
	);
};

const StudyFlowTabNavigator = createBottomTabNavigator();

const MetricsIcon = (props) => <Icon {...props} name="bar-chart-outline" />;

const ManagerIcon = (props) => <Icon {...props} name="bulb-outline" />;

const TimerIcon = (props) => <Icon {...props} name="book-open-outline" />;

const CalendarIcon = (props) => (
	<Icon {...props} name="calendar-outline" animation="zoom" />
);

const BottomTabBar = ({ navigation, state, managerIconRef }) => {
	return (
		<BottomNavigation
			style={{ height: 80, alignItems: "flex-start", paddingTop: 15 }}
			selectedIndex={state.index}
			onSelect={(index) => navigation.navigate(state.routeNames[index])}
		>
			<BottomNavigationTab icon={ManagerIcon} />
			<BottomNavigationTab icon={TimerIcon} />
			<BottomNavigationTab icon={CalendarIcon} />
		</BottomNavigation>
	);
};

const StudyFlowNavigator = ({ managerIconRef }) => {
	return (
		<StudyFlowTabNavigator.Navigator
			initialRouteName="StartFlowStack"
			tabBar={(props) => <BottomTabBar {...props} />}
			screenOptions={({ route }) => ({
				tabBarStyle: { height: 100 },
				//tabBarActiveTintColor: customTheme['color-primary-500'],
				headerShown: false,
				tabBarShowLabel: false,
			})}
		>
			{/* <StudyFlowTabNavigator.Screen
				name="MetricsStack"
				component={MetricsNavigator}
				options={{
					tabBarActiveTintColor: customTheme["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return (
							<Ionicons name="stats-chart-outline" color={color} size={size} />
						);
					},
				}}
			/> */}
			<StudyFlowTabNavigator.Screen
				name="ManagerStack"
				component={ManagerNavigator}
				options={{
					tabBarActiveTintColor: customTheme["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return <Ionicons name="create-outline" color={color} size={size} />;
					},
				}}
			/>
			<StudyFlowTabNavigator.Screen
				name="StartFlowStack"
				component={StartFlowNavigator}
				// options={{
				// 	tabBarIcon: ({ size, focused, color }) => {
				// 		return (
				// 			<View
				// 				style={{
				// 					position: "absolute",
				// 					bottom: 15, // space from bottombar
				// 					height: 58,
				// 					width: 58,
				// 					borderRadius: 58,
				// 					backgroundColor: "white",
				// 					borderColor: color,
				// 					borderWidth: 0.4,
				// 					justifyContent: "center",
				// 					alignItems: "center",
				// 				}}
				// 			>
				// 				<Ionicons name="hourglass-outline" color={color} size={38} />
				// 			</View>
				// 		);
				// 	},
				// }}
			/>
			{/* <StudyFlowTabNavigator.Screen
				name="GoalsStack"
				component={GoalsNavigator}
				options={{
					tabBarActiveTintColor: customTheme["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return (
							<Ionicons name="trail-sign-outline" color={color} size={size} />
						);
					},
				}}
			/> */}
			<StudyFlowTabNavigator.Screen
				name="ScheduleStack"
				component={ScheduleNavigator}
				options={{
					tabBarActiveTintColor: customTheme["color-primary-500"],
					tabBarIcon: ({ size, focused, color }) => {
						return (
							<Ionicons name="calendar-outline" color={color} size={size} />
						);
					},
				}}
			/>
		</StudyFlowTabNavigator.Navigator>
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
