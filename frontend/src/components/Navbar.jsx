import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">📚</span>
          <span className="brand-name">SkillStack</span>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className={isActive('/')}>
              🏠 Dashboard
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/skills" className={isActive('/skills')}>
              📖 My Skills
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/timeline" className={isActive('/timeline')}>
              📅 Timeline
            </Link>
          </li>
        </ul>

        <Link to="/add-skill" className="btn btn-primary add-skill-btn">
          ➕ Add Skill
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;