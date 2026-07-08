import { useState, useEffect } from "react"
import ResultElection from "../components/ResultElection";
import axios from "axios";
import "../styles/results.css"
import { useSelector } from "react-redux";

// import { elections as dummyElections } from "../data/data";

const Results = () => {

    const [elections, setElections] = useState([]);
    const [error, setError] = useState(null);

    const token = useSelector((state) => state.vote.currentVoter.token);

    const getElections = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/all-elections`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const elections = response.data;
            setElections(elections);
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            console.log(error);
        }
    }

    useEffect(() => {
        getElections();
    }, []);

  return (
    <section className="results">
      <div className="container results__container">
        {
            error ? <p className="results__error">{error}</p> :
            elections.map((election) => <ResultElection key={election._id} {...election} />)
        }
      </div>
    </section>
  )
}

export default Results
