import { usePartner } from '../../../assets/Layouts/PartnerLayout.jsx';
import { 
    MapPin,
    Clock,
    Star,
    MessageCircle,
    Phone,
    Tag,
    FileText 
} from "lucide-react";
import './DashBoard.css'

const DashBoard = () => {
    const { location } = usePartner();

    if (!location) {
        return <div style={{ padding: 20 }}>No data available</div>;
    }

    // Giờ mở cửa
    const activeHours =
        typeof location?.active_hours === "string"
            ? JSON.parse(location.active_hours)
            : location?.active_hours;

    const ACTIVE_HOURS_MAP = {
        0: "All day",
        1: "Morning",
        2: "Afternoon",
        3: "Evening",
        4: "Night",
    };

    // Tags (chung)
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

    const CUISINE_MAP = {
        1: "meat",
        2: "seafood",
        3: "vegetarian",
        4: "family-style",
        5: "set meals",
        6: "hotpot",
    };

    const HOTEL_MAP = {
        1: "hotel",
        2: "motel",
        3: "homestay",
        4: "resort",
        5: "villa",
    };

    const parseArray = (data) => {
        if (!data) return [];

        if (typeof data === "string") {
            try {
                return JSON.parse(data);
            } catch {
                return [];
            }
        }

        return Array.isArray(data) ? data : [];
    };

    // 👇 logic chính
    let tags = [];

    if (location?.tags || location?.cuisine_types) {
        // 👉 dùng chung parser
        const raw = location.tags || location.cuisine_types;

        const mapSource = location.tags ? TAGS_MAP : CUISINE_MAP;

        tags = parseArray(raw)
            .map(id => mapSource[id])
            .filter(Boolean);
    } 
    else if (location?.hotel_type) {
        tags = [HOTEL_MAP[location.hotel_type]];
    }



    return (
        <div className="dashboard">
            {/* Thẻ to nhất lưu hiển thị name, address */}
            <div className="card">
                <h2>{location?.name || "No name"}</h2>
                <p><MapPin size={16} /> {location?.address || "No address"}</p>
            </div>

            {/* Các thẻ con hiển thị giờ hoạt động, số sao và bao nhiêu lượt đánh giá, số điện thoại, tag, description */}
            <div className="stats">
                {/* Hours */}
                <div className="stat hours">
                    <Clock />
                    <div>
                        <h4>Hours</h4>
                        <p>
                            {Array.isArray(activeHours)
                                ? activeHours.map(h => ACTIVE_HOURS_MAP[h]).join(", ")
                                : "No schedule"}
                        </p>
                    </div>
                </div>
                
                {/* Rating + Reviews */}
                <div className="stat rating">
                    <Star />
                    <div>
                        <h4>
                            {location?.rating || 0} / 5
                        </h4>
                        <p>
                            {location?.review_count || 0} reviews
                        </p>
                    </div>
                </div>

                {/* Tags */}
                <div className="stat tags">
                    <Tag />
                    <div>
                        <h4>Tags</h4>
                        <p>
                            {Array.isArray(tags) && tags.length > 0
                                ? tags.join(", ")
                                : "No tags"}
                        </p>
                    </div>
                </div>

                {/* Phone */}
                <div className="stat phone">
                    <Phone />
                    <div>
                        <h4>Phone</h4>
                        <p>{location?.phone_number || "No phone"}</p>
                    </div>
                </div>

                {/* Description */}
                <div className="stat full">
                    <FileText />
                    <div>
                        <h4>Description</h4>
                        <p>{location?.description || "No description"}</p>
                    </div>
                </div>  
            </div>
        </div>
    );
};

export default DashBoard;