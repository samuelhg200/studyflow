export const UPDATE_STUDY_FLOW_CONFIG = "UPDATE_STUDY_FLOW_CONFIG";
export const TOGGLE_STUDY_FLOW = "TOGGLE_STUDY_FLOW"

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