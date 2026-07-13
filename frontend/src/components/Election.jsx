import { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import { voteActions } from '../store/voteSlice';

const Election = ({ id, title, description, thumbnail, onElectionDeleted }) => {

    const [deleting, setDeleting] = useState(false);

    const dispatch = useDispatch();

    const isAdmin = useSelector(
        (state) => state?.vote?.currentVoter?.isAdmin,
    );

    // Open update election modal
    const openUpdateModal = () => {
        dispatch(voteActions.changeIdOfElectionToUpdate(id));
        dispatch(UiActions.openUpdateElectionModal());
    }

    const deleteElection = async () => {
        if (!window.confirm(`Delete election "${title}"? This will also remove its candidates and cannot be undone.`)) {
            return;
        }

        try {
            setDeleting(true);
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/elections/${id}`,
                { withCredentials: true },
            );
            await onElectionDeleted?.();
        } catch (error) {
            console.error(error);
        } finally {
            setDeleting(false);
        }
    }

  return (
    <article className="election">
        <div className="election__image">
            <img src={thumbnail} alt={title} />
        </div>
        <div className="election__info">
            <Link to={`/elections/${id}/`}><h4>{title}</h4></Link>
            <p>{description?.length > 255 ? description.substring(0, 255) + '...' : description}</p>
            <div className="election__cta">
                <Link to={`/elections/${id}`} className='btn'>View</Link>
                {isAdmin && (
                    <>
                        <button className="btn primary" onClick={openUpdateModal}>Edit</button>
                        <button className="btn danger" onClick={deleteElection} disabled={deleting}>
                            {deleting ? 'Deleting...' : 'Delete'}
                        </button>
                    </>
                )}
            </div>
        </div>
    </article>
  )
}
export default Election
