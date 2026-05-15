import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Header from '../Components/Header.jsx'
import Banner from '../../pages/User/Banner.jsx';

const LanternString = () => {
  const colors = ["#e53935","#f57c00","#fdd835","#43a047","#1e88e5","#8e24aa","#e53935","#f57c00","#fdd835","#43a047","#e53935"];
  return (
    <div className="lantern-string-wrap">
      <svg width="100%" height="90" viewBox="0 0 1200 90" preserveAspectRatio="none">
        <path d="M0 15 Q150 28 300 15 Q450 2 600 15 Q750 28 900 15 Q1050 2 1200 15"
          fill="none" stroke="#8b6914" strokeWidth="1.5"/>
        {colors.map((color, i) => {
          const x = (i + 0.5) * (1200 / colors.length);
          const ry = 15 + 10 * Math.sin((i / colors.length) * Math.PI);
          const s = 0.82;
          const w = 22 * s, h = 38 * s;
          const cx = x, top = ry;
          return (
            <g key={i} style={{
              animation: `lanternSwing 3s ease-in-out ${i * 0.28}s infinite alternate`,
              transformOrigin: `${cx}px ${top}px`
            }}>
              <line x1={cx} y1={top} x2={cx} y2={top + 7*s} stroke="#8b6914" strokeWidth="1"/>
              <rect x={cx - 5*s} y={top + 7*s} width={10*s} height={3.5*s} rx={1.5*s} fill="#8b6914"/>
              <ellipse cx={cx} cy={top + 7*s + 3.5*s + h/2} rx={w/2} ry={h/2} fill={color} opacity="0.92"/>
              <ellipse cx={cx - 3*s} cy={top + 7*s + 3.5*s + h*0.35} rx={3.5*s} ry={6*s} fill="white" opacity="0.22"/>
              {[-0.2, 0, 0.2].map((o, j) => (
                <ellipse key={j} cx={cx} cy={top + 7*s + 3.5*s + h/2 + o*h}
                  rx={w/2} ry={1.8*s} fill="none" stroke="#00000020" strokeWidth="0.5"/>
              ))}
              <rect x={cx - 5*s} y={top + 7*s + 3.5*s + h - 2*s} width={10*s} height={3.5*s} rx={1.5*s} fill="#8b6914"/>
              <line x1={cx} y1={top + 7*s + 3.5*s + h + 1.5*s} x2={cx} y2={top + 7*s + 3.5*s + h + 12*s} stroke={color} strokeWidth="1.5"/>
              <circle cx={cx} cy={top + 7*s + 3.5*s + h + 12*s} r={1.8*s} fill={color}/>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const VNFlag = ({ size = 1 }) => (
  <svg width={36*size} height={24*size} viewBox="0 0 36 24">
    <rect width="36" height="24" fill="#da020e" rx="2"/>
    <polygon points="18,4 20,10 26,10 21,14 23,20 18,16 13,20 15,14 10,10 16,10" fill="#ffcd00"/>
  </svg>
);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Header />
      <LanternString />

      <div className="banner-hero-wrapper">
        <Banner />
        <div className="hero-text-overlay">
          <h1>Plan Smarter, Travel Better ✈️</h1>
          <p className="hero-desc">
            Khám phá hành trình của bạn một cách thông minh hơn. Lên kế hoạch, quản lý chuyến đi và lưu giữ mọi khoảnh khắc chỉ trong một nơi duy nhất.
          </p>
          <p className="sub-text-bold">
            Your journey, your story — we help you make it unforgettable.
          </p>
        </div>
      </div>

      <section className="feature-section">
        <div className="feature-box">
          <h3>📍 Discover</h3>
          <p>Tìm kiếm những địa điểm thú vị và phù hợp với bạn.</p>
        </div>
        <div className="feature-box">
          <h3>🧭 Plan</h3>
          <p>Tạo lịch trình cá nhân hóa theo phong cách của riêng bạn.</p>
        </div>
        <div className="feature-box">
          <h3>📝 Track</h3>
          <p>Theo dõi và quản lý toàn bộ chuyến đi dễ dàng.</p>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-white-box">
          <div className="cta-decor-row">
            <VNFlag size={1.2} />
          </div>

          <h2>Start your journey today</h2>
          <p>Đăng nhập để bắt đầu tạo kế hoạch du lịch của riêng bạn.</p>
          
          <button className="login-green-btn" onClick={() => navigate("/role")}>
            Đăng nhập ngay
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;