import { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdClose, IoMdCloudUpload } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const AddElectionModal = ({ onElectionCreated }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Preview the selected thumbnail and release the object URL when it changes
    useEffect(() => {
        if (!thumbnail) {
            setThumbnailPreview(null);
            return;
        }
        const url = URL.createObjectURL(thumbnail);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnail]);

    const dispatch = useDispatch();

    // Close add election modal
    const closeModal = () => {
        dispatch(UiActions.closeElectionModal());
    }

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!title || !description || !thumbnail) {
            setError('Title, description, and thumbnail are required');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('thumbnail', thumbnail);

        try {
            setSubmitting(true);
            await axios.post(
                `${import.meta.env.VITE_API_URL}/elections`,
                formData,
                { withCredentials: true },
            );
            await onElectionCreated?.();
            dispatch(UiActions.closeElectionModal());
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
                    <h4>Create New Election</h4>
                    <button className='modal__close' onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </header>
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
                        <label htmlFor='election-thumbnail' className='file-upload'>
                            {thumbnailPreview ? (
                                <>
                                    <img
                                        src={thumbnailPreview}
                                        alt='Thumbnail preview'
                                        className='file-upload__preview'
                                    />
                                    <span className='file-upload__filename'>
                                        {thumbnail.name}
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
                            id='election-thumbnail'
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
                        {submitting ? 'Creating...' : 'Add Election'}
                    </button>
                </form>
            </div>
        </section>
    );
};
export default AddElectionModal;
