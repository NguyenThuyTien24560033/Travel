import { useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { authorizedFetch } from "../../../../api.js";

const EditDiscount = ({ discount, onSuccess, onClose }) => {
    const { location, user } = usePartner();

    const [form, setForm] = useState(discount);
    const [loading, setLoading] = useState(false);

    const handleChange = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
    };

    const getBasePath = () => {
        switch (user?.type_location) {
            case "RESTAURANT":
                return "restaurants";
            case "ACCOMMODATION":
                return "hotels";
            case "ATTRACTION":
                return "attractions";
            default:
                return null;
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const base = getBasePath();

            const res = await authorizedFetch(
                `places/${base}/${location.id}/discounts/`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        ...form,
                        percent: Number(form.percent),
                    }),
                }
            );

            if (!res.ok) throw new Error();

            onSuccess && onSuccess(form);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="discount-form">
            <button className="close-btn" onClick={onClose}>X</button>

            <h3>Edit Discount</h3>

            <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />

            <input
                type="number"
                value={form.percent}
                onChange={(e) => handleChange("percent", e.target.value)}
            />

            <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <div className="date-row">
                <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) => handleChange("start_date", e.target.value)}
                />
                <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) => handleChange("end_date", e.target.value)}
                />
            </div>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
};

export default EditDiscount;