import { useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { authorizedFetch } from "../../../../api.js";

const EditDish = ({ dish, onSuccess, onClose }) => {
    const { location } = usePartner();

    const [form, setForm] = useState(dish);
    const [loading, setLoading] = useState(false);

    const handleChange = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await authorizedFetch(
                `places/restaurants/${location.id}/menu/`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price)
                    })
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
        <div className="menu-form">
            <button className="close-btn" onClick={onClose}>X</button>

            <h3>Edit Dish</h3>

            <input
                value={form.dish_name}
                onChange={(e) => handleChange("dish_name", e.target.value)}
            />

            <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
            />

            <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Save"}
            </button>
        </div>
    );
};

export default EditDish;