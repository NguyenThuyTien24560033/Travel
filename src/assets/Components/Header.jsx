import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { User } from "lucide-react";
import { useUser } from '../Layouts/UserLayout.jsx'; 

const Header = () => {
  const { user, logout } = useUser(); 
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Logic Theme (Sáng/Tối)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`main-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="top-content-header">
        <nav className="main-top-header">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/places" className="nav-item">Locations</Link>
          {user && (
            <>
              <Link to="/my-trip" className="nav-item">My Trips</Link>
              <Link to="/history" className="nav-item">History</Link>
            </>
          )}
        </nav>

        <div className="header-right-actions">
          {/* Nút đổi Theme */}
          <button className="theme-toggle-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '🌙' : '☀️'}
          </button>

          <div className="login-container-bt" ref={menuRef}>
            {user ? (
              <div className="user-menu">
                <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                  <User size={26} /> 
                  <span className="user-name">{user.username || user.email}</span>
                </button>
                {menuOpen && (
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <button className="dropdown-item" onClick={() => { logout(); navigate("/"); }}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button className="login-bt" onClick={() => navigate("/role")}>Login</button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;