import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import WelcomeScreen from "../screens/Tutorial/WelcomeScreen";
import ImprovementScreen from "../screens/Tutorial/ImprovementScreen";
import EducationLevelScreen from "../screens/Tutorial/EducationLevelScreen";
import StudyFlowExplainedScreen from "../screens/Tutorial/StudyFlowExplainedScreen";

const TutorialStackNavigator = createStackNavigator();

const TutorialNavigator = () => {
	return (
		<TutorialStackNavigator.Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<TutorialStackNavigator.Screen name="Welcome" component={WelcomeScreen} />
			<TutorialStackNavigator.Screen
				name="Improvement"
				component={ImprovementScreen}
			/>
			<TutorialStackNavigator.Screen
				name="EducationLevel"
				component={EducationLevelScreen}
			/>
			<TutorialStackNavigator.Screen
				name="StudyFlowExplained"
				component={StudyFlowExplainedScreen}
			/>
		</TutorialStackNavigator.Navigator>
	);
};

export default TutorialNavigator;
