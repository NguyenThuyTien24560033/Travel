import { useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { authorizedFetch } from "../../../../api.js";

const EditRoom = ({ room, onSuccess, onClose }) => {
    const { location } = usePartner();

    const [form, setForm] = useState(room);
    const [loading, setLoading] = useState(false);

    const handleChange = (k, v) => {
        setForm(prev => ({ ...prev, [k]: v }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const res = await authorizedFetch(
                `places/hotels/${location.id}/rooms/`,
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
        <div className="room-form">
            <button className="close-btn" onClick={onClose}>X</button>

            <h3>Edit Room</h3>

            <input
                value={form.type_name}
                onChange={(e) => handleChange("type_name", e.target.value)}
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

export default EditRoom;