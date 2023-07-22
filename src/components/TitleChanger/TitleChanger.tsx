import { ChangeEvent, memo, useState } from 'react';

type TitleChangerPropsType = {
    title: string
    changeTitleHandler: (newTitle: string) => void
    disabled?: boolean
}
export const TitleChanger = memo((props: TitleChangerPropsType) => {

    //title editor state
    const [editor, setEditor] = useState(false);

    //new title state
    const [newTitle, setNewTitle] = useState(props.title);

    //editor setting func-s
    const activateEditorHandler = () => {
        setEditor(true);
        { props.disabled ? setEditor(false) : setEditor(true) }
    };

    const inactivateEditorHandler = () => {
        setEditor(false);
        props.changeTitleHandler(newTitle);
    }

    //input value catching func
    const inputValueCatchingHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setNewTitle(event.currentTarget.value);
    };
    return (
        <>
            <span onDoubleClick={activateEditorHandler}>
                {editor
                    ? <input
                        disabled={props.disabled}
                        value={newTitle}
                        className={props.disabled ? 'my-3 border rounded w-40 outline-cyan-300 opacity-30' : 'my-3 border rounded w-40 outline-cyan-300'}
                        onBlur={inactivateEditorHandler}
                        onChange={inputValueCatchingHandler}
                        autoFocus
                    />
                    : props.title
                }
            </span>
        </>
    );
});
