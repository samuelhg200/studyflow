//activity log == miniSessions in activity instance

export default class EventHistory {
	constructor(id, eventId, startTime, endTime, activityLog, studyLog) {
		this.id = id;
		this.eventId = eventId;
		this.startTime = startTime;
        this.endTime = endTime;
		this.activityLog = activityLog;
		this.studyLog = studyLog;
	}
}
