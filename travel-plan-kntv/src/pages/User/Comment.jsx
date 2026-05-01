import { useState } from "react";
import { useParams, useNavigate, useLocation} from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { authorizedFetch } from "../../../api";
import { toast } from "sonner";
import { useUser } from "../../assets/Layouts/UserLayout.jsx"
import './Comment.css'

/* =========================================================
   MODE CONFIG
========================================================= */
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_API = "http://localhost:3001/places";

const REAL_API = {
  updatePlace: (id) => `http://localhost:8000/travel/places/${id}`,
};

const CommentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useUser();

  const existingComments = state?.comments || [];

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const username = user?.username || user?.email || "Anonymous";

  /* =========================================================
     SUBMIT COMMENT
  ========================================================= */
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập comment");
      return;
    }

    const newComment = {
      comment_id: Date.now().toString(),
      commenter: username,
      rating,
      content,
    };

    try {
      const updatedComments = [...existingComments, newComment];

      /* =========================
         JSON SERVER MODE
      ========================= */
      if (MODE === "JSON_SERVER") {
        await fetch(`${JSON_API}/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments: updatedComments,
          }),
        });

        toast.success("Comment success (JSON_SERVER)");
      }

      /* =========================
         REAL BACKEND MODE
      ========================= */
      else {
        await authorizedFetch(REAL_API.updatePlace(id), {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comments: updatedComments,
          }),
        });

        toast.success("Comment success (BACKEND)");
      }

      navigate(-1);
    } catch (err) {
      console.log(err);
      toast.error("Error submitting comment");
    }
  };

//   return (
//     <div style={{ padding: 20 }}>

//       {/* BACK */}
//       <button onClick={() => navigate(-1)}>
//         <ArrowLeft /> Back
//       </button>

//       <h2>Write Comment</h2>

//       {/* STAR RATING */}
//       <div style={{ display: "flex", gap: 6 }}>
//         {Array.from({ length: 5 }).map((_, i) => (
//           <Star
//             key={i}
//             size={24}
//             onClick={() => setRating(i + 1)}
//             fill={i < rating ? "#fbbf24" : "none"}
//             color="#fbbf24"
//             style={{ cursor: "pointer" }}
//           />
//         ))}
//       </div>

//       {/* TEXT AREA */}
//       <textarea
//         placeholder="Write your comment..."
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         style={{
//           width: "100%",
//           height: 120,
//           marginTop: 10,
//           padding: 10,
//         }}
//       />

//       {/* SUBMIT */}
//       <button onClick={handleSubmit} style={{ marginTop: 10 }}>
//         Submit
//       </button>
//     </div>
//   );

return (
  <div className="comment-page-wrapper">
    <div className="comment-card-container">
      {/* BACK */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <h2>Viết đánh giá</h2>

      {/* STAR RATING */}
      <div className="star-rating-box">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={32} // Tăng size lên một chút cho dễ bấm
            className="star-icon"
            onClick={() => setRating(i + 1)}
            fill={i < rating ? "#fbbf24" : "none"}
            color="#fbbf24"
          />
        ))}
      </div>

      {/* TEXT AREA */}
      <textarea
        className="comment-textarea"
        placeholder="Chia sẻ trải nghiệm của bạn về địa điểm này..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* SUBMIT */}
      <button className="submit-comment-btn" onClick={handleSubmit}>
        Gửi đánh giá
      </button>
    </div>
  </div>
);

};

export default CommentPage;