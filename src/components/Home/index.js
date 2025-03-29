import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Header from '../Header'

const Home = () => (
  <div className="home-container">
    <Header />
    <div className="home-content">
      <h1 className="heading">Find The Job That Fits Your Life</h1>
      <p className="home-description">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button className="find-jobs-button" type="button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)
export default Home
