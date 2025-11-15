import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>Neusis</h1>
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className={`navbar-link ${isActive('/')}`}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/news" className={`navbar-link ${isActive('/news')}`}>
              News
            </Link>
          </li>
          <li className="navbar-item">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className={`navbar-link ${isActive('/profile')}`}>
                  Profile
                </Link>
                <button onClick={logout} className="navbar-link navbar-logout">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className={`navbar-link ${isActive('/login')}`}>
                Login
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;