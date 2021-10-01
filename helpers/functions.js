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
	let studyCount= 1;
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
					eventType: 'study'
					
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
					eventType: 'study'
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
				eventType: 'break'
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
			eventType: 'study'
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
				eventType: 'break'
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
		eventType: 'feedback'
		
	});
	return data;
};
