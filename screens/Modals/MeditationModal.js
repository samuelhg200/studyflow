import React, {useEffect} from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { Text, Layout } from "@ui-kitten/components";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

const MeditationModal = (props) => {
    const theme = useSelector(state => state.theme.theme)
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            props.navigation.goBack()
        }, props.route.params.timeLeft*1000)
        
        return () => clearTimeout(timeout)
    }, [props.route.params.timeLeft])

	return (
		<Layout style={styles.screen}>
            {theme === 'dark' ? <LottieView
				style={styles.meditationLottie}
				source={require("../../assets/lottie/breatheAnimationDT.json")}
				autoPlay={true}
				loop={true}
				speed={1}
			/> : <LottieView
				style={styles.meditationLottie}
				source={require("../../assets/lottie/breatheAnimationLT.json")}
				autoPlay={true}
				loop={true}
				speed={1}
			/>}
			
		</Layout>
	);
};

export default MeditationModal;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	meditationLottie: {
		height: Dimensions.get("window").width,
	},
});
