

// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { toast } from "sonner";
// // import Header from "./Header";// 
// // import "./History.css";

// // /* =========================
// //    MODE
// // ========================= */
// // const MODE = "JSON_SERVER";
// // // const MODE = "REAL_BACKEND";

// // const JSON_API = "http://localhost:3001/history";

// // const REAL_API = {
// //   getHistory: "history/",
// //   getPlan: "plan/",
// // };

// // function HistoryComponent() {
// //   const [historyData, setHistoryData] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     const data = JSON.parse(localStorage.getItem("history")) || [];
// //     setHistoryData(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
// //   }, []);

// //   const handleClick = (id, wantToEdit = false) => {
// //     const plan = JSON.parse(localStorage.getItem(`plan_${id}`));
// //     if (!plan) {
// //       toast.error("Data missing");
// //       return;
// //     }

// //     // Nếu người dùng muốn Edit nhưng bản này đã bị Lock (Save rồi)
// //     if (wantToEdit && plan.is_locked) {
// //       toast.error("Bản này đã chốt, chỉ có thể xem thôi Tiên ơi!");
// //       navigate("/my-trip/output", { state: { data: plan, mode: "view" } });
// //       return;
// //     }

// //     navigate("/my-trip/output", {
// //       state: {
// //         data: plan,
// //         mode: wantToEdit ? "change" : "view",
// //       },
// //     });
// //   };

// //   const handleDelete = async (id) => {
// //   try {
// //     if (MODE === "JSON_SERVER") {
// //       await fetch(`${JSON_API}/${id}`, {
// //         method: "DELETE",
// //       });

// //       // update UI
// //       setHistoryData((prev) => prev.filter((item) => item.id !== id));
// //       toast.success("Deleted from JSON server");
// //       return;
// //     }

// //     // =========================
// //     // REAL BACKEND MODE
// //     // =========================
// //     const res = await fetch(`${REAL_API.getHistory}${id}`, {
// //       method: "DELETE",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //     });

// //     if (!res.ok) throw new Error("Delete failed");

// //     setHistoryData((prev) => prev.filter((item) => item.id !== id));
// //     toast.success("Deleted from backend");
// //   } catch (err) {
// //     console.error(err);
// //     toast.error("Delete failed");
// //   }
// // };

// //   return (
// //     <>
// //     <Header/>
// //     <div className="history-list">
// //       {historyData.map((item) => (
// //         <div key={item.id} className="history-card">
// //           <div onClick={() => handleClick(item.id, false)}>
// //             <h3>{item.location} {item.is_locked && "🔒"}</h3>
// //             <p>{new Date(item.created_at).toLocaleDateString()}</p>
// //           </div>
          
// //           <div className="actions">
// //             <button onClick={() => handleClick(item.id, false)}>View</button>
            
// //             {/* Chỉ hiện nút Edit nếu chưa bị lock */}
// //             {!item.is_locked && (
// //               <button onClick={() => handleClick(item.id, true)}>Continue Editing</button>
// //             )}
            
// //             <button onClick={() => handleDelete(item.id)}>Delete</button>
// //           </div>
// //         </div>
// //       ))}
// //     </div>
// //     </>
// //   );
// // }
// // export default HistoryComponent;



// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import Header from "./Header";
// import "./History.css";

// const MODE = "JSON_SERVER";

// const JSON_API = "http://localhost:3001/history";

// function HistoryComponent() {
//   const [historyData, setHistoryData] = useState([]);
//   const navigate = useNavigate();

//   /* =========================
//      LOAD HISTORY
//   ========================= */
//   useEffect(() => {
//     const loadHistory = () => {
//       const data = JSON.parse(localStorage.getItem("history")) || [];

//       const sorted = data.sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );

//       setHistoryData(sorted);
//     };

//     loadHistory();
//   }, []);

//   /* =========================
//      OPEN PLAN
//   ========================= */
//   const openPlan = (id, mode = "view") => {
//     const plan = JSON.parse(localStorage.getItem(`plan_${id}`));

//     if (!plan) {
//       toast.error("Không tìm thấy dữ liệu kế hoạch");
//       return;
//     }

//     // nếu đã lock mà vẫn cố edit
//     if (mode === "change" && plan.is_locked) {
//       toast.error("Kế hoạch đã được chốt, chỉ có thể xem");
//       mode = "view";
//     }

//     navigate("/my-trip/output", {
//       state: {
//         data: plan,
//         mode,
//       },
//     });
//   };

//   /* =========================
//      DELETE HISTORY
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

//       // REAL BACKEND
//       const res = await fetch(`history/${id}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) throw new Error();

//       setHistoryData((prev) => prev.filter((item) => item.id !== id));
//       toast.success("Deleted from backend");
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
//                 <button onClick={() => openPlan(item.id, "view")}>
//                   View
//                 </button>

//                 {!item.is_locked && (
//                   <button onClick={() => openPlan(item.id, "change")}>
//                     Continue Editing
//                   </button>
//                 )}

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
import { toast } from "sonner";
import Header from "./Header";
import "./History.css";

/* =========================
   MODE
========================= */
const MODE = "JSON_SERVER";

const JSON_API = "http://localhost:3001/history";

/* =========================
   CHECK EDIT VALIDATION
========================= */
const canEditPlan = (plan) => {
  const today = new Date().toISOString().split("T")[0];
  const endDay = plan?.input_data?.return_date;

  if (!endDay) return true;
  return today <= endDay;
};

function HistoryComponent() {
  const [historyData, setHistoryData] = useState([]);
  const navigate = useNavigate();

  /* =========================
     LOAD HISTORY
  ========================= */
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("history")) || [];

    const sorted = data.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    setHistoryData(sorted);
  }, []);

  /* =========================
     OPEN PLAN (VIEW / EDIT)
  ========================= */
  const openPlan = (id, mode = "view") => {
    const plan = JSON.parse(localStorage.getItem(`plan_${id}`));

    if (!plan) {
      toast.error("Không tìm thấy dữ liệu kế hoạch");
      return;
    }

    // nếu cố edit nhưng đã lock
    if (mode === "change" && plan.is_locked) {
      toast.error("Kế hoạch đã được chốt, chỉ có thể xem");
      mode = "view";
    }

    navigate("/my-trip/output", {
      state: {
        data: plan,
        mode, // "view" | "change"
      },
    });
  };

  /* =========================
     DELETE PLAN
  ========================= */
  const handleDelete = async (id) => {
    try {
      if (MODE === "JSON_SERVER") {
        await fetch(`${JSON_API}/${id}`, {
          method: "DELETE",
        });

        const updated = historyData.filter((item) => item.id !== id);
        setHistoryData(updated);

        localStorage.removeItem(`plan_${id}`);
        localStorage.setItem("history", JSON.stringify(updated));

        toast.success("Đã xóa kế hoạch");
        return;
      }

      const res = await fetch(`history/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      setHistoryData((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Xóa thất bại");
    }
  };

  /* =========================
     UI
  ========================= */
  return (
    <>
      <Header />

      <div className="history-list">
        {historyData.length === 0 ? (
          <p>Chưa có lịch sử nào</p>
        ) : (
          historyData.map((item) => (
            <div key={item.id} className="history-card">

              {/* INFO */}
              <div onClick={() => openPlan(item.id, "view")}>
                <h3>
                  {item.location || "Unknown"} {item.is_locked && "🔒"}
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

                      openPlan(item.id, "change");
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
          ))
        )}
      </div>
    </>
  );
}

export default HistoryComponent;
