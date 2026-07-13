import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdClose, IoMdCloudUpload } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';
import Loader from './Loader';

const UpdateElectionModal = ({ onElectionUpdated }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();

    const electionId = useSelector(
        (state) => state.vote.idOfElectionToUpdate,
    );

    // Load the current election's details to prefill the form
    useEffect(() => {
        const getElection = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/elections/${electionId}`,
                    { withCredentials: true },
                );
                setTitle(response.data.title);
                setDescription(response.data.description);
                setExistingThumbnailUrl(response.data.thumbnail);
                setError(null);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };

        if (electionId) {
            getElection();
        }
    }, [electionId]);

    // Preview a newly selected thumbnail and release the object URL when it changes
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview(null);
            return;
        }
        const url = URL.createObjectURL(thumbnail);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnail]);

    // Close update election modal
    const closeModal = () => {
        dispatch(UiActions.closeUpdateElectionModal());
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            setError('Title and description are required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        try {
            setSubmitting(true);
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/elections/${electionId}`,
                formData,
                { withCredentials: true },
            );
            await onElectionUpdated?.();
            closeModal();
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className='modal'>
            <div className='modal__content'>
                <header className='modal__header'>
                    <h4>Edit Election</h4>
                    <button className='modal__close' onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </header>
                {loading ? (
                    <Loader />
                ) : (
                    <form onSubmit={submitHandler}>
                        {error && <p className='form__error-message'>{error}</p>}
                        <div>
                            <h6>Election Title:</h6>
                            <input
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                type='text'
                                name='title'
                            />
                        </div>
                        <div>
                            <h6>Election Description:</h6>
                            <input
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                type='text'
                                name='description'
                            />
                        </div>
                        <div>
                            <h6>Election Thumbnail:</h6>
                            <label htmlFor='update-election-thumbnail' className='file-upload'>
                                {thumbnailPreview || existingThumbnailUrl ? (
                                    <>
                                        <img
                                            src={thumbnailPreview || existingThumbnailUrl}
                                            alt='Thumbnail preview'
                                            className='file-upload__preview'
                                        />
                                        <span className='file-upload__filename'>
                                            {thumbnail ? thumbnail.name : 'Current thumbnail'}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <IoMdCloudUpload className='file-upload__icon' />
                                        <span className='file-upload__placeholder'>
                                            Click to upload thumbnail
                                        </span>
                                    </>
                                )}
                            </label>
                            <input
                                id='update-election-thumbnail'
                                onChange={(e) => setThumbnail(e.target.files[0])}
                                accept='.png, .jpg, .jpeg, .webp, .avif'
                                type='file'
                                name='thumbnail'
                                className='file-upload__input'
                            />
                        </div>
                        <button
                            type='submit'
                            disabled={submitting}
                            className='btn primary'>
                            {submitting ? 'Updating...' : 'Update Election'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};
export default UpdateElectionModal;
