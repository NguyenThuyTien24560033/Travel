import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  Clock,
  Percent,
  Bell,
  Star,
  User,
  LogOut,
  Utensils,
  Home
} from "lucide-react";
import './PartnerSiderbar.css'

const MENU = [
  { label: "Dashboard", icon: Home, path: "/partner" },
  { label: "Location", icon: MapPin, path: "/partner/location" },
  { label: "Hours", icon: Clock, path: "/partner/hours" },
   { label: "Menu", icon: MapPin, path: "/partner/menu" },
  { label: "Discount", icon: Percent, path: "/partner/discount" },
  { label: "Notifications", icon: Bell, path: "/partner/notifications" },
  { label: "Rating", icon: Star, path: "/partner/rating" },
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
        const isActive = location.pathname === item.path;

        return (
          <div
            key={item.label}
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(item.path)}
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