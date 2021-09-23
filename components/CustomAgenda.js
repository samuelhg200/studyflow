import React, { useState, useCallback, useEffect, useRef } from "react";
import {
	SafeAreaView,
	StyleSheet,
	Platform,
	TouchableOpacity,
	TouchableNativeFeedback,
	View,
	FlatList,
} from "react-native";
import { Card, Layout, Button, Text } from "@ui-kitten/components";
import { useSelector } from "react-redux";
import moment from "moment";

function addMonths(date, months) {
	date.setMonth(date.getMonth() + months);
	return date;
}



Date.prototype.addDays = function (days) {
	var date = new Date(this.valueOf());
	date.setDate(date.getDate() + days);
	return date;
};

function getDates(startDate, stopDate) {
	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(new Date(currentDate));
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
}


const Footer = (props) => (
	<View {...props} style={[props.style, styles.footerContainer]}>
		<Button
			style={styles.footerControl}
			onPress={() => {
				props.deleteHandler(props.item.id);
			}}
			size="small"
			status="basic"
		>
			<Ionicons name="trash-outline" color={"white"} size={15} />
			<Text style={{ color: "white" }}> Remove</Text>
		</Button>
	</View>
);

const Header = (props) => {
	return (
		<View {...props} style={[props.style, styles.headerContainer]}>
			<View
				style={{
					flexDirection: "row",
					flexWrap: "wrap",
					marginRight: 1,
					flex: 1,
				}}
			>
				{props.item.subjects.map((subject) => {
					return (
						<View
							key={subject.id}
							style={{
								padding: 2,
								margin: 2,
								backgroundColor: subject.color,
								borderRadius: 2,
							}}
						>
							<Text style={{ fontSize: 11, color: "white" }}>
								{subject.title}
							</Text>
						</View>
					);
				})}
			</View>
			<Text
				category="s2"
				style={{ fontSize: 12, color: customTheme["color-primary-400"] }}
			>
				{props.item.timeRange}
			</Text>
		</View>
	);
};

const CustomAgenda = () => {
	const [currentDay, setCurrentDay] = useState(moment());
	const events = useSelector((state) => state.events.events);
	const [items, setItems] = useState(getItems());

	const onViewableItemsChanged = useCallback(({ viewableItems, changed }) => {
		console.log("Visible items are", viewableItems);
		console.log("Changed in this iteration", changed);
	}, []);

	function getItems() {
		const itemsToReturn = events.slice();
		let key = 1;

		const minMonth = addMonths(new Date(), -6);
		const maxMonth = addMonths(new Date(), 6);
		const allDates = getDates(minMonth, maxMonth);

		for (let i = 0; i < allDates.length; i++) {
			key++;
			const currentDate = allDates[i].setHours(0, 0, 0, 0);
			let found = false;
			if (events.length > 0) {
				for (let j = 0; j < events.length; j++) {
					if (currentDate === events[j].date.setHours(0, 0, 0, 0)) {
						found = true;
						break;
					}
				}
			}

			if (!found) {
				itemsToReturn.push({ key: key.toString(), date: currentDate });
			}
		}

		return itemsToReturn;
	}

	useEffect(() => {
		setItems(getItems());
	}, [events]);


	const eventItem = (itemData) => {
		if (Object.keys(itemData.item).length === 2) {
			return (
				<TouchableCmp
					onPress={() => {
						// setDayPressed(itemData.item.date);
						// animation.current.animateButton();
					}}
				>
					<Card
						onPress={() => {
						// setDayPressed(itemData.item.date);
							// animation.current.animateButton();
						}}
						style={{
							...styles.card,
							height: 95,
							justifyContent: "center",
							backgroundColor: "#f0f7f2",
							borderColor: customTheme["color-primary-400"],
							borderWidth: 1,
						}}
					>
						<TouchableCmp
							onPress={() => {
								// setDayPressed(info);
								// animation.current.animateButton();
							}}
							style={{}}
						>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 3,
								}}
							>
								<Ionicons name="add-circle-outline" size={20} />
								<View
									style={{
										marginLeft: 4,
										marginBottom: 1,
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<Text style={{ fontSize: 19, color: "black" }}>
										Add event
									</Text>
								</View>
							</View>
						</TouchableCmp>
					</Card>
				</TouchableCmp>
			);
		} else {
			//actual event
			return (
				<TouchableCmp>
					<Card
						style={styles.card}
						footer={(props) => (
							<Footer
								{...props}
								item={item}
								deleteHandler={deleteEventHandler}
							/>
						)}
						header={(props) => <Header {...props} item={item} />}
					>
						<View style={{ flexDirection: "row" }}>
							<Ionicons
								name={iconName}
								color={customTheme["color-primary-600"]}
								size={18}
							>
								<Text
									category="h6"
									style={{ color: customTheme["color-primary-600"] }}
								>
									{" " + item.title}
								</Text>
							</Ionicons>
						</View>
					</Card>
				</TouchableCmp>
			);
		}
		const iconName = getIconStringBasedOnEventType(item.type);
	};

	return (
		<View>
			{/* <FlatList
				keyExtractor={(item) => item.key}
				style={{ width: "100%" }}
				data={items}
				renderItem={({ item }) => {
					//todo
					return (
						<View>
							<Text>{moment(item.date).format("DD  MMM YYYY")}</Text>
						</View>
					);
				}}
				onViewableItemsChanged={onViewableItemsChanged}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50,
				}}
			/> */}
		</View>
	);
};


const styles = StyleSheet.create({
	footerContainer: {
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	card: {
		flex: 1,
		marginRight: 5,
		marginTop: 10,
		borderRadius: 10,
	},
	itemContainer: {
		backgroundColor: "white",
		margin: 4,
		borderRadius: 15,
		justifyContent: "center",
		alignItems: "center",
		alignContent: "center",
		flex: 1,
	},
	footerControl: {
		marginHorizontal: 2,
		backgroundColor: customTheme["color-primary-400"],
		color: "white",
	},
	headerContainer: {
		justifyContent: "space-between",
		flexDirection: "row",
		alignItems: "flex-start",
	},
});

export default CustomAgenda;

