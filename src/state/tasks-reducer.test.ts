import { TaskPriority, TaskStatus } from "../api/tasks_api";
import {
    addNewTaskAC, removeListAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType,
    updateTaskAC
} from "./tasks-reducer";
import { v1 } from "uuid";

let listID1: string
let listID2: string

let initialState: TasksStateType

beforeEach(() => {

    listID1 = v1();
    listID2 = v1();

    initialState = {
        [listID1]: [
            {
                id: v1(),
                title: "HTML&CSS",
                status: TaskStatus.Completed,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: v1(),
                title: "JS",
                status: TaskStatus.Completed,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: v1(),
                title: "ReactJS",
                status: TaskStatus.New,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            }
        ],
        [listID2]: [
            {
                id: v1(),
                title: "HTML&CSS-2",
                status: TaskStatus.Completed,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: v1(),
                title: "JS-2",
                status: TaskStatus.Completed,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            },
            {
                id: v1(),
                title: "ReactJS-2",
                status: TaskStatus.New,
                description: '',
                completed: false,
                priority: TaskPriority.Low,
                startDate: '',
                deadline: '',
                todoListId: '',
                order: 0,
                addedDate: ''
            }
        ]
    };

});

test('A new task must be added to a certain list', () => {

    const newTitle = 'Unit-Tests';
    const listID = listID1;
    const newTask = {
        id: v1(),
        title: newTitle,
        status: TaskStatus.New,
        description: '',
        completed: false,
        priority: TaskPriority.Low,
        startDate: '',
        deadline: '',
        todoListId: '',
        order: 0,
        addedDate: ''
    }

    const resultedState = tasksReducer(initialState, addNewTaskAC(listID, newTask));

    expect(resultedState[listID1].length).toBe(4);
    expect(resultedState[listID1][0].title).toBe(newTitle);
    expect(resultedState[listID1][0].status).toBe(TaskStatus.New);

});

test('A certain task must be removed from a certain list', () => {
    const taskToRemove = initialState[listID1][0].id
    const listID = listID1;

    const resultedState = tasksReducer(initialState, removeTaskAC(listID, taskToRemove));

    expect(resultedState[listID1].length).toBe(2);
    expect(resultedState[listID1][0].title).toBe('JS');
});

test('The status of a certain task must be changed', () => {
    const taskToChange = initialState[listID2][2].id;
    const taskStatus = initialState[listID2][2].status;

    const resultedState = tasksReducer(initialState, updateTaskAC(listID2, taskToChange, { status: taskStatus }));

    expect(resultedState[listID2][2].title).toBe('ReactJS-2');
    expect(resultedState[listID2][2].status).toBe(TaskStatus.Completed);
});


test('The title of a certain task must be removed', () => {
    const newTaskTitle = 'ReactJS&Redux';
    const taskID = initialState[listID1][2].id;

    const resultedState = tasksReducer(initialState, updateTaskAC(listID1, taskID, { title: newTaskTitle }));

    expect(resultedState[listID1][2].title).toBe(newTaskTitle);
    expect(resultedState[listID2][2].title).toBe("ReactJS-2");
});

test('A certain list must be removed', () => {


    const resultedState = tasksReducer(initialState, removeListAC(listID1));

    const resultedKeyList = Object.keys(resultedState);

    const keyID = resultedKeyList[0];

    expect(resultedKeyList.length).toBe(1);
    expect(keyID).toBe(listID2);
});
