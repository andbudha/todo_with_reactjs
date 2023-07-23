
import { changeAppStatusAC } from "./app_reducer";
import { FormikSharedValueType, loginAPI } from "../api/login_api";
import { Dispatch } from "redux";
import { handleAppServerError, handleNetworkServerError } from "../utilities/err_utilities";
import { AxiosError } from "axios";
import { clearListsAC } from "./lists-reducer";

const initialState = {
    isLoggedIn: false,
    isAuthorized: false
}
type InitialStateType = typeof initialState;
type AuthActionType = changeLoginStatusACType | changeAuthStatusACType
export const authReducer = (state: InitialStateType = initialState, action: AuthActionType): InitialStateType => {
    switch (action.type) {
        case 'CHANGE-LOGIN-STATUS': {
            return { ...state, isLoggedIn: action.newStatus }
        }
        case "CHANGE-AUTH-STATUS": {
            return { ...state, isAuthorized: action.newAuthStatus }
        }
        default: {
            return state;
        }
    }
}

//Action-Creators
export type changeLoginStatusACType = ReturnType<typeof changeLoginStatusAC>;
export const changeLoginStatusAC = (newStatus: boolean) => ({ type: 'CHANGE-LOGIN-STATUS', newStatus } as const);

export type changeAuthStatusACType = ReturnType<typeof changeAuthStatusAC>;
export const changeAuthStatusAC = (newAuthStatus: boolean) => ({ type: 'CHANGE-AUTH-STATUS', newAuthStatus } as const);


//thunks
export const changeAuthStatusTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(changeAppStatusAC('loading'));
        loginAPI.authMe()
            .then(response => {
                console.log(response);

                if (response.data.resultCode === 0) {
                    dispatch(changeLoginStatusAC(true));
                    dispatch(changeAppStatusAC('succeeded'));
                } else {
                    handleAppServerError(response.data, dispatch);
                }
                dispatch(changeAuthStatusAC(true));
            }).catch((err: AxiosError<{ error: string }>) => {
                const error = err.response ? err.response.data.error : err.message;
                handleNetworkServerError(error, dispatch);
            })
    }
}
export const changeLoginStatusTC = (logInData: FormikSharedValueType) => {
    return (dispatch: Dispatch) => {
        dispatch(changeAppStatusAC('loading'));
        loginAPI.logIn(logInData)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(changeLoginStatusAC(true));
                    dispatch(changeAppStatusAC('succeeded'));
                } else {
                    handleAppServerError(response.data, dispatch);
                }
            }).catch((err: AxiosError<{ error: string }>) => {
                const error = err.response ? err.response.data.error : err.message;
                handleNetworkServerError(error, dispatch);
            })
    }
}

export const logOutTC = () => {
    return (dispatch: Dispatch) => {
        dispatch(changeAppStatusAC('loading'));
        loginAPI.logout()
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(changeLoginStatusAC(false));
                    dispatch(changeAppStatusAC('succeeded'));
                    dispatch(clearListsAC())
                } else {
                    handleAppServerError(response.data, dispatch);
                }
                dispatch(changeAuthStatusAC(true));
            }).catch((err: AxiosError<{ error: string }>) => {
                const error = err.response ? err.response.data.error : err.message;
                handleNetworkServerError(error, dispatch);
            })
    }
}
