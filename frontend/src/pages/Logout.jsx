import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { voteActions } from '../store/voteSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                // Clear the httpOnly auth cookie on the server
                await axios.post(`${import.meta.env.VITE_API_URL}/voters/logout`, null, {
                    withCredentials: true,
                });
            } catch (error) {
                console.log(error);
            } finally {
                // Clear client-side voter state either way
                localStorage.removeItem('user');
                dispatch(voteActions.changeCurrentVoter(null));
                navigate('/');
            }
        };

        logout();
    }, []);

    return null;
};

export default Logout;
