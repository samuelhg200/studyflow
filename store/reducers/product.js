import {
	BUY_PRODUCT,
	SET_BREAK_TIMER,
	SET_STUDY_TIMER,
	SET_THEME,
	SET_COLOR_THEME,
	BUY_COLOR_THEME,
} from "../actions/product";

const initialState = {
	owned: [3, 4],
	ownedColorThemes: [0],
	studyTimerSkin: 3,
	breakTimerSkin: 4,
	colorTheme: 0,
	theme: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case BUY_PRODUCT:
			return {
				...state,
				owned: state.owned.concat(action.id),
			};
		case BUY_COLOR_THEME:
			return {
				...state,
				ownedColorThemes: state.ownedColorThemes.concat(action.index),
			};
		case SET_STUDY_TIMER:
			return {
				...state,
				studyTimerSkin: action.id,
			};
		case SET_BREAK_TIMER:
			return {
				...state,
				breakTimerSkin: action.id,
			};
		case SET_THEME:
			return {
				...state,
				theme: action.bool,
			};
		case SET_COLOR_THEME:
			return {
				...state,
				colorTheme: action.index,
			};
		default:
			return state;
	}
};
