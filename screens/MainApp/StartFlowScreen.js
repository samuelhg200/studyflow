import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/HeaderButton";


const StartFlowScreen = () => {
    return (
        <View>
            <Text></Text>
        </View>
    )
}

export default StartFlowScreen

export const screenOptions = (navData) => {
	return {
		headerTitle: "Study Flow",
		headerLeft: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Store"
					iconName={'cafe-outline'}
					onPress={() => {
						navData.navigation.navigate('Store');
					}}
				/>
			</HeaderButtons>
		),
		headerRight: () => (
			<HeaderButtons HeaderButtonComponent={HeaderButton}>
				<Item
					title="Cart"
					iconName={'person-outline'}
					onPress={() => {
						navData.navigation.navigate("Cart");
					}}
                    
				/>
			</HeaderButtons>
		),
        
	};
};

const styles = StyleSheet.create({})
