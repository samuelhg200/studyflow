export default class Question {
	//status = "0 -> no idea, 1 -> On track, but I need to improve , 2 -> I know this stuff really well!"
	constructor(id, text, subjectId, topicId, status = 0) {
		this.id = id;
		this.text = text;
		this.subjectId = subjectId;
		this.topicId = topicId;
		this.status = status;
	}

	decreaseStatus() {
		if (this.status > 0) {
			this.status -= 1;
		}
	}

    increaseStatus() {
        if (this.status < 2) {
            this.status += 1
        }
    }

}
