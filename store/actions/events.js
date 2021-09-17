export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";

export const addEvent = (
	title,
	duration,
	date,
	subjects,
	eventType,
	studyFlowMode
) => {
	date;
	return {
		type: ADD_EVENT,
		eventData: {
			title: title,
			duration: duration,
			date: date,
			subjects: subjects,
			eventType: eventType,
			studyFlowMode: studyFlowMode,
		},
	};
};

export const deleteEvent = (eventId) => {
	return { type: DELETE_EVENT, eventId: eventId };
};
