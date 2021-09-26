import { ADD_SUBJECT, ADD_TOPIC } from "../actions/subject";

import { SUBJECTS } from "../../data/dummy-data";
import Subject from "../../models/subject";
import { labelColors } from "../../data/label-colors";

const initialState = {
	subjects: SUBJECTS,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_SUBJECT:
			let choosenColor = null;
			for (let i = 0; i < labelColors.length; i++) {
				let used = false;
				for (let j = 0; j < state.subjects.length; j++) {
					if (state.subjects[j].color === labelColors[i]) {
						used = true;
						break;
					}
				}
				if (!used) {
					choosenColor = labelColors[i];
					break;
				}
			}
			if (!choosenColor) {
				choosenColor = labelColors[Math.floor(Math.random() * 16)];
			}
			const subjectToAdd = new Subject(
				Math.floor(Math.random() * 1000).toString(),
				action.subjectTitle,
				choosenColor,
				[]
			);
			return {
				...state,
				subjects: state.subjects.concat(subjectToAdd),
			};
		case ADD_TOPIC:
			const newSubjects = state.subjects.concat()
			newSubjects.forEach(subject => {
				if (action.subjectId === subject.id){
					subject.topics.push(action.topicTitle)
				}
			})
			return {
				...state,
				subjects: newSubjects,
			};
		default:
			return state;
	}
};
