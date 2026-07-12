import { Link, useParams } from 'react-router';
import Candidate from '../components/Candidate';
import '../styles/candidates.css';
import ConfirmVoteModal from '../components/ConfirmVoteModal.jsx';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';

const Candidates = () => {
    const { id: electionId } = useParams();
    const [candidates, setCandidates] = useState([]);
    const voteCandidateModalShowing = useSelector(
        (state) => state.ui.voteCandidateModalShowing,
    );
    const votedElections = useSelector((state) => state?.vote?.currentVoter?.votedElections);

    const [loading, setLoading] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    // Get candidates that belong to a specific election
    const getCandidates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/elections/${electionId}/candidates`,
                {
                    withCredentials: true,
                },
            );
            setCandidates(response.data.candidates ?? []);
            setHasVoted(response.data.hasVoted ?? false);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCandidates();
    }, [electionId]);

    if (loading) {
        return <Loader />;
    }

    // Server-side flag is the source of truth; redux covers the case where
    // the voter just cast a vote and navigates back before a refetch
    if (hasVoted || votedElections?.includes(electionId)) {
        return (
            <section className='candidates'>
                <header className='candidates__header'>
                    <h1>You already voted in this election</h1>
                    <p>
                        Each voter can only vote once per election. Check out
                        the results to see how your candidate is doing.
                    </p>
                    <Link to='/results' className='btn primary'>
                        See results
                    </Link>
                </header>
            </section>
        );
    }

    return (
        <>
            <section className='candidates'>
                {candidates.length > 0 ? (
                    <header className='candidates__header'>
                        <h1>Vote your candidate</h1>
                        <p>
                            These are the candidates for the
                            selected election. Please vote wisely,
                            you won't be allowed to vote in this
                            election again.
                        </p>
                    </header>
                ) : (
                    <header className='candidates__header'>
                        <h1>No candidates found</h1>
                        <p>
                            Election has no candidates yet.
                        </p>
                    </header>
                )}
                <div className='container candidates__container'>
                    {candidates.map((candidate) => (
                        <Candidate
                            key={candidate._id}
                            {...candidate}
                        />
                    ))}
                </div>
            </section>
            {voteCandidateModalShowing && <ConfirmVoteModal />}
        </>
    );
};

export default Candidates;
