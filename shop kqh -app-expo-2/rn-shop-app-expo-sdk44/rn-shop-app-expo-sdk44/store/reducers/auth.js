import { AUTHENTICATE, LOGOUT, SET_DID_TRY_AL } from "../actions/auth";

const ADMIN_EMAIL = "trieubaokhanh2005@gmail.com";

const initialState = {
    token: null,
    userId: null,
    email: null,
    isAdmin: false,
    didTryAutoLogin: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGOUT:
            return { ...initialState, didTryAutoLogin: true };
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId,
                email: action.email || null,
                isAdmin: action.email === ADMIN_EMAIL,
                didTryAutoLogin: true,
            };
        case SET_DID_TRY_AL:
            return {
                ...state,
                didTryAutoLogin: true,
            };
        default:
            return state;
    }
};
