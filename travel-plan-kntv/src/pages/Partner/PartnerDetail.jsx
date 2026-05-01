import { useState, useEffect } from "react";
import { usePartner } from '../../assets/Layouts/PartnerLayout.jsx';
import { authorizedFetch } from "../../../api.js";
import { toast, Toaster } from "sonner";
import './PartnerDetail.css'

import {
    MapPin,
    Clock,
    Star,
    Phone,
    Tag,
    FileText,
    Save,
    X
} from "lucide-react";

import "./PartnerDetail.css";

const ACTIVE_HOURS_MAP = {
    0: "All day",
    1: "Morning",
    2: "Afternoon",
    3: "Evening",
    4: "Night",
};

const TAGS_MAP = {
    1: "relax",
    2: "adventure",
    3: "food tour",
    4: "cultural",
    5: "playground",
    6: "history",
    7: "thrill",
    8: "beach",
    9: "take picture",
};

const PartnerDetail = () => {
    const { location } = usePartner();

    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (location) setForm(location);
    }, [location]);

    const handleChange = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            const res = await authorizedFetch(`locations/${form.id}/`, {
                method: "PATCH",
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error();

            toast.success("Updated successfully!");
        } catch (err) {
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    if (!form) return <div>No data</div>;

    return (
        <div className="detail-container">
            <Toaster position="top-center" richColors />

            {/* HEADER */}
            <div className="detail-header">
                <h2>Edit Location Detail</h2>

                <div className="actions">
                    <button className="save" onClick={handleSave}>
                        <Save size={16} /> Save
                    </button>
                </div>
            </div>

            {/* CORE INFO */}
            <div className="section">
                <h3><MapPin size={18} /> Basic Info</h3>

                <div className="grid">
                    <input
                        value={form.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        placeholder="Name"
                    />

                    <input
                        value={form.address || ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                        placeholder="Address"
                    />

                    <input
                        value={form.phone_number || ""}
                        onChange={(e) => handleChange("phone_number", e.target.value)}
                        placeholder="Phone"
                    />
                </div>

                <textarea
                    value={form.description || ""}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Description"
                />
            </div>

            {/* HOURS */}
            <div className="section">
                <h3><Clock size={18} /> Active Hours</h3>

                <input
                    value={form.active_hours || ""}
                    onChange={(e) => handleChange("active_hours", e.target.value)}
                    placeholder='e.g. [0,1]'
                />
            </div>

            {/* RATING (readonly) */}
            <div className="section">
                <h3><Star size={18} /> Rating Info</h3>

                <div className="readonly">
                    <p>Rating: {form.rating || 0} / 5</p>
                    <p>Reviews: {form.review_count || 0}</p>
                </div>
            </div>

            {/* TAGS */}
            <div className="section">
                <h3><Tag size={18} /> Tags</h3>

                <input
                    value={form.tags || ""}
                    onChange={(e) => handleChange("tags", e.target.value)}
                    placeholder="e.g. [1,9]"
                />
            </div>

            {/* SAVE FOOTER */}
            <div className="footer">
                <button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default PartnerDetail;