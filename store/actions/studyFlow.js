export const UPDATE_STUDY_FLOW_CONFIG = "UPDATE_STUDY_FLOW_CONFIG";
export const TOGGLE_STUDY_FLOW = "TOGGLE_STUDY_FLOW"
export const UPDATE_EVENT_CONFIG = "UPDATE_EVENT_CONFIG"

export const updateStudyFlowConfig = (studyTime, breakTime) => {
    return {
        type: UPDATE_STUDY_FLOW_CONFIG,
        config: {
            studyTime: studyTime,
            breakTime: breakTime
        }
    }
}

export const toggleStudyFlow = () => {
    return {
        type: TOGGLE_STUDY_FLOW,

    }
}

export const updateEventConfig = (newEventConfig) => {
    return {
        type: UPDATE_EVENT_CONFIG,
        eventConfig: newEventConfig
    }
}