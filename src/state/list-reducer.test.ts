
import { v1 } from "uuid";
import { TodoListDomainType, addListAC, changeListFilterAC, changeListTitleAC, listsReducer, removeListAC } from "./lists-reducer";


let listID1: string
let listID2: string

let initialState: TodoListDomainType[]

beforeEach(() => {

    listID1 = v1();
    listID2 = v1();

    initialState = [
        { id: listID1, title: 'What to learn', filter: 'all', order: 0, addedDate: '', listStatus: 'idle' },
        { id: listID2, title: 'What to buy', filter: 'all', order: 0, addedDate: '', listStatus: 'idle' }
    ];
});

test('A new list must be added', () => {
    const newTitle = 'Books to read';
    const newList = {
        id: v1(),
        title: newTitle,
        order: 0,
        addedDate: ''
    }

    const resultedState = listsReducer(initialState, addListAC(newList));

    expect(resultedState.length).toBe(3);
    expect(resultedState[0].title).toBe(newTitle);
});

test('A certain list must be removed', () => {

    const resultedState = listsReducer(initialState, removeListAC(listID1));

    expect(resultedState.length).toBe(1);
    expect(resultedState[0].id).toBe(listID2);
});

test('The filter of a certain list must be changed', () => {
    const newFilter = 'active';

    const resultedState = listsReducer(initialState, changeListFilterAC(listID2, newFilter));

    expect(resultedState[1].filter).toBe(newFilter);
});

test('The title of a certain list must be changed', () => {

    const newTitle = 'Books for reading';

    const resultedState = listsReducer(initialState, changeListTitleAC(listID2, newTitle));

    expect(resultedState[1].title).toBe(newTitle);
});