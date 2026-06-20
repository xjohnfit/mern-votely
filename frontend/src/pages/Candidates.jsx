import { useParams } from 'react-router';
import { candidates as dummyCandidates } from '../data/data.js';
import Candidate from '../components/Candidate';
import '../styles/candidates.css';
import ConfirmVoteModal from '../components/ConfirmVoteModal.jsx';
import { useSelector } from 'react-redux';

const Candidates = () => {

    const { id } = useParams();

    const voteCandidateModalShowing = useSelector(state => state.ui.voteCandidateModalShowing);

    // Get candidates that belong a specific election
    const candidates = dummyCandidates.filter(candidate => candidate.electionId === Number(id));

    return (
        <>
            <section className="candidates">
                <header className="candidates__header">
                    <h1>Vote your candidate</h1>
                    <p>This are the candidates for the selected election. Please vote wisely, you won't be allowed to vote in this election again.</p>
                </header>
                <div className="container candidates__container">
                    {
                        candidates.map(candidate => <Candidate key={candidate.id} {...candidate} />)
                    }
                </div>
            </section>
            <ConfirmVoteModal />
        </>
    );
};

export default Candidates;
