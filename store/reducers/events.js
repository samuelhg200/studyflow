import Event from "../../models/event";
import {
	ADD_EVENT,
	DELETE_EVENT,
	UPDATE_DAY_TO_TRAVEL_TO,
	UPDATE_DATE_TO_TRAVEL_TO,
	UPDATE_ACTIVITY,
	DELETE_EVENT_SERIES,
} from "../actions/events";

import { generateRepeatDates } from "../../helpers/functions";

const initialState = {
	events: [],
	activities: [],
	dayToTravelTo: new Date().getDate(),
	dateToTravelTo: new Date().setDate(1),
};

export default (state = initialState, action) => {
	switch (action.type) {
		case ADD_EVENT:
			if (action.repeatConfig.length === 0) {
				const eventData = action.eventData;
				const eventToAdd = new Event(
					Math.floor(Math.random() * 2000),
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
			} else {
				//generate all dates
				//create an event for all potential dates

				const dates = generateRepeatDates(
					action.repeatConfig,
					action.eventData.date
				);
				// series id used to reference events created for this repeat configuration
				const seriesId = Math.floor(Math.random() * 2000);
				const eventsToAdd = dates.map((date) => {
					return new Event(
						Math.floor(Math.random() * 2000),
						action.eventData.title,
						action.eventData.duration,
						new Date(date),
						action.eventData.subjects,
						action.eventData.eventType,
						null,
						seriesId
					);
				});

				return {
					...state,
					events: state.events.concat(eventsToAdd).sort((e1, e2) => {
						if (Date.parse(e1.date) < Date.parse(e2.date)) {
							return -1;
						}
						if (Date.parse(e1.date) > Date.parse(e2.date)) {
							return 1;
						}
						return 0;
					}),
				};
			}
		case DELETE_EVENT:
			let updatedEvents = state.events.filter((event) => {
				return event.id !== action.eventId;
			});
			return {
				...state,
				events: updatedEvents,
			};
		case DELETE_EVENT_SERIES:
			let updatedEvents2 = state.events.filter((event) => {
				return event.seriesId !== action.seriesId;
			});
			return {
				...state,
				events: updatedEvents2,
			};
		case UPDATE_DAY_TO_TRAVEL_TO:
			return {
				...state,
				dayToTravelTo: action.day,
			};
		case UPDATE_DATE_TO_TRAVEL_TO:
			return {
				...state,
				dateToTravelTo: action.date,
			};
		case UPDATE_ACTIVITY:
			const activitiesCopy = state.activities.filter(
				(activity) => activity.eventId !== action.activity.eventId
			);
			activitiesCopy.push(action.activity);
			return {
				...state,
				activities: activitiesCopy,
			};

		default:
			return state;
	}
};
