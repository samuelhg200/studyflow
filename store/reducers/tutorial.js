import { COMPLETE_TUTORIAL } from "../actions/tutorial";

const initialState = {
	didTutorial: false,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case COMPLETE_TUTORIAL:
			return {
				...state,
				didTutorial: true,
			};
		default:
			return state;
	}
};
