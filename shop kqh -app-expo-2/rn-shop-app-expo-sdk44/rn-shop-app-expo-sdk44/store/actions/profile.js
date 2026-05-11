import config from "../../config";
import { auth } from "./auth";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";

export const SET_PROFILE = "SET_PROFILE";

export const fetchProfile = () => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try {
            const response = await fetch(
                `${config.DATABASE_URL}/profiles/${userId}.json?auth=${token}`
            );
            if (!response.ok) {
                throw new Error("Lỗi khi tải thông tin hồ sơ!");
            }
            const resData = await response.json();
            if (resData) {
                dispatch({
                    type: SET_PROFILE,
                    profileData: resData,
                });
            }
        } catch (error) {
            throw error;
        }
    };
};

export const updateProfile = (fullName, dob, phone, gender) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const token = getState().auth.token;
        try {
            const profileData = { fullName, dob, phone, gender };
            const response = await fetch(
                `${config.DATABASE_URL}/profiles/${userId}.json?auth=${token}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(profileData),
                }
            );
            if (!response.ok) {
                throw new Error("Lỗi khi lưu thông tin hồ sơ!");
            }
            dispatch({
                type: SET_PROFILE,
                profileData: profileData,
            });
        } catch (error) {
            throw error;
        }
    };
};

export const updateUserPassword = (oldPassword, newPassword) => {
    return async (dispatch) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error("Không tìm thấy người dùng đăng nhập!");
        }

        try {
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
        } catch (error) {
            console.log(error);
            if (error.code === 'auth/invalid-credential') {
                throw new Error("Mật khẩu cũ không chính xác!");
            } else {
                throw new Error("Có lỗi xảy ra khi đổi mật khẩu.");
            }
        }
    };
};
