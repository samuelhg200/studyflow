export default class Event {
	constructor(id, title, duration, date, subjects, type, activity = null, seriesId = null) {
		this.id = id;
		this.title = title;
		this.duration = duration;
		this.date = date;
		this.subjects = subjects;
		this.type = type;
		this.activity = activity;
		this.seriesId = seriesId;
	}
}
