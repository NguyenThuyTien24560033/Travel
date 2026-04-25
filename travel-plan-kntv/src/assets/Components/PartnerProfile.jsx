import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePartner } from '../Layouts/PartnerLayout.jsx'
import './PartnerProfile.css'
import { User } from "lucide-react";
import { Toaster, toast } from "sonner";

/* =========================
   🔥 CONFIG MODE
========================= */
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_API = "http://localhost:3001/users";

const REAL_API = {
  update: "users/",
};

/* ========================= */

const PartnerProfile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = usePartner();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =========================
     🔹 INIT USER
  ========================= */
  useEffect(() => {
    if (!user) {
      navigate("/users");
      return;
    }

    setFormData(user);
  }, [user, navigate]);

  /* =========================
     🔹 INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     🔹 UPDATE PROFILE
  ========================= */
  const handleSave = async () => {
    if (!user?.id) {
      toast.error("User ID không tồn tại!");
      return;
    }

    try {
      let updatedUser;

      if (MODE === "JSON_SERVER") {
        const res = await fetch(`${JSON_API}/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error();
        updatedUser = await res.json();
      } else {
        const res = await fetch(REAL_API.update, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error();
        updatedUser = await res.json();
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setEditing(false);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi update!");
    }
  };

  /* =========================
     🔹 CHANGE PASSWORD
  ========================= */
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (MODE === "JSON_SERVER") {
      if (oldPassword !== user.password) {
        toast.error("Sai mật khẩu cũ");
        return;
      }
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
      let updatedUser;

      if (MODE === "JSON_SERVER") {
        const res = await fetch(`${JSON_API}/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: newPassword }),
        });

        if (!res.ok) throw new Error();
        updatedUser = await res.json();
      } else {
        const res = await fetch(`${REAL_API.update}change-password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            old_password: oldPassword,
            new_password: newPassword,
          }),
        });

        if (!res.ok) throw new Error();

        updatedUser = { ...user, password: newPassword };
      }

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

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
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Business Name"
            />

            <input
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Email"
            />

            <input
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              disabled={!editing}
              placeholder="Phone Number"
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

export default PartnerProfile;