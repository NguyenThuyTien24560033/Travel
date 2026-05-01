import { useState, useEffect } from "react";
import { usePartner } from '../../assets/Layouts/PartnerLayout.jsx';
import { Toaster, toast } from "sonner";
import './Menu.css';

/* ========================= */
// const MODE = "JSON_SERVER";
// const JSON_API = "http://localhost:3001/users";


const MODE = "REAL_BACKEND";
const REAL_API = {
    // Cái này phải gắn thêm id và "menu" vào cuối
    Dish: 'places/restaurants'
};
/* ========================= */

const DEFAULT_IMAGE = "https://placehold.co/300x200";


const PartnerMenu = () => {
    const { user, setUser, location } = usePartner();
    const [dishes, setDishes] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({
        dish_name: "",
        price: "",
        description: "",
        image: ""
    });

    const isOwner = user?.role === "OWNER";


    useEffect(() => {
        setDishes(location?.dishes || []);
    }, [location]);


    /* ================= INPUT ================= */
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    /* ================= SAVE ================= */
    const handleSave = async () => {
        if (!isOwner) return toast.error("Không có quyền!");

        try {
            let updatedUser;
            // 1. Xác định URL: places/restaurants/<location_id>/menu/
            const locationId = location.id;
            const url = `${REAL_API.Dish}/${locationId}/menu/`;

            try {
            setLoading(true);
            let res;

            if (editingId) {
                // --- UPDATE (SỬA MÓN) ---
                // Backend dùng logic: d_id = request.data.get('dish_id')
                res = await authorizedFetch(url, {
                    method: "PUT",
                    body: JSON.stringify({
                        ...form,
                        dish_id: editingId, // Truyền ID món vào body để backend nhận diện
                    }),
                });
            } else {
                // --- CREATE (THÊM MỚI) ---
                res = await authorizedFetch(url, {
                    method: "POST",
                    body: JSON.stringify(form),
                });
            }

            // Kiểm tra phản hồi
            if (res.ok) {
                const data = await res.json();
                console.log("Thao tác Menu thành công:", data);
                return data;
            } else {
                const errorData = await res.json();
                console.error("Lỗi thao tác Menu:", errorData.message);
            }

            } catch (err) {
                console.error("Lỗi kết nối API Menu:", err);
            } finally {
                setLoading(false);
            }

            /* ================= SYNC ================= */
            // localStorage.setItem("user", JSON.stringify(updatedUser));
            // setUser(updatedUser);

            // setShowModal(false);
            // setEditingId(null);

            // setForm({
            // dish_name: "",
            // price: "",
            // description: "",
            // image: ""
            // });

            // toast.success("Saved!");
        } catch (err) {
            console.error(err);
            toast.error("Lỗi!");
        }
    };

    /* ================= DELETE ================= */
    // Mấy cái handle này có cái bị trùng rồi. làm lại từ đầu đi
    const handleDelete = async (id) => {
        if (!isOwner) return toast.error("Không có quyền!");

        try {
            let updatedUser;
            const locationId = location.id;
            const url = `${REAL_API.Dish}/${locationId}/menu/`;

            try {
            setLoading(true);

            // 2. Gọi authorizedFetch với method DELETE
            // Lưu ý: ID của món ăn cần xóa (id) phải được bỏ vào body JSON
            const res = await authorizedFetch(url, {
                method: "DELETE",
                body: JSON.stringify({
                dish_id: id // 'id' này là ID của món ăn bạn truyền vào hàm delete
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Xóa món thất bại");
            }

            const data = await res.json();
            console.log("Xóa món thành công:", data);
            
            // Trả về data để cập nhật lại state UI (nếu cần)
            return data;

            } catch (err) {
            console.error("Lỗi khi xóa món:", err);
            } finally {
            setLoading(false);
            }
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);

    toast.success("Deleted!");
    } catch {
    toast.error("Xóa thất bại!");
    }
    };

    /* ================= EDIT ================= */
    const handleEdit = (dish) => {
    setForm({
    dish_name: dish.dish_name,
    price: dish.price,
    description: dish.description,
    image: dish.image || ""
    });
    setEditingId(dish.dish_id);
    setShowModal(true);
    };

    /* ================= UI ================= */
    return (
        <div className="menu-container">
            <Toaster position="top-center" richColors />

            <div className="menu-header">
                <h2>Menu Management</h2>

                {isOwner && (
                    <button onClick={() => setShowModal(true)}>+ Add Dish</button>
                )}
            </div>

            <div className="menu-grid">
                {dishes.length === 0 ? ( <p>No dishes</p> ) : ( dishes.map(d => (
                    <div key={d.dish_id} className="menu-card">
                        <img src={d.image || DEFAULT_IMAGE} alt={d.dish_name}/>

                        <h4>{d.dish_name}</h4>
                        <p>{d.description}</p>
                        <b>{d.price} VND</b>

                        {isOwner && (
                            <div className="actions">
                                <button onClick={() => handleEdit(d)}>Edit</button>
                                <button onClick={() => handleDelete(d.dish_id)}>Delete</button>
                            </div>
                        )}
                    </div>
                )))}
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingId ? "Edit Dish" : "Add Dish"}</h3>

                        <input
                            name="dish_name"
                            value={form.dish_name}
                            onChange={handleChange}
                            placeholder="Name"
                        />

                        <input
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            placeholder="Price"
                        />

                        <input
                            name="image"
                            value={form.image}
                            onChange={handleChange}
                            placeholder="Image URL"
                        />

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            placeholder="Description"
                        />

                        <div className="modal-actions">
                            <button onClick={handleSave}>
                                {editingId ? "Update" : "Create"}
                            </button>
                            <button onClick={() => setShowModal(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerMenu;