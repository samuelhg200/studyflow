import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableWithoutFeedback, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LottieView from "lottie-react-native";
import { BottomNavigation, BottomNavigationTab, Layout, Text } from '@ui-kitten/components';

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

import customTheme from "../assets/UIkitten/custom-theme.json";

import CustomTheme from "../assets/UIkitten/custom-theme.json";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";


const MetricsStackNavigator = createStackNavigator();
const MetricsNavigator = () => (
	<MetricsStackNavigator.Navigator>
		<MetricsStackNavigator.Screen name="Metrics" component={MetricsScreen} />
	</MetricsStackNavigator.Navigator>
);

const ManagerStackNavigator = createStackNavigator();
const ManagerNavigator = () => (
	<ManagerStackNavigator.Navigator>
		<ManagerStackNavigator.Screen name="Manager" component={ManagerScreen} />
	</ManagerStackNavigator.Navigator>
);

const StartFlowStackNavigator = createStackNavigator();
const StartFlowNavigator = () => (
	<StartFlowStackNavigator.Navigator>
		<StartFlowStackNavigator.Screen
			name="StartFlow"
			component={StartFlowScreen}
			options={startFlowScreenOptions}
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
			name="EventPreview"
			component={EventPreviewScreen}
			options={{
				presentation: "modal",
				headerTintColor: customTheme["color-primary-500"],
				headerTitle: "Event Info",
				headerBackTitle: "Home",
			}}
		/>
		<StartFlowStackNavigator.Screen name="Timer" component={TimerScreen} />
		<StartFlowStackNavigator.Screen name="Store" component={StoreScreen} />
		<StartFlowStackNavigator.Screen name="Profile" component={ProfileScreen} />
	</StartFlowStackNavigator.Navigator>
);

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
		</ScheduleStackNavigator.Navigator>
	);
};

const StudyFlowTabNavigator = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
	<BottomNavigation
	  selectedIndex={state.index}
	  onSelect={index => navigation.navigate(state.routeNames[index])}>
	  <BottomNavigationTab title='USERS'/>
	  <BottomNavigationTab title='ORDERS'/>
	</BottomNavigation>
  );

const StudyFlowNavigator = () => {
	return (
		<StudyFlowTabNavigator.Navigator
			initialRouteName="StartFlowStack"
			tabBar={props => <BottomTabBar {...props} />}
			screenOptions={({ route }) => ({
				tabBarActiveTintColor: customTheme['color-primary-500'],
				headerShown: false,
				tabBarShowLabel: false,
				tabBarIcon: ({ focused, color, size }) => {
					let filepath;
					let style = {};

					switch (route.name) {
						case "StartFlowStack":
							if (!focused) {
								filepath = require("../assets/lottie/sand-clock.json");
							} else {
								filepath = require("../assets/lottie/sandClockRed.json")
							}
							style = { width: 60, overflow: "visible" };
							return (
								<View
									style={{
										position: "absolute",
										bottom: 15, // space from bottombar
										height: 58,
										width: 58,
										borderRadius: 58,
										backgroundColor: "white",
										borderColor: focused ? color : "#ccc",
										borderWidth: 0.5,
										justifyContent: "center",
										alignItems: "center",
									}}
								>
									<LottieView
										source={filepath}
										autoPlay={focused}
										style={style}
									/>
								</View>
							);
						default:
							return;
					}
				},
			})}
		>
			<StudyFlowTabNavigator.Screen
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
			/>
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
			<StudyFlowTabNavigator.Screen
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
			/>
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
