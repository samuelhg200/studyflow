import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
	Platform,
	ScrollView,
	Dimensions,
	Modal,
} from "react-native";
import { Card, Text, Divider, Layout, Button, Toggle } from "@ui-kitten/components";
import { Ionicons } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import LottieView from "lottie-react-native";
import CustomTheme from "../../assets/UIkitten/custom-theme.json";

import { timerSkins, themeProd, colorTheme } from "../../data/products";
import * as walletActions from "../../store/actions/wallet";
import * as productActions from "../../store/actions/product";
import * as themeActions from '../../store/actions/theme'

let TouchableCmp = TouchableOpacity;
if (Platform.OS === "android") {
	TouchableCmp = TouchableNativeFeedback;
}
//import { colorTheme } from "../../data/products";
//const colorThemeIndex = useSelector((state) => state.product.colorTheme)
//colorTheme[colorThemeIndex].source
const Product = (props) => {
	return (
		<View
			style={{
				...styles.coinProduct,
				borderColor:
					colorTheme[props.colorThemeIndex].source["color-primary-500"],
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
				{!props.owned ? (
					<TouchableCmp onPress={() => props.handleProductBought(props.id)}>
						<View
							style={{
								flexDirection: "row",
								borderWidth: 1.5,
								padding: 8,
								borderRadius: 50,
								borderColor:
									colorTheme[props.colorThemeIndex].source["color-primary-500"],
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
				) : (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<TouchableCmp
							onPress={() => {
								props.studyHandler(timerSkins[props.id].id);
							}}
						>
							<View
								style={{
									flexDirection: "row",
									borderWidth: 1.5,
									padding: 8,
									borderRadius: 50,
									borderColor:
										colorTheme[props.colorThemeIndex].source[
											"color-primary-500"
										],
									backgroundColor:
										props.theme === "dark"
											? props.study
												? "white"
												: "#0000"
											: props.study
											? colorTheme[props.colorThemeIndex].source[
													"color-primary-200"
											  ]
											: "#0000",
									marginBottom: 10,
									alignItems: "center",
								}}
							>
								<Ionicons
									name="school-outline"
									color={
										props.study
											? "black"
											: props.theme == "dark"
											? "white"
											: "black"
									}
									size={17}
								/>
								{props.study && (
									<Ionicons name="checkmark-outline" color="black" size={12} />
								)}
							</View>
						</TouchableCmp>
						<TouchableCmp
							onPress={() => {
								props.breakHandler(timerSkins[props.id].id);
							}}
						>
							<View
								style={{
									flexDirection: "row",
									borderWidth: 1.5,
									padding: 8,
									borderRadius: 50,
									borderColor:
										colorTheme[props.colorThemeIndex].source[
											"color-primary-500"
										],
									backgroundColor:
										props.theme === "dark"
											? props.break
												? "white"
												: "#0000"
											: props.break
											? colorTheme[props.colorThemeIndex].source[
													"color-primary-200"
											  ]
											: "#0000",
									marginBottom: 10,
									alignItems: "center",
								}}
							>
								<Ionicons
									name="cafe-outline"
									color={
										props.break
											? "black"
											: props.theme == "dark"
											? "white"
											: "black"
									}
									size={17}
								/>
								{props.break && (
									<Ionicons name="checkmark-outline" color="black" size={12} />
								)}
							</View>
						</TouchableCmp>
					</View>
				)}
			</View>
		</View>
	);
};

const ProductColorTheme = (props) => {
	return (
		<View
			style={{
				...styles.coinProduct,
				borderColor:
					colorTheme[props.colorThemeIndex].source["color-primary-500"],
			}}
		>
			<View></View>
			<LottieView
				style={colorTheme[props.index].styleShopConfig}
				source={colorTheme[props.index].storeAnimation}
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
					{colorTheme[props.index].name}
				</Text>
				{!props.owned ? (
					<TouchableCmp
						onPress={() => props.handleColorThemeBought(props.index)}
					>
						<View
							style={{
								flexDirection: "row",
								borderWidth: 1.5,
								padding: 8,
								borderRadius: 50,
								borderColor:
									colorTheme[props.colorThemeIndex].source["color-primary-500"],
								backgroundColor: "white",
								marginBottom: 10,
							}}
						>
							<Ionicons name="wallet-outline" color="black" size={16} />
							<Text style={{ color: "black" }}>
								{" "}
								{colorTheme[props.index].price}
							</Text>
						</View>
					</TouchableCmp>
				) : (
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "100%",
						}}
					>
						<TouchableCmp
							onPress={() => {
								props.selectionHandler(props.index);
							}}
						>
							<View
								style={{
									flexDirection: "row",
									borderWidth: 1.5,
									padding: 8,
									borderRadius: 50,
									borderColor:
										colorTheme[props.colorThemeIndex].source[
											"color-primary-500"
										],
									backgroundColor:
										props.theme === "dark"
											? props.selected
												? "white"
												: "#0000"
											: props.selected
											? colorTheme[props.colorThemeIndex].source[
													"color-primary-200"
											  ]
											: "#0000",
									marginBottom: 10,
									alignItems: "center",
								}}
							>
								<Ionicons
									name="color-palette-outline"
									color={
										props.selected
											? "black"
											: props.theme == "dark"
											? "white"
											: "black"
									}
									size={17}
								/>
								{props.selected && (
									<Ionicons name="checkmark-outline" color="black" size={12} />
								)}
							</View>
						</TouchableCmp>
					</View>
				)}
			</View>
		</View>
	);
};

const StoreScreen = (props) => {
	const dispatch = useDispatch();
	const dispatch2 = useDispatch();
	const dispatch3 = useDispatch();
	const dispatch4 = useDispatch();
	const dispatch5 = useDispatch();
	const dispatch6 = useDispatch();
	const dispatch7 = useDispatch();
	const dispatch8 = useDispatch();
	const dispatch9 = useDispatch();
	const dispatch10 = useDispatch()

	const theme = useSelector((state) => state.theme.theme);
	const balance = useSelector((state) => state.wallet.amount);
	const ownedProducts = useSelector((state) => state.product.owned);
	const ownedColorThemes = useSelector(
		(state) => state.product.ownedColorThemes
	);
	const themeBought = useSelector((state) => state.product.theme);
	const studyTimerSelected = useSelector(
		(state) => state.product.studyTimerSkin
	);
	const breakTimerSelected = useSelector(
		(state) => state.product.breakTimerSkin
	);
	const colorThemeIndex = useSelector((state) => state.product.colorTheme);

	const [modalVisible, setModalVisible] = useState(false);
	const [productBoughtIndex, setProductBoughtIndex] = useState(0);
	const [coinStoreSelected, setCoinStoreSelected] = useState(true);
	const [timerSkinsVisible, setTimerSkinsVisible] = useState(false);
	const [colorThemesVisible, setColorThemesVisible] = useState(false);

	const handleProductBought = (index) => {
		const productId = timerSkins[index].id;
		const productPrice = timerSkins[index].price;
		if (productPrice <= balance && !ownedProducts.includes(productId)) {
			setProductBoughtIndex(index);
			setModalVisible(true);
			dispatch(productActions.buyProduct(productId));
			dispatch2(walletActions.substractCoins(productPrice));
		} else {
			console.log("reject");
		}
	};

	const handleThemeBought = () => {
		if (themeProd.price <= balance) {
			dispatch5(productActions.setTheme(true));
			dispatch6(walletActions.substractCoins(themeProd.price));
		} else {
			console.log("reject");
		}
	};

	const handleColorThemeBought = (index) => {
		const productPrice = colorTheme[index].price;
		if (
			colorTheme[index].price <= balance &&
			!ownedColorThemes.includes(index)
		) {
			//setProductBoughtIndex(index);
			//setModalVisible(true);
			dispatch7(productActions.buyColorTheme(index));
			dispatch8(walletActions.substractCoins(productPrice));
		} else {
			console.log("reject");
		}
	};

	const handleStudyTimerSkinSelection = (id) => {
		dispatch3(productActions.setStudyTimer(id));
	};

	const handleBreakTimerSkinSelection = (id) => {
		dispatch4(productActions.setBreakTimer(id));
	};

	const handleColorThemeSelection = (index) => {
		dispatch9(productActions.setColorTheme(index));
	};

	const onToggleTheme = () => {
		dispatch10(themeActions.toggleTheme());
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
						borderColor:
							colorTheme[colorThemeIndex].source["color-primary-500"],
					}}
				>
					<Ionicons
						name="wallet-outline"
						color={theme === "dark" ? "white" : "black"}
						size={15}
					/>
					<Text> {balance}</Text>
				</Layout>
			),
		});
	}, [balance, colorThemeIndex, theme]);

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
								shadowColor:
									colorTheme[colorThemeIndex].source["color-primary-500"],
								backgroundColor:
									theme === "dark"
										? timerSkins[productBoughtIndex].modalBackground
											? "white"
											: colorTheme[colorThemeIndex].source["color-primary-500"]
										: colorTheme[colorThemeIndex].source["color-primary-200"],
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
												? colorTheme[colorThemeIndex].source[
														"color-primary-500"
												  ]
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
							backgroundColor:
								colorTheme[colorThemeIndex].source["color-primary-500"],
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
							backgroundColor:
								colorTheme[colorThemeIndex].source["color-primary-500"],
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
						theme === "dark"
							? "white"
							: colorTheme[colorThemeIndex].source["color-primary-500"],
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
					<View
						style={{
							...styles.coinProduct,
							borderColor:
								colorTheme[colorThemeIndex].source["color-primary-500"],
						}}
					>
						<LottieView
							style={{
								width: Dimensions.get("window").width / 2.8,
							}}
							source={require("../../assets/lottie/ShopChest.json")}
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
							<Text
								style={{
									padding: 5,
									fontFamily: "yellow-tail",
									fontSize: 22,
								}}
							>
								Daily Coins
							</Text>
							<Button appearance="outline">Claim</Button>
							{/* <TouchableCmp onPress={() => {console.log('show video')}}>
								<View
									style={{
										flexDirection: "row",
										borderWidth: 1.5,
										padding: 8,
										borderRadius: 50,
										borderColor:
											colorTheme[colorThemeIndex].source["color-primary-500"],
										backgroundColor: "white",
										marginBottom: 10,
									}}
								>
									<Ionicons name="wallet-outline" color="black" size={16} />
									<Text style={{ color: "black" }}> {Show Video}</Text>
								</View>
							</TouchableCmp> */}
						</View>
					</View>
					{!themeBought ? (
						
						<View
							style={{
								...styles.coinProduct,
								borderColor:
									colorTheme[colorThemeIndex].source["color-primary-500"],
							}}
						>
							<View></View>
							<LottieView
								style={themeProd.styleBuyModal}
								source={themeProd.source}
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
								<Text
									style={{
										padding: 5,
										fontFamily: "yellow-tail",
										fontSize: 24,
									}}
								>
									{theme === "dark" ? "Light Theme" : "Dark Theme"}
								</Text>
								<TouchableCmp onPress={() => handleThemeBought(props.id)}>
									<View
										style={{
											flexDirection: "row",
											borderWidth: 1.5,
											padding: 8,
											borderRadius: 50,
											borderColor:
												colorTheme[colorThemeIndex].source["color-primary-500"],
											backgroundColor: "white",
											marginBottom: 10,
										}}
									>
										<Ionicons name="wallet-outline" color="black" size={16} />
										<Text style={{ color: "black" }}> {themeProd.price}</Text>
									</View>
								</TouchableCmp>
							</View>
						</View>
					) : (
						<View>
							<Divider
						style={{
							backgroundColor:
								theme === "dark"
									? "white"
									: colorTheme[colorThemeIndex].source["color-primary-500"],
							height: 1,
							alignSelf: "stretch",
							marginBottom: Dimensions.get("window").height / 40,
						}}
					/>
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
										name={theme === 'dark' ? "cloudy-night-outline" : 'partly-sunny-outline'}
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
										Dark Theme
									</Text>
								</View>
								<View>
								<Toggle
									checked={theme === "dark"}
									onChange={onToggleTheme}
									style={{}}
									disabled={!themeBought}
								></Toggle>
								</View>
							</View>
						</View>
					)}
					<Divider
						style={{
							backgroundColor:
								theme === "dark"
									? "white"
									: colorTheme[colorThemeIndex].source["color-primary-500"],
							height: 1,
							alignSelf: "stretch",
							marginBottom: Dimensions.get("window").height / 40,
						}}
					/>
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
							{timerSkins.map((timerSkin, index) => {
								return (
									<Product
										key={index}
										theme={theme}
										id={index}
										handleProductBought={handleProductBought}
										owned={ownedProducts.includes(timerSkin.id)}
										study={studyTimerSelected === timerSkin.id}
										break={breakTimerSelected === timerSkin.id}
										studyHandler={handleStudyTimerSkinSelection}
										breakHandler={handleBreakTimerSkinSelection}
										colorThemeIndex={colorThemeIndex}
									/>
								);
							})}
						</View>
					)}
					<Divider
						style={{
							backgroundColor:
								theme === "dark"
									? "white"
									: colorTheme[colorThemeIndex].source["color-primary-500"],
							height: 1,
							alignSelf: "stretch",
							marginBottom: Dimensions.get("window").height / 40,
						}}
					/>
					<TouchableCmp
						onPress={() => {
							setColorThemesVisible((prev) => !prev);
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
									name="color-palette-outline"
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
									Color Themes
								</Text>
							</View>
							<View>
								<Ionicons
									name={
										colorThemesVisible
											? "chevron-down-outline"
											: "chevron-forward-outline"
									}
									size={20}
									color={theme === "dark" ? "white" : "black"}
								/>
							</View>
						</View>
					</TouchableCmp>

					{colorThemesVisible && (
						<View>
							{colorTheme.map((colorTheme, index) => {
								return (
									<ProductColorTheme
										key={index}
										theme={theme}
										index={index}
										handleColorThemeBought={handleColorThemeBought}
										owned={ownedColorThemes.includes(index)}
										selected={colorThemeIndex === index}
										selectionHandler={handleColorThemeSelection}
										colorThemeIndex={colorThemeIndex}
									/>
								);
							})}
						</View>
					)}
					<Divider
						style={{
							backgroundColor:
								theme === "dark"
									? "white"
									: colorTheme[colorThemeIndex].source["color-primary-500"],
							height: 1,
							alignSelf: "stretch",
							marginBottom: Dimensions.get("window").height / 40,
						}}
					/>
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
