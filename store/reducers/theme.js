import { TOGGLE_THEME } from "../actions/theme";

const initialState = {
	theme: "light",
};

export default (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_THEME:
			const nextTheme = state.theme === "light" ? "dark" : "light";
			return {
				...state,
				theme: nextTheme,
			};
		default:
			return state;
	}
};
