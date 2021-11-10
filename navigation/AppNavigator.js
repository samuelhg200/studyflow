import React, {useState, useRef} from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme  } from "@react-navigation/native";
import { useSelector } from 'react-redux';

import StudyFlowNavigator from './StudyFlowNavigator';
import TutorialNavigator from './TutorialNavigator';

const AppNavigator = () => {
        // get if user has made tutorial yet
    const didTutorial = useSelector(state => state.tutorial.didTutorial)
	const theme = useSelector(state => state.theme.theme)

    const MyDarkTheme = {
        dark: theme === 'dark',
        colors: {
            
            border: '#222B45',
            background: '#222B45',
            primary: '#222B45',
            card: '#222B45',
            text: '#222B45',
            notification: '#222B45'
        }
    }

    const MyLightTheme = {
        dark: theme === 'dark',
        colors: {
            border: 'white',
            background: 'white',
            primary: 'white',
            card: 'white',
            text: 'white',
            notification: 'white'
        }
    }
    
    return (
        <NavigationContainer theme={theme === 'dark' ? MyDarkTheme : MyLightTheme }>
            {didTutorial ? <StudyFlowNavigator /> : <TutorialNavigator/>}
        </NavigationContainer>
    )
}

export default AppNavigator

