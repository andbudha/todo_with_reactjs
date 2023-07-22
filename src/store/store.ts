import { AnyAction, applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { tasksReducer } from "../state/tasks-reducer";
import { listsReducer } from "../state/lists-reducer";
import thunk, { ThunkDispatch } from "redux-thunk";
import { useDispatch } from "react-redux";
import { appReducer } from "../state/app_reducer";
import { authReducer } from "../state/login-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    lists: listsReducer,
    app: appReducer,
    authorization: authReducer
});

//creating certain type for the useDispatch hook
type AppDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>;

//creating dispatch func for thunk-dispatching
export const useAppDispatch = () => useDispatch<AppDispatchType>();

//creating store and applying middleWare
export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

export type AppRootStateType = ReturnType<typeof rootReducer>