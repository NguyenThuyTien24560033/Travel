import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../../assets/Layouts/UserLayout.jsx';
import "./UserProfile.css";
import { User } from "lucide-react";
import { Toaster, toast } from "sonner";


const JSON_API = "http://localhost:3001/users";

//Đình Khang đổi đường dẫn tại đây
const REAL_API = "";

//Đình Khang đổi thành REAL_API tại đây
const API_BASE = JSON_API;

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useUser();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /**
   * =========================
   * 🔹 INIT USER
   * =========================
   */
  useEffect(() => {
    if (!user) {
      navigate("/users");
      return;
    }

    setFormData(user);
  }, [user, navigate]);

  /**
   * =========================
   * 🔹 INPUT CHANGE
   * =========================
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * =========================
   * 🔹 UPDATE PROFILE
   * =========================
   */
  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User ID không tồn tại!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${user.id}`, {
        method: "PATCH", // JSON Server nên dùng PATCH
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();

      // 🔥 update context + localStorage
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      setEditing(false);

      toast.success("Cập nhật thành công!");

      window.dispatchEvent(new Event("userChanged"));
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi update!");
    }
  };

  /**
   * =========================
   * 🔹 CHANGE PASSWORD
   * =========================
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (oldPassword !== user.password) {
      toast.error("Sai mật khẩu cũ");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu >= 6 ký tự");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      toast.success("Đổi mật khẩu thành công!");

      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Đổi mật khẩu thất bại");
    }
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <Toaster position="top-center" richColors />

      {showChangePassword ? (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Change Password</h3>

            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="Old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="modal-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setShowChangePassword(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="profile-card">
          <User size={70} />

          <div className="profile-info">
            <input
              name="username"
              value={formData.username || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Username"
            />

            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Email"
            />

            <input
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Phone"
            />

            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Address"
            />
          </div>

          <div className="button-group">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={() => setShowChangePassword(true)}>
                  Change Password
                </button>
                <button onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={handleSave}>Save</button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData(user);
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;