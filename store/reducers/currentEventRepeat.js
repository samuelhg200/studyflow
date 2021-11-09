import { SET_EVENT_REPEAT } from "../actions/currentEventRepeat";

const initialState = {
	repeatConfig: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case SET_EVENT_REPEAT:

			return {
				...state,
				repeatConfig: action.repeatConfig,
			};

		default:
			return state;
	}
};
