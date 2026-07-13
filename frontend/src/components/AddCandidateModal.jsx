import { IoMdClose, IoMdCloudUpload } from 'react-icons/io';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const AddCandidateModal = ({ electionId, onCandidateAdded }) => {

    const [fullName, setFullName] = useState('');
    const [motto, setMotto] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();

    // Preview the selected image and release the object URL when it changes
    useEffect(() => {
        if (!image) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(image);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [image]);

    const closeModal = () => {
        dispatch(UiActions.closeAddCandidateModal());
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!fullName || !motto || !image) {
            setError('Full name, motto, and thumbnail are required');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('motto', motto);
        formData.append('image', image);
        formData.append('electionId', electionId);

        try {
            setSubmitting(true);
            await axios.post(
                `${import.meta.env.VITE_API_URL}/candidates`,
                formData,
                { withCredentials: true },
            );
            await onCandidateAdded?.();
            dispatch(UiActions.closeAddCandidateModal());
        } catch (error) {
            setError(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className='modal'>
            <div className='modal__content'>
                <header className='modal__header'>
                    <h4>Add Candidate</h4>
                    <button
                        className='modal__close'
                        onClick={closeModal}>
                        <IoMdClose />
                    </button>
                </header>
                <form onSubmit={submitHandler}>
                    {error && <p className='form__error-message'>{error}</p>}
                    <div>
                        <h6>Full Name</h6>
                        <input
                            type='text'
                            name='fullName'
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <h6>Motto</h6>
                        <input
                            type='text'
                            name='motto'
                            value={motto}
                            onChange={(e) => setMotto(e.target.value)}
                        />
                    </div>
                    <div>
                        <h6>Thumbnail</h6>
                        <label htmlFor='candidate-image' className='file-upload'>
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
                                        alt='Candidate thumbnail preview'
                                        className='file-upload__preview'
                                    />
                                    <span className='file-upload__filename'>
                                        {image.name}
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
                            id='candidate-image'
                            type='file'
                            name='image'
                            onChange={(e) => setImage(e.target.files[0])}
                            accept='.png, .jpg, .jpeg, .webp, .avif'
                            className='file-upload__input'
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={submitting}
                        className='btn primary'>
                        {submitting ? 'Adding...' : 'Add Candidate'}
                    </button>
                </form>
            </div>
        </section>
    );
};
export default AddCandidateModal;
