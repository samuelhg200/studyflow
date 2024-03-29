export default class Activity {
	constructor(eventId, startTime, secondStamp, miniSessions, studyLog) {
		this.eventId = eventId;
		this.secondStamp = secondStamp;
        this.startTime = startTime;
        
		/* 
        [
            {
                id: 1,
                type: 'study',
                duration: 30
            },
            {
                id: 2,
                type: 'break',
                duration: 10
            },
            {
                id: 3,
                type: 'study',
                duration: 33
            },
            ...
        ]
        */
		this.miniSessions = miniSessions;
        /* 
            [
                {
                    subjectId: 1,
                    startTime: new Date(),
                },
                ...
            ]
        */
        this.studyLog = studyLog;

	}
}
