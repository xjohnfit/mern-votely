import { useState, useEffect } from 'react';
// import { candidates as dummyCandidates } from "../data/data";
import CandidateRating from './CandidateRating';
import { Link } from 'react-router';
import axios from 'axios';
import Loader from './Loader';

const ResultElection = ({ _id: id, thumbnail, title }) => {
    // const electionCandidates = dummyCandidates.filter(candidate => candidate.electionId === id);


    const [electionCandidates, setElectionCandidates] = useState([]);
    const [loading, setLoading] = useState(false);

    const totalVotes = electionCandidates.reduce(
        (sum, candidate) => sum + candidate.voteCount,
        0,
    );

    const getCandidates = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/elections/${id}/candidates`,
                {
                    withCredentials: true,
                },
            );
            setElectionCandidates(response.data.candidates ?? []);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCandidates();
    }, []);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <article className='result'>
                    <header className='result__header'>
                        <h4>{title}</h4>
                        <div className='result__header-image'>
                            <img
                                src={thumbnail}
                                alt={title}
                            />
                        </div>
                    </header>
                    <ul className='result__list'>
                        {electionCandidates.map((candidate) => (
                            <CandidateRating
                                key={candidate.id}
                                {...candidate}
                                totalVotes={totalVotes}
                            />
                        ))}
                    </ul>
                    <Link
                        to={`/elections/${id}/candidates`}
                        className='btn primary full'>
                        Enter Election
                    </Link>
                </article>
            )}
        </>
    );
};
export default ResultElection;
