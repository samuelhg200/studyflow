import { BUY_PRODUCT } from "../actions/product";

const initialState = {
    owned: [],
    studyTimerSkin: 3,
    breakTimerSkin: 4
}

export default (state = initialState, action) => {
    switch (action.type) {
    case BUY_PRODUCT: 
        return {
            ...state,
            owned: state.owned.concat(action.id)
        }
    default: 
        return state;
    }
}