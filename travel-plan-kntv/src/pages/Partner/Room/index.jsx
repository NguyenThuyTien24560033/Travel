import { useEffect, useState } from "react";
import { usePartner } from "../../../assets/Layouts/PartnerLayout.jsx";
import { Banknote, FileText, Pencil, Trash2 } from "lucide-react";
import { authorizedFetch } from "../../../../api.js";
import "./Room.css";

import AddRoom from "./Room_Add";
import EditRoom from "./Room_Edit";

const Room = () => {
    const { location } = usePartner();

    const [rooms, setRooms] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [editRoom, setEditRoom] = useState(null);

    useEffect(() => {
        const data =
            typeof location?.room_types === "string"
                ? JSON.parse(location.room_types)
                : location?.room_types || [];

        setRooms(data);
    }, [location]);

    const handleAdd = (room) => {
        setRooms(prev => [room, ...prev]);
        setShowAdd(false);
    };

    const handleEdit = (updated) => {
        setRooms(prev =>
            prev.map(r => r.room_type_id === updated.room_type_id ? updated : r)
        );
        setEditRoom(null);
    };

    const handleDelete = async (id) => {
        try {
            await authorizedFetch(
                `places/hotels/${location.id}/rooms/`,
                {
                    method: "DELETE",
                    body: JSON.stringify({ room_type_id: id })
                }
            );

            setRooms(prev => prev.filter(r => r.room_type_id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (!location) return <div style={{ padding: 20 }}>No data</div>;

    return (
        <div className="room-page">
            <h2>Rooms</h2>

            <button className="add-btn" onClick={() => setShowAdd(true)}>
                + Add Room
            </button>

            <div className="room-container">
                {rooms.length > 0 ? (
                    rooms.map(r => (
                        <div key={r.room_type_id} className="room-card">

                            <div className="room-header">
                                <div className="room-title">{r.type_name}</div>

                                <div className="room-price">
                                    <Banknote size={16} />
                                    {r.price.toLocaleString()}đ
                                </div>
                            </div>

                            <div className="room-desc">
                                <FileText size={16} />
                                {r.description || "No description"}
                            </div>

                            <div className="room-actions">
                                <Pencil size={16} onClick={() => setEditRoom(r)} />
                                <Trash2 size={16} onClick={() => handleDelete(r.room_type_id)} />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty">No rooms yet</div>
                )}
            </div>

            {/* MODALS */}
            {showAdd && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AddRoom onSuccess={handleAdd} onClose={() => setShowAdd(false)} />
                    </div>
                </div>
            )}

            {editRoom && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <EditRoom
                            room={editRoom}
                            onSuccess={handleEdit}
                            onClose={() => setEditRoom(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Room;