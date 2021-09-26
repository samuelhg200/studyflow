import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import LabelsList from '../../components/LabelsList'
import { useSelector } from 'react-redux'

const TopicsModal = props => {
    const subject = useSelector(state => state.subject.subjects.filter((subject) => subject.id === props.route.params.subjectId))
    console.log(subject)


    return (
        <View style={{flex: 1}}>
            {/* <LabelsList data={topics} /> */}
        </View>
    )
}

export default TopicsModal

const styles = StyleSheet.create({})
