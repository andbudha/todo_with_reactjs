import { memo, useCallback } from 'react';
import { FilterType } from '../../state/lists-reducer';


type MasterButtonPropsType = {
    title: string
    filter: FilterType
    buttonName: FilterType
    taskFilterHandler: (buttonName: FilterType) => void
}
export const MasterButton = memo((props: MasterButtonPropsType) => {
    const classes = (filter: FilterType) => {
        if (filter === 'all') {
            return 'border-2 rounded px-3 my-2 bg-indigo-200';
        } else if (filter === 'active') {
            return 'border-2 rounded px-3 my-2 bg-orange-300';
        } else if (filter === 'complete') {
            return 'border-2 rounded px-3 my-2 bg-lime-300';
        }
    };

    const btnActive = classes(props.filter);
    const btnPassive = 'border-2 rounded px-3 my-2';

    //task filtering func
    const filterTasksHandler = useCallback(() => {
        props.taskFilterHandler(props.buttonName);
    }, [props.taskFilterHandler, props.buttonName]);

    return (
        <div>
            <button className={props.filter === props.buttonName ? btnActive : btnPassive} onClick={filterTasksHandler}>{props.title}</button>
        </div>
    );
});
