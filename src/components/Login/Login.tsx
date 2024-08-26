import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import styles from './Login.module.css';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { AppRootStateType, useAppDispatch } from '../../store/store';
import { changeLoginStatusTC } from '../../state/login-reducer';
import { Navigate } from 'react-router-dom';

export const Login = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.authorization.isLoggedIn);

    const dispatch = useAppDispatch();
    //Formik
    type FormikSharedValueType = {
        email?: string
        password?: string
        rememberMe?: boolean
    }
    const validate = (values: FormikSharedValueType) => {
        const errors: FormikSharedValueType = {};
        if (!values.email) {
            errors.email = 'Email required!';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address!';
        }

        if (!values.password) {
            errors.password = 'Password required!';
        } else if (values.password.length < 3) {
            errors.password = 'Must be not less than 3 characters!';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate,
        onSubmit: values => {
            dispatch(changeLoginStatusTC(values));
        },
    });

    if (isLoggedIn) {
        return <Navigate to={'/'} />
    }

    return (
        <div className={`${'min-h-screen flex  items-center'}`}>
            <Grid container justifyContent={'center'}>
                <Grid item justifyContent={'center'}>
                    <div className={styles.login_container}>
                        <FormControl>
                            <FormLabel>
                                <p>In order to log in, please, use the below provided</p>
                                <p>common test account credentials:</p>
                                <br></br>
                                <p>Email: free@samuraijs.com</p>
                                <p>Password: free</p>
                            </FormLabel>
                            <form onSubmit={formik.handleSubmit}>
                                <FormGroup>
                                    <TextField
                                        className={styles.font_style}
                                        label="Email"
                                        margin="normal"
                                        {...formik.getFieldProps('email')}
                                    />
                                    {formik.touched.email && formik.errors.email ? (
                                        <div style={{ color: 'red', fontSize: 13 }}>{formik.errors.email}</div>
                                    ) : null}
                                    <TextField
                                        className={styles.font_style}
                                        type="password"
                                        label="Password"
                                        margin="normal"
                                        {...formik.getFieldProps('password')}
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div style={{ color: 'red', fontSize: 13 }}>{formik.errors.password}</div>
                                    ) : null}
                                    <FormControlLabel
                                        label={'Remember me'}
                                        control={<Checkbox
                                            {...formik.getFieldProps('rememberMe')}
                                            checked={formik.values.rememberMe}
                                        />}
                                    />
                                    <Button type={'submit'} variant={'contained'} color={'primary'}>
                                        Login
                                    </Button>
                                </FormGroup>
                            </form>
                        </FormControl>
                    </div>
                </Grid>
            </Grid>
        </div>
    );
}
