import { Dispatch } from 'redux';
import { TodoListType, listsAPI } from '../api/lists_api';
import { ReqestStatusType, changeAppStatusAC, setErrorAC } from './app_reducer';
import {
  handleAppServerError,
  handleNetworkServerError,
} from '../utilities/err_utilities';
import { AxiosError } from 'axios';

export type FilterType = 'all' | 'active' | 'complete';
export type TodoListDomainType = TodoListType & {
  filter: FilterType;
  listStatus: ReqestStatusType;
};

type ListsStateType = TodoListDomainType[];

type ActionType =
  | addListACType
  | removeListACType
  | changeListFilterACType
  | changeListTitleACType
  | setListsACType
  | changeListStatusACType
  | clearListsACType;

const initialState: TodoListDomainType[] = [];

export const listsReducer = (
  state: ListsStateType = initialState,
  action: ActionType
): TodoListDomainType[] => {
  switch (action.type) {
    case 'ADD LIST':
      const newList: TodoListDomainType = {
        ...action.payload.list,
        filter: 'all',
        listStatus: 'idle',
      };
      return [newList, ...state];
    case 'REMOVE LIST':
      return state.filter((list) => list.id !== action.payload.listID);
    case 'CHANGE LIST FILTER':
      return state.map((list) =>
        list.id === action.payload.listID
          ? { ...list, filter: action.payload.newFilter }
          : list
      );
    case 'CHANGE LIST TITLE':
      return state.map((list) =>
        list.id === action.payload.listID
          ? { ...list, title: action.payload.newTitle }
          : list
      );
    case 'CHNAGE-LIST-STATUS':
      return state.map((list) =>
        list.id === action.listID
          ? { ...list, listStatus: action.newListStatus }
          : list
      );
    case 'SET-LISTS':
      return action.payload.lists.map((list) => ({
        ...list,
        filter: 'all',
        listStatus: 'idle',
      }));
    case 'CLEAR-LISTS':
      return (state = []);
    default:
      return state;
  }
};

//Action-Creators
export type addListACType = ReturnType<typeof addListAC>;
export const addListAC = (list: TodoListType) => {
  return {
    type: 'ADD LIST',
    payload: { list },
  } as const;
};

type removeListACType = ReturnType<typeof removeListAC>;
export const removeListAC = (listID: string) => {
  return {
    type: 'REMOVE LIST',
    payload: { listID },
  } as const;
};

type changeListFilterACType = ReturnType<typeof changeListFilterAC>;
export const changeListFilterAC = (listID: string, newFilter: FilterType) => {
  return {
    type: 'CHANGE LIST FILTER',
    payload: { listID, newFilter },
  } as const;
};

export type changeListStatusACType = ReturnType<typeof changeListStatusAC>;
export const changeListStatusAC = (
  listID: string,
  newListStatus: ReqestStatusType
) => {
  return {
    type: 'CHNAGE-LIST-STATUS',
    listID,
    newListStatus,
  } as const;
};
type changeListTitleACType = ReturnType<typeof changeListTitleAC>;
export const changeListTitleAC = (listID: string, newTitle: string) => {
  return {
    type: 'CHANGE LIST TITLE',
    payload: { listID, newTitle },
  } as const;
};

export type setListsACType = ReturnType<typeof setListsAC>;
export const setListsAC = (lists: TodoListType[]) => {
  return {
    type: 'SET-LISTS',
    payload: { lists },
  } as const;
};

export type clearListsACType = ReturnType<typeof clearListsAC>;
export const clearListsAC = () => ({ type: 'CLEAR-LISTS' } as const);

//thunks

export const setListsTC = () => {
  return (dispatch: Dispatch) => {
    dispatch(changeAppStatusAC('loading'));
    listsAPI
      .getLists()
      .then((response) => {
        if (response.status === 200 && response.data.length) {
          dispatch(setListsAC(response.data));
          dispatch(changeAppStatusAC('succeeded'));
        } else {
          dispatch(
            setErrorAC('Either no list has been found or an error occurred!')
          );
          dispatch(changeAppStatusAC('idle'));
        }
      })
      .catch((err: AxiosError<{ message: string }>) => {
        // dispatch(setErrorAC(error.message));
        dispatch(changeAppStatusAC('failed'));
      });
  };
};

export const addListTC = (title: string) => {
  return (dispatch: Dispatch) => {
    dispatch(changeAppStatusAC('loading'));
    listsAPI
      .postList(title)
      .then((response) => {
        if (response.data.resultCode === 0) {
          const list = response.data.data.item;
          dispatch(addListAC(list));
          dispatch(changeAppStatusAC('succeeded'));
        } else {
          handleAppServerError(response.data, dispatch);
        }
      })
      .catch((err: AxiosError<{ error: string }>) => {
        const error = err.response ? err.response.data.error : err.message;
        handleNetworkServerError(error, dispatch);
      });
  };
};

export const removeListTC = (listID: string) => {
  return (dispatch: Dispatch) => {
    dispatch(changeAppStatusAC('loading'));
    dispatch(changeListStatusAC(listID, 'loading'));
    listsAPI
      .deleteList(listID)
      .then((response) => {
        if (response.data.resultCode === 0) {
          dispatch(removeListAC(listID));
          dispatch(changeAppStatusAC('succeeded'));
        } else {
          handleAppServerError(response.data, dispatch);
        }
      })
      .catch((err: AxiosError<{ error: string }>) => {
        const error = err.response ? err.response.data.error : err.message;
        handleNetworkServerError(error, dispatch);
      });
  };
};

export const updateListTitleTC = (listID: string, newTitle: string) => {
  return (dispatch: Dispatch) => {
    dispatch(changeAppStatusAC('loading'));
    dispatch(changeListStatusAC(listID, 'loading'));
    listsAPI
      .editList(listID, newTitle)
      .then((response) => {
        if (response.data.resultCode === 0) {
          dispatch(changeListTitleAC(listID, newTitle));
          dispatch(changeAppStatusAC('succeeded'));
          dispatch(changeListStatusAC(listID, 'succeeded'));
        } else {
          handleAppServerError(response.data, dispatch);
        }
      })
      .catch((err: AxiosError<{ error: string }>) => {
        const error = err.response ? err.response.data.error : err.message;
        handleNetworkServerError(error, dispatch);
      });
  };
};
