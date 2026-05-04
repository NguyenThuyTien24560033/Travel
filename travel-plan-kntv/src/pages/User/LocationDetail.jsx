// import { useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { Star, ArrowLeft } from "lucide-react";
// import "./LocationDetail.css";

// const OPERATING_LABELS = {
//   0: "Cả ngày",
//   1: "Sáng",
//   2: "Trưa",
//   3: "Tối",
//   4: "Nửa đêm",
// };

// const LocationDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const raw = state?.detail || null;
//    console.log("RAW DETAIL:", raw);
//   const location = raw
//     ? {
//         ...raw,
//       name:
//           raw.name ||
//           raw.place_name ||
//           raw.title ||
//           raw.places?.[0]?.name || // 🔥 fallback cho case nested
//           "No name",

//         address:
//           raw.address ||
//           raw.places?.[0]?.address ||
//           "No address",
        
      
//   //  operatingHours: Array.isArray(raw.active_hours)
//   //         ? raw.active_hours.map(Number)
//   //         : raw.active_hours
//   //         ? JSON.parse(raw.active_hours).map(Number)
//   //         : raw.operatingHours || [],
//   operatingHours: (() => {
//   try {
//     // let hours = raw.active_hours;
// let hours =
//   raw.active_hours ??
//   raw.places?.[0]?.active_hours ??
//   raw.operatingHours;
//     // 🔥 Nếu là string → parse
//     if (typeof hours === "string") {
//       hours = JSON.parse(hours);
//     }

//     // 🔥 Nếu không phải array → bỏ
//     if (!Array.isArray(hours)) return [];

//     // 🔥 Convert về number + lọc NaN
//     return hours.map((h) => Number(h)).filter((h) => !isNaN(h));
//   } catch (e) {
//     console.log("Parse active_hours error:", e);
//     return [];
//   }
// })(),

      
//         menu: raw.room_types || raw.dishes || [],

//         reviews: raw.comments || raw.reviews || [],
        
        
//         promotions: raw.discounts || raw.promotions || [],

//         announcements: raw.announcements || [],
//       }
//     : null;


//     console.log("FINAL HOURS:", location.operatingHours);

//   const comments = location?.reviews || [];
//   const averageRating = location.rating || 4.0;
// const [reviewPage, setReviewPage] = useState(0);
// const REVIEWS_PER_PAGE = 3;
// const start = reviewPage * REVIEWS_PER_PAGE;
// const visibleReviews = comments.slice(
//   start,
//   start + REVIEWS_PER_PAGE
// );
// const totalPages = Math.ceil(comments.length / REVIEWS_PER_PAGE);
//   const [openSection, setOpenSection] = useState("menu");

//   const toggleSection = (key) => {
//     setOpenSection(openSection === key ? null : key);
//   };
// const [openDiscount, setOpenDiscount] = useState(false);
//   /* =========================
//      GUARD
//   ========================= */
//   if (!location) {
//     return (
//       <div style={{ padding: 20 }}>
//         <p>Không có dữ liệu.</p>
//         <button onClick={() => navigate("/places")}>Quay lại</button>
//       </div>
//     );
//   }
//   const now = new Date();

// const validDiscounts = (location.promotions || []).filter((d) => {
//   if (!d.end_date) return true; // nếu không có end_date thì vẫn show

//   return new Date(d.end_date) >= now;
// });
// const validAnnouncements = Array.isArray(location?.announcements)
//   ? location.announcements.filter((n) => {
//       // nếu không có end_date → vẫn hiển thị
//       if (!n.end_date) return true;

//       return new Date(n.end_date) >= now;
//     })
//   : [];
//   return (
//     <div className="location-detail-wrapper">
//       <div className="location-detail-container">

//         {/* HEADER */}
//         <div className="detail-header">
//           <button className="back-btn" onClick={() => navigate("/places")}>
//             <ArrowLeft size={18} /> Quay lại
//           </button>

//           <div className="image-container">
//             <img
//               src={location.image || "https://placehold.co/800x400"}
//               alt={location.name}
//             />

//             <div className="image-overlay">
//               {/* <h1>{location.name}</h1> */}
//                <h1>{location.name}</h1>

//               <div className="quick-info">
//                 <span>{location.address}</span>

//                <span>
//   ⭐ {averageRating}
// </span>
//                 {/* <span>
//                   {location.operatingHours
//                     ? `Buổi: ${location.operatingHours.join(", ")}`
//                     : "Not updated"}
//                 </span> */}
//                 {/* <span>
//   {location.operatingHours && location.operatingHours.length > 0
//     ? (() => {
//         const hours = location.operatingHours.map(Number);

//         // ✅ Nếu có 0 → chỉ lấy 0
//         if (hours.includes(0)) {
//           return "Buổi: Cả ngày";
//         }

//         // ❌ Không có 0 → map bình thường
//         return `Buổi: ${hours
//           .map((h) => OPERATING_LABELS[h] || "Không rõ")
//           .join(", ")}`;
//       })()
//     : "Not updated"}
// </span> */}
// <span>
//                   {location.operatingHours &&
//                   location.operatingHours.length > 0
//                     ? (() => {
//                         const hours = location.operatingHours;

//                         // ✅ Nếu có 0 → chỉ hiển thị cả ngày
//                         if (hours.includes(0)) {
//                           return "Buổi: Cả ngày";
//                         }

//                         // ❌ Không có 0 → map bình thường
//                         return `Buổi: ${hours
//                           .map((h) => OPERATING_LABELS[h] || "Không rõ")
//                           .join(", ")}`;
//                       })()
//                     : "Not updated"}
//                 </span>

//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="detail-grid">

//           {/* LEFT */}
//           <div className="main-content">

//             {/* DESCRIPTION */}
//             <div className="info-block">
//               <h3>Description</h3>
//               <p>{location.description}</p>
//             </div>

//             {/* MENU */}
//             <div className="info-block">
//               <h3
//                 onClick={() => toggleSection("menu")}
//                 className="clickable-h3"
//               >
//                 Menu & Services {openSection === "menu" ? "▲" : "▼"}
//               </h3>

//               {openSection === "menu" && (
//                 <div className="content-list">
//                   {location.menu.length > 0 ? (
//                     location.menu.map((item, i) => (
//                       <div key={item.dish_id || i} className="dish-card">

//                         <div className="dish-header">
//                           <h4 className="dish-name">
//                             {/* {item.dish_name || item.name || "No name"} */}
//                              {item.dish_name || item.name || item.type_name || "No name"}

//                           </h4>

//                           <span className="dish-price">
//                             {item.price ? `${item.price.toLocaleString()}đ` : "0đ"}
//                           </span>
//                 </div>

//           <p className="dish-desc">
//             {item.description?.trim() || "Không có mô tả"}
//           </p>

//         </div>
//       ))
//     ) : (
//       <p>Chưa có thông tin</p>
//     )}
//   </div>
// )}
//             </div>

//             {/* NOTIFICATION */}
//             {/* <div className="info-block">
//               <h3
//                 onClick={() => toggleSection("notify")}
//                 className="clickable-h3"
//               >
//                 Notification {openSection === "notify" ? "▲" : "▼"}
//               </h3>

              
//               {openSection === "notify" && (
//   <div className="content-list">

//     {Array.isArray(location?.announcements) &&
//     location.announcements.length > 0 ? (
//       location.announcements.map((n) => (
//         <div key={n.id} className="announce-card">

//           <h4 className="announce-title">
//             {n.title}
//           </h4>

//           <p className="announce-desc">
//             {n.description || n.content || n.desc || "Không có mô tả"}
//           </p>

//           <div className="announce-meta">
//             {n.start_date && <small>Từ: {n.start_date}</small>}
//             {n.end_date && <small>Đến: {n.end_date}</small>}
//           </div>

//         </div>
//       ))
//     ) : (
//       <p>Không có thông báo</p>
//     )}

//   </div>
// )}
//             </div> */}

//           </div>

//           {/* RIGHT */}
//           <div className="sidebar">

//             <div className="promo-block">

//   <h3
//     className="clickable-h3"
//     onClick={() => setOpenDiscount(!openDiscount)}
//   >
//     Discount {openDiscount ? "▲" : "▼"}
//   </h3>

//   {openDiscount && (
//     <div className="content-list">

//       {validDiscounts.length > 0 ? (
//         validDiscounts.map((d) => (
//           <div key={d.discount_id} className="promo-card">

//             <div className="promo-header">
//               <h4 className="promo-title">{d.title}</h4>

//               <span className="promo-value">
//                 {d.percent ? `${d.percent}%` : ""}
//               </span>
//             </div>

//             <p className="promo-desc">
//               {d.description || "Không có mô tả"}
//             </p>

//             <div className="promo-meta">
//               {d.start_date && (
//                 <small>Từ: {d.start_date}</small>
//               )}
//               <br />
//               {d.end_date && (
//                 <small>Đến: {d.end_date}</small>
//               )}
//             </div>

//           </div>
//         ))
//       ) : (
//         <p>No valid discount</p>
//       )}

//     </div>
//   )}
// </div>

//             {/* REVIEWS */}
//             <div className="reviews-block">

//               <div className="reviews-header">
//                 <h3>Đánh giá ({comments.length})</h3>

//                 <button
//   className="write-review-btn"
//   onClick={() =>
//     navigate(`/places/${id}/comments`, {
//       state: {
//         comments: location.reviews || [],
//       },
//     })
//   }
// >
//   Comment
// </button>
//               </div>

//               <div className="comments-container">

//                 {comments.length === 0 ? (
//                   <p>Chưa có đánh giá</p>
//                 ) : (
//                  visibleReviews.map((c, index) => (
//                     <div key={c.comment_id || index} className="comment-card">

//                       <div className="comment-top">
        
//                         <strong>{c.commenter || c.user}</strong>

//                         <div className="stars">
//                           {Array.from({ length: 5 }).map((_, i) => (
//                             <Star
//                               key={i}
//                               size={12}
//                               fill={i < (c.rating || 0) ? "#fbbf24" : "none"}
//                               color="#fbbf24"
//                             />
//                           ))}
//                         </div>
//                       </div>

//                       <p>{c.comment || c.content}</p>

//                     </div>
//                   ))
//                 )}
//                 {comments.length > 3 && (
//   <div className="review-pagination">

//     <button
//       disabled={reviewPage === 0}
//       onClick={() => setReviewPage((p) => p - 1)}
//     >
//       ◀ Prev
//     </button>

//     <span>
//       {reviewPage + 1} / {totalPages}
//     </span>

//     <button
//       disabled={reviewPage === totalPages - 1}
//       onClick={() => setReviewPage((p) => p + 1)}
//     >
//       Next ▶
//     </button>

//   </div>
// )}

//               </div>

//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationDetail;


import { useState, useEffect } from "react"; 
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { authorizedFetch } from "../../../api"; 
import "./LocationDetail.css";

const OPERATING_LABELS = {
  0: "Cả ngày",
  1: "Sáng",
  2: "Trưa",
  3: "Tối",
  4: "Nửa đêm",
};

const LocationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [raw, setRaw] = useState(state?.detail || null);

  console.log("RAW DETAIL:", raw);


  const fetchDetail = async () => {
    try {
      let data;

      const res = await fetch(`http://localhost:3001/places/${id}`);
      if (!res.ok) return;
      data = await res.json();



      setRaw(data);
    } catch (err) {
      console.log(err);
    }
  };


  useEffect(() => {
  fetchDetail(); 
}, [id]);

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

            return hours.map((h) => Number(h)).filter((h) => !isNaN(h));
          } catch (e) {
            console.log("Parse active_hours error:", e);
            return [];
          }
        })(),

        menu: raw.room_types || raw.dishes || [],
        reviews: raw.comments || raw.reviews || [],
        promotions: raw.discounts || raw.promotions || [],
        announcements: raw.announcements || [],
      }
    : null;

  console.log("FINAL HOURS:", location?.operatingHours);

  const comments = location?.reviews || [];
  const averageRating = location?.rating || 4.0;

  const [reviewPage, setReviewPage] = useState(0);
  const REVIEWS_PER_PAGE = 3;
  const start = reviewPage * REVIEWS_PER_PAGE;
  const visibleReviews = comments.slice(start, start + REVIEWS_PER_PAGE);
  const totalPages = Math.ceil(comments.length / REVIEWS_PER_PAGE);

  const [openSection, setOpenSection] = useState("menu");
  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  const [openDiscount, setOpenDiscount] = useState(false);

  if (!location) {
    return (
      <div style={{ padding: 20 }}>
        <p>Không có dữ liệu.</p>
        <button onClick={() => navigate("/places")}>Quay lại</button>
      </div>
    );
  }

  const now = new Date();

  const validDiscounts = (location.promotions || []).filter((d) => {
    if (!d.end_date) return true;
    return new Date(d.end_date) >= now;
  });

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
              {/* <h1>{location.name}</h1> */}
               <h1>{location.name}</h1>

              <div className="quick-info">
                <span>{location.address}</span>

               <span>
  ⭐ {averageRating}
</span>
                
<span>
                  {location.operatingHours &&
                  location.operatingHours.length > 0
                    ? (() => {
                        const hours = location.operatingHours;

                 
                        if (hours.includes(0)) {
                          return "Buổi: Cả ngày";
                        }

                        
                        return `Buổi: ${hours
                          .map((h) => OPERATING_LABELS[h] || "Không rõ")
                          .join(", ")}`;
                      })()
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
                      <div key={item.dish_id || i} className="dish-card">

                        <div className="dish-header">
                          <h4 className="dish-name">
                            {/* {item.dish_name || item.name || "No name"} */}
                             {item.dish_name || item.name || item.type_name || "No name"}

                          </h4>

                          <span className="dish-price">
                            {item.price ? `${item.price.toLocaleString()}đ` : "0đ"}
                          </span>
                </div>

          <p className="dish-desc">
            {item.description?.trim() || "Không có mô tả"}
          </p>

        </div>
      ))
    ) : (
      <p>Chưa có thông tin</p>
    )}
  </div>
)}
            </div>

            {/* NOTIFICATION */}
            {/* <div className="info-block">
              <h3
                onClick={() => toggleSection("notify")}
                className="clickable-h3"
              >
                Notification {openSection === "notify" ? "▲" : "▼"}
              </h3>

              
              {openSection === "notify" && (
  <div className="content-list">

    {Array.isArray(location?.announcements) &&
    location.announcements.length > 0 ? (
      location.announcements.map((n) => (
        <div key={n.id} className="announce-card">

          <h4 className="announce-title">
            {n.title}
          </h4>

          <p className="announce-desc">
            {n.description || n.content || n.desc || "Không có mô tả"}
          </p>

          <div className="announce-meta">
            {n.start_date && <small>Từ: {n.start_date}</small>}
            {n.end_date && <small>Đến: {n.end_date}</small>}
          </div>

        </div>
      ))
    ) : (
      <p>Không có thông báo</p>
    )}

  </div>
)}
            </div> */}

          </div>

          {/* RIGHT */}
          <div className="sidebar">

            <div className="promo-block">

  <h3
    className="clickable-h3"
    onClick={() => setOpenDiscount(!openDiscount)}
  >
    Discount {openDiscount ? "▲" : "▼"}
  </h3>

  {openDiscount && (
    <div className="content-list">

      {validDiscounts.length > 0 ? (
        validDiscounts.map((d) => (
          <div key={d.discount_id} className="promo-card">

            <div className="promo-header">
              <h4 className="promo-title">{d.title}</h4>

              <span className="promo-value">
                {d.percent ? `${d.percent}%` : ""}
              </span>
            </div>

            <p className="promo-desc">
              {d.description || "Không có mô tả"}
            </p>

            <div className="promo-meta">
              {d.start_date && (
                <small>Từ: {d.start_date}</small>
              )}
              <br />
              {d.end_date && (
                <small>Đến: {d.end_date}</small>
              )}
            </div>

          </div>
        ))
      ) : (
        <p>No valid discount</p>
      )}

    </div>
  )}
</div>

            {/* REVIEWS */}
            <div className="reviews-block">

              <div className="reviews-header">
                <h3>Đánh giá ({comments.length})</h3>

                <button
  className="write-review-btn"
  onClick={() =>
    navigate(`/places/${id}/comments`, {
      state: {
        comments: location.reviews || [],
      },
    })
  }
>
  Comment
</button>
              </div>

              <div className="comments-container">

                {comments.length === 0 ? (
                  <p>Chưa có đánh giá</p>
                ) : (
                 visibleReviews.map((c, index) => (
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
                {comments.length > 2 && (
  <div className="review-pagination">

    <button
      disabled={reviewPage === 0}
      onClick={() => setReviewPage((p) => p - 1)}
    >
      ◀ Prev
    </button>

    <span>
      {reviewPage + 1} / {totalPages}
    </span>

    <button
      disabled={reviewPage === totalPages - 1}
      onClick={() => setReviewPage((p) => p + 1)}
    >
      Next ▶
    </button>

  </div>
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

