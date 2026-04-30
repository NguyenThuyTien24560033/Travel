import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import "./LocationDetail.css";

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const raw = state?.detail || null;

  const location = raw
    ? {
        ...raw,

        
        operatingHours: raw.active_hours
          ? JSON.parse(raw.active_hours)
          : raw.operatingHours || null,

      
        menu: raw.room_types || raw.menu || [],

        reviews: raw.comments || raw.reviews || [],

        
        promotions: raw.discounts || raw.promotions || [],

        announcements: raw.announcements || [],
      }
    : null;

  const comments = location?.reviews || [];

  const [openSection, setOpenSection] = useState("menu");

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  /* =========================
     GUARD
  ========================= */
  if (!location) {
    return (
      <div style={{ padding: 20 }}>
        <p>Không có dữ liệu.</p>
        <button onClick={() => navigate("/places")}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="location-detail-wrapper">
      <div className="location-detail-container">

        {/* HEADER */}
        <div className="detail-header">
          <button className="back-btn" onClick={() => navigate("/places")}>
            <ArrowLeft size={18} /> Quay lại
          </button>

          <div className="image-container">
            <img
              src={location.image || "https://placehold.co/800x400"}
              alt={location.name}
            />

            <div className="image-overlay">
              <h1>{location.name}</h1>

              <div className="quick-info">
                <span>{location.address}</span>

               
                <span>
                  {location.operatingHours
                    ? `Active days: ${location.operatingHours.join(", ")}`
                    : "Not updated"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="detail-grid">

          {/* LEFT */}
          <div className="main-content">

            {/* DESCRIPTION */}
            <div className="info-block">
              <h3>Description</h3>
              <p>{location.description}</p>
            </div>

            {/* MENU */}
            <div className="info-block">
              <h3
                onClick={() => toggleSection("menu")}
                className="clickable-h3"
              >
                Menu & Services {openSection === "menu" ? "▲" : "▼"}
              </h3>

              {openSection === "menu" && (
                <div className="content-list">
                  {location.menu.length > 0 ? (
                    location.menu.map((item, i) => (
                      <div key={i} className="list-item">

                      
                        {item.type_name ? (
                          <>
                            <span>{item.type_name}</span>
                            <span className="price">{item.price}đ</span>
                          </>
                        ) : (
                          <>
                            <span>{item.name}</span>
                            <span className="price">{item.price}</span>
                          </>
                        )}

                      </div>
                    ))
                  ) : (
                    <p>Chưa có thông tin</p>
                  )}
                </div>
              )}
            </div>

            {/* NOTIFICATION */}
            <div className="info-block">
              <h3
                onClick={() => toggleSection("notify")}
                className="clickable-h3"
              >
                Notification {openSection === "notify" ? "▲" : "▼"}
              </h3>

              {openSection === "notify" && (
                <div className="content-list">
                  {location.announcements.length > 0 ? (
                    location.announcements.map((n, i) => (
                      <p key={i}>• {n.title || n}</p>
                    ))
                  ) : (
                    <p>Không có thông báo</p>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT */}
          <div className="sidebar">

            {/* DISCOUNT */}
            <div className="promo-block">
              <h3>Discount</h3>

              <div className="discount-tag">
                {location.promotions.length > 0
                  ? location.promotions.map(p => p.title || p).join(", ")
                  : "No discount"}
              </div>
            </div>

            {/* REVIEWS */}
            <div className="reviews-block">

              <div className="reviews-header">
                <h3>Đánh giá ({comments.length})</h3>

                <button
                  className="write-review-btn"
                  onClick={() => navigate(`/places/${id}/comments`)}
                >
                  Comment
                </button>
              </div>

              <div className="comments-container">

                {comments.length === 0 ? (
                  <p>Chưa có đánh giá</p>
                ) : (
                  comments.map((c, index) => (
                    <div key={c.comment_id || index} className="comment-card">

                      <div className="comment-top">
        
                        <strong>{c.commenter || c.user}</strong>

                        <div className="stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={i < (c.rating || 0) ? "#fbbf24" : "none"}
                              color="#fbbf24"
                            />
                          ))}
                        </div>
                      </div>

                      <p>{c.comment || c.content}</p>

                    </div>
                  ))
                )}

              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetail;