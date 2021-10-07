import {
	UPDATE_STUDY_FLOW_CONFIG,
	TOGGLE_STUDY_FLOW,
	UPDATE_EVENT_CONFIG,
} from "../actions/studyFlow";

const initialState = {
	config: {
		studyTime: 2,
		breakTime: 2,
	},
	eventConfig: {
		studySession: true,
		homework: true,
		lecture: false,
		assessment: false,
		other: false,
	},
	active: true,
};

export default (state = initialState, action) => {
	switch (action.type) {
		
		case UPDATE_STUDY_FLOW_CONFIG:
			//console.log(action.config)
			return {
				...state,
				config: action.config,
			};
		case TOGGLE_STUDY_FLOW:
			return {
				...state,
				active: !state.active,
			};
		case UPDATE_EVENT_CONFIG:
			return {
				...state,
				eventConfig: action.eventConfig,
			};
		default:
			return state;
	}
};
