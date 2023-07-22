import { ChangeEvent, memo, useCallback } from 'react';
import { TitleChanger } from "../TitleChanger/TitleChanger";
import { TaskStatus, TaskType } from '../../api/tasks_api';

type TaskPropsType = {
    task: TaskType
    removeTask: (taskID: string) => void
    changeStatus: (taskID: string, status: TaskStatus) => void
    changeTaskTitle: (taskID: string, newTitle: string) => void

}
export const Task = memo((props: TaskPropsType) => {

    //task removing func
    const taskRemovingHandler = useCallback((taskID: string) => {
        props.removeTask(taskID);
    }, [props.removeTask]);

    //changing task status func
    const changeStatusHandler = useCallback((taskID: string, status: TaskStatus) => {
        props.changeStatus(taskID, status);
    }, [props.changeStatus]);

    //task title changing func
    const changeTaskTitleHandler = useCallback((taskID: string, newTitle: string) => {
        props.changeTaskTitle(taskID, newTitle);
    }, [props.changeTaskTitle]);
    return (
        <li key={props.task.id} className={props.task.status === TaskStatus.Completed ? 'opacity-30' : ''}>
            <div className={'flex justify-start items-center space-x-2.5 '}>
                <button className={'px-3 m-1 border rounded bg-white hover:bg-cyan-200'} onClick={() => taskRemovingHandler(props.task.id)}>x</button>
                <TitleChanger title={props.task.title} changeTitleHandler={(newTitle: string) => changeTaskTitleHandler(props.task.id, newTitle)} />
                <input
                    type="checkbox"
                    checked={props.task.status === TaskStatus.Completed ? true : false}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => changeStatusHandler(props.task.id, event.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New)}
                />
            </div>
        </li>
    );
});
