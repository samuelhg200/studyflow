import React, { useEffect, useState, useRef } from "react";
import {
	StyleSheet,
	View,
	Dimensions,
	Platform,
	TouchableOpacity,
	TouchableNativeFeedback,
    ScrollView
} from "react-native";
import { Text, Layout, Divider } from "@ui-kitten/components";
import LottieView from "lottie-react-native";
import { useSelector, useDispatch } from "react-redux";
import * as Animatable from "react-native-animatable";
import HeaderButton from "../../components/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons"

import { studyTips } from "../../data/study-tips";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import { Ionicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "@ui-kitten/components/devsupport";
import * as currentEventRepeatActions from "../../store/actions/currentEventRepeat";

const repeatOptions = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const ItemToRepeat = (props) => {
    const isSelected = props.selected

    return (<TouchableCmp
		style={{ width: "75%", alignItems: "center", justifyContent: "center" }}
        onPress={() => {props.selectHandler(props.text)}}
	>
		<View style={isSelected ? {...styles.row, ...styles.selected, borderColor: props.theme === 'dark' ?  CustomTheme['color-primary-500'] : CustomTheme['color-primary-400']} : {...styles.row, borderColor: props.theme === 'dark' ?  CustomTheme['color-primary-500'] : CustomTheme['color-primary-400']}} >
			<Text style={{fontSize: 16}}>{props.text}</Text>
            {isSelected ? <Ionicons name="repeat-outline" color={props.theme === 'dark' ? 'white' : CustomTheme['color-primary-500']} size={18}/> : <View></View>}
		</View>
	</TouchableCmp>)
	
};

const ChooseRepeatFrequency = (props) => {
    const dispatch = useDispatch()
	const onRepeatConfig = useSelector(
		(state) => state.currentEventRepeat.repeatConfig
	);
    const theme = useSelector((state) => state.theme.theme)

    const checkIfSelected = (day) => {
        return onRepeatConfig.includes(day)
    }

    const handleSelect = (option) => {
        if (onRepeatConfig.includes(option)){
            dispatch(currentEventRepeatActions.setEventRepeat(onRepeatConfig.filter(configOption => option !== configOption )))
        } else {
            dispatch(currentEventRepeatActions.setEventRepeat([...onRepeatConfig, option]))
        }
    }

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={HeaderButton}>
                        <Item
                            title="editstudyflow"
                            iconName={"save-outline"}
                            onPress={() => {
                                props.navigation.goBack();
                            }}
                        />
                    </HeaderButtons>
                );
            },
        })
    })

	return (<ScrollView>
		<Layout style={styles.screen}>
            
            {repeatOptions.map((option) => <ItemToRepeat key={option} text={option} selected={checkIfSelected(option)} selectHandler={handleSelect} theme={theme}/>)}
			
		</Layout></ScrollView>
	);
};

export default ChooseRepeatFrequency;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
        paddingTop: 20
	},
	row: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "space-between",
		borderWidth: 2,
        borderRadius: 4,
        padding: Dimensions.get('window').height / 80,
        marginVertical: Dimensions.get('window').height / 80
	},
    selected: {
		shadowColor: "#bbb",
		shadowOffset: { width: 1, height: 0 },
		shadowOpacity: 8,
		shadowRadius: 4,
		elevation: 5,
		padding: Dimensions.get('window').height / 60,
        width: '100%'
	},
});
