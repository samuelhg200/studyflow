import Event from "../../models/event";
import { ADD_EVENT, DELETE_EVENT } from "../actions/events";

const initialState = {
	events: [],
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_EVENT:
			const eventData = action.eventData
			const eventToAdd = new Event(new Date(), eventData.title, eventData.duration, eventData.date, eventData.subjects, eventData.eventType)
			return {
				...state,
				events: state.events.concat(eventToAdd),
			};
		case DELETE_EVENT:
			let updatedEvents = state.events.filter((event) => {
				return event.id !== action.eventId;
			})
			return {
				...state,
				events: updatedEvents
			}
		default:
			return state;
	}
};
