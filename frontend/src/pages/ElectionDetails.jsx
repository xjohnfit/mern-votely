import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoAddOutline } from 'react-icons/io5';
import ElectionCandidate from '../components/ElectionCandidate';
import Loader from '../components/Loader';
import '../styles/electionDetails.css';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import { useParams } from 'react-router';
import AddCandidateModal from '../components/AddCandidateModal';

const ElectionDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const [election, setElection] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAdmin = useSelector(
        (state) => state?.vote?.currentVoter?.isAdmin,
    );

    const addCandidateModalShowing = useSelector(
        (state) => state.ui.addCandidateModalShowing,
    );

    // Get election, its candidates, and its voters
    const getElectionDetails = async () => {
        try {
            setLoading(true);
            const [electionRes, candidatesRes, votersRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/elections/${id}`, {
                    withCredentials: true,
                }),
                axios.get(
                    `${import.meta.env.VITE_API_URL}/elections/${id}/candidates`,
                    { withCredentials: true },
                ),
                axios.get(
                    `${import.meta.env.VITE_API_URL}/elections/${id}/voters`,
                    { withCredentials: true },
                ),
            ]);
            setElection(electionRes.data);
            setCandidates(candidatesRes.data.candidates ?? []);
            setVoters(votersRes.data.voters ?? []);
            setError(null);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getElectionDetails();
    }, [id]);

    // Open modal to add candidate
    const openModal = () => {
        dispatch(UiActions.openAddCandidateModal());
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <section className='electionDetails'>{error}</section>;
    }

    if (!election) {
        return <section className='electionDetails'>Election not found.</section>;
    }

    return (
        <>
            <section className='electionDetails'>
                <div className='container electionDetails__container'>
                    <h2>{election.title}</h2>
                    <p>{election.description}</p>
                    <div className='electionDetails__image'>
                        <img
                            src={election.thumbnail}
                            alt={election.title}
                        />
                    </div>

                    <menu className='electionDetails__candidates'>
                        {candidates.map((candidate) => (
                            <ElectionCandidate
                                key={candidate._id}
                                {...candidate}
                            />
                        ))}
                        {isAdmin && (
                            <button className='add__candidate-btn' onClick={openModal}>
                                <IoAddOutline />
                            </button>
                        )}
                    </menu>

                    <article className='voters'>
                        <h2>Voters</h2>
                        <table className='voters__table'>
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {voters.map((voter) => (
                                    <tr key={voter._id}>
                                        <td>
                                            <h5>{voter.fullName}</h5>
                                        </td>
                                        <td>{voter.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                </div>
            </section>
            {addCandidateModalShowing && (
                <AddCandidateModal
                    electionId={id}
                    onCandidateAdded={getElectionDetails}
                />
            )}
        </>
    );
};

export default ElectionDetails;
