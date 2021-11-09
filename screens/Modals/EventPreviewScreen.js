import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Keyboard,
	Alert,
	Image,
	Platform,
} from "react-native";
import {
	Card,
	Text,
	Input,
	Divider,
	Button,
	Layout,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import Timeline from 'react-native-timeline-flatlist'
import { generateTimeline, getStudyFlow } from "../../helpers/functions";

const EventPreviewScreen = (props) => {
    const event = useSelector(state => state.events.events.find((event) =>  event.id.toString() === props.route.params.id))
	const studyFlowConfig = useSelector(state => state.studyFlow.config)
	const theme = useSelector(state => state.theme.theme)
	const sessionPreview = getStudyFlow(event, studyFlowConfig.studyTime, studyFlowConfig.breakTime)
	const data = generateTimeline(sessionPreview, studyFlowConfig.studyTime, studyFlowConfig.breakTime, new Date(event.date))
	return (
        <Layout style={styles.screen}>
			<View style={styles.listContainer}>
			<Timeline 
				data={data}
				separator={true}
				separatorStyle={ {backgroundColor: theme === 'dark' ? 'white' : 'gray'}}
				innerCircle={'icon'}
				circleSize={32}
				circleColor={CustomTheme['color-primary-500']}
				lineColor={ theme === 'dark' ? 'white' : CustomTheme['color-primary-200']}
				timeStyle={{textAlign: 'center', color:CustomTheme['color-primary-500'],  borderRadius:13}}
				titleStyle={{color: theme === 'dark' ? 'white' : 'black'}}
				descriptionStyle={{color: theme === 'dark' ? '#D9D2D2' : 'gray'}}
				options={{
					style:{padding:25 },
					//ListFooterComponent:() => <Text>#</Text>,
					//ListFooterComponentStyle:{flexGrow: 1, heght: 100},
					
				}}
				//columnFormat='two-column'
				
				
			/></View>
        </Layout>
    )
}

export default EventPreviewScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
	listContainer: {
		flex: 1,
		justifyContent: 'center',
		//flexGrow: 1
	},
    textTitle: {
		fontSize: 18,
		fontWeight: "600",
	},
})
