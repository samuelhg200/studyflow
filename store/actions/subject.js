export const ADD_SUBJECT = 'ADD_SUBJECT'

export const addSubject = (subjectToAdd) => {
    return {type: ADD_SUBJECT, subject: subjectToAdd}
}