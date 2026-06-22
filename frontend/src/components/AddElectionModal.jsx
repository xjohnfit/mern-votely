import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useDispatch } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const AddElectionModal = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [thumbnail, setThumbnail] = useState('');

    const dispatch = useDispatch();

    // Close add election modal
    const closeModal = () => {
        dispatch(UiActions.closeElectionModal());
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
                <form>
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
                        <input
                            onChange={(e) => setThumbnail(e.target.files[0])}
                            accept='png, jpg, jpeg, webp, avif'
                            value={thumbnail}
                            type='file'
                            name='thumbnail'
                        />
                    </div>
                    <button
                        type='submit'
                        className='btn primary'>
                        Add Election
                    </button>
                </form>
            </div>
        </section>
    );
};
export default AddElectionModal;
