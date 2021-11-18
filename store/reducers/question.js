import Question from "../../models/question";
import { ADD_QUESTION, REMOVE_QUESTION, SET_HARSHNESS, SET_QUANTITY, SET_STATUS } from "../actions/question";

const initialState = {
	questions: [],
	quantity: 3,
	harshness: 2,
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_QUESTION:
			const newQuestion = new Question(
				Math.floor(Math.random() * 1000),
				action.text,
				action.subjectId,
				action.topicId
			);
			return {
				...state,
				questions: state.questions.concat(newQuestion),
			};
		case REMOVE_QUESTION:
			return {
				...state,
				questions: state.questions.filter(
					(question) => question.id !== action.id
				),
			};
		case SET_STATUS:
			const questionModified = state.questions.find(
				(question) => question.id === action.id
			);
			questionModified.status = action.status;
			const newQuestions = state.questions.filter(
				(question) => question.id !== action.id
			);
			return {
				...state,
				questions: newQuestions.concat(questionModified),
			};
		case SET_QUANTITY:
			return {
				...state,
				quantity: action.quantity
			}
		case SET_HARSHNESS: 
			return {
				...state,
				harshness: action.harshness
			}
		default:
			return state;
	}
};
