import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Comment.css";
import { ArrowLeft, Star } from "lucide-react";


// Đình Khang nhớ đổi nha
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_SERVER_API = {
    locations: "http://localhost:3001/places",
    comments: "http://localhost:3001/comments",
}; 

const REAL_BACKEND_API = {
    locations: "http://localhost:8080/places",

    comments: {
        getByPlace: (id) =>
            `http://localhost:8080/places/${id}/comments`,
        create: (id) =>
            `http://localhost:8080/places/${id}/comments`,
    },
};

const API =
    MODE === "JSON_SERVER"
        ? JSON_SERVER_API
        : REAL_BACKEND_API;

/* =========================
   COMPONENT
========================= */
const LocationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [location, setLocation] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    /* MODAL */
    const [openCommentModal, setOpenCommentModal] = useState(false);

    /* FORM */
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    /* USER */
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const commenter = user?.username || user?.email || "Anonymous";

    /* =========================
       FETCH LOCATION
    ========================= */
    const fetchDetail = async () => {
        const res = await fetch(API.locations);
        const data = await res.json();
        return data.find((i) => String(i.id) === String(id));
    };

    /* =========================
       FETCH COMMENTS
    ========================= */
    const fetchComments = async () => {
        if (MODE === "JSON_SERVER") {
            const res = await fetch(API.comments);
            const data = await res.json();

            return data.filter(
                (c) => String(c.placeId) === String(id)
            );
        }

        const res = await fetch(API.backend.comments(id));
        return await res.json();
    };

    /* =========================
       LOAD DATA
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
       SUBMIT COMMENT
    ========================= */
    const handleSubmit = async () => {
        if (!content.trim() || rating === 0) return;

        const newComment = {
            comment_id: crypto.randomUUID(),
            user_id: user?.id || "guest",
            commenter,
            content,
            rating,
            date: new Date().toISOString(),
        };

        setSubmitting(true);

        try {
            if (MODE === "JSON_SERVER") {
                await fetch(API.comments, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        placeId: id,
                        ...newComment,
                    }),
                });

                setComments((prev) => [
                    ...prev,
                    { placeId: id, ...newComment },
                ]);
            } else {
                await fetch(API.backend.comments(id), {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newComment),
                });

                setComments((prev) => [...prev, newComment]);
            }

            setContent("");
            setRating(0);
            setOpenCommentModal(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    /* =========================
       UI STATES
    ========================= */
    if (loading) return <div>Loading...</div>;
    if (!location) return <div>Not found</div>;

    return (
        <div className="location-detail-wrapper">

            {/* BACK BUTTON */}
            {/* <button onClick={() => navigate("/places")}>
                <ArrowLeft size={16} /> Back
            </button> */}
            <button onClick={() => navigate(-1)}>
                <ArrowLeft size={16} /> Back
            </button>

            <h1>{location.name}</h1>

            {/* =========================
               COMMENTS
            ========================= */}
            <div className="reviews-block">
                <div className="reviews-header">
                    <h3>Reviews ({comments.length})</h3>

                    <button onClick={() => setOpenCommentModal(true)}>
                        Comment
                    </button>
                </div>

                {comments.map((c, i) => (
                    <div key={i} className="comment-card">
                        <strong>{c.commenter}</strong>

                        <div>
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                    key={idx}
                                    size={14}
                                    color={
                                        idx < c.rating ? "#fbbf24" : "#ccc"
                                    }
                                />
                            ))}
                        </div>

                        <p>{c.content}</p>
                    </div>
                ))}
            </div>

            {/* =========================
               MODAL
            ========================= */}
            {openCommentModal && (
                <div
                    className="modal-overlay"
                    onClick={() => setOpenCommentModal(false)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3>Comment as {commenter}</h3>

                        {/* RATING */}
                        <div className="rating">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span
                                    key={i}
                                    onClick={() => setRating(i + 1)}
                                    style={{
                                        fontSize: "28px",
                                        cursor: "pointer",
                                        color:
                                            i < rating
                                                ? "#fbbf24"
                                                : "#ccc",
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        {/* INPUT */}
                        <textarea
                            placeholder="Write your comment..."
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                        />

                        {/* ACTIONS */}
                        <div className="modal-actions">
                            <button
                                onClick={() =>
                                    setOpenCommentModal(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Posting..."
                                    : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationDetail;