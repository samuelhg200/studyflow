export const ADD_EVENT_HISTORY = "ADD_EVENT_HISTORY";

export const addEventHistory = (eventId, startTime, endTime, activityLog, studyLog) => {
    return {
        type: ADD_EVENT_HISTORY,
        eventHistoryData: {
            eventId: eventId,
            startTime: startTime,
            endTime: endTime,
            activityLog: activityLog,
            studyLog: studyLog
        }
    }
}