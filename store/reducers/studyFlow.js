import { UPDATE_STUDY_FLOW_CONFIG, TOGGLE_STUDY_FLOW } from "../actions/studyFlow";


const initialState = {
	config: {
		studyTime: 30,
		breakTime: 10,
	},
	active: true
};

export default (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_STUDY_FLOW_CONFIG:
			return {
				...state,
				config: {
					studyTime: action.studyTime,
					breakTime: action.breakTime,
				},
			};
		case TOGGLE_STUDY_FLOW:
			return {
				...state,
				active: !state.active
			}
		default:
			return state;
	}
};
