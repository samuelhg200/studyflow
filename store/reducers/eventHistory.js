import EventHistory from "../../models/eventHistory";

import { ADD_EVENT_HISTORY } from "../actions/eventHistory";

const initialState = {
    eventLogs: []
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_EVENT_HISTORY: 
            const eventHistoryData = action.eventHistoryData;
            const eventHistoryToAdd = new EventHistory(
                Math.floor(Math.random() * 1000),
                eventHistoryData.eventId,
                eventHistoryData.startTime,
                eventHistoryData.endTime,
                eventHistoryData.activityLog,
                eventHistoryData.studyLog,
            )
            return {
                ...state,
                eventLogs: state.eventLogs.concat(eventHistoryToAdd)
            }

        default: 
            return state
    }
}