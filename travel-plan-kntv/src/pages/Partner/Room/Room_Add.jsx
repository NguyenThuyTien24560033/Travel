import { useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { authorizedFetch } from "../../../../api.js";

const AddRoom = ({ onSuccess, onClose }) => {
    const { location } = usePartner();

    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        type_name: "",
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
                `places/hotels/${location.id}/rooms/`,
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

            onSuccess && onSuccess(data.room);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="room-form">
            <button className="close-btn" onClick={onClose}>X</button>

            <h3>Add Room</h3>

            <input
                placeholder="Room type"
                value={form.type_name}
                onChange={(e) => handleChange("type_name", e.target.value)}
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

export default AddRoom;