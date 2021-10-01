export const ADD_SUBJECT = "ADD_SUBJECT";
export const REMOVE_SUBJECT = "REMOVE_SUBJECT";
export const ADD_TOPIC = "ADD_TOPIC";
export const REMOVE_TOPIC = "REMOVE_TOPIC";

export const addSubject = (subjectTitle) => {
	return { type: ADD_SUBJECT, subjectTitle: subjectTitle };
};

export const removeSubject = (subjectId) => {
    return {type: REMOVE_SUBJECT, subjectId: subjectId}
}

export const addTopic = (subjectId, topicTitle) => {
	return { type: ADD_TOPIC, subjectId: subjectId, topicTitle: topicTitle };
};

export const removeTopic = ( topicId) => {
	
	return {type: REMOVE_TOPIC, topicId: topicId}
};


