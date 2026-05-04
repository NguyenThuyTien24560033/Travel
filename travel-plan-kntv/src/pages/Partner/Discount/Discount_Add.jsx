import { useState } from "react";
import { usePartner } from '../../../assets/Layouts/PartnerLayout.jsx';
import { authorizedFetch } from "../../../../api.js"

const AddDiscount = ({ onSuccess, onClose  }) => {
    const { user, location } = usePartner();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        percent: "",
        description: "",
        start_date: "",
        end_date: "",
    });



    const handleChange = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
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
        const base = getBasePath();

        try {
            setLoading(true);

            const payload = {
                ...form,
                percent: Number(form.percent),
            };

            // console.log("Dữ liệu gửi đi nè: ", payload);
            // return;

            const res = await authorizedFetch(
                `places/${base}/${location.id}/discounts/`,
                {
                    method: "POST",
                    body: JSON.stringify( payload ),
                }
            );

            const data = await res.json();

            if (!res.ok) throw new Error("Failed");

            onSuccess && onSuccess(data.discount); // 🔥 trả về discount mới

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="discount-form">
            <button onClick={onClose} className="close-btn">X</button>

            <h3>Add Discount</h3>

            <input
                placeholder="Title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
            />

            <input
                type="number"
                placeholder="Percent (%)"
                value={form.percent}
                onChange={(e) => handleChange("percent", e.target.value)}
            />

            <textarea
                placeholder="Description"
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
                {loading ? "Creating..." : "Create Discount"}
            </button>
        </div>
    );
};

export default AddDiscount;