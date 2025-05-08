import { FETCH_ACCOUNTS, ADD_ACCOUNT, UPDATE_ACCOUNT, DELETE_ACCOUNT } from "../actions/accountActions";

const initialState = {
    items: []
};

export const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ACCOUNTS:
            return { ...state, items: action.payload };
            
        case ADD_ACCOUNT:
            return { ...state, items: [...state.items, action.payload] };

        case UPDATE_ACCOUNT:
            return {
                ...state,
                items: state.items.map((acc) =>
                acc.id === action.payload.id ? action.payload : acc)
            };

        case DELETE_ACCOUNT:
            return {
                ...state,
                items: state.items.filter((acc) => acc.id !== action.payload)
            };

        default:
            return state;
    }
};