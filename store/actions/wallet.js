export const ADD_COINS = "ADD_COINS";
export const SUBSTRACT_COINS = "SUBSTRACT_COINS";

export const addCoins = (amount) => {
	return {
		type: ADD_COINS,
		amount: amount,
	};
};

export const substractCoins = (amount) => {
	return {
		type: SUBSTRACT_COINS,
		amount: amount,
	};
};


