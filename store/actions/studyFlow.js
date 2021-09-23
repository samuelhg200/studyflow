export const UPDATE_STUDY_FLOW_CONFIG = "UPDATE_STUDY_FLOW_CONFIG";

export const updateStudyFlowConfig = (studyTime, breakTime) => {
    return {
        type: UPDATE_STUDY_FLOW_CONFIG,
        config: {
            studyTime: studyTime,
            breakTime: breakTime
        }
    }
}