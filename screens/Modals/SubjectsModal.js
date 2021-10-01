import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Layout } from "@ui-kitten/components";
import LabelsList from "../../components/LabelsList";
import { useSelector, useDispatch } from "react-redux";

const SubjectsModal = (props) => {
	const subjects = useSelector((state) => state.subject.subjects);

	const onAddTopic = (subjectId, subjectTitle, subjectColor) => {
		props.navigation.navigate("Topics", {
			subjectId: subjectId,
			subjectTitle: subjectTitle,
            subjectColor: subjectColor,
		});
	};
	return (
		<View style={{ flex: 1 }}>
			<LabelsList data={subjects} onAddTopic={onAddTopic} />
		</View>
	);
};

export default SubjectsModal;

const styles = StyleSheet.create({});
