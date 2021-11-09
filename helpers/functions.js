import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import React from "react";
import { View } from "react-native";

export function combineDateWithTime(d, t) {
	return new Date(
		d.getFullYear(),
		d.getMonth(),
		d.getDate(),
		t.getHours(),
		t.getMinutes(),
		t.getSeconds(),
		t.getMilliseconds()
	);
}

export function getIconStringBasedOnEventType(eventType) {
	switch (eventType) {
		case "studySession":
			return "glasses-outline";
		case "assessment":
			return "school-outline";
		case "homework":
			return "reader-outline";
		case "other":
			return "ellipsis-horizontal-outline";
		case "lecture":
			return "book-outline";
		default:
			return;
	}
}

export function getFormattedEventType(eventType) {
	switch (eventType) {
		case "studySession":
			return "Study Session";
		case "study":
			return "Study Session";
		case "assessment":
			return "Assessment";
		case "homework":
			return "Homework";
		case "other":
			return "Other";
		case "Lecture":
			return "book-outline";
		default:
			return;
	}
}

export function getFormattedActivityType(activityType) {
	switch (activityType) {
		case "feedback":
			return "Feedback";
		case "study":
			return "Study Session";
		case "break":
			return "Break";
		default:
			return;
	}
}

export function getStudyFlow(event, studyTime, breakTime) {
	//get time in minutes of each pomodoro session
	const pomodoroSession = studyTime + breakTime;

	// get total time in minutes of event
	let hours = event.duration.getHours() * 60;
	let minutes = event.duration.getMinutes();
	let totalMinutes = hours + minutes;

	const reminder = totalMinutes % pomodoroSession;
	const completePomodoros = Math.floor(totalMinutes / pomodoroSession);

	// At least two pomodoro session if not deny pomodoro for current study session
	if (completePomodoros < 2) {
		return {
			pomodoros: null,
			compromise: { studyTime: totalMinutes, breakTime: 0 },
		};
	}

	//if the pomodoro session does not fit perfectly in produce compomise
	if (reminder !== 0) {
		let compromiseBreakTime;
		let compromiseStudyTime;
		if (reminder < 10) {
			compromiseBreakTime = reminder;
			compromiseStudyTime = 0;
		} else if (reminder < studyTime) {
			compromiseBreakTime = 0;
			compromiseStudyTime = reminder;
		} else {
			compromiseBreakTime = studyTime % reminder;
			compromiseStudyTime = reminder - (studyTime % reminder);
		}
		return {
			pomodoros: completePomodoros,
			compromise: {
				studyTime: compromiseStudyTime,
				breakTime: compromiseBreakTime,
			},
		};
	} else {
		//signoff number of pomodoro sessions only
		return { pomodoros: completePomodoros, compromise: null };
	}
}

export const generateTimeline = (
	pomodoroConfig,
	studyTime,
	breakTime,
	startDate
) => {
	const data = [];
	//const totalPomodoro = studyTime + breakTime;
	const { pomodoros, compromise } = pomodoroConfig;
	let timeAdded = 0;
	let studyCount = 1;
	// console.log("Study Time: " + studyTime);
	// console.log("Break Time: " + breakTime);
	if (pomodoros) {
		for (let i = 0; i < pomodoros; i++) {
			let currentPomodoroStudy;

			if (i === 0) {
				currentPomodoroStudy = {
					time: moment(startDate).format("HH:mm"),
					title: `#${studyCount} Study`,
					description: "Improve your knowledge!",
					icon: (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons name={"glasses-outline"} color="white" size={15} />
						</View>
					),
					iconName: "glasses-outline",
					duration: studyTime,
					eventType: "study",
				};
			} else {
				currentPomodoroStudy = {
					time: moment(startDate).add(timeAdded, "minutes").format("HH:mm"),
					title: `#${studyCount} Study`,
					description: "Improve your knowledge!",
					icon: (
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Ionicons name={"glasses-outline"} color="white" size={15} />
						</View>
					),
					iconName: "glasses-outline",
					duration: studyTime,
					eventType: "study",
				};
			}

			timeAdded += studyTime;
			studyCount++;
			let currentPomodoroBreak = {
				time: moment(startDate).add(timeAdded, "minutes").format("HH:mm"),
				title: "Break",
				description: "Go watch some Netflix!",
				icon: (
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<Ionicons name={"cafe-outline"} color="white" size={15} />
					</View>
				),
				iconName: "cafe-outline",
				duration: breakTime,
				eventType: "break",
			};
			timeAdded += breakTime;
			data.push(currentPomodoroStudy);
			data.push(currentPomodoroBreak);
		}
	}

	if (compromise) {
		let currentCompromiseStudy = {
			time: moment(startDate).add(timeAdded, "minutes").format("HH:mm"),
			title: `#${studyCount} Study`,
			description: "Improve your knowledge!",
			icon: (
				<View
					style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
				>
					<Ionicons name={"glasses-outline"} color="white" size={15} />
				</View>
			),
			iconName: "glasses-outline",
			duration: studyTime,
			eventType: "study",
		};
		timeAdded += compromise.studyTime;
		studyCount++;
		let currentCompromiseBreak;
		if (compromise.breakTime) {
			currentCompromiseBreak = {
				time: moment(startDate).add(timeAdded, "minutes").format("HH:mm"),
				title: "Break",
				description: "Go watch some Netflix!",
				icon: (
					<View
						style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
					>
						<Ionicons name={"cafe-outline"} color="white" size={15} />
					</View>
				),
				iconName: "cafe-outline",
				duration: breakTime,
				eventType: "break",
			};
		}
		timeAdded += compromise.breakTime;
		data.push(currentCompromiseStudy);
		if (currentCompromiseBreak) {
			data.push(currentCompromiseBreak);
		}
	}
	data.push({
		time: moment(startDate).add(timeAdded, "minutes").format("HH:mm"),
		title: "Session End",
		description: "Good job! Let us get some feedback quickly!",
		icon: (
			<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
				<Ionicons name={"stats-chart-outline"} color="white" size={15} />
			</View>
		),
		iconName: "stats-chart-outline",
		eventType: "feedback",
	});
	return data;
};

export function convertActivityToTimeline(activity) {
	let studyCount = 0;
	let timeAdded = 0;
	const convertedTimeline = activity.miniSessions.map((ms) => {
		switch (ms.type) {
			case "study":
				studyCount++;
				const tempTimeAdded = timeAdded;
				timeAdded += ms.duration;
				return {
					id: ms.id,
					time: moment(activity.startTime)
						.add(tempTimeAdded, "minutes")
						.format("HH:mm"),
					title: `#${studyCount} Study`,
					description: "Improve your knowledge",
					iconName: "glasses-outline",
					duration: ms.duration,
					eventType: ms.type,
				};

			case "break":
				const tempTimeAdded2 = timeAdded;
				timeAdded += ms.duration;
				return {
					id: ms.id,
					time: moment(activity.startTime)
						.add(tempTimeAdded2, "minutes")
						.format("HH:mm"),
					title: `Break`,
					description: "Go watch some Netflix!",
					iconName: "cafe-outline",
					duration: ms.duration,
					eventType: ms.type,
				};
			case "feedback":
				return {
					id: ms.id,
					time: moment(activity.startTime)
						.add(timeAdded, "minutes")
						.format("HH:mm"),
					title: "Session End",
					description: "Good job! Let us get some feedback quickly!",
					iconName: "stats-chart-outline",
					eventType: "feedback",
				};
			default:
				return {};
		}
	});
	// convertedTimeline.push({
	// 	id: 1234,
	// 	time: moment(activity.startTime).add(timeAdded, "minutes").format("HH:mm"),
	// 	title: "Session End",
	// 	description: "Good job! Let us get some feedback quickly!",
	// 	iconName: "stats-chart-outline",
	// 	eventType: "feedback",
	// });
	return convertedTimeline;
}

//This function can calculate the time studied for each subject
//reconsider calculating the break by adding duration of all break sessions
export function getSubjectStudyTime(studyLog, endTime) {
	//console.log(studyLog)
	const studyStats = {};
	//console.log(studyLog)
	// iterate until penultimate
	for (let i = 0; i < studyLog.length; i++) {
		//console.log('hey')
		if (!studyStats[studyLog[i]["subjectId"]]) {
			studyStats[studyLog[i]["subjectId"]] = 0;
		}
		const start = studyLog[i]["startTime"];
		//if last item end is end of event
		const end =
			i + 1 === studyLog.length ? endTime : studyLog[i + 1]["startTime"];
		const durationInSeconds = (new Date(end) - new Date(start)) / 1000;
		//const durationInMinutes = Math.ceil(durationInSeconds / 60);
		studyStats[studyLog[i]["subjectId"]] += durationInSeconds;
	}
	// We then convert to minutes, this is not done initially because it would cause repeated
	// subjects in the studylog to report a higher number than needed as rounding up to 1 minute then adding
	// would be detrimental four entries of 1 second would be represented as 4 minutes!
	Object.keys(studyStats).map(function (key, index) {
		studyStats[key] = Math.ceil(studyStats[key] / 60);
	});

	return studyStats;
}

export function convertStudyStatsToChartData(studyStats, subjects) {
	const labels = [];
	const datasets = [{ data: [] }];

	Object.keys(studyStats).map(function (key, index) {
		if (key === "null") {
			labels.push("Break");
			datasets[0].data.push(studyStats[key]);
		} else {
			const currentSubject = subjects.find((subject) => subject.id === key);
			labels.push(currentSubject.title);
			datasets[0].data.push(studyStats[key]);
		}
	});

	return {
		labels: labels,
		datasets: datasets,
	};
}

//when creating an event with a repeat this function takes charge of creating
//all dates withing that repeat config during 1 year
export function generateRepeatDates(repeatConfig, startDate) {
	let start = moment(startDate);
	let end = moment(startDate).add(3, "M");

	//we always want to add the event for the start date
	const dates = [startDate];
	const current = start.add(1, "d").clone();

	while (current < end) {
		if (repeatConfig.includes(current.format("dddd"))) {
			dates.push(current.clone());
		}
		current.add(1, "d");
	}
	return dates;
}
