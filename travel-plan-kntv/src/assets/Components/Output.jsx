// // import { useLocation, useNavigate } from "react-router-dom";
// // import { useState } from "react";
// // import { toast } from "sonner";
// // import "./Output.css";

// // /* =========================
// //    MODE
// // ========================= */
// // // Đình Khang nhớ đổi
// // const MODE = "JSON_SERVER";
// // // const MODE = "REAL_BACKEND";

// // const REAL_API = {
// //   edit: "", // + id/edit/
// //   save: "", // + id/
// // };

// // const MyTripOutput = () => {
// //   const { state } = useLocation();
// //   const navigate = useNavigate();

// //   /* =========================
// //      STATE
// //   ========================= */
// //   const [plans, setPlans] = useState([state?.data]);
// //   const [currentIndex, setCurrentIndex] = useState(0);

// //   const mode = state?.mode || "view";
// //   const maxEdit = state?.maxEdit || 5;

// //   const plan = plans[currentIndex];
// //   if (!plan) return <div>No plan data</div>;

// //   const inputData = plan.input_data;

// //   /* =========================
// //      EDIT (ONLY SCHEDULE)
// //   ========================= */
// //   const handleEdit = async () => {
// //     if (mode !== "change") {
// //       toast.error("Không thể chỉnh sửa ở chế độ view");
// //       return;
// //     }

// //     if (plans.length >= maxEdit) {
// //       toast.error("Bạn đã sửa tối đa 5 lần");
// //       return;
// //     }

// //     try {
// //       if (MODE === "JSON_SERVER") {
// //         const newPlan = fakeEdit(plan);

// //         setPlans((prev) => [...prev, newPlan]);
// //         setCurrentIndex(plans.length);

// //         return;
// //       }

// //       const res = await fetch(`${REAL_API.edit}${plan.input_id}/edit/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
// //         },
// //       });

// //       if (!res.ok) throw new Error();

// //       const data = await res.json();

// //       setPlans((prev) => [...prev, data]);
// //       setCurrentIndex(plans.length);

// //     } catch (err) {
// //       toast.error("Edit failed");
// //     }
// //   };

// //   /* =========================
// //      SAVE
// //   ========================= */
// //   // const saveToHistory = (selectedPlan) => {
// //   //   const history = JSON.parse(localStorage.getItem("history")) || [];

// //   //   history.push({
// //   //     id: Date.now(),
// //   //     created_at: new Date(),
// //   //     location: selectedPlan.Summary_info.Main_location,
// //   //     plan: selectedPlan,
// //   //   });

// //   //   localStorage.setItem("history", JSON.stringify(history));
// //   // };

// //   const saveToHistory = (selectedPlan) => {
// //     const history = JSON.parse(localStorage.getItem("history")) || [];

// //     const id = Date.now();

// //     const newItem = {
// //       id,
// //       created_at: new Date(),
// //       location: selectedPlan.Summary_info.Main_location,
// //     };

// //     history.push(newItem);

// //     localStorage.setItem("history", JSON.stringify(history));

// //     // 🔥 lưu plan riêng
// //     localStorage.setItem(
// //       `plan_${id}`,
// //       JSON.stringify({
// //         ...selectedPlan,
// //         input_id: id,
// //       })
// //     );
// //   };


// //   const handleSave = async () => {
// //     try {
// //       const selectedPlan = plans[currentIndex];

// //       if (MODE === "JSON_SERVER") {
// //         saveToHistory(selectedPlan);
// //         toast.success("Saved!");
// //         navigate("/history");
// //         return;
// //       }

// //       await fetch(`${REAL_API.save}${selectedPlan.input_id}/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
// //         },
// //       });

// //       toast.success("Saved!");
// //       navigate("/history");

// //     } catch (err) {
// //       toast.error("Save failed");
// //     }
// //   };

// //   /* =========================
// //      CLOSE (❌ AUTO SAVE)
// //   ========================= */
// //   const handleClose = () => {
// //     const selectedPlan = plans[currentIndex];

// //     try {
// //       if (MODE === "JSON_SERVER") {
// //         saveToHistory(selectedPlan);
// //         navigate("/");
// //         return;
// //       }

// //       fetch(`${REAL_API.save}${selectedPlan.input_id}/`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
// //         },
// //       });

// //       navigate("/");

// //     } catch (err) {
// //       console.error(err);
// //       navigate("/");
// //     }
// //   };

// //   /* =========================
// //      UI
// //   ========================= */
// //   return (
// //     <div className="output-container">

// //       {/* HEADER */}
// //       <div className="output-header">

// //         <button className="close-btn" onClick={handleClose}>
// //           ✖
// //         </button>
// //       </div>

// //       {/* PLAN TABS */}
// //       <div className="plan-tabs">
// //         {plans.map((_, index) => (
// //           <button
// //             key={index}
// //             className={`plan-tab ${currentIndex === index ? "active" : ""}`}
// //             onClick={() => setCurrentIndex(index)}
// //           >
// //             Plan {index + 1}
// //           </button>
// //         ))}
// //         <span className="view-all">view all</span>
// //       </div>

// //       {/* MAIN */}
// //       <div className="output-main">

// //         {/* LEFT: SCHEDULE */}
// //         <div className="schedule-box">
// //           {plan.schedule.map((day, i) => (
// //             <div key={i} className="day-block">
// //               <h4>Ngày {i + 1}</h4>

// //               <ul>
// //                 <li>
// //                   Food:
// //                   <ul>
// //                     <li>Sáng: {day.Breakfast?.name}</li>
// //                     <li>Trưa: {day.Lunch?.name}</li>
// //                     <li>Tối: {day.Dinner?.name}</li>
// //                   </ul>
// //                 </li>

// //                 <li>
// //                   Địa điểm:
// //                   <ul>
// //                     {day.Place?.map((p, idx) => (
// //                       <li key={idx}>{p.name}</li>
// //                     ))}
// //                   </ul>
// //                 </li>
// //               </ul>
// //             </div>
// //           ))}

// //           {/* EDIT */}
// //           {mode === "change" && (
// //             <button className="edit-btn" onClick={handleEdit}>
// //               Edit
// //             </button>
// //           )}
// //         </div>

// //         {/* RIGHT */}
// //         <div className="right-panel">

// //           <div className="summary-box">
// //             <h4>Chung:</h4>
// //             <ul>
// //               <li>Hotel: {plan.Summary_info.Hotel?.name}</li>
// //               <li>Main activity: {plan.Summary_info.Main_location}</li>
// //             </ul>

// //             <h4>Detail payment:</h4>
// //             <ul>
// //               <li>Food: {plan.budget_breakdown.food}</li>
// //               <li>Hotel: {plan.budget_breakdown.hotel}</li>
// //               <li>Other: {plan.budget_breakdown.other}</li>
// //             </ul>
// //           </div>

// //           {/* INPUT (LOCKED) */}
// //           <div className="input-box">
// //             <h4>Tóm tắt input:</h4>
// //             <p>Budget: {inputData?.budget}</p>
// //             <p>People: {inputData?.num_people}</p>
// //             <p>Location: {inputData?.location}</p>
// //           </div>
// //         </div>
// //       </div>

// //       {/* SAVE */}
// //       {mode === "change" && (
// //         <button className="save-btn" onClick={handleSave}>
// //           Save
// //         </button>
// //       )}
// //     </div>
// //   );
// // };

// // /* =========================
// //    FAKE EDIT
// // ========================= */
// // const fakeEdit = (oldPlan) => {
// //   return {
// //     ...oldPlan,
// //     input_data: oldPlan.input_data, // 🔒 không đổi
// //     schedule: oldPlan.schedule.map((day, i) => {
// //       if (i === 0) {
// //         return {
// //           ...day,
// //           Lunch: { name: "Edited Food 🍜" },
// //         };
// //       }
// //       return day;
// //     }),
// //   };
// // };

// // export default MyTripOutput;







// import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "sonner";
// import "./Output.css";

// /* =========================
//     CONFIG & MODE
// ========================= */
// const MODE = "JSON_SERVER"; // "JSON_SERVER" hoặc "REAL_BACKEND"

// const REAL_API = {
//   edit: "plan/", // API để nhận plan đã chỉnh sửa
//   save: "plan/", // API để lưu chính thức (lock)
// };

// const MyTripOutput = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   /* =========================
//       STATE MANAGEMENT
//   ========================= */
//   // Khởi tạo plans là một mảng chứa plan ban đầu từ state
//   const [plans, setPlans] = useState(() => {
//     const initialData = state?.data;
//     if (!initialData) return [];
//     return [{
//       ...initialData,
//       input_id: initialData.input_id || Date.now(),
//       is_locked: initialData.is_locked ?? false,
//     }];
//   });

//   const [currentIndex, setCurrentIndex] = useState(0);
  
//   const mode = state?.mode || "view";
//   const maxEdit = state?.maxEdit || 5;

//   // Lấy plan hiện tại đang được chọn để hiển thị
//   const currentPlan = plans[currentIndex];

//   if (!currentPlan) return <div className="no-data">No plan data available</div>;

//   /* =========================
//       HELPER: SAVE LOCAL
//   ========================= */
//   const saveLocal = (planToSave) => {
//     let history = JSON.parse(localStorage.getItem("history")) || [];
    
//     const summaryItem = {
//       id: planToSave.input_id,
//       created_at: new Date(),
//       location: planToSave.Summary_info?.Main_location || "Unknown",
//     };

//     const index = history.findIndex((h) => h.id === summaryItem.id);
//     if (index !== -1) history[index] = summaryItem;
//     else history.push(summaryItem);

//     localStorage.setItem("history", JSON.stringify(history));
//     localStorage.setItem(`plan_${summaryItem.id}`, JSON.stringify(planToSave));
//   };

//   /* =========================
//       CORE LOGIC: EDIT (GET NEW PLAN)
//   ========================= */
//   const handleEdit = async () => {
//     if (currentPlan.is_locked) {
//       toast.error("Plan này đã được lưu cố định, không thể chỉnh sửa thêm");
//       return;
//     }

//     if (plans.length >= maxEdit) {
//       toast.error(`Bạn đã đạt giới hạn chỉnh sửa (${maxEdit} lần)`);
//       return;
//     }

//     try {
//       let newPlanData;

//       if (MODE === "JSON_SERVER") {
//         // Giả lập backend trả về plan mới dựa trên plan hiện tại
//         newPlanData = fakeEdit(currentPlan);
//       } else {
//         const res = await fetch(`${REAL_API.edit}${currentPlan.input_id}/edit/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//           // Gửi bản hiện tại lên để backend biết đường mà sửa
//           body: JSON.stringify(currentPlan) 
//         });

//         if (!res.ok) throw new Error("Backend error");
//         newPlanData = await res.json();
//       }

//       // THÊM bản mới vào danh sách, giữ lại các bản cũ
//       setPlans((prev) => [...prev, newPlanData]);
//       // Tự động chuyển sang tab mới nhất
//       setCurrentIndex(plans.length);
      
//       toast.success("Đã tạo bản phác thảo mới!");

//     } catch (err) {
//       toast.error("Không thể kết nối với máy chủ để chỉnh sửa");
//     }
//   };

//   /* =========================
//       CORE LOGIC: SAVE (LOCK PLAN)
//   ========================= */
//   const handleSave = async () => {
//     try {
//       const lockedPlan = { ...currentPlan, is_locked: true };

//       if (MODE === "REAL_BACKEND") {
//         const res = await fetch(`${REAL_API.save}${currentPlan.input_id}/`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//           },
//           body: JSON.stringify(lockedPlan),
//         });
//         if (!res.ok) throw new Error();
//       }

//       // Cập nhật trạng thái locked cho bản hiện tại trong danh sách
//       const updatedPlans = [...plans];
//       updatedPlans[currentIndex] = lockedPlan;
//       setPlans(updatedPlans);

//       saveLocal(lockedPlan);
//       toast.success("Đã lưu kế hoạch thành công!");
//       navigate("/history");

//     } catch (err) {
//       toast.error("Lưu thất bại, vui lòng thử lại");
//     }
//   };

//   const handleClose = () => navigate("/");

//   /* =========================
//       UI RENDERING
//   ========================= */
//   return (
//     <div className="output-container">
//       {/* HEADER */}
//       <div className="output-header">
//         <button className="close-btn" onClick={handleClose}>✖</button>
//       </div>

//       {/* TABS: Chuyển đổi giữa các version đã edit */}
//       <div className="plan-tabs">
//         {plans.map((_, index) => (
//           <button
//             key={index}
//             className={`plan-tab ${currentIndex === index ? "active" : ""}`}
//             onClick={() => setCurrentIndex(index)}
//           >
//             Bản dịch {index + 1} {index === 0 ? "(Gốc)" : ""}
//           </button>
//         ))}
//         {plans.length > 1 && <span className="view-all-hint">Vuốt để xem thêm các bản cũ</span>}
//       </div>

//       <div className="output-main">
//         {/* LEFT: SCHEDULE DISPLAY */}
//         <div className="schedule-box">
//           <h3 className="section-title">Lịch trình chi tiết</h3>
//           {currentPlan.schedule.map((day, i) => (
//             <div key={i} className="day-block">
//               <h4>Ngày {i + 1}</h4>
//               <ul className="day-details">
//                 <li>
//                   <strong>Ăn uống:</strong>
//                   <ul>
//                     <li>Sáng: {day.Breakfast?.name || "Tự túc"}</li>
//                     <li>Trưa: {day.Lunch?.name || "Tự túc"}</li>
//                     <li>Tối: {day.Dinner?.name || "Tự túc"}</li>
//                   </ul>
//                 </li>
//                 <li>
//                   <strong>Tham quan:</strong>
//                   <ul>
//                     {day.Place?.map((p, idx) => <li key={idx}>{p.name}</li>)}
//                   </ul>
//                 </li>
//               </ul>
//             </div>
//           ))}

//           {/* EDIT BUTTON */}
//           {mode === "change" && !currentPlan.is_locked && (
//             <button className="edit-btn" onClick={handleEdit}>
//               Chỉnh sửa (Random lại lịch trình)
//             </button>
//           )}
//         </div>

//         {/* RIGHT: SUMMARY & INPUT (LOCKED) */}
//         <div className="right-panel">
//           <div className="summary-box">
//             <h4>Thông tin chung</h4>
//             <p><strong>Khách sạn:</strong> {currentPlan.Summary_info.Hotel?.name}</p>
//             <p><strong>Điểm chính:</strong> {currentPlan.Summary_info.Main_location}</p>

//             <h4 style={{marginTop: '20px'}}>Dự toán chi phí</h4>
//             <ul className="budget-list">
//               <li>Ăn uống: {currentPlan.budget_breakdown.food}</li>
//               <li>Lưu trú: {currentPlan.budget_breakdown.hotel}</li>
//               <li>Khác: {currentPlan.budget_breakdown.other}</li>
//             </ul>
//           </div>

//           {/* INPUT INFO (READ-ONLY) */}
//           <div className="input-box locked">
//             <h4>Yêu cầu ban đầu (🔒)</h4>
//             <p>Ngân sách: {currentPlan.input_data?.budget}</p>
//             <p>Số người: {currentPlan.input_data?.num_people}</p>
//             <p>Địa điểm: {currentPlan.input_data?.location}</p>
//             <small className="lock-note">*Không thể thay đổi yêu cầu đầu vào tại đây</small>
//           </div>
//         </div>
//       </div>

//       {/* FINAL SAVE */}
//       {mode === "change" && !currentPlan.is_locked && (
//         <div className="sticky-footer">
//           <button className="save-btn" onClick={handleSave}>
//             Chốt kế hoạch này (Lưu vào lịch sử)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// /* =========================
//     FAKE API LOGIC
// ========================= */
// const fakeEdit = (oldPlan) => {
//   return {
//     ...oldPlan,
//     // Giữ nguyên input_data
//     input_data: { ...oldPlan.input_data }, 
//     // Chỉ thay đổi schedule
//     schedule: oldPlan.schedule.map((day, i) => {
//       if (i === 0) {
//         return {
//           ...day,
//           Lunch: { name: `Món mới random ${Math.floor(Math.random() * 100)} 🍲` },
//         };
//       }
//       return day;
//     }),
//   };
// };

// export default MyTripOutput;



import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import "./Output.css";

const MODE = "JSON_SERVER"; 

const REAL_API = {
  edit: "plan/",
  save: "plan/",
};

const MyTripOutput = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // KHỞI TẠO: Nếu bản ghi này đã có danh sách versions trước đó thì load lên, không thì tạo mới
  const [plans, setPlans] = useState(() => {
    const initialData = state?.data;
    if (!initialData) return [];
    
    // Nếu dữ liệu truyền sang có all_versions (do lần trước bấm X lưu lại), thì dùng nó
    if (initialData.all_versions && initialData.all_versions.length > 0) {
      return initialData.all_versions;
    }

    return [{
      ...initialData,
      input_id: initialData.input_id || Date.now(),
      is_locked: initialData.is_locked ?? false,
    }];
  });

  const [currentIndex, setCurrentIndex] = useState(plans.length - 1);
  const mode = state?.mode || "view";
  const maxEdit = state?.maxEdit || 5;
  const currentPlan = plans[currentIndex];

  if (!currentPlan) return <div className="no-data">No plan data available</div>;

  /* =========================
      HELPER: LƯU VÀO HISTORY (CHẶT CHẼ)
  ========================= */
  const updateHistoryStorage = (planToSave, isFinalSave = false) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    
    // Cấu trúc dữ liệu để lưu chi tiết
    // Nếu bấm Save (isFinalSave): Chỉ lưu 1 bản này, is_locked = true
    // Nếu bấm X: Lưu bản hiện tại nhưng kèm theo 'all_versions' để lần sau mở lại đủ các tab
    const detailedData = isFinalSave 
      ? { ...planToSave, is_locked: true, all_versions: null }
      : { ...planToSave, all_versions: plans };

    const summaryItem = {
      id: planToSave.input_id,
      created_at: new Date(),
      location: planToSave.Summary_info?.Main_location || "Unknown",
      is_locked: isFinalSave // Để ngoài History hiển thị icon khóa hoặc ẩn nút Edit
    };

    // Cập nhật mảng history tóm tắt
    const idx = history.findIndex((h) => h.id === summaryItem.id);
    if (idx !== -1) history[idx] = summaryItem;
    else history.push(summaryItem);

    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem(`plan_${summaryItem.id}`, JSON.stringify(detailedData));
  };

  /* =========================
      CORE LOGIC: EDIT
  ========================= */
  const handleEdit = async () => {
    if (currentPlan.is_locked) {
      toast.error("Plan này đã được lưu cố định");
      return;
    }
    if (plans.length >= maxEdit) {
      toast.error(`Giới hạn ${maxEdit} lần chỉnh sửa`);
      return;
    }

    try {
      let newPlanData;
      if (MODE === "JSON_SERVER") {
        newPlanData = fakeEdit(currentPlan);
      } else {
        const res = await fetch(`${REAL_API.edit}${currentPlan.input_id}/edit/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(currentPlan) 
        });
        if (!res.ok) throw new Error();
        newPlanData = await res.json();
      }

      const newPlans = [...plans, newPlanData];
      setPlans(newPlans);
      setCurrentIndex(newPlans.length - 1);
      toast.success("Đã tạo bản phác thảo mới!");
    } catch (err) {
      toast.error("Lỗi kết nối máy chủ");
    }
  };

  /* =========================
      CORE LOGIC: SAVE (CHỐT)
  ========================= */
  const handleSave = async () => {
    try {
      const lockedPlan = { ...currentPlan, is_locked: true };

      if (MODE === "REAL_BACKEND") {
        const res = await fetch(`${REAL_API.save}${currentPlan.input_id}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(lockedPlan),
        });
        if (!res.ok) throw new Error();
      }

      // Lưu vào localStorage với trạng thái Chốt
      updateHistoryStorage(lockedPlan, true);
      
      toast.success("Đã chốt kế hoạch thành công!");
      navigate("/history");
    } catch (err) {
      toast.error("Lưu thất bại");
    }
  };

  /* =========================
      CORE LOGIC: CLOSE (LƯU TẠM)
  ========================= */
  const handleClose = () => {
    // Nếu đang ở chế độ sửa và chưa bị khóa, bấm X sẽ lưu "dở dang" toàn bộ các version
    if (mode === "change" && !currentPlan.is_locked) {
      updateHistoryStorage(currentPlan, false);
      toast.info("Đã lưu lại các bản phác thảo vào lịch sử.");
    }
    navigate("/history");
  };

//   return (
//     <div className="output-container">
//       <div className="output-header">
//         <button className="close-btn" onClick={handleClose}>✖</button>
//       </div>

//       <div className="plan-tabs">
//         {plans.map((_, index) => (
//           <button
//             key={index}
//             className={`plan-tab ${currentIndex === index ? "active" : ""}`}
//             onClick={() => setCurrentIndex(index)}
//           >
//             Bản {index + 1} {index === 0 ? "(Gốc)" : ""}
//           </button>
//         ))}
//       </div>

//       <div className="output-main">
//         <div className="schedule-box">
//           <h3 className="section-title">Lịch trình chi tiết</h3>
//           {currentPlan.schedule.map((day, i) => (
//             <div key={i} className="day-block">
//               <h4>Ngày {i + 1}</h4>
//               <p>Trưa: {day.Lunch?.name || "Tự túc"}</p>
//               {/* Render các phần khác của bà ở đây */}
//             </div>
//           ))}

//           {mode === "change" && !currentPlan.is_locked && (
//             <button className="edit-btn" onClick={handleEdit}>
//               Chỉnh sửa (Random lại lịch trình)
//             </button>
//           )}
//         </div>
        
//         {/* Phần Right Panel giữ nguyên UI của bà */}
//       </div>

//       {mode === "change" && !currentPlan.is_locked && (
//         <div className="sticky-footer">
//           <button className="save-btn" onClick={handleSave}>
//             Chốt kế hoạch này (Khóa chỉnh sửa)
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };




  return (
    <div className="output-container">
      {/* HEADER */}
      <div className="output-header">
        <button className="close-btn" onClick={handleClose}>✖</button>
      </div>

      {/* TABS: Chuyển đổi giữa các version đã edit */}
      <div className="plan-tabs">
        {plans.map((_, index) => (
          <button
            key={index}
            className={`plan-tab ${currentIndex === index ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          >
            Plan {index + 1}
          </button>
        ))}
        {/* {plans.length > 1 && <span className="view-all-hint">Vuốt để xem thêm các bản cũ</span>} */}
      </div>

      <div className="output-main">
        {/* LEFT: SCHEDULE DISPLAY */}
        <div className="schedule-box">
          <h3 className="section-title">Lịch trình chi tiết</h3>
          {currentPlan.schedule.map((day, i) => (
            <div key={i} className="day-block">
              <h4>Ngày {i + 1}</h4>
              <ul className="day-details">
                <li>
                  <strong>Ăn uống:</strong>
                  <ul>
                    <li>Sáng: {day.Breakfast?.name || "Tự túc"}</li>
                    <li>Trưa: {day.Lunch?.name || "Tự túc"}</li>
                    <li>Tối: {day.Dinner?.name || "Tự túc"}</li>
                  </ul>
                </li>
                <li>
                  <strong>Tham quan:</strong>
                  <ul>
                    {day.Place?.map((p, idx) => <li key={idx}>{p.name}</li>)}
                  </ul>
                </li>
              </ul>
            </div>
          ))}

          {/* EDIT BUTTON */}
          {mode === "change" && !currentPlan.is_locked && (
            <button className="edit-btn" onClick={handleEdit}>
              Chỉnh sửa 
            </button>
          )}
        </div>

        {/* RIGHT: SUMMARY & INPUT (LOCKED) */}
        <div className="right-panel">
          <div className="summary-box">
            <h4>Thông tin chung</h4>
            <p><strong>Khách sạn:</strong> {currentPlan.Summary_info.Hotel?.name}</p>
            <p><strong>Điểm chính:</strong> {currentPlan.Summary_info.Main_location}</p>

            <h4 style={{marginTop: '20px'}}>Dự toán chi phí</h4>
            <ul className="budget-list">
              <li>Ăn uống: {currentPlan.budget_breakdown.food}</li>
              <li>Lưu trú: {currentPlan.budget_breakdown.hotel}</li>
              <li>Khác: {currentPlan.budget_breakdown.other}</li>
            </ul>
          </div>

          {/* INPUT INFO (READ-ONLY) */}
          <div className="input-box locked">
            <h4>Yêu cầu ban đầu (🔒)</h4>
            <p>Ngân sách: {currentPlan.input_data?.budget}</p>
            <p>Số người: {currentPlan.input_data?.num_people}</p>
            <p>Địa điểm: {currentPlan.input_data?.location}</p>
            {/* <small className="lock-note">*Không thể thay đổi yêu cầu đầu vào tại đây</small> */}
          </div>
        </div>
      </div>

      {/* FINAL SAVE */}
      {mode === "change" && !currentPlan.is_locked && (
        <div className="sticky-footer">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      )}
    </div>
  );
};

const fakeEdit = (oldPlan) => {
  return {
    ...oldPlan,
    schedule: oldPlan.schedule.map((day, i) => (
      i === 0 ? { ...day, Lunch: { name: `Món mới ${Math.floor(Math.random() * 100)} 🍲` } } : day
    )),
  };
};

export default MyTripOutput;