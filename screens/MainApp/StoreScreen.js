import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Alert,
	Platform,
	SafeAreaView,
	ScrollView,
	Dimensions,
	Modal,
} from "react-native";
import {
	Card,
	Text,
	Input,
	TopNavigation,
	Divider,
	Layout,
} from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import moment from "moment";
import * as eventsActions from "../../store/actions/events";
import * as studyFlowActions from "../../store/actions/studyFlow";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getIconStringBasedOnEventType } from "../../helpers/functions";
import HeaderButton from "../../components/HeaderButton";
import { FlatList } from "react-native-gesture-handler";
import { timerSkins } from "../../data/products";
import * as walletActions from "../../store/actions/wallet";
import * as productActions from "../../store/actions/product";

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}

const Product = (props) => {
	return (
		<View
			style={{
				...styles.coinProduct,
				borderColor: CustomTheme["color-primary-500"],
			}}
		>
			<View></View>
			<LottieView
				style={timerSkins[props.id].styleShopConfig}
				source={timerSkins[props.id].source}
				autoPlay={true}
				loop={true}
				speed={0.5}
			/>
			<View
				style={{
					alignItems: "flex-start",
					justifyContent: "space-between",
					height: "100%",
					width: Dimensions.get("window").width / 3,
				}}
			>
				<Text style={{ padding: 5, fontFamily: "yellow-tail", fontSize: 20 }}>
					{timerSkins[props.id].name}
				</Text>
				<TouchableCmp onPress={() => props.handleProductBought(props.id)}>
					<View
						style={{
							flexDirection: "row",
							borderWidth: 1.5,
							padding: 8,
							borderRadius: 50,
							borderColor: CustomTheme["color-primary-500"],
							backgroundColor: "white",
							marginBottom: 10,
						}}
					>
						<Ionicons name="wallet-outline" color="black" size={16} />
						<Text style={{ color: "black" }}>
							{" "}
							{timerSkins[props.id].price}
						</Text>
					</View>
				</TouchableCmp>
			</View>
		</View>
	);
};

const StoreScreen = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const theme = useSelector((state) => state.theme.theme);
	const balance = useSelector((state) => state.wallet.amount);
	const ownedProducts = useSelector((state) => state.product.owned);

	const [modalVisible, setModalVisible] = useState(false);
	const [productBoughtIndex, setProductBoughtIndex] = useState(0);
	const [coinStoreSelected, setCoinStoreSelected] = useState(true);
	const [timerSkinsVisible, setTimerSkinsVisible] = useState(false);

	const handleProductBought = (index) => {
		const productId = timerSkins[index].id;
		const productPrice = timerSkins[index].price;
		if (productPrice <= balance && !(ownedProducts.includes(productId))) {
			setProductBoughtIndex(index);
			setModalVisible(true);
			dispatch(productActions.buyProduct(productId));
			dispatch2(walletActions.substractCoins(productPrice));
		} else {
			console.log('reject')
		}
	};

	useEffect(() => {
		props.navigation.setOptions({
			headerRight: () => (
				<Layout
					level="2"
					style={{
						padding: Dimensions.get("window").width / 70,
						flexDirection: "row",
						alignItems: "center",
						borderWidth: 1,
						marginRight: Dimensions.get("window").width / 40,
						borderRadius: 12,
						paddingLeft: Dimensions.get("window").width / 50,
						borderColor: CustomTheme["color-primary-500"],
					}}
				>
					<Ionicons
						name="cash"
						color={theme === "dark" ? "white" : "black"}
						size={15}
					/>
					<Text> {balance}</Text>
				</Layout>
			),
		});
	}, [balance]);

	return (
		<Layout level="2" style={styles.screen}>
			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					setModalVisible(!modalVisible);
				}}
			>
				<TouchableWithoutFeedback
					onPress={() => {
						modalVisible && setModalVisible(false);
					}}
				>
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: 22,
						}}
					>
						<View
							style={{
								...styles.modal,
								backgroundColor:
									theme === "dark"
										? timerSkins[productBoughtIndex].modalBackground
											? "white"
											: CustomTheme["color-primary-500"]
										: CustomTheme["color-primary-200"],
							}}
						>
							<Text
								style={{
									paddingHorizontal: 10,
									fontFamily: "yellow-tail",
									fontSize: 30,
									color:
										theme == "dark"
											? timerSkins[productBoughtIndex].modalBackground
												? CustomTheme["color-primary-500"]
												: "white"
											: "white",
								}}
							>
								{timerSkins[productBoughtIndex].name}
							</Text>
							<LottieView
								style={timerSkins[productBoughtIndex].styleBuyModal}
								source={timerSkins[productBoughtIndex].source}
								autoPlay={true}
								loop={true}
								speed={0.5}
							/>
							<LottieView
								style={{
									width: "100%",
									position: "absolute",
									top: Dimensions.get("window").height / 90,
								}}
								source={require("../../assets/lottie/confetti.json")}
								autoPlay={true}
								loop
							/>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<View
				style={{
					flexDirection: "row",
					marginVertical: Dimensions.get("window").height / 40,
					alignItems: "center",
					justifyContent: "center",
					width: "100%",
				}}
			>
				<TouchableCmp
					onPress={() => {
						setCoinStoreSelected(true);
					}}
				>
					<View
						style={{
							...styles.toggleOption,
							backgroundColor: CustomTheme["color-primary-500"],
							borderBottomLeftRadius: 12,
							borderTopLeftRadius: 12,
							borderRightWidth: 0.5,
							borderColor: "white",
						}}
					>
						<Ionicons
							name={coinStoreSelected ? "flash" : "flash-outline"}
							color="white"
							size={coinStoreSelected ? 20 : 17}
						/>
					</View>
				</TouchableCmp>
				<TouchableCmp
					onPress={() => {
						setCoinStoreSelected(false);
					}}
				>
					<View
						style={{
							...styles.toggleOption,
							backgroundColor: CustomTheme["color-primary-500"],
							borderBottomRightRadius: 12,
							borderTopRightRadius: 12,
							borderLeftWidth: 0.5,
							borderColor: "white",
						}}
					>
						<Ionicons
							name={coinStoreSelected ? "cart-outline" : "cart"}
							color="white"
							size={coinStoreSelected ? 17 : 20}
						/>
					</View>
				</TouchableCmp>
			</View>
			<Divider
				style={{
					backgroundColor:
						theme === "dark" ? "white" : CustomTheme["color-primary-500"],
					height: 0.5,
					alignSelf: "stretch",
				}}
			/>

			<ScrollView
				contentContainerStyle={{
					width: "100%",
					marginTop: 10,
				}}
			>
				<View
					style={{
						width: "100%",
						paddingVertical: 10,

						justifyContent: "center",
						paddingHorizontal: 20,
					}}
				>
					<TouchableCmp
						onPress={() => {
							setTimerSkinsVisible((prev) => !prev);
						}}
					>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
								paddingBottom: 30,
								paddingTop: 5,
								width: "100%",
							}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
							>
								<Ionicons
									name="timer-outline"
									color={theme === "dark" ? "white" : "black"}
									size={20}
								/>
								<Text
									style={{
										fontSize: 22,
										fontFamily: "roboto-bold",
									}}
								>
									{" "}
									Timer Skins
								</Text>
							</View>
							<View>
								<Ionicons
									name={
										timerSkinsVisible
											? "chevron-down-outline"
											: "chevron-forward-outline"
									}
									size={20}
									color={theme === "dark" ? "white" : "black"}
								/>
							</View>
						</View>
					</TouchableCmp>
					{timerSkinsVisible && (
						<View>
							<Product id={0} handleProductBought={handleProductBought} />
							<Product id={4} handleProductBought={handleProductBought} />
							<Product id={1} handleProductBought={handleProductBought} />
							<Product id={5} handleProductBought={handleProductBought} />
							<Product id={6} handleProductBought={handleProductBought} />
							<Product id={2} handleProductBought={handleProductBought} />
							<Product id={3} handleProductBought={handleProductBought} />
						</View>
					)}
				</View>
			</ScrollView>
		</Layout>
	);
};

export default StoreScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	toggleOption: {
		padding: 10,
		width: Dimensions.get("window").width / 5,
		justifyContent: "center",
		alignItems: "center",
	},
	coinProduct: {
		width: "95%",
		padding: 18,
		borderRadius: 12,
		borderTopLeftRadius: 0,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		borderWidth: 1.5,
		height: Dimensions.get("window").height / 6,
		marginBottom: Dimensions.get("window").height / 35,
	},
	modal: {
		width: Dimensions.get("window").width / 1.2,
		height: Dimensions.get("window").height / 2.5,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 30,
		alignItems: "center",
		shadowColor: CustomTheme["color-primary-500"],
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 1,
		shadowRadius: 12,
		elevation: 5,
		overflow: "visible",
	},
});
