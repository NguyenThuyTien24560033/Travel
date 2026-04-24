import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import './Header.css'; // Import CSS thuần trực tiếp

// Header nhận props từ Layout cha
function Header({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    // Logic: Click ra ngoài vùng menu thì tự động đóng dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <header className="header-container">
            {/* --- PHẦN 1: LOGO VÀ ĐĂNG NHẬP --- */}
            <div className="header-main">
                <div className="header-logo">
                    <img src="/img/web icon.png" alt="Logo" className="logo-img"/>
                    <span className="web-name">Travel Plan KNTV</span>
                </div>

                <div className="header-auth" ref={menuRef}>
                    {user ? (
                        /* Trường hợp: Đã đăng nhập (Fetch từ UserLayout) */
                        <div className="user-profile-wrapper">
                            <button className="user-toggle-btn" onClick={() => setMenuOpen(!menuOpen)}>
                                <User size={20} />
                                <span className="display-name">{user.name}</span>
                            </button>
                            
                            {menuOpen && (
                                <div className="user-dropdown">
                                    <Link to="/profile" onClick={() => setMenuOpen(false)}>Hồ sơ cá nhân</Link>
                                    <button onClick={() => { onLogout(); setMenuOpen(false); }}>Đăng xuất</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Trường hợp: Chưa đăng nhập */
                        <div className="auth-buttons">
                            <button className="btn-login" onClick={() => navigate('/users')}>Log in</button>
                            <button className="btn-signup">Sign up</button>
                        </div>
                    )}
                </div>
            </div>

            {/* --- PHẦN 2: THANH ĐIỀU HƯỚNG (NAVBAR) --- */}
            <nav className="header-nav">
                {/* Nhóm bên trái: Home, Locations và các tính năng của User */}
                <div className="nav-group">
                    <Link className="nav-link" to="/">Home</Link>
                    <Link className="nav-link" to="/locations">Locations</Link>
                    
                    {/* Chỉ hiện nếu role là user */}
                    {user?.role === "user" && (
                        <>
                            <Link className="nav-link" to="/my-trips">My Trips</Link>
                            <Link className="nav-link" to="/history">History</Link>
                        </>
                    )}
                </div>

                {/* Nhóm bên phải: Các tính năng của Partner hoặc Admin */}
                <div className="nav-group">
                    {/* Chỉ hiện nếu role là partner */}
                    {user?.role === "partner" && (
                        <>
                            <Link className="nav-link" to="/partner/dashboard">Dashboard</Link>
                            <Link className="nav-link" to="/partner/menu">Menu</Link>
                            <Link className="nav-link" to="/partner/hours">Hours</Link>
                        </>
                    )}
                    
                    {/* Nút Admin nếu bạn muốn hiển thị nhanh */}
                    <Link className="nav-link admin-link" to="/admin">Admin</Link>
                </div>
            </nav>
        </header>
    );
}

export default Header;