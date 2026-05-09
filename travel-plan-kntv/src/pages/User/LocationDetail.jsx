import { useState, useEffect, useRef  } from "react"; 
import { useParams, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { authorizedFetch } from "../../../api";
import "./LocationDetail.css";

/* =========================================================
   CONFIG
========================================================= */

const MODE = "REAL_BACKEND"; // hoặc "JSON_SERVER"

const JSON_API = "http://localhost:3001/places";

const REAL_API = {
  getHotel: "places/hotels/",
  getRestaurant: "places/restaurants/",
  getAttraction: "places/attractions/",
};

/* =========================================================
   API
========================================================= */

const getDetail = async (id, type) => {
  try {
    if (MODE === "REAL_BACKEND") {
      let endpoint = "";

      switch (type) {
        case 1:
          endpoint = REAL_API.getHotel;
          break;
        case 2:
          endpoint = REAL_API.getRestaurant;
          break;
        case 3:
          endpoint = REAL_API.getAttraction;
          break;
        default:
          console.error("Loại không hợp lệ:", type);
          return null;
      }

      const url = `${endpoint}${id}/`;

      const response = await authorizedFetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        console.error("Fetch fail:", response.status);
        return null;
      }

      const data = await response.json();
      
      console.log("Dữ liệu chi tiết của địa điểm nè: ", data);

      return data;
    } else {
      const res = await fetch(`${JSON_API}/${id}`);
      if (!res.ok) return null;
      return await res.json();
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

const postComment = async (id, type, content) => {
  try {
    let endpoint = "";

    switch (type) {
      case 1:
        endpoint = REAL_API.getHotel;
        break;

      case 2:
        endpoint = REAL_API.getRestaurant;
        break;

      case 3:
        endpoint = REAL_API.getAttraction;
        break;

      default:
        console.error("Loại không hợp lệ:", type);
        return false;
    }

    const url = `${endpoint}${id}/comments/`;

    const response = await authorizedFetch(url, {
      method: "POST",
      body: JSON.stringify({
        content: content,
      }),
    });

    if (!response.ok) {
      console.error("Comment fail:", response.status);
      return null;
    }

    return await response.json();

  } catch (err) {
    console.error(err);
    return null;
  }
};

const postRating = async (id, type, star) => {
  try {
    let endpoint = "";

    switch (type) {
      case 1:
        endpoint = REAL_API.getHotel;
        break;

      case 2:
        endpoint = REAL_API.getRestaurant;
        break;

      case 3:
        endpoint = REAL_API.getAttraction;
        break;

      default:
        console.error("Loại không hợp lệ:", type);
        return null;
    }

    const url = `${endpoint}${id}/rate/`;

    const response = await authorizedFetch(url, {
      method: "POST",
      body: JSON.stringify({
        star: star,
      }),
    });

    if (!response.ok) {
      console.error("Rating fail:", response.status);
      return null;
    }

    return await response.json();

  } catch (err) {
    console.error(err);
    return null;
  }
};

/* =========================================================
   COMPONENT
========================================================= */

const OPERATING_LABELS = {
  0: "Cả ngày",
  1: "Sáng",
  2: "Trưa",
  3: "Tối",
  4: "Nửa đêm",
};

const LocationDetail = ({ data, type: propType, mode = "navigate", onClose }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const [openSection, setOpenSection] = useState("menu");
  const [openDiscount, setOpenDiscount] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);

  // ✅ lấy type từ state hoặc query
  const type =
    mode === "embedded"
      ? propType
      : state?.type || Number(searchParams.get("type"));

  const [raw, setRaw] = useState(
    mode === "embedded" ? data : state?.detail || null
  );

  /* =========================
     FETCH
  ========================= */
  const fetchDetail = async () => {
    if (!type) {
      console.error("Thiếu type");
      return;
    }

    const data = await getDetail(id, type);
    if (data) setRaw(data);
  };

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (mode === "embedded") return;
    if (!id || !type) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    fetchDetail();
  }, [id, type]);

  useEffect(() => {
    if (mode === "embedded") {
      setRaw(data || null);
    }
  }, [data, mode]);

  /* =========================
     OTHER
  ========================= */
  const handleBack = () => {
    if (mode === "embedded") {
      onClose?.(); // 🔥 đóng modal
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/places");
    }
  };

  const handleSendComment = async () => {
    if (!commentInput.trim()) return;

    const result = await postComment(
      location.business_id || location.id,
      type,
      commentInput
    );

    if (!result?.success) return;

    const user = JSON.parse(localStorage.getItem("user"));

    const newComment = {
      comment_id: crypto.randomUUID(),
      commenter: user?.username || "Bạn",
      content: commentInput,
      date: new Date().toISOString(),
    };

    setRaw(prev => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));

    setCommentInput("");
  };

  const handleRating = async (star) => {
    setSelectedRating(star);

    const result = await postRating(
      location.business_id || location.id,
      type,
      star
    );

    if (!result?.success) return;

    // update UI local
    setRaw((prev) => ({
      ...prev,
      rating: Number(result.message.match(/[\d.]+$/)?.[0]) || prev.rating,
      review_count: (prev.review_count || 0) + 1,
    }));
  };

  /* =========================
     NORMALIZE
  ========================= */
  const location = raw
    ? {
        ...raw,
        name:
          raw.name ||
          raw.place_name ||
          raw.title ||
          raw.places?.[0]?.name ||
          "No name",

        address:
          raw.address ||
          raw.places?.[0]?.address ||
          "No address",

        operatingHours: (() => {
          try {
            let hours =
              raw.active_hours ??
              raw.places?.[0]?.active_hours ??
              raw.operatingHours;

            if (typeof hours === "string") {
              hours = JSON.parse(hours);
            }

            if (!Array.isArray(hours)) return [];

            return hours.map(Number).filter((h) => !isNaN(h));
          } catch {
            return [];
          }
        })(),

        menu: raw.room_types || raw.dishes || [],
        comments: raw.comments || raw.reviews || [],
        promotions: raw.discounts || raw.promotions || [],
      }
    : null;

  if (!location) {
    return (
      <div style={{ padding: 20 }}>
        <p>Không có dữ liệu</p>
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  const averageRating = location.rating || 4.0;
  const comments = location.comments || [];

  const now = new Date();
  const validDiscounts = location.promotions.filter(
    (d) => !d.end_date || new Date(d.end_date) >= now
  );

  /* =========================
     RENDER
  ========================= */
  return (
    <div
      className={`location-detail-page ${
        mode === "embedded" ? "embedded-mode" : ""
      }`}
    >
      <button
        className="floating-back-btn"
        onClick={handleBack}
      >
        <ArrowLeft size={18} />
        <span>Quay lại</span>
      </button>

      <div className="location-detail-container">

        {/* HERO */}
        <div className="hero-section">

          <img
            src={location.image || "https://placehold.co/1200x500"}
            alt={location.name}
            className="hero-image"
          />

          <div className="hero-overlay">

            <h1 className="hero-title">
              {location.name}
            </h1>

            <div className="hero-info">
              <a 
                href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="map-link"
              >
                <span>📍 {location.address}</span>
              </a>

              <span>⭐ {averageRating}</span>

              <span>
                🕒 {
                  location.operatingHours.length > 0
                    ? location.operatingHours.includes(0)
                      ? "Cả ngày"
                      : location.operatingHours
                          .map((h) => OPERATING_LABELS[h] || "?")
                          .join(", ")
                    : "Chưa cập nhật"
                }
              </span>
            </div>

          </div>
        </div>


        {/* GRID */}
        <div className="detail-grid">

          {/* LEFT */}
          <div className="left-panel">

            {/* DESCRIPTION */}
            <div className="detail-card">

              <h2 className="section-title">
                Description
              </h2>

              <p className="description-text">
                {location.description || "Chưa có mô tả"}
              </p>

            </div>


            {/* MENU */}
            <div className="detail-card">

              <h2 className="section-title">
                Menu & Services
              </h2>

              <div className="menu-scroll">

                {location.menu.length > 0 ? (
                  location.menu.map((item, i) => (

                    <div
                      key={item.dish_id || i}
                      className="menu-item"
                    >

                      <div className="menu-top">

                        <div className="menu-name">
                          {
                            item.dish_name ||
                            item.name ||
                            item.type_name ||
                            "No name"
                          }
                        </div>

                        <div className="menu-price">
                          {
                            item.price
                              ? `${item.price.toLocaleString()}đ`
                              : "0đ"
                          }
                        </div>

                      </div>

                      <div className="menu-description">
                        {item.description || "Không có mô tả"}
                      </div>

                    </div>

                  ))
                ) : (
                  <p>Không có dữ liệu menu</p>
                )}

              </div>

            </div>


            {/* DISCOUNT */}
            <div className="detail-card">

              <h2 className="section-title">
                Promotions
              </h2>

              <div className="discount-scroll">

                {validDiscounts.length > 0 ? (
                  validDiscounts.map((d, index) => (

                    <div
                      key={d.discount_id || index}
                      className="discount-card"
                    >

                      <div className="discount-header">

                        <div className="discount-title">
                          {d.title}
                        </div>

                        <div className="discount-value">
                          {d.percent ? `${d.percent}%` : ""}
                        </div>

                      </div>

                      <div className="discount-description">
                        {d.description}
                      </div>

                      <div className="discount-date">
                        {d.start_date} - {d.end_date}
                      </div>

                    </div>

                  ))
                ) : (
                  <p>Không có khuyến mãi</p>
                )}

              </div>

            </div>

          </div>


          {/* RIGHT */}
          <div className="right-panel">

            {/* OVERVIEW */}
            <div className="rating-card">

              <div className="overview-top">

                <div className="overview-score">
                  {averageRating}
                </div>

                <div className="overview-star">
                  <Star
                    size={24}
                    fill="#fbbc04"
                    color="#fbbc04"
                  />
                </div>

              </div>

              <div className="rating-text">
                Đánh giá trung bình từ người dùng
              </div>

            </div>


            {/* USER RATING */}
            <div className="rating-card">

              <h2 className="section-title">
                Đánh giá địa điểm
              </h2>

              <div className="star-picker">

                {[1,2,3,4,5].map((star) => (
                  <Star
                    key={star}
                    size={28}
                    color="#fbbc04"
                    fill={selectedRating >= star ? "#fbbc04" : "none"}
                    style={{ cursor: "pointer" }}

                    onClick={() => {
                      handleRating(star);
                    }}
                  />
                ))}

              </div>

              <div className="rating-text">
                Chọn số sao bạn muốn đánh giá
              </div>

              {/*
                TODO:
                submit rating API
              */}

            </div>


            {/* COMMENTS */}
            <div className="comment-card-wrapper">

              <h2 className="section-title">
                Comments ({comments.length})
              </h2>


              {/* LIST */}
              <div className="comment-list">

                {comments.length > 0 ? (
                  comments.map((c, index) => (

                    <div
                      key={c.comment_id || index}
                      className="comment-item"
                    >

                      <div className="comment-user">
                        {c.commenter || "Ẩn danh"}
                      </div>

                      <div className="comment-content">
                        {c.content || c.comment}
                      </div>

                      <div className="comment-date">
                        {
                          c.date
                            ? new Date(c.date).toLocaleString("vi-VN", {
                                hour: "2-digit",
                                minute: "2-digit",
                                day: "2-digit",
                                month: "2-digit",
                              })
                            : ""
                        }
                      </div>

                    </div>

                  ))
                ) : (
                  <p>Chưa có bình luận</p>
                )}

              </div>


              {/* COMMENT INPUT */}
              <div className="comment-form">

                <textarea
                  className="comment-input"
                  placeholder="Viết bình luận của bạn..."
                  value={commentInput}
                  onChange={(e) =>
                    setCommentInput(e.target.value)
                  }
                />

                <button
                  className="comment-submit"

                  onClick={handleSendComment}
                  
                >
                  Gửi bình luận
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default LocationDetail;
