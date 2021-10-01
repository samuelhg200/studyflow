import Event from "../../models/event";
import {
	ADD_EVENT,
	DELETE_EVENT,
	UPDATE_DAY_TO_TRAVEL_TO,
	UPDATE_DATE_TO_TRAVEL_TO,
	UPDATE_ACTIVITY,
} from "../actions/events";

const initialState = {
	events: [],
	dayToTravelTo: new Date().getDate(),
	dateToTravelTo: new Date().setDate(1)
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_EVENT:
			const eventData = action.eventData;
			const eventToAdd = new Event(
				new Date(),
				eventData.title,
				eventData.duration,
				eventData.date,
				eventData.subjects,
				eventData.eventType
			);
			return {
				...state,
				events: state.events.concat(eventToAdd).sort((e1, e2) => {
					if (Date.parse(e1.date) < Date.parse(e2.date)) {
						return -1;
					}
					if (Date.parse(e1.date) > Date.parse(e2.date)) {
						return 1;
					}
					return 0;
				}),
			};
		case DELETE_EVENT:
			let updatedEvents = state.events.filter((event) => {
				return event.id !== action.eventId;
			});
			return {
				...state,
				events: updatedEvents,
			};
		case UPDATE_DAY_TO_TRAVEL_TO:
			return {
				...state,
				dayToTravelTo: action.day,
			};
		case UPDATE_DATE_TO_TRAVEL_TO:
			return {
				...state,
				dateToTravelTo: action.date
			}
		case UPDATE_ACTIVITY: 
			const eventsCopy = state.events.splice()
			eventsCopy.forEach((event) => {
				if(event.id === action.eventId){
					event.activity = action.activity
				}
			}
			)
			return {
				...state,
				events: eventsCopy
			}
			
		default:
			return state;
	}
};
