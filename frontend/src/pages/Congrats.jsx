import { Link, useNavigate } from "react-router";
import { useEffect } from "react";
import '../styles/congrats.css'

const Congrats = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => navigate('/results'), 3000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <section className="congrats">
        <div className="container congrats__container">
            <h2>Thanks for your vote</h2>
            <p>Your vote is now added to your candidate's vote count. You'll be redirected shortly</p>
            <Link to='/results' className='btn sm primary'>See Results</Link>
        </div>
    </section>
  )
}

export default Congrats
