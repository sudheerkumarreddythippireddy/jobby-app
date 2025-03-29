import './index.css'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch, BsStarFill, BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import Header from '../Header'

const employmentTypesList = [
  {label: 'Full Time', employmentTypeId: 'FULLTIME'},
  {label: 'Part Time', employmentTypeId: 'PARTTIME'},
  {label: 'Freelance', employmentTypeId: 'FREELANCE'},
  {label: 'Internship', employmentTypeId: 'INTERNSHIP'},
]

const salaryRangesList = [
  {salaryRangeId: '1000000', label: '10 LPA and above'},
  {salaryRangeId: '2000000', label: '20 LPA and above'},
  {salaryRangeId: '3000000', label: '30 LPA and above'},
  {salaryRangeId: '4000000', label: '40 LPA and above'},
]

const locationsList = [
  {locationId: 'DELHI', label: 'Delhi'},
  {locationId: 'HYDERABAD', label: 'Hyderabad'},
  {locationId: 'CHENNAI', label: 'Chennai'},
  {locationId: 'MUMBAI', label: 'Mumbai'},
  {locationId: 'BANGLORE', label: 'Banglore'},
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    searchInput: '',
    selectedEmploymentTypes: [],
    selectedSalaryRange: '',
    selectedLocations: [],
    isLoading: true,
    isRetry: false,
    isJobsFailure: false,
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {
      searchInput,
      selectedEmploymentTypes,
      selectedSalaryRange,
      selectedLocations,
    } = this.state
    const employmentFilter = selectedEmploymentTypes.join(',')
    console.log(employmentFilter)
    const locationFilter = selectedLocations.join(',')
    console.log(locationFilter)

    const url = `https://apis.ccbp.in/jobs?search=${searchInput}&employment_type=${employmentFilter}&minimum_package=${selectedSalaryRange}&location=${locationFilter}`
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }

    try {
      const response = await fetch(url, options)
      console.log(response)
      if (response.ok) {
        const data = await response.json()
        const formattedJobs = data.jobs.map(job => ({
          id: job.id,
          companyLogoUrl: job.company_logo_url,
          employmentType: job.employment_type,
          jobDescription: job.job_description,
          location: job.location,
          packagePerAnnum: job.package_per_annum,
          rating: job.rating,
          title: job.title,
        }))
        this.setState({
          jobsList: formattedJobs,
          isLoading: false,
          isJobsFailure: false,
        })
      } else {
        this.setState({isJobsFailure: true, isLoading: false})
      }
    } catch (error) {
      this.setState({isJobsFailure: true, isLoading: false})
    }
  }

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {Authorization: `Bearer ${jwtToken}`},
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const formattedProfileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({profileDetails: formattedProfileDetails, isRetry: false})
    } else {
      this.setState({isRetry: true})
    }
  }

  onSearchChange = event => {
    this.setState({searchInput: event.target.value})
  }

  onSearchClick = () => {
    this.getJobsDetails()
  }

  onEmploymentTypeChange = event => {
    const {value, checked} = event.target
    if (checked) {
      this.setState(
        prevState => ({
          selectedEmploymentTypes: [
            ...prevState.selectedEmploymentTypes,
            value,
          ],
        }),
        this.getJobsDetails,
      )
    } else {
      this.setState(
        prevState => ({
          selectedEmploymentTypes: prevState.selectedEmploymentTypes.filter(
            type => type !== value,
          ),
        }),
        this.getJobsDetails,
      )
    }
  }

  onLocationChange = event => {
    const {value, checked} = event.target
    if (checked) {
      this.setState(
        prevState => ({
          selectedLocations: [...prevState.selectedLocations, value],
        }),
        this.getJobsDetails,
      )
    } else {
      this.setState(
        prevState => ({
          selectedLocations: prevState.selectedLocations.filter(
            type => type !== value,
          ),
        }),
        this.getJobsDetails,
      )
    }
  }

  onSalaryChange = event => {
    this.setState(
      {selectedSalaryRange: event.target.value},
      this.getJobsDetails,
    )
  }

  onRetryFetch = () => this.getProfileDetails()

  renderProfileFailureButton = () => (
    <div className="retry-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onRetryFetch}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-text">
        We could not find any jobs. Try other filters
      </p>
    </div>
  )

  renderFailureJobsView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobListings = () => {
    const {isLoading, isJobsFailure, jobsList} = this.state

    if (isLoading) {
      return (
        <div className="loader-container" data-testid="loader">
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </div>
      )
    }

    if (isJobsFailure) {
      return this.renderFailureJobsView()
    }

    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="job-card-list">
        {jobsList.map(job => (
          <Link key={job.id} to={`/jobs/${job.id}`} className="job-card-link">
            <li className="job-card" key={job.id}>
              <div className="logo-container">
                <img
                  className="job-logo"
                  src={job.companyLogoUrl}
                  alt="company logo"
                />
                <div className="name-container">
                  <h1 className="job-company-name">{job.title}</h1>
                  <div className="rating-container">
                    <BsStarFill className="star-icon" />
                    <p className="job-rating">{job.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-container">
                <div className="icons-container">
                  <div className="job-location-container">
                    <MdLocationOn className="icon" />
                    <p className="job-location">{job.location}</p>
                  </div>
                  <div className="job-internship-container">
                    <BsFillBriefcaseFill className="icon" />
                    <p className="job-internship">{job.employmentType}</p>
                  </div>
                </div>
                <p className="job-package">{job.packagePerAnnum}</p>
              </div>
              <hr />
              <h3 className="job-description-title">Description</h3>
              <p className="job-description">{job.jobDescription}</p>
            </li>
          </Link>
        ))}
      </ul>
    )
  }

  render() {
    const {profileDetails, searchInput, isRetry} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="jobs-container">
        <Header />
        <div className="jobs-content">
          {/* 🔍 Search Bar */}
          <div className="jobs-sm-input-container">
            <div className="jobs-input-container">
              <input
                className="jobs-input"
                type="search"
                value={searchInput}
                onChange={this.onSearchChange}
                placeholder="Search"
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-icon-container"
                onClick={this.onSearchClick}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
          </div>

          <div className="filters-container">
            {isRetry || !profileImageUrl ? (
              this.renderProfileFailureButton()
            ) : (
              <div className="profile-card">
                {profileImageUrl && (
                  <img
                    className="profile-image"
                    src={profileImageUrl}
                    alt="profile"
                  />
                )}
                <h2 className="profile-name">{name}</h2>
                <p className="profile-description">{shortBio}</p>
              </div>
            )}
            <hr />

            <div className="type-container">
              <h1 className="type-heading">Type of Employment</h1>
              <ul className="type-list">
                {employmentTypesList.map(type => (
                  <li key={type.employmentTypeId} className="type-item">
                    <input
                      id={type.employmentTypeId}
                      type="checkbox"
                      value={type.employmentTypeId}
                      onChange={this.onEmploymentTypeChange}
                    />
                    <label htmlFor={type.employmentTypeId}>{type.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />

            {/* Salary Range Filters */}
            <div className="salary-container">
              <h1 className="type-heading">Salary Range</h1>
              <ul className="type-list">
                {salaryRangesList.map(salary => (
                  <li key={salary.salaryRangeId} className="type-item">
                    <input
                      id={salary.salaryRangeId}
                      type="radio"
                      name="salary"
                      value={salary.salaryRangeId}
                      onChange={this.onSalaryChange}
                    />
                    <label htmlFor={salary.salaryRangeId}>{salary.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            {/* Location Filters */}
            <div className="locations-container">
              <h1 className="location-heading">Locations</h1>
              <ul className="location-list">
                {locationsList.map(location => (
                  <li key={location.locationId} className="location-item">
                    <input
                      type="checkbox"
                      value={location.locationId}
                      id={location.locationId}
                      onChange={this.onLocationChange}
                    />
                    <label htmlFor={location.locationId}>
                      {location.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="jobs-list-container">
            <div className="jobs-lg-container">
              <div className="jobs-input-container">
                <input
                  className="jobs-input"
                  type="search"
                  value={searchInput}
                  onChange={this.onSearchChange}
                  placeholder="Search"
                />
                <button
                  data-testid="searchButton"
                  type="button"
                  className="search-icon-container"
                  onClick={this.onSearchClick}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
            </div>
            {this.renderJobListings()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
