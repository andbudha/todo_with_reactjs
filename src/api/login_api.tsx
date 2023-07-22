import axios from "axios";

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.1',
    withCredentials: true,
    headers: {
        'API-KEY': 'ce65347e-0874-43a4-84c8-48038b97386a'
    }
});
export type FormikSharedValueType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

export type LogInResponseType<D = {}> = {
    resultCode: number
    messages: Array<string>
    fieldsErrors: Array<string>
    data: D
}
export const loginAPI = {
    logIn(logInData: FormikSharedValueType) {
        return instance.post<LogInResponseType<{ userId: number }>>('/auth/login', logInData);
    },
    logout() {
        return instance.delete('/auth/login');
    },
    authMe() {
        return instance.get('/auth/me');
    }
}