

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import Header from "./Header";
// import "./History.css";

// /* =========================
//    MODE
// ========================= */
// const MODE = "JSON_SERVER";

// const JSON_API = "http://localhost:3001/history";

// /* =========================
//    CHECK EDIT VALIDATION
// ========================= */
// const canEditPlan = (plan) => {
//   const today = new Date().toISOString().split("T")[0];
//   const endDay = plan?.input_data?.return_date;

//   if (!endDay) return true;
//   return today <= endDay;
// };

// function HistoryComponent() {
//   const [historyData, setHistoryData] = useState([]);
//   const navigate = useNavigate();

//   /* =========================
//      LOAD HISTORY
//   ========================= */
//   useEffect(() => {
//     const data = JSON.parse(localStorage.getItem("history")) || [];

//     const sorted = data.sort(
//       (a, b) => new Date(b.created_at) - new Date(a.created_at)
//     );

//     setHistoryData(sorted);
//   }, []);

//   /* =========================
//      OPEN PLAN (VIEW / EDIT)
//   ========================= */
//   const openPlan = (id, mode = "view") => {
//     const plan = JSON.parse(localStorage.getItem(`plan_${id}`));

//     if (!plan) {
//       toast.error("Không tìm thấy dữ liệu kế hoạch");
//       return;
//     }

//     // nếu cố edit nhưng đã lock
//     if (mode === "change" && plan.is_locked) {
//       toast.error("Kế hoạch đã được chốt, chỉ có thể xem");
//       mode = "view";
//     }

//     navigate("/my-trip/output", {
//       state: {
//         data: plan,
//         mode, // "view" | "change"
//       },
//     });
//   };

//   /* =========================
//      DELETE PLAN
//   ========================= */
//   const handleDelete = async (id) => {
//     try {
//       if (MODE === "JSON_SERVER") {
//         await fetch(`${JSON_API}/${id}`, {
//           method: "DELETE",
//         });

//         const updated = historyData.filter((item) => item.id !== id);
//         setHistoryData(updated);

//         localStorage.removeItem(`plan_${id}`);
//         localStorage.setItem("history", JSON.stringify(updated));

//         toast.success("Đã xóa kế hoạch");
//         return;
//       }

//       const res = await fetch(`history/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error();

//       setHistoryData((prev) => prev.filter((item) => item.id !== id));
//       toast.success("Deleted");
//     } catch (err) {
//       console.error(err);
//       toast.error("Xóa thất bại");
//     }
//   };

//   /* =========================
//      UI
//   ========================= */
//   return (
//     <>
//       <Header />

//       <div className="history-list">
//         {historyData.length === 0 ? (
//           <p>Chưa có lịch sử nào</p>
//         ) : (
//           historyData.map((item) => (
//             <div key={item.id} className="history-card">

//               {/* INFO */}
//               <div onClick={() => openPlan(item.id, "view")}>
//                 <h3>
//                   {item.location || "Unknown"} {item.is_locked && "🔒"}
//                 </h3>

//                 <p>
//                   {item.created_at
//                     ? new Date(item.created_at).toLocaleString()
//                     : "No date"}
//                 </p>
//               </div>

//               {/* ACTIONS */}
//               <div className="actions">
//                 {/* VIEW */}
//                 <button onClick={() => openPlan(item.id, "view")}>
//                   View
//                 </button>

//                 {/* EDIT */}
//                 {!item.is_locked && (
//                   <button
//                     onClick={() => {
//                       if (!canEditPlan(item)) {
//                         toast.error("Đã quá hạn chỉnh sửa");
//                         return;
//                       }

//                       openPlan(item.id, "change");
//                     }}
//                   >
//                     Continue Editing
//                   </button>
//                 )}

//                 {/* DELETE */}
//                 <button onClick={() => handleDelete(item.id)}>
//                   Delete
//                 </button>
//               </div>

//             </div>
//           ))
//         )}
//       </div>
//     </>
//   );
// }

// export default HistoryComponent;



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authorizedFetch } from "../../../api";
import { toast } from "sonner";
import Header from "./Header";
import "./History.css";

/* =========================================================
   CONFIG
========================================================= */

const MODE = "JSON_SERVER";

const JSON_API = "http://localhost:3001/history";

const REAL_API = {
  getHistory: "history/",
  deleteHistory: "history/",
};

/* =========================================================
   CHECK EDIT VALIDATION
========================================================= */

const canEditPlan = (plan) => {
  const today = new Date().toISOString().split("T")[0];
  const endDay = plan?.input_data?.return_date;

  if (!endDay) return true;
  return today <= endDay;
};

/* =========================================================
   API
========================================================= */

const api = {
  /* =========================
     GET HISTORY
  ========================= */
  getHistory: async () => {
    try {
      if (MODE === "REAL_BACKEND") {
        const res = await authorizedFetch(REAL_API.getHistory, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json();
          return data.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
        }
      } else {
        const res = await fetch(JSON_API);
        if (!res.ok) return [];

        const data = await res.json();
        return data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      }
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  /* =========================
     DELETE HISTORY
  ========================= */
  deleteHistory: async (id) => {
    try {
      if (!id) return false;

      if (MODE === "REAL_BACKEND") {
        const res = await authorizedFetch(
          `${REAL_API.deleteHistory}${id}/`,
          { method: "DELETE" }
        );
        return res.ok;
      } else {
        const res = await fetch(`${JSON_API}/${id}`, {
          method: "DELETE",
        });
        return res.ok;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  },
};

/* =========================================================
   COMPONENT
========================================================= */

function HistoryComponent() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getHistory();
      setHistoryData(data);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     OPEN PLAN (GIỮ NGUYÊN LOGIC CŨ)
  ========================= */
  const openPlan = (id, mode = "view") => {
    const plan = JSON.parse(localStorage.getItem(`plan_${id}`));

    if (!plan) {
      toast.error("Không tìm thấy dữ liệu kế hoạch");
      return;
    }

    // lock check
    if (mode === "change" && plan.is_locked) {
      toast.error("Kế hoạch đã được chốt, chỉ có thể xem");
      mode = "view";
    }

    navigate("/my-trip/output", {
      state: {
        data: plan,
        mode, // 🔥 QUAN TRỌNG
      },
    });
  };

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    const success = await api.deleteHistory(id);

    if (!success) {
      toast.error("Xóa thất bại");
      return;
    }

    // update UI
    const updated = historyData.filter((item) => item.id !== id);
    setHistoryData(updated);

    // xoá local detail
    localStorage.removeItem(`plan_${id}`);

    toast.success("Đã xóa kế hoạch");
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <Header />

      <div className="history-list">
        {loading && <p>Loading...</p>}

        {!loading && historyData.length === 0 && (
          <p>Chưa có lịch sử nào</p>
        )}

        {historyData.map((item) => (
          <div key={item.id} className="history-card">

            {/* INFO */}
            <div onClick={() => openPlan(item.id, "view")}>
              <h3>
                {item.location || "Unknown"}{" "}
                {item.is_locked && "🔒"}
              </h3>

              <p>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "No date"}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="actions">

              {/* VIEW */}
              <button onClick={() => openPlan(item.id, "view")}>
                View
              </button>

              {/* EDIT */}
              {!item.is_locked && (
                <button
                  onClick={() => {
                    if (!canEditPlan(item)) {
                      toast.error("Đã quá hạn chỉnh sửa");
                      return;
                    }

                    openPlan(item.id, "change"); // 🔥 mode vẫn giữ
                  }}
                >
                  Continue Editing
                </button>
              )}

              {/* DELETE */}
              <button onClick={() => handleDelete(item.id)}>
                Delete
              </button>

            </div>

          </div>
        ))}
      </div>
    </>
  );
}

export default HistoryComponent;