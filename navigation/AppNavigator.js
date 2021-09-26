import React, {useState, useRef} from 'react'
import { NavigationContainer, DefaultTheme, DarkTheme  } from "@react-navigation/native";
import { useSelector } from 'react-redux';

import StudyFlowNavigator from './StudyFlowNavigator';
import TutorialNavigator from './TutorialNavigator';
import CustomTheme from '../assets/UIkitten/custom-theme.json'

const AppNavigator = () => {
        // get if user has made tutorial yet
    const didTutorial = useSelector(state => state.tutorial.didTutorial)
	const theme = useSelector(state => state.theme.theme)

    const MyTheme = {
        dark: theme === 'dark',
        colors: {
          ...DefaultTheme.colors
        },
      };

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
    
    return (
        <NavigationContainer theme={MyTheme.dark ? MyDarkTheme : DefaultTheme }>
            {didTutorial ? <StudyFlowNavigator /> : <TutorialNavigator/>}
        </NavigationContainer>
    )
}

export default AppNavigator

