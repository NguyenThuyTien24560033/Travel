import { useNavigate, useLocation } from "react-router-dom";
import {
    Home,
    MapPin,
    Utensils,
    Bed,
    Percent,
    User,
    LogOut,
} from "lucide-react";
import './PartnerSiderbar.css'

const MENU = [
    { label: "Dashboard", icon: Home, path: "/partner" },
    { label: "Location", icon: MapPin, path: "/partner/location" },
    { label: "Menu", icon: Utensils, path: "/partner/menu" },
    { label: "Room", icon: Bed, path: "/partner/room" },
    { label: "Discount", icon: Percent, path: "/partner/discount" },
    { label: "Profile", icon: User, path: "/partner/profile" },
];

const PartnerSidebar = ({ onLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className="sidebar">
        <div className="sidebar-title">Partner Panel</div>

        {MENU.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
            <div
                key={item.label}
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => {
                    if (location.pathname !== item.path) {
                        navigate(item.path);
                    }
                }}
            >
                <Icon size={18} />
                <span>{item.label}</span>
            </div>
            );
        })}

        <div className="sidebar-item logout" onClick={onLogout}>
            <LogOut size={18} />
            <span>Log out</span>
        </div>
        </div>
    );
};

export default PartnerSidebar;



// const REAL_API = {
//     plan: "travel-output/",
// };

// const handleSave = async (payload) => {
//     try {
//         const res = await authorizedFetch(REAL_API.plan, {
//             method: "POST",
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             const data = await res.json();
//             return data;
//         }
//     } catch (err) {
//         console.error(err);
//     }
// };

// const handleUpdate = async (id, payload) => {
//     try {
//         const res = await authorizedFetch(`${REAL_API.plan}${id}/`, {
//             method: "PATCH",
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             const data = await res.json();
//             return data;
//         }
//     } catch (err) {
//         console.error(err);
//     }
// };