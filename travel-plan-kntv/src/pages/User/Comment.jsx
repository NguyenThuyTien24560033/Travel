import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Star, ArrowLeft } from "lucide-react";
import { authorizedFetch } from "../../../api";
import { toast } from "sonner";
import { useUser } from "../../assets/Layouts/UserLayout.jsx";
import "./Comment.css";

/* =========================================================
   MODE CONFIG
========================================================= */
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_API = "http://localhost:3001/places";

const REAL_API = {
  hotel: (id) => `places/hotels/${id}/comments/`,
  restaurant: (id) => `places/restaurants/${id}/comments/`,
  attraction: (id) => `places/attractions/${id}/comments/`,
};

const CommentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

 
  const type = state?.type;

  const existingComments = state?.comments || [];
  const { user } = useUser();

  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");

  const username = user?.username || user?.email || "Anonymous";

 
  console.log("TYPE:", type);

  /* =========================================================
     SUBMIT COMMENT
  ========================================================= */
  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Vui lòng nhập comment");
      return;
    }

    try {
  
      if (MODE === "JSON_SERVER") {
        const newComment = {
          comment_id: Date.now().toString(),
          commenter: username,
          rating,      
          content,
        };

        const updatedComments = [...existingComments, newComment];

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

 
      else {
        let url = "";

   
        switch (type) {
          case 1:
            url = REAL_API.hotel(id);
            break;
          case 2:
            url = REAL_API.restaurant(id);
            break;
          case 3:
            url = REAL_API.attraction(id);
            break;
          default:
            toast.error("Type không hợp lệ");
            return;
        }

     
        await authorizedFetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content,
          }),
        });

        toast.success("Comment success (BACKEND)");
      }

      
      navigate(-1, {
  state: { refresh: true } 
});
    } catch (err) {
      console.log(err);
      toast.error("Error submitting comment");
    }
  };

  return (
    <div className="comment-page-wrapper">
      <div className="comment-card-container">

        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Quay lại
        </button>

        <h2>Viết đánh giá</h2>

      
        <div className="star-rating-box">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={32}
              className="star-icon"
              onClick={() => setRating(i + 1)}
              fill={i < rating ? "#fbbf24" : "none"}
              color="#fbbf24"
            />
          ))}
        </div>

        {/* TEXT */}
        <textarea
          className="comment-textarea"
          placeholder="Chia sẻ trải nghiệm của bạn..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

   
        <button className="submit-comment-btn" onClick={handleSubmit}>
          Gửi đánh giá
        </button>

      </div>
    </div>
  );
};

export default CommentPage;