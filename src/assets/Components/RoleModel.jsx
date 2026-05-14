import { useNavigate } from "react-router-dom";
import Role from "../../pages/Role";

const RolePage = () => {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    if (role === "user") {
      navigate("/users");
    } else {
      navigate("/partner/login");
    }
  };

  return <Role onSelect={handleSelect} />;
};

export default RolePage;