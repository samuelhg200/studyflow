import { ADD_SUBJECT, REMOVE_SUBJECT, ADD_TOPIC, REMOVE_TOPIC } from "../actions/subject";

import { SUBJECTS } from "../../data/dummy-data";
import Subject from "../../models/subject";
import { labelColors } from "../../data/label-colors";

const initialState = {
	subjects: SUBJECTS,
	topics: []
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
				Math.floor(Math.random() * 10000).toString(),
				action.subjectTitle,
				choosenColor,
				[]
			);
			return {
				...state,
				subjects: state.subjects.concat(subjectToAdd),
			};
		case REMOVE_SUBJECT:
			const updatedSubjects = state.subjects.filter(subject => subject.id !== action.subjectId)
			const updatedTopics = state.topics.filter(topic => topic.subjectId !== action.subjectId)
			return {
				...state,
				subjects: updatedSubjects,
				topics: updatedTopics
			}
		case ADD_TOPIC:
			const newTopicToAdd = {
				id: Math.floor(Math.random() * 10000).toString(),
				subjectId: action.subjectId,
				title: action.topicTitle,
			}
			
			return {
				...state,
				topics: state.topics.concat(newTopicToAdd),
			};
		case REMOVE_TOPIC:
			const newTopics = state.topics.filter(topic => topic.id !== action.topicId)
			return {
				...state,
				topics: newTopics
			}
			
		default:
			return state;
	}
};
