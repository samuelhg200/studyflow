import { SUBSTRACT_COINS, ADD_COINS } from "../actions/wallet";

const initialState = {
	amount: 15000,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_COINS:
			return {
				...state,
				amount: state.amount + action.amount,
			};
		case SUBSTRACT_COINS:
			console.log('executed')
			return {
				...state,
				amount: state.amount - action.amount,
			};
		default:
			return state;
	}
};
