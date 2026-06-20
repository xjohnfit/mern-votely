import { useState } from "react";
import { candidates as dummyCandidates } from "../data/data";
import CandidateRating from "./CandidateRating";
import { Link } from "react-router";

const ResultElection = ({ id, thumbnail, title }) => {

    const electionCandidates = dummyCandidates.filter(candidate => candidate.electionId === id);
    const [totalVotes, setTotalVotes] = useState(electionCandidates.reduce((sum, candidate) => sum + candidate.voteCount, 0));

  return (
    <article className="result">
        <header className="result__header">
            <h4>{title}</h4>
            <div className="result__header-image">
                <img src={thumbnail} alt={title} />
            </div>
        </header>
            <ul className="result__list">
                {
                    electionCandidates.map(candidate => <CandidateRating key={candidate.id} {...candidate} totalVotes={totalVotes} />)
                }
            </ul>
            <Link to={`/elections/${id}/candidates`} className="btn primary full">Enter Election</Link>
    </article>
  )
}
export default ResultElection
