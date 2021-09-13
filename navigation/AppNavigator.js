import React, {useState} from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from 'react-redux';

import StudyFlowNavigator from './StudyFlowNavigator';
import TutorialNavigator from './TutorialNavigator';

const AppNavigator = () => {
    // get if user has made tutorial yet
    const didTutorial = useSelector(state => state.tutorial.didTutorial)
    
    return (
        <NavigationContainer>
            {didTutorial ? <StudyFlowNavigator/> : <TutorialNavigator/>}
        </NavigationContainer>
    )
}

export default AppNavigator

