export default class Subject {
	constructor(id, title, color, topics) {
		this.id = id;
		this.title = title;
		this.color = color;
		this.topics = topics;
	}

	addTopic(topic) {
		if (!this.topics) {
			this.topics = [];
		}
		this.topics = topics.push(topic);
	}
}
