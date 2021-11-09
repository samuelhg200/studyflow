export const ADD_EVENT = "ADD_EVENT";
export const DELETE_EVENT = "DELETE_EVENT";
export const DELETE_EVENT_SERIES = "DELETE_EVENT_SERIES"
export const UPDATE_DAY_TO_TRAVEL_TO = "UPDATE_DAY_TO_TRAVEL_TO";
export const UPDATE_DATE_TO_TRAVEL_TO = "UPDATE_MONTH_TO_TRAVEL_TO";
export const UPDATE_ACTIVITY = "UPDATE_ACTIVITY"

export const addEvent = (
	title,
	duration,
	date,
	subjects,
	eventType,
	studyFlowMode,
	repeatConfig
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
		repeatConfig: repeatConfig
	};
};

export const deleteEvent = (eventId) => {
	return { type: DELETE_EVENT, eventId: eventId };
};

export const deleteEventSeries = (seriesId) => {
	return {type: DELETE_EVENT_SERIES, seriesId: seriesId}
}

export const updateDayToTravelTo = (day) => {
	return { type: UPDATE_DAY_TO_TRAVEL_TO, day: day };
};

export const updateDateToTravelTo = (date) => {
	return { type: UPDATE_DATE_TO_TRAVEL_TO, date: date };
};

export const updateActivity = (activity) => {
	return {type: UPDATE_ACTIVITY, activity: activity}
}
