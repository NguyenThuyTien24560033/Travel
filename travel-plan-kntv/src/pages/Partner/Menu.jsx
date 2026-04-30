// import { useState, useEffect } from "react";
// import { usePartner } from '../../assets/Layouts/PartnerLayout.jsx'
// import { Toaster, toast } from "sonner";
// import './Menu.css'

// const DEFAULT_IMG = "https://placehold.co/300x200";

// //Đình Khang nhớ đổi
// const MODE = "JSON_SERVER";
// // const MODE = "REAL_BACKEND";

// const JSON_API = "http://localhost:3001/users";
// const REAL_API = { update: "users/" };

// const PartnerMenu = () => {
//   const { user, setUser, location } = usePartner();

//   const [dishes, setDishes] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [form, setForm] = useState({
//     dish_name: "",
//     price: "",
//     description: "",
//     image: ""
//   });

//   useEffect(() => {
//     setDishes(location?.dishes || []);
//   }, [location]);

//   const isOwner = user?.role === "OWNER";

//   const handleChange = (e) => {
//     setForm({
//       ...form,
//       [e.target.name]: e.target.value,
//     });
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     if (!isOwner) return toast.error("Không có quyền!");

//     try {
//       let newDishes;

//       if (editingId) {
//         newDishes = dishes.map(d =>
//           d.dish_id === editingId ? { ...d, ...form } : d
//         );
//       } else {
//         newDishes = [
//           ...dishes,
//           {
//             dish_id: crypto.randomUUID(),
//             ...form,
//           }
//         ];
//       }

//       const updatedPlaces = user.places.map(p =>
//         p.id === location.id ? { ...p, dishes: newDishes } : p
//       );

//       let updatedUser;

//       if (MODE === "JSON_SERVER") {
//         const res = await fetch(`${JSON_API}/${user.id}`, {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ places: updatedPlaces }),
//         });

//         updatedUser = await res.json();
//       } else {
//         await fetch(REAL_API.update, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//           body: JSON.stringify({ places: updatedPlaces }),
//         });

//         updatedUser = { ...user, places: updatedPlaces };
//       }

//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       setDishes(newDishes);
//       setShowModal(false);
//       setEditingId(null);

//       setForm({
//         dish_name: "",
//         price: "",
//         description: "",
//         image: ""
//       });

//       toast.success("Saved!");
//     } catch {
//       toast.error("Error!");
//     }
//   };

//   /* ================= DELETE ================= */

// const handleDelete = async (id) => {
//   if (!isOwner) return toast.error("Không có quyền!");

//   try {
//     const newDishes = dishes.filter(d => d.dish_id !== id);

//     const updatedPlaces = user.places.map(p =>
//       p.id === location.id ? { ...p, dishes: newDishes } : p
//     );

//     let updatedUser;

//     /* ================= JSON SERVER ================= */
//     if (MODE === "JSON_SERVER") {
//       const res = await fetch(`${JSON_API}/${user.id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ places: updatedPlaces }),
//       });

//       if (!res.ok) throw new Error();
//       updatedUser = await res.json();
//     }

//     /* ================= BACKEND ================= */
//     else {
//       const res = await fetch(REAL_API.update, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//         },
//         body: JSON.stringify({
//           places: updatedPlaces
//         }),
//       });

//       if (!res.ok) throw new Error();

//       // backend không trả full user → tự sync
//       updatedUser = {
//         ...user,
//         places: updatedPlaces
//       };
//     }

//     /* SYNC */
//     localStorage.setItem("user", JSON.stringify(updatedUser));
//     setUser(updatedUser);

//     setDishes(newDishes);

//     toast.success("Deleted!");
//   } catch (err) {
//     console.error(err);
//     toast.error("Xóa thất bại!");
//   }
// };
//   /* ================= EDIT ================= */
//   const handleEdit = (dish) => {
//     setForm(dish);
//     setEditingId(dish.dish_id);
//     setShowModal(true);
//   };

//   return (
//     <div className="menu-container">
//       <Toaster />

//       <div className="menu-header">
//         <h2>Menu</h2>
//         <button onClick={() => setShowModal(true)}>+ Add Dish</button>
//       </div>

//       {/* ================= LIST ================= */}
//       <div className="menu-grid">
//         {dishes.map(d => (
//           <div key={d.dish_id} className="menu-card">
//             <img src={d.image || DEFAULT_IMG} alt="" />

//             <div className="menu-info">
//               <h4>{d.dish_name}</h4>
//               <p>{d.description}</p>
//               <span>{d.price} VND</span>
//             </div>

//             <div className="menu-actions">
//               <button onClick={() => handleEdit(d)}>Edit</button>
//               <button onClick={() => handleDelete(d.dish_id)}>Delete</button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="modal-overlay">
//           <div className="modal">
//             <h3>{editingId ? "Edit Dish" : "Add Dish"}</h3>

//             <input name="dish_name" value={form.dish_name} onChange={handleChange} placeholder="Name" />
//             <input name="price" value={form.price} onChange={handleChange} placeholder="Price" />
//             <input name="description" value={form.description} onChange={handleChange} placeholder="Description" />
//             <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" />

//             <div className="modal-actions">
//               <button onClick={handleSave}>Save</button>
//               <button onClick={() => setShowModal(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PartnerMenu;




import { useState, useEffect } from "react";
import { usePartner } from '../../assets/Layouts/PartnerLayout.jsx';
import { Toaster, toast } from "sonner";
import './Menu.css';

/* ========================= */
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

const JSON_API = "http://localhost:3001/users";

const REAL_API = {
  createDish: "",
  updateDish: "",
  deleteDish: "",
};
/* ========================= */

const DEFAULT_IMAGE =
  "https://placehold.co/300x200";

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

  /* ================= INIT ================= */
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

      /* ================= JSON SERVER ================= */
      if (MODE === "JSON_SERVER") {
        let newDishes;

        if (editingId) {
          newDishes = dishes.map(d =>
            d.dish_id === editingId ? { ...d, ...form } : d
          );
        } else {
          newDishes = [
            ...dishes,
            {
              dish_id: crypto.randomUUID(),
              ...form,
            }
          ];
        }

        const updatedPlaces = user.places.map(p =>
          p.id === location.id ? { ...p, dishes: newDishes } : p
        );

        const res = await fetch(`${JSON_API}/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ places: updatedPlaces }),
        });

        if (!res.ok) throw new Error();

        updatedUser = await res.json();
        setDishes(newDishes);
      }

      /* ================= REAL BACKEND ================= */
      else {
        let res;

        if (editingId) {
          // UPDATE
          res = await fetch(`${REAL_API.updateDish}${editingId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify(form),
          });
        } else {
          // CREATE
          res = await fetch(REAL_API.createDish, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({
              ...form,
              location_id: location.id
            }),
          });
        }

        if (!res.ok) throw new Error();

        updatedUser = await res.json();
      }

      /* ================= SYNC ================= */
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setShowModal(false);
      setEditingId(null);

      setForm({
        dish_name: "",
        price: "",
        description: "",
        image: ""
      });

      toast.success("Saved!");
    } catch (err) {
      console.error(err);
      toast.error("Lỗi!");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!isOwner) return toast.error("Không có quyền!");

    try {
      let updatedUser;

      /* ================= JSON SERVER ================= */
      if (MODE === "JSON_SERVER") {
        const newDishes = dishes.filter(d => d.dish_id !== id);

        const updatedPlaces = user.places.map(p =>
          p.id === location.id ? { ...p, dishes: newDishes } : p
        );

        const res = await fetch(`${JSON_API}/${user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ places: updatedPlaces }),
        });

        if (!res.ok) throw new Error();

        updatedUser = await res.json();
        setDishes(newDishes);
      }

      /* ================= REAL BACKEND ================= */
      else {
        const res = await fetch(`${REAL_API.deleteDish}${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error();

        updatedUser = await res.json();
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
        {dishes.length === 0 ? (
          <p>No dishes</p>
        ) : (
          dishes.map(d => (
            <div key={d.dish_id} className="menu-card">
              <img
                src={d.image || DEFAULT_IMAGE}
                alt={d.dish_name}
              />

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
          ))
        )}
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