import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MetricsScreen from "../screens/MainApp/MetricsScreen";
import ManagerScreen from "../screens/MainApp/ManagerScreen";
import StartFlowScreen, {screenOptions as startFlowScreenOptions} from "../screens/MainApp/StartFlowScreen";
import GoalsScreen from "../screens/MainApp/GoalsScreen";
import ScheduleScreen from "../screens/MainApp/ScheduleScreen";
import StoreScreen from '../screens/MainApp/StoreScreen'


import TimerScreen from "../screens/MainApp/TimerScreen";

import CustomTheme from "../assets/UIkitten/custom-theme.json";
import {View} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

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
		<StartFlowStackNavigator.Screen name="Timer" component={TimerScreen} />
        <StartFlowStackNavigator.Screen name="Store" component={StoreScreen} />
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
			/>
		</ScheduleStackNavigator.Navigator>
	);
};

const StudyFlowTabNavigator = createBottomTabNavigator();
const StudyFlowNavigator = () => (
	<StudyFlowTabNavigator.Navigator
		screenOptions={{
			headerShown: false,
            tabBarShowLabel:false,
            
		}}
	>
		<StudyFlowTabNavigator.Screen
			name="MetricsStack"
            
			component={MetricsNavigator}
			options={{
				tabBarIcon: ({ size, focused, color }) => {return (<Ionicons name='stats-chart-outline' color={color} size={size} />)}
			}}
		/>
		<StudyFlowTabNavigator.Screen
			name="ManagerStack"
			component={ManagerNavigator}
            options={{
				tabBarIcon: ({ size, focused, color }) => {return (<Ionicons name='create-outline' color={color} size={size} />)}
			}}
		/>
		<StudyFlowTabNavigator.Screen
			name="StartFlowStack"
			component={StartFlowNavigator}
            options={{
				tabBarIcon: ({ size, focused, color }) => {return (<View style={{
                    position: 'absolute',
                    bottom: 15, // space from bottombar
                    height: 58,
                    width: 58,
                    borderRadius: 58,
                    backgroundColor: 'white',
                    borderColor: color,
                    borderWidth: 0.4,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}><Ionicons name='hourglass-outline' color={color} size={38} /></View>)}
			 }}
		/>
		<StudyFlowTabNavigator.Screen
			name="GoalsStack"
			component={GoalsNavigator}
            options={{
				tabBarIcon: ({ size, focused, color }) => {return (<Ionicons name='trail-sign-outline' color={color} size={size} />)}
			}}
		/>
		<StudyFlowTabNavigator.Screen
			name="ScheduleStack"
			component={ScheduleNavigator}
            options={{
				tabBarIcon: ({ size, focused, color }) => {return (<Ionicons name='calendar-outline' color={color} size={size} />)}
			}}
		/>
	</StudyFlowTabNavigator.Navigator>
);

export default StudyFlowNavigator;
