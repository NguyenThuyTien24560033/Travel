import "./Home.css";
import Header from '../Components/Header.jsx'
import Banner from '../../pages/User/Banner.jsx';

const HomePage = () => {
  return (
    <div className="home-container">
      <Header />

      <Banner />

      {/* HERO TEXT */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>
            Plan Smarter, Travel Better ✈️
          </h1>

          <p>
            Khám phá hành trình của bạn một cách thông minh hơn. 
            Lên kế hoạch, quản lý chuyến đi và lưu giữ mọi khoảnh khắc 
            chỉ trong một nơi duy nhất.
          </p>

          <p className="sub-text">
            Your journey, your story — we help you make it unforgettable.
          </p>
        </div>
      </section>

      {/* FEATURE SECTION */}
      <section className="feature-section">
        <div className="feature-box">
          <h3>📍 Discover</h3>
          <p>
            Tìm kiếm những địa điểm thú vị và phù hợp với bạn.
          </p>
        </div>

        <div className="feature-box">
          <h3>🧭 Plan</h3>
          <p>
            Tạo lịch trình cá nhân hóa theo phong cách của riêng bạn.
          </p>
        </div>

        <div className="feature-box">
          <h3>📝 Track</h3>
          <p>
            Theo dõi và quản lý toàn bộ chuyến đi dễ dàng.
          </p>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <h2>Start your journey today</h2>
        <p>
          Đăng nhập để bắt đầu tạo kế hoạch du lịch của riêng bạn.
        </p>
      </section>
    </div>
  );
};

export default HomePage;