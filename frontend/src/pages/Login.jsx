import { Link, Navigate } from 'react-router';
import '../styles/register.css';
import { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { voteActions } from '../store/voteSlice';

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const currentVoter = useSelector((state) => state?.vote?.currentVoter);

    if (currentVoter) {
        return <Navigate to='/results' replace />;
    }

    // Function to change controlled input
    const inputHandler = (e) => {
        setUserData((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/voters/login`, userData, {
                withCredentials: true,
            });
            const currentUser = response.data.voter;

            // Save the user to local storage
            localStorage.setItem('user', JSON.stringify(currentUser));

            // Dispatch the action to change the current voter
            dispatch(voteActions.changeCurrentVoter(currentUser));

            // Navigate to the home page
            navigate('/results');

        } catch (error) {

            setError(error.response.data.message);
        }
    };

    return (
        <section className='register'>
            <div className='container register__container'>
                <h2>Login</h2>
                <form onSubmit={submitHandler}>
                    {error && <p className='form__error-message'>
                        {error}
                    </p>}
                    <input
                        onChange={inputHandler}
                        type='email'
                        name='email'
                        placeholder='Email Address'
                        autoComplete='true'
                        autoFocus
                    />
                    <input
                        onChange={inputHandler}
                        type='password'
                        name='password'
                        placeholder='Password'
                        autoComplete='true'
                    />
                    <p>
                        Don't have an account?{' '}
                        <Link to='/register'>Register Now</Link>
                    </p>
                    <button
                        type='submit'
                        className='btn primary'>
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
