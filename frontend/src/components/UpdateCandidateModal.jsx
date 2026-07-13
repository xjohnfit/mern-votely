import { IoMdClose, IoMdCloudUpload } from 'react-icons/io';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const UpdateCandidateModal = ({ onCandidateUpdated }) => {

    const candidate = useSelector((state) => state.vote.candidateToUpdate);

    const [fullName, setFullName] = useState(candidate?.fullName ?? '');
    const [motto, setMotto] = useState(candidate?.motto ?? '');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const dispatch = useDispatch();

    // Preview a newly selected image and release the object URL when it changes
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
        dispatch(UiActions.closeUpdateCandidateModal());
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!fullName || !motto) {
            setError('Full name and motto are required');
            return;
        }

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('motto', motto);
        if (image) {
            formData.append('image', image);
        }

        try {
            setSubmitting(true);
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/candidates/${candidate._id}`,
                formData,
                { withCredentials: true },
            );
            await onCandidateUpdated?.();
            closeModal();
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
                    <h4>Edit Candidate</h4>
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
                        <label htmlFor='update-candidate-image' className='file-upload'>
                            {imagePreview || candidate?.image ? (
                                <>
                                    <img
                                        src={imagePreview || candidate.image}
                                        alt='Candidate thumbnail preview'
                                        className='file-upload__preview'
                                    />
                                    <span className='file-upload__filename'>
                                        {image ? image.name : 'Current thumbnail'}
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
                            id='update-candidate-image'
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
                        {submitting ? 'Updating...' : 'Update Candidate'}
                    </button>
                </form>
            </div>
        </section>
    );
};
export default UpdateCandidateModal;
