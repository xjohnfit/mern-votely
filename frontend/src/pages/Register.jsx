import { Link, Navigate, useNavigate } from 'react-router';
import '../styles/register.css';
import { useState } from 'react';
import axios from 'axios'
import { useSelector } from 'react-redux';

const Register = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [error, setError] = useState('');

    const currentVoter = useSelector((state) => state?.vote?.currentVoter);

    if (currentVoter) {
        return <Navigate to='/results' replace />;
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/voters/register`,
                userData,
            );
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'Something went wrong');
        }
    };

    // Function to change controlled input
    const inputHandler = (e) => {
        setUserData((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    return (
        <section className='register'>
            <div className='container register__container'>
                <h2>Register</h2>
                <form onSubmit={submitHandler}>
                    {error && <p className='form__error-message'>{error}</p>}
                    <input
                        onChange={inputHandler}
                        type='text'
                        name='fullName'
                        placeholder='Full Name'
                        autoComplete='true'
                        autoFocus
                    />
                    <input
                        onChange={inputHandler}
                        type='email'
                        name='email'
                        placeholder='Email Address'
                        autoComplete='true'
                    />
                    <input
                        onChange={inputHandler}
                        type='password'
                        name='password'
                        placeholder='Password'
                        autoComplete='true'
                    />
                    <input
                        onChange={inputHandler}
                        type='password'
                        name='confirmPassword'
                        placeholder='Confirm Password'
                        autoComplete='true'
                    />
                    <p>
                        Already have an account? <Link to='/'> Sign In</Link>
                    </p>
                    <button
                        type='submit'
                        className='btn primary'>
                        Register
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Register;
