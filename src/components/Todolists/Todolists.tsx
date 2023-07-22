import { useSelector } from "react-redux";
import { AppRootStateType, useAppDispatch } from "../../store/store";
import { FilterType, TodoListDomainType, addListTC, changeListFilterAC, removeListTC, setListsTC, updateListTitleTC } from "../../state/lists-reducer";
import { Todolist } from "../Todolist/Todolist";
import { TasksStateType, addNewTaskTC, removeTaskTC, updateTaskTC } from "../../state/tasks-reducer";
import { useCallback, useEffect } from "react";
import { TaskStatus } from "../../api/tasks_api";
import { MasterInput } from "../Masterinput/Masterinput";
import { Navigate } from "react-router-dom";
import { changeAppStatusAC } from "../../state/app_reducer";
import { logOutTC } from "../../state/login-reducer";


export const Todolists = () => {

    const lists = useSelector<AppRootStateType, TodoListDomainType[]>(state => state.lists);
    const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks);
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.authorization.isLoggedIn);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!isLoggedIn) {
            dispatch(changeAppStatusAC('idle'))
        }
        dispatch(setListsTC());
    }, [])

    //task adding function
    const addTask = useCallback((listID: string, inputValue: string) => {
        dispatch(addNewTaskTC(listID, inputValue));

    }, [dispatch]);

    //task removing func
    const removeTask = useCallback((listID: string, taskID: string) => {
        dispatch(removeTaskTC(listID, taskID));
    }, [dispatch]);

    //changing task status func
    const changeStatus = useCallback((listID: string, taskID: string, status: TaskStatus) => {
        dispatch(updateTaskTC(listID, taskID, { status }));
    }, [dispatch]);

    //task filtering func

    const filterTasks = useCallback((listID: string, buttonName: FilterType) => {
        dispatch(changeListFilterAC(listID, buttonName));
    }, [dispatch]);

    //list removing func
    const removeList = useCallback((listID: string) => {
        dispatch(removeListTC(listID));
    }, [dispatch]);

    //task title changing func
    const changeTaskTitle = useCallback((listID: string, taskID: string, title: string) => {
        dispatch(updateTaskTC(listID, taskID, { title }));
    }, [dispatch]);

    //list title changing func
    const changeListTitle = useCallback((listID: string, newTitle: string) => {
        //setToDoLists(toDoLists.map(list=>list.id === listID ? {...list, title: newTitle} : list));
        dispatch(updateListTitleTC(listID, newTitle));
    }, [dispatch]);

    //new list creating func
    const newListCreatingHandler = useCallback((inputValue: string) => {
        dispatch(addListTC(inputValue));
    }, [dispatch]);

    //log-out func
    const logoutHandler = () => {
        dispatch(logOutTC());
    }

    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }
    return (
        <>
            <div className={'flex flex-col items-center p-5'}>
                <div>
                    <div className={'flex flex-row justify-center'}>
                        <h2>Add new list!</h2>
                    </div>
                    <MasterInput inputValueCatchingHandler={newListCreatingHandler} />
                </div>
            </div>
            <div className={'flex flex-row justify-center flex-wrap'}>
                {lists.map(list => {
                    return (
                        <Todolist
                            key={list.id}
                            listStatus={list.listStatus}
                            todolistID={list.id}
                            tasks={tasks[list.id]}
                            listTitle={list.title}
                            addTask={addTask}
                            removeTask={removeTask}
                            changeStatus={changeStatus}
                            filterTasks={filterTasks}
                            filter={list.filter}
                            changeTaskTitle={changeTaskTitle}
                            changeListTitle={changeListTitle}
                            removeList={removeList}
                        />
                    );
                })}
            </div>
            <div className={'flex flex-col items-center p-5'}>
                <button
                    className='px-5 py-1 m-1 border rounded bg-white'
                    onClick={logoutHandler}
                >log out</button>
            </div>
        </>
    );
}

