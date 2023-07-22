import { ChangeEvent, KeyboardEvent, useState } from 'react';

type MasterInputPropsType = {
    inputValueCatchingHandler: (inputValue: string) => void
    disabled?: boolean
}
export const MasterInput = (props: MasterInputPropsType) => {

    //input catching state
    const [inputValue, setInputValue] = useState('');

    //error state
    const [error, setError] = useState(false);

    //input value catching func
    const inputValueCatchingHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.currentTarget.value);
        setError(false);
    };

    //on click task adding func
    const taskAddingHandler = () => {
        if (inputValue !== '') {
            props.inputValueCatchingHandler(inputValue.trim());
            setInputValue('');
        } else {
            setError(true);
        }
    };

    //on ENTER task adding func
    const onEnterAddTaskHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && inputValue !== '') {
            props.inputValueCatchingHandler(inputValue.trim());
            setInputValue('');
        } else {
            if (error) setError(true);
        }
    }

    return (
        <>
            {error ? <span className={'text-red-600  prose-sm'}>New entry is required!</span> : ''}
            <div>
                <input
                    disabled={props.disabled}
                    value={inputValue}
                    className={error
                        ? 'my-3 p-1 border-2 rounded focus: border-red-600 w-48 outline-none mt-0'
                        : 'my-3 p-1 border rounded w-48 outline-cyan-300'}
                    onChange={inputValueCatchingHandler}
                    onKeyDown={onEnterAddTaskHandler}
                />
                <button className={props.disabled ? 'px-3 py-1 border rounded bg-white bg-cyan-200 opacity-30' : 'px-3 py-1 border rounded bg-white hover:bg-cyan-200'} onClick={taskAddingHandler} disabled={props.disabled}>+</button>
            </div>
        </>
    );
};
