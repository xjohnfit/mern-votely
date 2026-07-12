import { useDispatch } from "react-redux";
import { UiActions } from "../store/uiSlice";
import { voteActions } from "../store/voteSlice";

const Candidate = ({ image, _id, fullName, motto }) => {

    const dispatch = useDispatch();

    const openCandidateModal = () => {
        dispatch(UiActions.openVoteCandidateModal());
        dispatch(voteActions.changeSelectedVoteCandidate({ _id, image, fullName, motto }))
    }

  return (
    <article className="candidate">
        <div className="candidate__image">
            <img src={image} alt={fullName} />
        </div>
        <h5>{fullName?.length > 20 ? fullName.substring(0, 20) + '...' : fullName}</h5>
        <small>{motto?.length > 25 ? motto.substring(0, 25) + '...' : motto}</small>
        <button className="btn primary" onClick={openCandidateModal}>Vote</button>
    </article>
  )
}
export default Candidate
