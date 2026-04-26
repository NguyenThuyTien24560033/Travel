import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { User } from "lucide-react";
import {useUser} from  '../Layouts/UserLayout.jsx'
import {usePartner} from  '../Layouts/PartnerLayout.jsx'

const Header = ({ onLoginClick }) => {
  const { user, logout } = useUser(); // lấy từ context
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // 🔹 Click ngoài dropdown → đóng menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // 🔹 Logout
  const handleLogout = () => {
    logout(); // từ UserLayout
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="main-header">
      <div className="top-content-header">
        
        {/* NAV */}
        <nav className="main-top-header">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/locations" className="nav-item">Locations</Link>

          {/* USER ONLY */}
          {user && (
            <>
              <Link to="/my-trip" className="nav-item">My Trips</Link>
              <Link to="/history" className="nav-item">History</Link>
            </>
          )}
        </nav>

        {/* USER / LOGIN */}
        <div className="login-container-bt" ref={menuRef}>
          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <User size={28} />
                <span className="user-name">
                  {user.username || user.email}
                </span>
              </button>

              {menuOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="login-bt"
              // onClick={() => navigate("/users")}
              onClick={() => navigate("/role")}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="header-search">
        {/* <FilterSearch /> */}
      </div>
    </header>
  );
};

export default Header;