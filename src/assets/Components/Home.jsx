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

const Lotus = ({ flip = false, scale = 1 }) => (
  <svg width={80*scale} height={70*scale} viewBox="0 0 80 70"
    style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}>
    <path d="M40 65 Q38 50 36 42" fill="none" stroke="#27ae60" strokeWidth="2"/>
    <path d="M40 65 Q42 50 44 42" fill="none" stroke="#27ae60" strokeWidth="2"/>
    <ellipse cx="25" cy="55" rx="14" ry="8" fill="#27ae60" opacity="0.7" transform="rotate(-25 25 55)"/>
    <ellipse cx="55" cy="55" rx="14" ry="8" fill="#27ae60" opacity="0.7" transform="rotate(25 55 55)"/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = deg * Math.PI / 180;
      return <ellipse key={i}
        cx={40 + 10*Math.sin(rad)} cy={38 - 10*Math.cos(rad)}
        rx="7" ry="14"
        fill={i < 4 ? "#f06292" : "#f48fb1"} opacity="0.88"
        transform={`rotate(${deg} ${40+10*Math.sin(rad)} ${38-10*Math.cos(rad)})`}/>;
    })}
    <circle cx="40" cy="38" r="7" fill="#ffd54f"/>
    <circle cx="40" cy="38" r="4" fill="#ffb300"/>
  </svg>
);

const NonLa = () => (
  <svg width="54" height="60" viewBox="0 0 60 65">
    <path d="M30 5 Q5 40 2 60 Q30 68 58 60 Q55 40 30 5Z" fill="#d4a843" opacity="0.88"/>
    {[15,25,35,45,55].map((y,i) => (
      <line key={i} x1={30-(y-5)*0.88} y1={y} x2={30+(y-5)*0.88} y2={y}
        stroke="#b8860b" strokeWidth="0.6" opacity="0.45"/>
    ))}
    <ellipse cx="30" cy="60" rx="28" ry="5" fill="#c49a2a" opacity="0.75"/>
    <path d="M20 57 Q30 55 40 57" fill="none" stroke="#e53935" strokeWidth="2"/>
  </svg>
);

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
          <p>Khám phá hành trình của bạn một cách thông minh hơn. Lên kế hoạch, quản lý chuyến đi và lưu giữ mọi khoảnh khắc chỉ trong một nơi duy nhất.</p>
          <p className="sub-text-bold">Your journey, your story — we help you make it unforgettable.</p>
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
            <VNFlag/><NonLa/><VNFlag/><NonLa/><VNFlag/>
          </div>

          <h2>Start your journey today</h2>
          <p>Đăng nhập để bắt đầu tạo kế hoạch du lịch của riêng bạn.</p>
          
          <button className="login-green-btn" onClick={() => navigate("/role")}>
            Đăng nhập ngay
          </button>

          <div className="cta-lotus-row">
            {[0,1,2,3,4].map(i => <Lotus key={i} scale={0.55 + (i%3)*0.1} flip={i%2===1}/>)}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;