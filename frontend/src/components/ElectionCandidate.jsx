import { IoMdTrash, IoMdCreate } from "react-icons/io";
import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { UiActions } from "../store/uiSlice";
import { voteActions } from "../store/voteSlice";

const ElectionCandidate = ({ _id, fullName, image, motto, onCandidateDeleted }) => {
    const [deleting, setDeleting] = useState(false);

    const dispatch = useDispatch();

    const isAdmin = useSelector(
        (state) => state?.vote?.currentVoter?.isAdmin,
    );

    const openEditModal = () => {
        dispatch(voteActions.changeCandidateToUpdate({ _id, fullName, image, motto }));
        dispatch(UiActions.openUpdateCandidateModal());
    };

    const deleteCandidate = async () => {
        if (!window.confirm(`Delete candidate "${fullName}"? This cannot be undone.`)) {
            return;
        }

        try {
            setDeleting(true);
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/candidates/${_id}`,
                { withCredentials: true },
            );
            await onCandidateDeleted?.();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    };

    return (
    <li className="electionCandidate">
        <div className="electionCandidate__image">
            <img src={image} alt={fullName} />
        </div>
        <div>
            <h5>{fullName}</h5>
            <small>{motto?.length > 70 ? motto.substring(0, 70) + '...' : motto}</small>
            {isAdmin && (
                <div className="electionCandidate__actions">
                    <button
                        className="electionCandidate__btn electionCandidate__btn--edit"
                        onClick={openEditModal}>
                        <IoMdCreate />
                    </button>
                    <button
                        className="electionCandidate__btn"
                        onClick={deleteCandidate}
                        disabled={deleting}>
                        <IoMdTrash />
                    </button>
                </div>
            )}
        </div>
    </li>
  )
}
export default ElectionCandidate
