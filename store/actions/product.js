export const BUY_PRODUCT = "BUY_PRODUCT";
export const SET_STUDY_TIMER = "SET_STUDY_TIMER";
export const SET_BREAK_TIMER = "SET_BREAK_TIMER";
export const SET_THEME = "SET_THEME"
export const BUY_COLOR_THEME = "BUY_COLOR_THEME"
export const SET_COLOR_THEME = "SET_COLOR_THEME"

export const buyProduct = (id) => {
	return {
		type: BUY_PRODUCT,
		id: id,
	};
};

export const setStudyTimer = (id) => {
	return {
		type: SET_STUDY_TIMER,
		id: id,
	};
};

export const setBreakTimer = (id) => {
	return {
		type: SET_BREAK_TIMER,
		id: id,
	};
};

export const setTheme = (bool) => {
	return {
		type: SET_THEME,
		bool: bool
	}
}

export const setColorTheme = (index) => {
	return {
		type: SET_COLOR_THEME,
		index: index
	}
}

export const buyColorTheme = (index) => {
	return {
		type: BUY_COLOR_THEME,
		index: index
	}
}
