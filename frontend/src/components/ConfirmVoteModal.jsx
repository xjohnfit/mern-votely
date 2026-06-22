import { useState, useEffect } from 'react';
import { candidates } from '../data/data';
import '../styles/confirmVoteModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const ConfirmVoteModal = () => {

    const [modalCandidate, setModalCandidate] = useState({});

    const dispatch = useDispatch();

    // Get selected candidate id from redux store
    const selectedVoteCandidate = useSelector(state => state.vote.selectedVoteCandidate);

    // Close modal
    const closeCandidateModal = () => {
        dispatch(UiActions.closeVoteCandidateModal());
    }

    const fetchCandidate = () => {
        candidates.find(candidate => {
            if (candidate.id === selectedVoteCandidate) {
                setModalCandidate(candidate);
            }
        });
    };

    useEffect(() => {
        fetchCandidate();
    }, []);

    return (
        <section className="modal">
            <div className="modal__content confirm__vote-content">
                <h5>Please confirm your vote</h5>
                <div className="confirm__vote-image">

                    <img src={modalCandidate.image} alt={modalCandidate.fullName} />
                </div>

                <h2>{modalCandidate.fullName?.length > 17 ? modalCandidate.fullName.substring(0, 17) + '...' : modalCandidate.fullName}</h2>
                <p>{modalCandidate.motto?.length > 45 ? modalCandidate.motto.substring(0, 45) + '...' : modalCandidate.motto}</p>
                <div className="confirm__vote-cta">
                    <button className="btn" onClick={closeCandidateModal}>Cancel</button>
                    <button className="btn primary">Confirm</button>
                </div>
            </div>
        </section>
    );
};
export default ConfirmVoteModal;
