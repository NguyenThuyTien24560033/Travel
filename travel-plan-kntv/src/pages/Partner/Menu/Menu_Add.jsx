import { useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { authorizedFetch } from "../../../../api.js";

const AddDish = ({ onSuccess, onClose }) => {
    const { location } = usePartner();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        dish_name: "",
        price: "",
        description: ""
    });

    const handleChange = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await authorizedFetch(
                `places/restaurants/${location.id}/menu/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ...form,
                        price: Number(form.price)
                    })
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error();

            onSuccess && onSuccess(data.dish);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="menu-form">
            <button className="close-btn" onClick={onClose}>X</button>

            <h3>Add Dish</h3>

            <input
                placeholder="Dish name"
                value={form.dish_name}
                onChange={(e) => handleChange("dish_name", e.target.value)}
            />

            <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => handleChange("price", e.target.value)}
            />

            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
            />

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating..." : "Create"}
            </button>
        </div>
    );
};

export default AddDish;