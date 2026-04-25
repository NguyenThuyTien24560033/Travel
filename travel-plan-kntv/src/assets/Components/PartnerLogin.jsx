import { useState } from "react";
import { usePartner } from "../Layouts/PartnerLayout.jsx"; // Đảm bảo đúng đường dẫn
import { useNavigate } from "react-router-dom";
import './PartnerLogin.css'

const PartnerLogin = () => {
  const { login, register, loading } = usePartner();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);

  // State cho form
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 VALIDATE FORM
  const validate = () => {
    if (!email.includes("@")) {
      alert("Email không hợp lệ");
      return false;
    }

    if (password.length < 6) {
      alert("Mật khẩu phải từ 6 ký tự trở lên");
      return false;
    }

    if (!isLogin && username.trim().length < 3) {
      alert("Tên đối tác phải từ 3 ký tự trở lên");
      return false;
    }

    return true;
  };

  // 🔹 XỬ LÝ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (isLogin) {
      // Đăng nhập đối tác
      const success = await login(email, password);
      if (success) {
        // Sau khi login thành công, PartnerLayout đã lưu token và user
        navigate("/partner"); // Điều hướng đến trang quản trị đối tác
      }
    } else {
      // Đăng ký đối tác
      const success = await register({
        email,
        username: username.trim(),
        password,
      });

      if (success) {
        // Alert này khớp với logic toast.success trong Layout của bạn
        setIsLogin(true);
        // Reset form
        setUsername("");
        setEmail("");
        setPassword("");
      }
    }
  };

  return (
    <div className="login-container partner-login">
      <h2>{isLogin ? "Partner Login" : "Partner Registration"}</h2>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        {isLogin ? "Truy cập hệ thống quản lý đối tác" : "Trở thành đối tác kinh doanh của chúng tôi"}
      </p>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {/* Tên đối tác (chỉ hiện khi đăng ký) */}
        {!isLogin && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Tên đối tác / Thương hiệu"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email doanh nghiệp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn-submit"
        >
          {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký đối tác"}
        </button>
      </form>

      <div className="switch-mode" style={{ marginTop: "15px" }}>
        <span>
          {isLogin ? "Bạn muốn hợp tác với chúng tôi?" : "Đã có tài khoản đối tác?"}
        </span>
        <span
          style={{ color: "green", fontWeight: "bold", cursor: "pointer", marginLeft: 5 }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Đăng ký ngay" : "Đăng nhập tại đây"}
        </span>
      </div>
    </div>
  );
};

export default PartnerLogin;