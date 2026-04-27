
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MessageCircle, ArrowLeft } from "lucide-react";
import { authorizedFetch } from "../../../api";
import "./LocationDetail.css";

/* =========================
   MODE
========================= */

//Đình Khang nhớ chỉnh nhé
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_API = "http://localhost:3001/locations";
const COMMENTS_API = "http://localhost:3001/comments";

const REAL_API = {
  detail: (id) => `locations/${id}/`,
  comments: (id) => `locations/${id}/comments`,
};

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openSection, setOpenSection] = useState("menu");

  /* =========================
     FETCH DETAIL
  ========================= */
  const fetchDetail = async () => {
    try {
      if (MODE === "REAL_BACKEND") {
        const res = await authorizedFetch(REAL_API.detail(id));
        if (!res.ok) throw new Error();
        return await res.json();
      }

      const res = await fetch(JSON_API);
      const data = await res.json();

      const found = data.find((i) => i.id === id);

      return {
        ...found,

        menu: found?.menu || [],

        openingHours: found?.operatingHours
          ? `${found.operatingHours.open} - ${found.operatingHours.close}`
          : "Not updated",

        discount: found?.promotions?.length
          ? found.promotions.map((p) => p.title).join(", ")
          : "No discount",

        notifications: found?.announcements?.map((a) => a.title) || [],
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  /* =========================
     FETCH COMMENTS
  ========================= */
  const fetchComments = async () => {
    try {
      if (MODE === "REAL_BACKEND") {
        const res = await authorizedFetch(REAL_API.comments(id));
        if (!res.ok) return [];
        return await res.json();
      }

      const res = await fetch(JSON_API);
    const data = await res.json();

    const found = data.find((i) => i.id === id);

    return found?.reviews || [];
    } catch {
      return [];
    }
  };

  /* =========================
     LOAD
  ========================= */
  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [loc, cmt] = await Promise.all([
        fetchDetail(),
        fetchComments(),
      ]);

      setLocation(loc);
      setComments(cmt);
      setLoading(false);
    };

    load();
  }, [id]);

  /* =========================
     UI HELPERS
  ========================= */
  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  /* =========================
     GUARD
  ========================= */
  if (loading) return <div>Loading...</div>;
  if (!location) return <div>Location not found</div>;

return (
  <div className="location-detail-wrapper">
    <div className="location-detail-container">
      
      {/* HEADER SECTION: Nút back và Ảnh bìa */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate("/locations")}>
          <ArrowLeft size={18} /> Quay lại
        </button>
        <div className="image-container">
          <img 
            src={location.image || "https://placehold.co/800x400?text=No+Image+Available"} 
            alt={location.name} 
          />
          <div className="image-overlay">
            <h1>{location.name}</h1>
            <div className="quick-info">
              <span>{location.address}</span>
              <span>{location.openingHours}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-grid">
        {/* CỘT TRÁI: Thông tin chính */}
        <div className="main-content">
          <div className="info-block">
            <h3>Description</h3>
            <p>{location.description}</p>
          </div>

          <div className="info-block">
            <h3 onClick={() => toggleSection("menu")} className="clickable-h3">
              Menu & Services {openSection === "menu" ? "▲" : "▼"}
            </h3>
            {openSection === "menu" && (
              <div className="content-list">
                {location.menu.length > 0 ? (
                  location.menu.map((item, i) => (
                    <div key={i} className="list-item">
                      {typeof item === "object" ? (
                        <><span>{item.name}</span><span className="price">${item.price}</span></>
                      ) : <span>{item}</span>}
                    </div>
                  ))
                ) : <p>Chưa có thông tin</p>}
              </div>
            )}
          </div>

          <div className="info-block">
            <h3 onClick={() => toggleSection("notify")} className="clickable-h3">
              Notification {openSection === "notify" ? "▲" : "▼"}
            </h3>
            {openSection === "notify" && (
              <div className="content-list">
                {location.notifications.length > 0 ? 
                  location.notifications.map((n, i) => <p key={i}>• {n}</p>) 
                  : <p>Không có thông báo mới</p>}
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI: Discount & Reviews */}
        <div className="sidebar">
          <div className="promo-block">
             <h3>Discount</h3>
            <div className="discount-tag">{location.discount}</div>
          </div>

          {/* <div className="reviews-block">
            <h3>Đánh giá ({comments.length})</h3>
            <div className="comments-container">
              {comments.map((c, index) => (
                <div key={c.id || index} className="comment-card">
                  <div className="comment-top">
                    <strong>{c.name || c.user}</strong>
                    <div className="stars">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} fill={i < c.rating ? "#fbbf24" : "none"} color="#fbbf24" />
                      ))}
                    </div>
                  </div>
                  <p>{c.content || c.comment}</p>
                </div>
              ))}
            </div>
          </div> */}


          <div className="reviews-block">
  <div className="reviews-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
    <h3 style={{ margin: 0 }}>Đánh giá ({comments.length})</h3>
    
    {/* Nút điều hướng sang trang review mới */}
    <button 
      className="write-review-btn"
      onClick={() => navigate(`/locations/${id}/review`)}
      style={{
        padding: '8px 16px',
        backgroundColor: '#111827',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}
    >
      Comment
    </button>
  </div>

  <div className="comments-container">
    {comments.length === 0 ? (
      <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Chưa có đánh giá nào.</p>
    ) : (
      comments.map((c, index) => (
        <div key={c.id || index} className="comment-card">
          <div className="comment-top">
            <strong>{c.name || c.user}</strong>
            <div className="stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  fill={i < c.rating ? "#fbbf24" : "none"} 
                  color="#fbbf24" 
                />
              ))}
            </div>
          </div>
          <p>{c.content || c.comment}</p>
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