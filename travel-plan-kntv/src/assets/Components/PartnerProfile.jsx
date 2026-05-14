import './PartnerProfile.css'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePartner } from '../Layouts/PartnerLayout.jsx'
import { User } from "lucide-react";
import { Toaster, toast } from "sonner";
import { authorizedFetch } from "../../../api.js"


const REAL_API = {
  update: "users/",
};

/* ========================= */

const PartnerProfile = () => {
    // UI state
    const [editing, setEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // profile form
    const [formData, setFormData] = useState({});

    // password form
    const [password, setPassword] = useState({
    old: "",
    new: "",
    confirm: "",
    });

    const navigate = useNavigate();
    const { logout } = usePartner();

    // Lấy user từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Check xem đăng nhập chưa, chưa thì về home
    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }

        setFormData(user);
    }, [navigate]);

    // cập nhật state khi user gõ input
    const handleSubmitProfile = (e) => {
        e.preventDefault();
        const username = document.querySelector('input[name="username"]').value;
        const email = document.querySelector('input[name="email"]').value;

        const dataToUpdate = {};
        if (username !== user.username) dataToUpdate.username = username;
        if (email !== user.email) dataToUpdate.email = email;

        if (Object.keys(dataToUpdate).length === 0) {
            setEditing(false);
            return;
        }

        handleSave(dataToUpdate);
    };

    // gửi dữ liệu update profile lên backend
    const handleSave = async (input = {}) => {
        if (!user?.id) {
            toast.error("User không hợp lệ");
            return;
        }

        try {
            console.log("Dữ liệu gửi đi nè: ", input);
            const res = await authorizedFetch(`users/${user.id}/`, {
                method: "PATCH",
                body: JSON.stringify(input),
            });

            if (!res.ok) throw new Error();

            const updatedUser = await res.json();

            // 🔥 update localStorage
            localStorage.setItem("user", JSON.stringify(updatedUser));

            setFormData(updatedUser);
            setEditing(false);

            toast.success("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            toast.error("Update thất bại!");
        }
    };

    // đổi password an toàn
    const handleSubmitPassword = (e) => {
        e.preventDefault();

        if (password.new !== password.confirm) {
            toast.error("Mật khẩu không khớp");
            return;
        }

        if (password.new.length < 6) {
            toast.error("Mật khẩu >= 6 ký tự");
            return;
        }

        // Chuẩn bị dữ liệu
        const updatedData = {
            ...formData,
            password: password.new
        };

        handleSave(updatedData);

        setShowPassword(false);
        setPassword({ old: "", new: "", confirm: "" });
    };

    // hủy chỉnh sửa
    const handleCancel = () => {
        setEditing(false);
        setFormData(user);
    };


    return (
    <div className="profile-container">
        <Toaster position="top-center" richColors />

        {showPassword ? (
            <div className="modal-overlay">
                <div className="modal-content">
                    <h3>Change Password</h3>

                    <form onSubmit={handleSubmitPassword}>

                        {/* OLD PASSWORD */}
                        <input
                            type="password"
                            placeholder="Old password"
                            value={password.old}
                            onChange={(e) =>
                                setPassword(prev => ({
                                    ...prev,
                                    old: e.target.value
                                }))
                            }
                            required
                        />

                        {/* NEW PASSWORD */}
                        <input
                            type="password"
                            placeholder="New password"
                            value={password.new}
                            onChange={(e) =>
                                setPassword(prev => ({
                                    ...prev,
                                    new: e.target.value
                                }))
                            }
                            required
                        />

                        {/* CONFIRM PASSWORD */}
                        <input
                            type="password"
                            placeholder="Confirm password"
                            value={password.confirm}
                            onChange={(e) =>
                                setPassword(prev => ({
                                    ...prev,
                                    confirm: e.target.value
                                }))
                            }
                            required
                        />

                        <div className="modal-actions">
                            <button type="submit">Save</button>
                            <button
                                type="button"
                                onClick={() => setShowPassword(false)}
                            >
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
                        defaultValue={formData.username || ""}
                        disabled={!editing}
                        placeholder="Business Name"
                    />

                    <input
                        name="email"
                        defaultValue={formData.email || ""}
                        disabled={!editing}
                        placeholder="Email"
                    />

                    <input
                        name="type_location"
                        defaultValue={formData.type_location || ""}
                        disabled={true}
                        placeholder="Location type"
                    />
                </div>

                <div className="button-group">
                    {!editing ? (
                    <>
                        <button onClick={() => setEditing(true)}>Edit</button>
                        <button onClick={() => setShowPassword(true)}>
                            Change Password
                        </button>
                        <button onClick={logout}>Logout</button>
                    </>
                    ) : (
                    <>
                        <button onClick={handleSubmitProfile}>Save</button>
                        <button
                            onClick={() => {
                                setEditing(false);
                                // setFormData(user);
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

