export const ADD_QUESTION = "ADD_QUESTION";
export const REMOVE_QUESTION = "REMOVE_QUESTION";
export const SET_STATUS = "SET_STATUS";
export const SET_QUANTITY = "SET_QUANTITY";
export const SET_HARSHNESS = "SET_HARSHNESS"

export const addQuestion = (text, subjectId, topicId) => {
	return {
		type: ADD_QUESTION,
		text: text,
		subjectId: subjectId,
		topicId: topicId,
	};
};

export const removeQuestion = (id) => {
	return {
		type: REMOVE_QUESTION,
		id: id,
	};
};

export const setStatus = (id, status) => {
	return {
		type: SET_STATUS,
		id: id,
		status: status,
	};
};

export const setQuantity = (quantity) => {
	return {
		type: SET_QUANTITY,
		quantity: quantity
	}
}

export const setHarshness = (harshness) => {
	console.log('heyo')
	console.log(harshness)
	return {
		type: SET_HARSHNESS,
		harshness: harshness
	}
}
