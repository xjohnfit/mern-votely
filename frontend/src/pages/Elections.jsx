import { useEffect, useState } from 'react';
import axios from 'axios';
import Election from '../components/Election';
import Loader from '../components/Loader';
import '../styles/elections.css';
import AddElectionModal from '../components/AddElectionModal';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import UpdateElectionModal from '../components/UpdateElectionModal';

const Elections = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();

    // Get all elections
    const getElections = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/all-elections`,
                { withCredentials: true },
            );
            setElections(response.data);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getElections();
    }, []);

    // Open modal election modal
    const openModal = () => {
        dispatch(UiActions.openElectionModal());
    };

    const electionModalShowing = useSelector(
        (state) => state.ui.electionModalShowing,
    );

    const updateElectionModalShowing = useSelector(
        (state) => state.ui.updateElectionModalShowing,
    );

    const isAdmin = useSelector(
        (state) => state?.vote?.currentVoter?.isAdmin,
    );

    return (
        <>
            <section className='elections'>
                <div className='container elections__container'>
                    <header className='elections__header'>
                        <h1>Ongoing Elections</h1>
                        {isAdmin && (
                            <button
                                className='btn primary'
                                onClick={openModal}>
                                Create New Election
                            </button>
                        )}
                    </header>
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <p className='elections__error'>{error}</p>
                    ) : (
                        <menu className='elections__menu'>
                            {elections.map((election) => (
                                <Election
                                    key={election._id}
                                    id={election._id}
                                    {...election}
                                    onElectionDeleted={getElections}
                                />
                            ))}
                        </menu>
                    )}
                </div>
            </section>

            {electionModalShowing && (
                <AddElectionModal onElectionCreated={getElections} />
            )}
            {updateElectionModalShowing && (
                <UpdateElectionModal onElectionUpdated={getElections} />
            )}
        </>
    );
};

export default Elections;
