import { useState, useEffect } from "react";
import { usePartner } from '../../../assets/Layouts/PartnerLayout.jsx';
import { authorizedFetch } from "../../../../api.js";
import { toast, Toaster } from "sonner";
import {
    MapPin,
    Star,
    Phone,
    Tag,
    FileText,
    Save,
    X,

    Clock,
    CalendarDays,   // Giờ, ngày vận hành
    Umbrella,

    Map,            // Định vị
} from "lucide-react";
import "./Detail.css";

import {renderFieldsByType} from "./Detail_Frame.jsx"


const Detail = () => {
    const [form, setForm] = useState({});
    const [loading, setLoading] = useState(false);
    const [dateInput, setDateInput] = useState("");

    const { location, setLocation } = usePartner();
    const user = JSON.parse(localStorage.getItem("user"));
    // form: luôn chứa dữ liệu mới nhất, ban đầu là lấy từ location sau đó trong quá trình nhập sẽ được lưu lại thông qua 
    // handleChange.
    // dateInput: chứa dữ liệu ngày nghỉ trong năm đang được nhập

    // Hàm helper
    const safeArray = (v) => {
        if (Array.isArray(v)) return v;

        if (typeof v === "string") {
            try {
                return JSON.parse(v);
            } catch {
                try {
                    // replace ' → "
                    const fixed = v.replace(/'/g, '"');
                    return JSON.parse(fixed);
                } catch {
                    return [];
                }
            }
        }

        return [];
    };

    // Cập nhật dữ liệu từ location vào form
    useEffect(() => {
        if (!location) return;

        const cuisine_types = location.cuisine_types || [];
        const tags = location.tags || [];

        setForm({
            ...location,
            off_dates: safeArray(location.off_dates),
            off_weekdays: safeArray(location.off_weekdays),
            active_hours: safeArray(location.active_hours),
            cuisine_types: safeArray(cuisine_types),
            tags: safeArray(tags),
        });
    }, [location]);

    // Cập nhật form khi dữ liệu thay đổi
    const handleChange = (key, value) => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Reset lại data khi không muốn thay đổi nữa
    const handleCancel = async () => {
        if (!location) return;

        const cuisine_types = location.cuisine_types || [];
        const tags = location.tags || [];

        setForm({
            ...location,
            off_dates: safeArray(location.off_dates),
            off_weekdays: safeArray(location.off_weekdays),
            active_hours: safeArray(location.active_hours),
            cuisine_types: safeArray(cuisine_types),
            tags: safeArray(tags),
        });
    };

// -------------------------------------------------------------
// ---------------------------SAVE------------------------------
// -------------------------------------------------------------
    // Các đường dẫn
    const TYPE_TO_ENDPOINT = {
        RESTAURANT: "places/restaurants",
        ACCOMMODATION: "places/hotels",
        ENTERTAINMENT: "places/attractions",
    };

    // Bỏ field dư
    const REMOVE_FIELDS = {
        ENTERTAINMENT: ["cuisine_types", "discounts", "comments", "location"],
        RESTAURANT: ["tags", "discounts", "comments", "dish", "location"],
        ACCOMMODATION: ["tags", "cuisine_types", "discounts", "comments", "room", "location"],
    };

    // Lấy đường dẫn thông qua user.type_location
    const getEndpoint = () => {

        return TYPE_TO_ENDPOINT[user.type_location] || "places";
    };

    // Save dữ liệu
    const handleSave = async () => {
        setLoading(true);

        try {
            const endpoint = getEndpoint();
            const payload = {
                ...form,
                off_dates: form.off_dates || [],
                off_weekdays: form.off_weekdays || [],
                active_hours: form.active_hours || [0],
            };

            // Bỏ field dư
            (REMOVE_FIELDS[user.type_location] || []).forEach(field => {
                delete payload[field];
            });

            console.log("Dữ liệu gửi đi nè: ", payload, form.id) 
            // return;

            const res = await authorizedFetch(`${endpoint}/${form.id}/`, {
                method: "PATCH",
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error();

            setLocation(form);
            toast.success("Updated successfully!");

            setForm({
                ...location,
                off_dates: safeArray(location.off_dates),
                off_weekdays: safeArray(location.off_weekdays),
                active_hours: safeArray(location.active_hours),
                cuisine_types: safeArray(cuisine_types),
                tags: safeArray(tags),
            });
        } catch (err) {
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };
// -------------------------------------------------------------
// -------------------------------------------------------------

    const ACTIVE_HOUR_OPTIONS = [
        { label: "All day", value: 0 },
        { label: "Morning", value: 1 },
        { label: "Afternoon", value: 2 },
        { label: "Evening", value: 3 },
        { label: "Midnight", value: 4 },
    ];

    const OFF_WEEKDAY_OPTIONS = [
        { label: "Sunday", value: 1 },
        { label: "Monday", value: 2 },
        { label: "Tuesday", value: 3 },
        { label: "Wednesday", value: 4 },
        { label: "Thursday", value: 5 },
        { label: "Friday", value: 6 },
        { label: "Saturday", value: 7 },
    ];

    const toggleArrayValue = (key, value) => {
        setForm(prev => {
            const arr = prev[key] || [];

            const exists = arr.includes(value);

            return {
                ...prev,
                [key]: exists
                    ? arr.filter(v => v !== value)
                    : [...arr, value],
            };
        });
    };

    const priceLevelText = (level) => {
        const map = {
            0: "Miễn phí",
            1: "≤ 100k",
            2: "100k - 200k",
            3: "200k - 300k",
            4: "300k - 400k",
        };

        return map[level] || "400k+";
    };




    if (!location) return <div>No data</div>;

    return (
        <div className="detail-container">
            <Toaster position="top-center" richColors />

            {/* HEADER */}
            <div className="detail-header">
                <h2>Edit Location Detail</h2>
            </div>


            {/* BASIC INFO */}
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


            {/* LOCATION */}
            <div className="section location-box">
                <h3><Map size={18} /> Định vị </h3>

                <div className="grid">

                    {/* LATITUDE */}
                    <h4>Latitude</h4>
                    <input
                        type="number"
                        step="any"
                        value={form.latitude || ""}
                        onChange={(e) =>
                            handleChange("latitude", Number(e.target.value))
                        }
                        placeholder="Latitude"
                    />

                    {/* LONGITUDE */}
                    <h4>Longitude</h4>
                    <input
                        type="number"
                        step="any"
                        value={form.longitude || ""}
                        onChange={(e) =>
                            handleChange("longitude", Number(e.target.value))
                        }
                        placeholder="Longitude"
                    />
                </div>

                {/* MAP LINK */}
                {form.latitude && form.longitude && (
                    <a className="map-link"
                        href={`https://www.google.com/maps?q=${form.latitude},${form.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        🗺 Open in Google Maps
                    </a>
                )}
            </div>


            {/* HOURS */}
            <div className="section">
                <h3><Clock size={18} /> Active Hours</h3>
                <div className="tag-group">
                    {ACTIVE_HOUR_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`tag ${form.active_hours?.includes(opt.value) ? "active" : ""}`}
                            onClick={() => toggleArrayValue("active_hours", opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>


                <h3><CalendarDays size={18} /> Off Weekdays</h3>
                <div className="tag-group">
                    {OFF_WEEKDAY_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            type="button"
                            className={`tag ${form.off_weekdays?.includes(opt.value) ? "active" : ""}`}
                            onClick={() => toggleArrayValue("off_weekdays", opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>


                <h3><Umbrella size={18} /> Off Dates</h3>
                <div style={{ display: "flex", gap: 8 }}>
                    <input
                        value={dateInput}
                        onChange={(e) => setDateInput(e.target.value)}
                        placeholder="DD-MM (e.g. 30-04)"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (!dateInput) return;

                            setForm(prev => ({
                                ...prev,
                                off_dates: [...(prev.off_dates || []), dateInput],
                            }));

                            setDateInput("");
                        }}
                    >
                        Add
                    </button>
                </div>

                <div className="tag-group">
                    {(form.off_dates || []).map((d, idx) => (
                        <span
                            key={idx}
                            className="tag active"
                            onClick={() =>
                                setForm(prev => ({
                                    ...prev,
                                    off_dates: (prev.off_dates || []).filter(x => x !== d),
                                }))
                            }
                        >
                            {d} ✕
                        </span>
                    ))}
                </div>
            </div>


            {/* PRICE */}
            <div className="section price-box">
                <h3>💰 Pricing</h3>

                <div className="grid--column">

                    {/* PRICE LEVEL */}
                    <select
                        value={form.price_level || 0}
                        onChange={(e) =>
                            handleChange("price_level", Number(e.target.value))
                        }
                    >
                        <option value={0}>Miễn phí</option>
                        <option value={1}>≤ 100k</option>
                        <option value={2}>100k - 200k</option>
                        <option value={3}>200k - 300k</option>
                        <option value={4}>300k - 400k</option>
                        <option value={5}>400k+</option>
                    </select>

                    {/* MIN PRICE */}
                    <input
                        type="number"
                        value={form.min_price || "0"}
                        onChange={(e) =>
                            handleChange("min_price", Number(e.target.value))
                        }
                        placeholder="Min price (VND)"
                    />

                    {/* MAX PRICE */}
                    <input
                        type="number"
                        value={form.max_price || "0"}
                        onChange={(e) =>
                            handleChange("max_price", Number(e.target.value))
                        }
                        placeholder="Max price (VND)"
                    />

                    {/* SURGE PRICE */}
                    <label className="checkbox-row">
                        <input
                            type="checkbox"
                            checked={form.has_surge_price || false}
                            onChange={(e) =>
                                handleChange("has_surge_price", e.target.checked)
                            }
                        />
                        🔥 Có tăng giá cuối tuần
                    </label>
                </div>
            </div>


            {/* TAGS */}
            {renderFieldsByType(user.type_location, {
                form,
                handleChange,
                toggleArrayValue,
            })}


            {/* RATING (readonly) */}
            <div className="section">
                <h3><Star size={18} /> Rating Info</h3>

                <div className="readonly">
                    <p>Rating: {form.rating || 0} / 5</p>
                    <p>Reviews: {form.review_count || 0}</p>
                </div>
            </div>


            {/* SAVE FOOTER */}
            <div className="footer">
                <button onClick={handleCancel} disabled={loading}>
                    {loading ? "Reset..." : "Reset data"}
                </button>

                <button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </div>
    );
};

export default Detail;