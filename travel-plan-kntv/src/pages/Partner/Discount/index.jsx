import { Percent, CalendarDays, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import './Discount.css';
import { usePartner } from '../../../assets/Layouts/PartnerLayout.jsx';
import AddDiscount from "./Discount_Add";

const Discount = () => {
    const { location } = usePartner();
    const [discounts, setDiscounts] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const data =
            typeof location?.discounts === "string"
                ? JSON.parse(location.discount)
                : location?.discounts || [];

        setDiscounts(data);
    }, [location]);

    const handleAddSuccess = (newDiscount) => {
        setDiscounts(prev => [newDiscount, ...prev]); // thêm lên đầu
        setShowModal(false);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "N/A";
        return new Date(dateStr).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };





    if (!location) {
        return <div style={{ padding: 20 }}>No data available</div>;
    }

    return (
        <div className="discount-page">
            <h2>Discount Programs</h2>
            
            <button className="add-btn" onClick={() => setShowModal(true)}>
                + Add Discount
            </button>

            <div className="discount-container">
                {discounts.length > 0 ? (
                    discounts.map((d) => {
                        const isExpired =
                            d.end_date && new Date(d.end_date) < new Date();

                        return (
                            <div
                                key={d.discount_id}
                                className={`discount-card ${isExpired ? "expired" : ""}`}
                            >
                                {/* Title + % */}
                                <div className="discount-header">
                                    <div className="discount-title">
                                        {d.title || "No title"}
                                    </div>

                                    <div className="discount-percent">
                                        <Percent size={16} />
                                        {d.percent || 0}%
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="discount-desc">
                                    <FileText size={16} />
                                    <span>
                                        {d.description || "No description"}
                                    </span>
                                </div>

                                {/* Date */}
                                <div className="discount-date">
                                    <CalendarDays size={16} />
                                    <span>
                                        {formatDate(d.start_date)} → {formatDate(d.end_date)}
                                    </span>
                                </div>

                                {/* Status */}
                                {isExpired && (
                                    <div className="discount-badge">Expired</div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="no-discount">
                        No discount programs available
                    </div>
                )}

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <AddDiscount
                                onSuccess={handleAddSuccess}
                                onClose={() => setShowModal(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discount;