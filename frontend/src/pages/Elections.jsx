import { useState } from 'react';
import { elections as dummyElections } from '../data/data';
import Election from '../components/Election';
import '../styles/elections.css';
import AddElectionModal from '../components/AddElectionModal';
import { useDispatch, useSelector } from 'react-redux';
import { UiActions } from '../store/uiSlice';

const Elections = () => {
    const [elections, setElections] = useState(dummyElections);

    const dispatch = useDispatch();

    // Open modal election modal
    const openModal = () => {
        dispatch(UiActions.openElectionModal());
    };

    const electionModalShowing = useSelector(
        (state) => state.ui.electionModalShowing,
    );

    return (
        <>
            <section className='elections'>
                <div className='container elections__container'>
                    <header className='elections__header'>
                        <h1>Ongoing Elections</h1>
                        <button
                            className='btn primary'
                            onClick={openModal}>
                            Create New Election
                        </button>
                    </header>
                    <menu className='elections__menu'>
                        {elections.map((election) => (
                            <Election
                                key={election.id}
                                {...election}
                            />
                        ))}
                    </menu>
                </div>
            </section>

            {electionModalShowing && <AddElectionModal />}
        </>
    );
};

export default Elections;
