import axios, { AxiosResponse } from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'ce65347e-0874-43a4-84c8-48038b97386a'
    }
});

export const tasksAPI = {
    getTasks(listID: string) {
        return instance.get<GetTasksResponseType>(`/todo-lists/${listID}/tasks`);
    },
    createTask(listID: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`/todo-lists/${listID}/tasks`, { title });
    },
    editTask(listID: string, taskID: string, model: UpdatedTaskModel) {
        return instance.put<ResponseType<{ item: TaskType }>, AxiosResponse<ResponseType<{ item: TaskType }>>>(`/todo-lists/${listID}/tasks/${taskID}`, model);
    },
    deleteTask(listID: string, taskID: string) {
        return instance.delete<ResponseType>(`/todo-lists/${listID}/tasks/${taskID}`);
    }
}

export enum TaskStatus {
    New = 0,
    Completed = 1,
    Awaiting = 2
}

export enum TaskPriority {
    Low = 1,
    Moderate = 2,
    High = 3
}

export type TaskType = {
    description: string
    title: string
    completed: boolean
    status: TaskStatus
    priority: TaskPriority
    startDate: string
    deadline: string
    id: string
    todoListId: string
    order: number
    addedDate: string
}

export type GetTasksResponseType = {
    totalCount: number
    error: string
    items: TaskType[]
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export type UpdatedTaskModel = {
    title: string
    description: string
    status: TaskStatus
    priority: TaskPriority
    startDate: string
    deadline: string
}