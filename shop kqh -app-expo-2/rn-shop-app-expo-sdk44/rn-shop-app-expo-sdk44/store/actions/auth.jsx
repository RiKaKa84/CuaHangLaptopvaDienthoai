import app from "../../firebase";
import {
    initializeAuth,
    getAuth,
    getReactNativePersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Khởi tạo Firebase Auth với persistence
let authInstance;
try {
    authInstance = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
} catch (error) {
    authInstance = getAuth(app);
}

export const auth = authInstance;

export const LOGOUT = "LOGOUT";
export const AUTHENTICATE = "AUTHENTICATE";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

export const setDidTryAL = () => ({ type: SET_DID_TRY_AL });

export const authenticate = (userId, token, email) => (dispatch) => {
    dispatch({ type: AUTHENTICATE, userId, token, email });
};

/**
 * Lắng nghe trạng thái Auth Firebase.
 * - Khi app khởi động: Firebase sẽ TỰ ĐỘNG khôi phục session nếu có.
 * - onAuthStateChanged được gọi 1 lần ngay lập tức:
 *     + Có user  → dispatch AUTHENTICATE → vào app
 *     + Không có → dispatch SET_DID_TRY_AL → vào AuthScreen
 * Trả về hàm unsubscribe để cleanup khi component unmount.
 */
export const listenToAuthChanges = () => (dispatch) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // Không dùng forceRefresh=true để tránh lỗi khi offline
                const token = await user.getIdToken(false);
                dispatch(authenticate(user.uid, token, user.email));
            } catch (error) {
                // Token thực sự hỏng → đăng xuất hẳn để tránh kẹt
                console.log("Token lỗi, đăng xuất:", error.code);
                try { await signOut(auth); } catch (_) {}
                dispatch(setDidTryAL());
            }
        } else {
            dispatch(setDidTryAL());
        }
    });
    return unsubscribe;
};

/**
 * Đăng ký tài khoản mới
 */
export const signup = (email, password) => async (dispatch) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    dispatch(authenticate(user.uid, token, user.email));
};

/**
 * Đăng nhập bằng email/password
 * Nếu Firebase đang có user khác đăng nhập → sign out trước để tránh xung đột
 */
export const login = (email, password) => async (dispatch) => {
    // Đảm bảo không có session cũ còn kẹt
    if (auth.currentUser) {
        try { await signOut(auth); } catch (_) {}
    }

    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();
    dispatch(authenticate(user.uid, token, user.email));
};

/**
 * Đăng xuất
 */
export const logout = () => async (dispatch) => {
    try {
        await signOut(auth);
    } catch (error) {
        console.log("Lỗi đăng xuất:", error);
    }
    dispatch({ type: LOGOUT });
};
