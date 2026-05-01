import { useState } from "react";
import { usePartner } from '../Layouts/PartnerLayout.jsx'
import { useNavigate } from "react-router-dom";
import './PartnerLogin.css'


const PartnerLogin = () => {
  const { login, loading } = usePartner();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!email.includes("@")) {
      alert("Email không hợp lệ");
      return false;
    }

    if (password.length < 6) {
      alert("Password phải >= 6 ký tự");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const user = await login(email, password);

    if (user) {
        console.log(user);

        if (user.role !== "OWNER") {
            alert("Bạn không phải partner!");
            return;
        }

        navigate("/partner/dashboard");
    } else {
        alert("Username hoặc password bị sai!");
    }
  };

  return (
    <div className="login-container">
      <h2>Partner Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Partner Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default PartnerLogin;