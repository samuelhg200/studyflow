export const SET_EVENT_REPEAT = "SET_EVENT_REPEAT";

export const setEventRepeat = (repeatConfig) => {
    return {
        type: SET_EVENT_REPEAT,
        repeatConfig: repeatConfig
    }
}