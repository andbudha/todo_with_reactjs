import axios, { AxiosResponse } from "axios"

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'ce65347e-0874-43a4-84c8-48038b97386a'
    }
})

export const listsAPI = {
    getLists() {
        return instance.get<TodoListType[]>('/todo-lists');
    },
    postList(title: string) {
        return instance.post<ResponseType<{ item: TodoListType }>, AxiosResponse<ResponseType<{ item: TodoListType }>>>('/todo-lists', { title });
    },
    editList(listID: string, title: string) {
        return instance.put<ResponseType>(`/todo-lists/${listID}`, { title });
    },
    deleteList(listID: string) {
        return instance.delete<ResponseType>(`/todo-lists/${listID}`);
    }
}

export type TodoListType = {
    id: string
    title: string
    order: number
    addedDate: string
}

export type ResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
