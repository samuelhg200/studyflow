export const ADD_SUBJECT = 'ADD_SUBJECT'
export const ADD_TOPIC = 'ADD_TOPIC'

export const addSubject = (subjectTitle) => {
    return {type: ADD_SUBJECT, subjectTitle: subjectTitle}
}

export const addTopic = (subjectId, topicTitle) => {
    return {type: ADD_TOPIC, subjectId: subjectId, topicTitle: topicTitle}
}