import { addListACType, clearListsACType, setListsACType } from "./lists-reducer";
import { TaskPriority, TaskStatus, TaskType, UpdatedTaskModel, tasksAPI } from "../api/tasks_api";
import { Dispatch } from "redux";
import { AppRootStateType } from "../store/store";
import { ReqestStatusType, changeAppStatusAC } from "./app_reducer";
import { handleAppServerError, handleNetworkServerError } from "../utilities/err_utilities";
import { AxiosError } from "axios";

export type TasksStateType = {
    [key: string]: TaskType[]
}

export type ActionType =
    addNewTaskACType
    | removeTaskACType
    | updateTaskACType
    | removeListACType
    | addListACType
    | setListsACType
    | setTasksACType
    | changeTaskStatusACType
    | clearListsACType

const initialState: TasksStateType = {};
export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case 'ADD NEW TASK':
            return { ...state, [action.payload.listID]: [action.payload.task, ...state[action.payload.listID]] };
        case "REMOVE TASK":
            return {
                ...state,
                [action.payload.listID]: [...state[action.payload.listID]
                    .filter(task => task.id !== action.payload.taskID)]
            };
        case "UPDATE-TASK":
            return {
                ...state, [action.payload.listID]: [...state[action.payload.listID]
                    .map(task => task.id === action.payload.taskID ? {
                        ...task,
                        ...action.payload.updatedTask
                    } : task)]
            };
        case "REMOVE LIST":
            const { [action.payload.listID]: [], ...rest } = { ...state };
            return rest;
        case "ADD LIST":
            return { ...state, [action.payload.list.id]: [] }
        case "SET-LISTS": {
            const stateCopy = { ...state }
            action.payload.lists.forEach(list => {
                stateCopy[list.id] = [];
            })
            return stateCopy;
        }
        case "SET-TASKS": {
            const stateCopy = { ...state }
            stateCopy[action.payload.listID] = action.payload.tasks
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.payload.listID]: [...state[action.payload.listID]
                    .map(task => task.id === action.payload.taskID ? { ...task, taskStatus: action.payload.taskStatus } : task)]
            }
        }
        case "CLEAR-LISTS": {
            return state = {};
        }
        default:
            return state;
    }
};

//action-creators
type addNewTaskACType = ReturnType<typeof addNewTaskAC>
export const addNewTaskAC = (listID: string, task: TaskType) => {
    return {
        type: 'ADD NEW TASK',
        payload: { listID, task }
    } as const
};

type removeTaskACType = ReturnType<typeof removeTaskAC>
export const removeTaskAC = (listID: string, taskID: string) => {
    return {
        type: 'REMOVE TASK',
        payload: { listID, taskID }
    } as const
};

type updateTaskACType = ReturnType<typeof updateTaskAC>
export const updateTaskAC = (listID: string, taskID: string, updatedTask: UpdatedTaskModelType) => {
    return {
        type: 'UPDATE-TASK',
        payload: { listID, taskID, updatedTask }
    } as const
};

type removeListACType = ReturnType<typeof removeListAC>
export const removeListAC = (listID: string) => {
    return {
        type: 'REMOVE LIST',
        payload: { listID }
    } as const
}

type setTasksACType = ReturnType<typeof setTasksAC>
export const setTasksAC = (listID: string, tasks: TaskType[]) => {
    return {
        type: 'SET-TASKS',
        payload: { listID, tasks }
    } as const
}

type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
export const changeTaskStatusAC = (listID: string, taskID: string, taskStatus: UpdatedTaskModelType) => {
    return {
        type: 'CHANGE-TASK-STATUS',
        payload: { listID, taskID, taskStatus }
    } as const
}

//thunk creators
export const setTasksTC = (listID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeAppStatusAC('loading'));
        tasksAPI.getTasks(listID)
            .then(response => {
                dispatch(changeAppStatusAC('succeeded'));
                dispatch(setTasksAC(listID, response.data.items));
            })
    }
}

export const removeTaskTC = (listID: string, taskID: string) => {
    return (dispatch: Dispatch) => {
        dispatch(changeAppStatusAC('loading'));

        tasksAPI.deleteTask(listID, taskID)
            .then(response => {
                if (response.data.resultCode === 0) {
                    dispatch(removeTaskAC(listID, taskID));
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

export const addNewTaskTC = (listID: string, taskID: string) => {
    return (dispatch: Dispatch) => {

        dispatch(changeAppStatusAC('loading'));
        tasksAPI.createTask(listID, taskID)
            .then(response => {
                if (response.data.resultCode === 0) {
                    const task = response.data.data.item
                    dispatch(changeAppStatusAC('succeeded'));

                    dispatch(addNewTaskAC(listID, task));
                } else {
                    handleAppServerError(response.data, dispatch);
                }
            }).catch((err: AxiosError<{ error: string }>) => {
                const error = err.response ? err.response.data.error : err.message;
                handleNetworkServerError(error, dispatch);
            })
    }
}

export type UpdatedTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
    taskStatus?: ReqestStatusType
}

export const updateTaskTC = (listID: string, taskID: string, updatedTaskModel: UpdatedTaskModelType) => {
    return (dispatch: Dispatch, getState: () => AppRootStateType) => {
        dispatch(changeAppStatusAC('loading'));

        const task = getState().tasks[listID].find(task => task.id === taskID);
        if (task) {
            const updatedTask: UpdatedTaskModel = {
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                startDate: task.startDate,
                deadline: task.deadline,
                ...updatedTaskModel
            }
            tasksAPI.editTask(listID, taskID, updatedTask)
                .then(response => {
                    if (response.data.resultCode === 0) {
                        dispatch(updateTaskAC(listID, taskID, updatedTask));
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
}