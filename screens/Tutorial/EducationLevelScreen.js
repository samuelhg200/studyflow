import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import {
	Layout,
	IndexPath,
	SelectItem,
	Text,
	Select,
	Button,
} from "@ui-kitten/components";
import LottieView from "lottie-react-native";

const educationLevelData = [
	"University / College",
	"High School",
	"School",
	"Short Course",
	"Other",
];

const studyHoursData = [
	"Less than 1 hour",
	"Between 2 and 4 hours",
	"Between 5 and 10 hours",
	"Between 11 and 20 hours",
	"More than 20 hours",
];

const EducationLevelScreen = (props) => {
	//const [educationLevel, setEducationLevel] = useState('Unknown');
	const [selectedIndex1, setSelectedIndex1] = useState(new IndexPath(0));
	const [selectedIndex2, setSelectedIndex2] = useState(new IndexPath(0));
	const [showAnimation, setShowAnimation] = useState(false);

	const animation = useRef(null);

	useEffect(() => {
		if (showAnimation) {
			animation.current.play(0, 59);
		} else {
		}
	}, [showAnimation]);

	const educationLevel = educationLevelData[selectedIndex1.row];
	const studyHours = studyHoursData[selectedIndex2.row];

	const renderOption = (title) => {
		return <SelectItem title={title} key={title} />;
	};

	return (
		<Layout style={styles.screen}>
			<SafeAreaView />
			<Text style={styles.title} category="h4">
				At what level are you studying now?
			</Text>
			<Select
				selectedIndex={selectedIndex1}
				onSelect={(index) => setSelectedIndex1(index)}
				value={educationLevel}
				style={styles.selectBox}
				placeholder="Default"
			>
				{educationLevelData.map((item) => renderOption(item))}
			</Select>
			<Text style={styles.title} category="h4">
				How many hours do you study a week?
			</Text>
			<Select
				selectedIndex={selectedIndex2}
				onSelect={(index) => setSelectedIndex2(index)}
				value={studyHours}
				style={{ marginBottom: 40, ...styles.selectBox }}
				placeholder="Default"
			>
				{studyHoursData.map((item) => renderOption(item))}
			</Select>
			<LottieView
				ref={animation}
				style={styles.explosionLottie}
				source={require("../../assets/lottie/explosion.json")}
				autoPlay={false}
				loop={false}
				speed={2.5}
			/>
			<Button
				style={{ marginTop: -120 }}
				size="giant"
				onPress={() => {
					setShowAnimation(true);
					setTimeout(()=> {
						props.navigation.navigate('StudyFlowExplained');
					   }, 350);
				}}
			>
				Finish Calibration
			</Button>
		</Layout>
	);
};

export default EducationLevelScreen;

const styles = StyleSheet.create({
	screen: { flex: 1, alignItems: "center", justifyContent: "flex-start" },
	title: {
		marginBottom: 40,
		marginTop: 70,
		textAlign: "center",
		padding: 5,
	},
	selectBox: {
		width: "75%",
		paddingBottom: 20,
	},
	explosionLottie: {
		width: "50%",
		overflow: "visible",
	},
});
