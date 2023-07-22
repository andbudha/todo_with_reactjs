import { useEffect } from 'react';
import { useSelector } from "react-redux";
import { AppRootStateType, useAppDispatch } from "./store/store";
import { Box, CircularProgress, LinearProgress, Stack } from '@mui/material';
import { ReqestStatusType } from './state/app_reducer';
import { ErrorSnackBar } from './components/ErrorSnackBar/ErrorSnackBar';
import { Todolists } from './components/Todolists/Todolists';
import { Login } from './components/Login/Login';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PageNotFound } from './components/404/PageNotFound';
import { changeAuthStatusTC } from './state/login-reducer';

function App() {

    const appStatus = useSelector<AppRootStateType, ReqestStatusType>(state => state.app.status);
    const isAuthorized = useSelector<AppRootStateType, boolean>(state => state.authorization.isAuthorized);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(changeAuthStatusTC());
    }, [])

    if (!isAuthorized) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </div>
        )
    }
    return (
        <div className="container lg bg-stone-100 min-h-screen">
            <ErrorSnackBar />
            {/* ProgressBar */}
            <Stack display={'flex'} justifyContent={'center'} flexDirection={'row'}>
                <Box sx={{ width: '100%' }}>
                    {appStatus === 'loading' && <LinearProgress />}
                </Box>
            </Stack>
            <Routes>
                <Route path={'/'} element={<Todolists />} />
                <Route path={'/login'} element={<Login />} />
                <Route path={'/404'} element={<PageNotFound />} />
                <Route path={'/*'} element={<Navigate to={'/login'} />} />
            </Routes>
        </div>
    );
}
export default App;
