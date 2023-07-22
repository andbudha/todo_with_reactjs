export type ReqestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed';
const initialState = {
    status: 'idle' as ReqestStatusType,
    error: null as null | string
}
type InitialStateType = typeof initialState;
type AppActionType = changeAppStatusACType | setErrorACType;

export const appReducer = (state: InitialStateType = initialState, action: AppActionType): InitialStateType => {
    switch (action.type) {
        case 'SET-APP-STATUS': {
            return { ...state, status: action.newStatus }
        }
        case "SET-APP-ERROR": {
            return { ...state, error: action.error }
        }
        default: {
            return state;
        }
    }
}
export type changeAppStatusACType = ReturnType<typeof changeAppStatusAC>;
export const changeAppStatusAC = (newStatus: ReqestStatusType) => ({ type: 'SET-APP-STATUS', newStatus } as const);

export type setErrorACType = ReturnType<typeof setErrorAC>
export const setErrorAC = (error: null | string) => ({ type: 'SET-APP-ERROR', error } as const);