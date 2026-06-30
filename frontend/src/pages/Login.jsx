import { Link } from 'react-router';
import '../styles/register.css';
import { useState } from 'react';

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    // Function to change controlled input
    const inputHandler = (e) => {
        setUserData((prevState) => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    return (
        <section className='register'>
            <div className='container register__container'>
                <h2>Login</h2>
                <form>
                    <p className='form__error-message'>
                        Error from the backend
                    </p>
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
