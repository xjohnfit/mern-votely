import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import { voteActions } from '../store/voteSlice';

const Election = ({ id, title, description, thumbnail }) => {

    const dispatch = useDispatch();

    const isAdmin = useSelector(
        (state) => state?.vote?.currentVoter?.isAdmin,
    );

    // Open update election modal
    const openUpdateModal = () => {
        dispatch(voteActions.changeIdOfElectionToUpdate(id));
        dispatch(UiActions.openUpdateElectionModal());
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
                    <button className="btn primary" onClick={openUpdateModal}>Edit</button>
                )}
            </div>
        </div>
    </article>
  )
}
export default Election
