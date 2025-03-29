import './index.css'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaHome} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <div className="header-container">
      <Link to="/">
        <img
          className="header-logo"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>

      <ul className="navigation-sm-container">
        <Link className="nav-link" to="/">
          <li>
            <FaHome className="sm-icons" />
          </li>
        </Link>
        <Link className="nav-link" to="/jobs">
          <li>
            <BsBriefcaseFill className="sm-icons" />
          </li>
        </Link>
        <li>
          <button
            className="logout-sm-button"
            type="button"
            onClick={onClickLogout}
          >
            <FiLogOut className="sm-icons" />
          </button>
        </li>
      </ul>

      <div className="navigation-lg-container">
        <ul className="header-links-container">
          <Link className="nav-link" to="/">
            <li className="header-name">Home</li>
          </Link>
          <Link className="nav-link" to="/jobs">
            <li className="header-name">Jobs</li>
          </Link>
        </ul>
      </div>

      <button className="logout-button" type="button" onClick={onClickLogout}>
        Logout
      </button>
    </div>
  )
}
export default withRouter(Header)
