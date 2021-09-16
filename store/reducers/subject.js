import { ADD_SUBJECT } from "../actions/subject";

import { SUBJECTS } from "../../data/dummy-data";

const initialState = {
	subjects: SUBJECTS
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_SUBJECT:
			return {
				...state,
				subjects: state.subjects.concat(action.subject),
			};
		default:
			return state;
	}
};