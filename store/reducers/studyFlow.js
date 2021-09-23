import { UPDATE_STUDY_FLOW_CONFIG } from "../actions/studyFlow";

const initialState = {
	config: {
		studyTime: 30,
		breakTime: 10,
	},
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
		default:
			return state;
	}
};
