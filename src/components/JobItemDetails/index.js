import {Component} from 'react'
import {
  BsStarFill,
  BsFillBriefcaseFill,
  BsBoxArrowUpRight,
} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Cookies from 'js-cookie'
import './index.css'
import Loader from 'react-loader-spinner'
import Header from '../Header'

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    isLoading: true,
    isError: false,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  formatJobDetails = jobDetails => ({
    companyLogoUrl: jobDetails.company_logo_url,
    companyWebsiteUrl: jobDetails.company_website_url,
    employmentType: jobDetails.employment_type,
    id: jobDetails.id,
    jobDescription: jobDetails.job_description,
    location: jobDetails.location,
    packagePerAnnum: jobDetails.package_per_annum,
    rating: jobDetails.rating,
    title: jobDetails.title,
    skills: jobDetails.skills.map(skill => ({
      imageUrl: skill.image_url,
      name: skill.name,
    })),
    lifeAtCompany: {
      description: jobDetails.life_at_company.description,
      imageUrl: jobDetails.life_at_company.image_url,
    },
  })

  formatSimilarJobs = similarJobs =>
    similarJobs.map(job => ({
      id: job.id,
      companyLogoUrl: job.company_logo_url,
      employmentType: job.employment_type,
      jobDescription: job.job_description,
      location: job.location,
      rating: job.rating,
      title: job.title,
    }))

  getJobDetails = async () => {
    const {match} = this.props
    const {id} = match.params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      console.log(data)
      this.setState({
        jobDetails: this.formatJobDetails(data.job_details),
        similarJobs: this.formatSimilarJobs(data.similar_jobs),
        isLoading: false,
        isError: false,
      })
    } else {
      this.setState({isLoading: false, isError: true})
    }
  }

  retryFetching = () => {
    this.setState({isLoading: true, isError: false}, this.getJobDetails)
  }

  renderErrorView = () => (
    <div className="error-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={this.retryFetching}>
        Retry
      </button>
    </div>
  )

  render() {
    const {jobDetails, similarJobs, isLoading, isError} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      skills,
      lifeAtCompany,
      title,
    } = jobDetails

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (isError) {
      return this.renderErrorView()
    }

    return (
      <div className="job-details-container">
        <Header />
        <div className="job-details-content">
          <div className="job-details-card">
            <div className="logo-container">
              <img
                className="job-logo"
                src={companyLogoUrl}
                alt="job details company logo"
              />
              <div className="name-container">
                <h1 className="job-title">{title}</h1>
                <div className="rating-container">
                  <BsStarFill className="star-icon" />
                  <p className="job-rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-container">
              <div className="icons-container">
                <div className="job-location-container">
                  <MdLocationOn className="icon" />
                  <p className="job-location">{location}</p>
                </div>
                <div className="job-internship-container">
                  <BsFillBriefcaseFill className="icon" />
                  <p className="job-internship">{employmentType}</p>
                </div>
              </div>
              <p className="job-package">{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="link-container">
              <h3 className="job-description-title">Description</h3>
              <div className="visit-container">
                <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                  Visit
                </a>
                <BsBoxArrowUpRight className="arrow-icon" />
              </div>
            </div>
            <p className="job-description">{jobDescription}</p>
            <div className="skills-container">
              <h1 className="skills-heading">Skills</h1>
              <ul className="skills-list">
                {skills.map(skill => (
                  <li key={skill.name} className="skill-item">
                    <img
                      src={skill.imageUrl}
                      alt={skill.name}
                      className="skill-icon"
                    />
                    <p className="skill-name">{skill.name}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="life-at-company">
              <div>
                <h1>Life at Company</h1>
                <p>{lifeAtCompany?.description}</p>
              </div>
              <img
                src={lifeAtCompany?.imageUrl}
                alt="life at company"
                className="company-life-image"
              />
            </div>
          </div>

          {/* 🔹 Similar Jobs Section */}
          <div className="similar-jobs-container">
            <h3 className="similar-heading">Similar Jobs</h3>
            <ul className="similar-jobs-list">
              {similarJobs.map(job => (
                <li key={job.id} className="similar-job-card">
                  <div className="similar-logo-container">
                    <img
                      src={job.companyLogoUrl}
                      alt="similar job company logo"
                      className="similar-job-logo"
                    />
                    <div className="similar-name-container">
                      <h4>{job.title}</h4>
                      <div className="rating-container">
                        <BsStarFill className="star-icon" />
                        <p>{job.rating}</p>
                      </div>
                    </div>
                  </div>
                  <h3>Description</h3>
                  <p>{job.jobDescription}</p>
                  <div className="job-meta">
                    <div className="job-location">
                      <MdLocationOn className="icon" />
                      <p>{job.location}</p>
                    </div>
                    <div className="job-type">
                      <BsFillBriefcaseFill className="icon" />
                      <p>{job.employmentType}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default JobItemDetails
