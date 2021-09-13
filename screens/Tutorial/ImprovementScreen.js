import React, {useState} from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";
import { Layout, Toggle, Text, Button } from "@ui-kitten/components";

const ImprovementScreen = props => {
    const [focusChecked, setFocusChecked] = useState(false)
    const [efficiencyChecked, setEfficiencyChecked] = useState(false)
    const [enjoyChecked, setEnjoyedChecked] = useState(false)
    const [motivationChecked, setMotivationChecked] = useState(false)

    const onFocusChecked = (isChecked) => {
        setFocusChecked(isChecked);
    }

    const onEfficiencyChecked = (isChecked) => {
        setEfficiencyChecked(isChecked)
    }

    const onEnjoyChecked = (isChecked) => {
        setEnjoyedChecked(isChecked)
    }

    const onMotivationChecked = (isChecked) => {
        setMotivationChecked(isChecked)
    }

	return (
		<Layout style={styles.screen}>
			<SafeAreaView />
           
			<Text category="h4" style={styles.title}>
				What do you struggle with when studying?
			</Text>
			<View style={styles.checkboxContainer}>
				<Toggle checked={focusChecked} onChange={onFocusChecked} style={styles.checkbox}  >
					<Text fontSize={22}>Remaining focused</Text>
				</Toggle>
                <Toggle checked={efficiencyChecked} onChange={onEfficiencyChecked} style={styles.checkbox}>
					Being efficient
				</Toggle>
                <Toggle checked={enjoyChecked} onChange={onEnjoyChecked} style={styles.checkbox}>
					Enjoying my study sessions
				</Toggle>
                <Toggle checked={motivationChecked} onChange={onMotivationChecked} style={styles.checkbox}>
					Finding the motivation to start
				</Toggle>
                <Button
					style={{ marginTop: 90, marginBottom: 85 }}
					size="giant"
					onPress={() => props.navigation.navigate("EducationLevel")}
				>
					Calibrate experience
				</Button>
			</View>
            
		</Layout>
	);
};

export default ImprovementScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "flex-start",
	},
	title: {
		marginBottom: 70,
		marginTop: 70,
		textAlign: "center",
		padding: 5,
	},
    checkbox: {
        padding: 20,
        justifyContent: 'flex-start'
    },
    checkboxContainer: {
        width: '80%'
    }
});
