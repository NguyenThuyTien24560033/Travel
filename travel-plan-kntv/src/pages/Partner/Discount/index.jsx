import { useEffect, useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { Percent, CalendarDays, FileText, Pencil, Trash2 } from "lucide-react";
import { authorizedFetch } from "../../../../api.js";
import './Discount.css';

import AddDiscount from "./Discount_Add";
import EditDiscount from "./Discount_Edit";


const Discount = () => {
    const { location } = usePartner();

    const [discounts, setDiscounts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editDiscount, setEditDiscount] = useState(null);

    useEffect(() => {
        const data =
            typeof location?.discounts === "string"
                ? JSON.parse(location.discounts)
                : location?.discounts || [];

        setDiscounts(data);
    }, [location]);

    const handleAddSuccess = (newDiscount) => {
        setDiscounts(prev => [newDiscount, ...prev]); // thêm lên đầu
        setShowModal(false);
    };

    const handleEditSuccess = (updated) => {
        setDiscounts(prev =>
            prev.map(d => d.discount_id === updated.discount_id ? updated : d)
        );
        setEditDiscount(null);
    };

    const handleDelete = async (id) => {
        try {
            await authorizedFetch(
                `places/restaurants/${location.id}/discounts/`,
                {
                    method: "DELETE",
                    body: JSON.stringify({ discount_id: id }),
                }
            );

            setDiscounts(prev => prev.filter(d => d.discount_id !== id));
        } catch (err) {
            console.error(err);
        }
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

                                <div className="discount-actions">
                                    <Pencil size={16} onClick={() => setEditDiscount(d)} />
                                    <Trash2 size={16} onClick={() => handleDelete(d.discount_id)} />
                                </div>
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

                {editDiscount && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <EditDiscount
                                discount={editDiscount}
                                onSuccess={handleEditSuccess}
                                onClose={() => setEditDiscount(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Discount;