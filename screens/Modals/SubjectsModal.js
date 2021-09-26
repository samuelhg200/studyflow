import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Layout } from '@ui-kitten/components'
import * as subjectActions from '../../store/actions/subject'
import LabelsList from '../../components/LabelsList'
import { useSelector } from 'react-redux'


const SubjectsModal = props => {
    const subjects = useSelector(state => state.subject.subjects)

    const onAddTopic = (subjectId) => {
		props.navigation.navigate('Topics', {
			subjectId: subjectId,
		})
	}
    return (
        <View style={{flex: 1}}>
            <LabelsList data={subjects} onAddTopic={onAddTopic} />
        </View>
    )
}

export default SubjectsModal

const styles = StyleSheet.create({})
