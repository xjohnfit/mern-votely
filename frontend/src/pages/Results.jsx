import { useState } from "react"
import ResultElection from "../components/ResultElection";

import "../styles/results.css"

import { elections as dummyElections } from "../data/data";

const Results = () => {

    const [election, setElection] = useState(null)

  return (
    <section className="results">
      <div className="container results__container">
        {
            dummyElections.map((election) => <ResultElection key={election.id} {...election} />)
        }
      </div>
    </section>
  )
}

export default Results
