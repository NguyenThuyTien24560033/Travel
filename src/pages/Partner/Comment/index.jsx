import { usePartner } from '../../../assets/Layouts/PartnerLayout.jsx';
import { MessageCircle } from "lucide-react";
import './Comment.css';

const Comment = () => {
    const { location } = usePartner();

    if (!location) {
        return <div style={{ padding: 20 }}>No data available</div>;
    }

    const comments = location?.comments || [];

    return (
        <div className="comments-page">
            <h2>Comments</h2>

            <div className="comments-container">
                {comments.length > 0 ? (
                    comments.map((c) => {
                        const date = new Date(c.date);

                        const formattedDate = date.toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                        });

                        return (
                            <div key={c.comment_id} className="comment-card">
                                <div className="comment-header">
                                    <div className="comment-user">
                                        <MessageCircle size={16} />
                                        <span>{c.commenter}</span>
                                    </div>
                                    <div className="comment-date">
                                        {formattedDate}
                                    </div>
                                </div>

                                <div className="comment-content">
                                    {c.content}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="no-comment">No comments yet</div>
                )}
            </div>
        </div>
    );
};

export default Comment;