import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import '../styles/confirmVoteModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import { voteActions } from '../store/voteSlice';

const ConfirmVoteModal = () => {
    const { id: electionId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Selected candidate and current voter from redux store
    const modalCandidate = useSelector(state => state.vote.selectedVoteCandidate);
    const currentVoter = useSelector(state => state.vote.currentVoter);

    // Close modal
    const closeCandidateModal = () => {
        dispatch(UiActions.closeVoteCandidateModal());
    }

    const confirmVote = async () => {
        try {
            setSubmitting(true);
            setError('');

            await axios.post(
                `${import.meta.env.VITE_API_URL}/votes`,
                { electionId, candidateId: modalCandidate._id },
                {
                    withCredentials: true,
                },
            );

            // Keep client state in sync so hasVoted checks work without a refetch
            const updatedVoter = {
                ...currentVoter,
                votedElections: [...(currentVoter?.votedElections ?? []), electionId],
            };
            dispatch(voteActions.changeCurrentVoter(updatedVoter));
            localStorage.setItem('user', JSON.stringify(updatedVoter));

            closeCandidateModal();
            navigate('/congrats');
        } catch (err) {
            setError(err.response?.data?.message ?? 'Failed to cast vote. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="modal">
            <div className="modal__content confirm__vote-content">
                <h5>Please confirm your vote</h5>
                <div className="confirm__vote-image">

                    <img src={modalCandidate.image} alt={modalCandidate.fullName} />
                </div>

                <h2>{modalCandidate.fullName?.length > 17 ? modalCandidate.fullName.substring(0, 17) + '...' : modalCandidate.fullName}</h2>
                <p>{modalCandidate.motto?.length > 45 ? modalCandidate.motto.substring(0, 45) + '...' : modalCandidate.motto}</p>
                {error && <p className="form__error-message">{error}</p>}
                <div className="confirm__vote-cta">
                    <button className="btn" onClick={closeCandidateModal} disabled={submitting}>Cancel</button>
                    <button className="btn primary" onClick={confirmVote} disabled={submitting}>
                        {submitting ? 'Voting...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </section>
    );
};
export default ConfirmVoteModal;
