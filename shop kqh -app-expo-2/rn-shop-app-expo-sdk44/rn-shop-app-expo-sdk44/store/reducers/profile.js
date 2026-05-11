import { SET_PROFILE } from "../actions/profile";

const initialState = {
    fullName: "",
    dob: "",
    phone: "",
    gender: "",
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            return {
                fullName: action.profileData.fullName || "",
                dob: action.profileData.dob || "",
                phone: action.profileData.phone || "",
                gender: action.profileData.gender || "",
            };
        default:
            return state;
    }
};
