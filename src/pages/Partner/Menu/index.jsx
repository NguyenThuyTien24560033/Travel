import { useEffect, useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { Banknote, FileText, Pencil, Trash2 } from "lucide-react";
import { authorizedFetch } from "../../../../api.js";
import "./Menu.css";

import AddDish from "./Menu_Add";
import EditDish from "./Menu_Edit";

const Menu = () => {
    const { location } = usePartner();

    const [dishes, setDishes] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editDish, setEditDish] = useState(null);

    useEffect(() => {
        const data =
            typeof location?.dishes === "string"
                ? JSON.parse(location.dishes)
                : location?.dishes || [];

        setDishes(data);
    }, [location]);

    const handleAdd = (dish) => {
        setDishes(prev => [dish, ...prev]);
        setShowAdd(false);
    };

    const handleEdit = (updated) => {
        setDishes(prev =>
            prev.map(d => d.dish_id === updated.dish_id ? updated : d)
        );
        setEditDish(null);
    };

    const handleDelete = async (id) => {
        try {
            await authorizedFetch(
                `places/restaurants/${location.id}/menu/`,
                {
                    method: "DELETE",
                    body: JSON.stringify({ dish_id: id })
                }
            );

            setDishes(prev => prev.filter(d => d.dish_id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!location) return <div style={{ padding: 20 }}>No data</div>;

    return (
        <div className="menu-page">
            <h2>Menu</h2>

            <button className="add-btn" onClick={() => setShowAdd(true)}>
                + Add Dish
            </button>

            <div className="menu-container">
                {dishes.length > 0 ? (
                    dishes.map(d => (
                        <div key={d.dish_id} className="menu-card">

                            <div className="menu-header">
                                <div className="menu-title">{d.dish_name}</div>

                                <div className="menu-price">
                                    <Banknote size={16} />
                                    {d.price.toLocaleString()}đ
                                </div>
                            </div>

                            <div className="menu-desc">
                                <FileText size={16} />
                                {d.description || "No description"}
                            </div>

                            <div className="menu-actions">
                                <Pencil size={16} onClick={() => setEditDish(d)} />
                                <Trash2 size={16} onClick={() => handleDelete(d.dish_id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty">No dishes yet</div>
                )}
            </div>

            {/* MODALS */}
            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddDish onSuccess={handleAdd} onClose={() => setShowAdd(false)} />
                    </div>
                </div>
            )}

            {editDish && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <EditDish
                            dish={editDish}
                            onSuccess={handleEdit}
                            onClose={() => setEditDish(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;