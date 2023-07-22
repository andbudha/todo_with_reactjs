import { memo, useCallback, useEffect } from 'react';
import { MasterInput } from "../Masterinput/Masterinput";
import { TitleChanger } from "../TitleChanger/TitleChanger";
import { MasterButton } from "../MasterButton/MasterButton";
import { Task } from "../Task/Task";
import { FilterType } from '../../state/lists-reducer';
import { TaskStatus, TaskType } from '../../api/tasks_api';
import { useAppDispatch } from '../../store/store';
import { setTasksTC } from '../../state/tasks-reducer';
import { ReqestStatusType } from '../../state/app_reducer';

type TodolistPropsType = {
    listStatus: ReqestStatusType,
    todolistID: string,
    tasks: TaskType[],
    listTitle: string,
    filter: FilterType,
    addTask: (listID: string, inputValue: string) => void,
    removeTask: (listID: string, taskID: string) => void,
    changeStatus: (listID: string, taskID: string, status: TaskStatus) => void,
    filterTasks: (listID: string, buttonName: FilterType) => void
    changeTaskTitle: (listID: string, taskID: string, newTitle: string) => void
    changeListTitle: (listID: string, newTitle: string) => void
    removeList: (listID: string) => void
}
export const Todolist = memo((props: TodolistPropsType) => {

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setTasksTC(props.todolistID));
    }, []);

    //task removing func
    const taskRemovingHandler = useCallback((taskID: string) => {
        props.removeTask(props.todolistID, taskID);
    }, [props.removeTask, props.todolistID]);

    //changing task status func
    const changeStatusHandler = useCallback((taskID: string, status: TaskStatus) => {
        props.changeStatus(props.todolistID, taskID, status);
    }, [props.changeStatus, props.todolistID]);

    //task title changing func
    const changeTaskTitleHandler = useCallback((taskID: string, newTitle: string) => {
        props.changeTaskTitle(props.todolistID, taskID, newTitle);
    }, [props.changeTaskTitle, props.todolistID]);

    //task-filtering functions
    const filterAllHandler = useCallback((buttonName: FilterType) => {
        props.filterTasks(props.todolistID, buttonName);
    }, [props.filterTasks, props.todolistID]);

    const filterActiveHandler = useCallback((buttonName: FilterType) => {
        props.filterTasks(props.todolistID, buttonName);
    }, [props.filterTasks, props.todolistID]);

    const filterCompleteHandler = useCallback((buttonName: FilterType) => {
        props.filterTasks(props.todolistID, buttonName);
    }, [props.filterTasks, props.todolistID]);

    //master-input helper func
    const inputValueCatchingHandler = useCallback((inputValue: string) => {
        props.addTask(props.todolistID, inputValue);
    }, [props.addTask, props.todolistID]);

    //list title changing func
    const changeListTitleHandler = useCallback((newTitle: string) => {
        props.changeListTitle(props.todolistID, newTitle);
    }, [props.changeListTitle, props.todolistID]);

    //list removing handler
    const removeListHandler = useCallback(() => {
        props.removeList(props.todolistID);
    }, [props.removeList, props.todolistID]);

    //filter conditioning

    let tasks = props.tasks;

    if (props.filter === 'active') {
        tasks = tasks.filter(task => task.status === TaskStatus.New);
    }

    if (props.filter === 'complete') {
        tasks = tasks.filter(task => task.status === TaskStatus.Completed);
    }

    return (
        <ul className={'bg-white border rounded-md p-2 m-3 w-64 drop-shadow-lg '}>
            <span className={'flex items-center justify-center'}>
                <h1><TitleChanger title={props.listTitle} changeTitleHandler={changeListTitleHandler} disabled={props.listStatus === 'loading'} /></h1>
                <button
                    className={props.listStatus === 'loading' ? 'px-3 m-1 border rounded bg-white bg-cyan-200 opacity-30' : 'px-3 m-1 border rounded bg-white hover:bg-cyan-200'}
                    onClick={removeListHandler} disabled={props.listStatus === 'loading'}
                >x</button>
            </span>
            <MasterInput inputValueCatchingHandler={inputValueCatchingHandler} disabled={props.listStatus === 'loading'} />
            {tasks.map(task => {
                return (
                    <Task
                        key={task.id}
                        task={task}
                        removeTask={taskRemovingHandler}
                        changeStatus={changeStatusHandler}
                        changeTaskTitle={changeTaskTitleHandler}
                    />
                );
            })}
            <div className={'flex justify-around'}>
                <MasterButton title={'All'} filter={props.filter} buttonName={'all'} taskFilterHandler={filterAllHandler} />
                <MasterButton title={'Active'} filter={props.filter} buttonName={'active'} taskFilterHandler={filterActiveHandler} />
                <MasterButton title={'Complete'} filter={props.filter} buttonName={'complete'} taskFilterHandler={filterCompleteHandler} />
            </div>
        </ul>
    );
});
