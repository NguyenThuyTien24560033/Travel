import "./Role.css";
import { User, Map } from "lucide-react";

const Role = ({ onSelect }) => {
  return (
    <div className="role-container">
      <div className="role-card">
        <h2 className="role-title">WHO ARE YOU</h2>
        <p className="role-subtitle">
          Choose your role to start your journey
        </p>

        <div className="option">
          {/* USER */}
          <div className="role-optional">
            <User size={40} />
            <h3>Traveler</h3>
            <p>Discover and plan amazing trips</p>

            <button onClick={() => onSelect("user")}>
              Continue
            </button>
          </div>

          {/* PARTNER */}
          <div className="role-optional">
            <Map size={40} />
            <h3>Partner</h3>
            <p>Manage and share your locations</p>

            <button onClick={() => onSelect("partner")}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;