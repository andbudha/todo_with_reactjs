import { Dispatch } from "redux"
import { changeAppStatusAC, changeAppStatusACType, setErrorAC, setErrorACType } from "../state/app_reducer"
import { ResponseType } from "../api/lists_api"

type ErrorUtilitiesDispatchType = Dispatch<setErrorACType | changeAppStatusACType>

export const handleAppServerError = (data: ResponseType, dispatch: ErrorUtilitiesDispatchType) => {
    if (data.messages.length) {
        dispatch(setErrorAC(data.messages[0]));
    } else {
        dispatch(setErrorAC('Some Error!'));
    }
    dispatch(changeAppStatusAC('failed'));
}

export const handleNetworkServerError = (error: string, dispatch: ErrorUtilitiesDispatchType) => {
    dispatch(setErrorAC(error));
    dispatch(changeAppStatusAC('failed'));
}