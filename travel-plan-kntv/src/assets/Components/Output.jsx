
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api'
import "./Output.css";

// const MODE = "JSON_SERVER"; 

const MODE = "REAL_BACKEND"; 
const REAL_API = {
    plan: "travel-output/",
};

// const handleSave = async (payload) => {
//     try {
//         const res = await authorizedFetch(REAL_API.plan, {
//             method: "POST",
//             body: JSON.stringify(payload)
//         });

//         if (res.ok) {
//             const data = await res.json();
//             return data;
//         }
//     } catch (err) {
//         console.error(err);
//     }
// };
const savePlanToServer = async (payload) => {
  try {
    const data = {
      "summary_info": payload.Summary_info, 
      "budget_breakdown": payload.budget_breakdown, 
      "input_id": payload.input_id, 
      "schedule": payload.schedule
    }

    console.log("Dữ liệu save kế hoạch nè: ", data);

    const res = await authorizedFetch(REAL_API.plan, {
      method: "POST",
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Save failed");

    return await res.json();
  } catch (err) {
    console.error("savePlanToServer error:", err);
    throw err;
  }
};
const handleUpdate = async (id, payload) => {
    try {
        const res = await authorizedFetch(`${REAL_API.plan}${id}/`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.error(err);
    }
};

const TRAVEL_STYLE = [
  { label: "Relax", value: 1 },
  { label: "Adventure", value: 2 },
  { label: "Food tour", value: 3 },
  { label: "Cultural", value: 4 },
  { label: "Playground", value: 5 },
  { label: "History", value: 6 },
  { label: "Thrill", value: 7 },
  { label: "Beach", value: 8 },
  { label: "Take Picture", value: 9 },
];

const FOOD_TYPE = [
  { label: "Meat", value: 1 },
  { label: "Seafood", value: 2 },
  { label: "Vegetarian", value: 3 },
  { label: "Family-style", value: 4},
  { label: "Set meal", value: 5 },
  { label: "Hotpot", value: 6 },
];

const ACCOMMODATION = [
  { label: "Hotel", value: 1 },
  { label: "Motel", value: 2 },
  { label: "Homestay", value: 3 },
  { label: "Resort", value: 4 },
  { label: "Villa", value: 5 },
];

/* =========================
   TAG MAP (tránh trùng value)
========================= */
// const TAG_MAP = {
//   ...Object.fromEntries(TRAVEL_STYLE.map(i => [i.value, i.label])),
//   ...Object.fromEntries(FOOD_TYPE.map(i => [i.value, i.label])),
//   ...Object.fromEntries(ACCOMMODATION.map(i => [i.value, i.label])),
// };
const FOOD_MAP = Object.fromEntries(FOOD_TYPE.map(i => [i.value, i.label]));
const HOTEL_MAP = Object.fromEntries(ACCOMMODATION.map(i => [i.value, i.label]));
const STYLE_MAP = Object.fromEntries(TRAVEL_STYLE.map(i => [i.value, i.label]));
const getItemType = (item) => {
  const tags = item?.tag || [];

  // hotel: có tag thuộc ACCOMMODATION
  if (tags.some(t => ACCOMMODATION.some(a => a.value === t))) {
    return "hotel";
  }

  // food/restaurant: có FOOD_TYPE
  if (tags.some(t => FOOD_TYPE.some(f => f.value === t))) {
    return "food";
  }

  // còn lại coi là attraction / travel style
  if (tags.some(t => TRAVEL_STYLE.some(s => s.value === t))) {
    return "attraction";
  }

  return "unknown";
};
/* =========================
   REUSABLE COMPONENT
========================= */

// const RenderItem = ({ item, onEdit, canEdit }) => {
//   if (!item) return <span>Không có dữ liệu</span>;

//   const type = getItemType(item);

//   const getLabel = (t) => {
//     if (type === "food") return FOOD_MAP[t] || `Food ${t}`;
//     if (type === "hotel") return HOTEL_MAP[t] || `Hotel ${t}`;
//     if (type === "attraction") return STYLE_MAP[t] || `Style ${t}`;
//     return `Tag ${t}`;
//   };

//   return (
//     <div className="item-box">
//       <div className="item-main">
//         <span className="item-name">
//           {item.name} ({type})
//         </span>

//         {item.has_surge_price && (
//           <span className="surge-price">⚠️ Cuối tuần có tăng giá</span>
//         )}

//         {canEdit && (
//           <button className="edit-icon" onClick={onEdit}>
//             Edit
//           </button>
//         )}
//       </div>

//       {item.tag?.length > 0 && (
//         <div className="tag-list">
//           {item.tag.map((t, i) => (
//             <span key={i} className="tag">
//               {getLabel(t)}
//             </span>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

const RenderItem = ({ item, typeScope, onEdit, canEdit }) => {
  if (!item) return <span>Không có dữ liệu</span>;

  const getLabel = (t) => {
    if (typeScope === "food") return FOOD_MAP[t] || `Food ${t}`;
    if (typeScope === "hotel") return HOTEL_MAP[t] || `Hotel ${t}`;
    if (typeScope === "attraction") return STYLE_MAP[t] || `Style ${t}`;
    return `Tag ${t}`;
  };

  return (
    <div className="item-box">
      <div className="item-main">
        <span className="item-name">{item.name}</span>

        {item.has_surge_price && (
          <span className="surge-price">⚠️ Cuối tuần có tăng giá</span>
        )}

        {/* {canEdit && (
          <button className="edit-icon" onClick={onEdit}>
            Edit
          </button>
        )} */}
{canEdit && (
  <button className="edit-icon" onClick={onEdit}>
    Edit
  </button>
)}
      </div>

      {item.tag?.length > 0 && (
        <div className="tag-list">
          {item.tag.map((t, i) => (
            <span key={i} className="tag">
              {getLabel(t)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};


const MyTripOutput = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
const [isEditing, setIsEditing] = useState(false);
  

  const [plans, setPlans] = useState(() => {
  const initialData = state?.data;
  if (!initialData) return [];

  const base = {
    ...initialData,
    input_id: initialData.input_id || Date.now(),
    is_locked: initialData.is_locked ?? false,
    input_data: initialData.input_data || state?.input_data || state?.data?.input_data || state?.input || {}
  };

  if (initialData.all_versions && initialData.all_versions.length > 0) {
    return initialData.all_versions;
  }

  return [base];
});
  const [currentIndex, setCurrentIndex] = useState(plans.length - 1);
  const mode = state?.mode || "view";
  const isViewMode = mode === "view";
const isEditMode = mode === "change";
  const maxEdit = state?.maxEdit || 5;
  const currentPlan = plans[currentIndex];

  if (!currentPlan) return <div className="no-data">No plan data available</div>;

  const updateHistoryStorage = (planToSave, isFinalSave = false) => {
    let history = JSON.parse(localStorage.getItem("history")) || [];

    const detailedData = isFinalSave 
      ? { ...planToSave, is_locked: true, all_versions: null }
      : { ...planToSave, all_versions: plans };

    const summaryItem = {
      id: planToSave.input_id,
      created_at: new Date(),
      location: planToSave.Summary_info?.Main_location || "Unknown",
      is_locked: isFinalSave
    };

    const idx = history.findIndex((h) => h.id === summaryItem.id);
    if (idx !== -1) history[idx] = summaryItem;
    else history.push(summaryItem);

    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem(`plan_${summaryItem.id}`, JSON.stringify(detailedData));
  };

  // const handleEdit = async () => {
  //   if (currentPlan.is_locked) {
  //     toast.error("Plan này đã được lưu cố định");
  //     return;
  //   }
  //   if (plans.length >= maxEdit) {
  //     toast.error(`Giới hạn ${maxEdit} lần chỉnh sửa`);
  //     return;
  //   }

  //   try {
  //     let newPlanData;
  //     if (MODE === "JSON_SERVER") {
  //       newPlanData = fakeEdit(currentPlan);
  //     } else {
  //       const res = await fetch(`${REAL_API.edit}${currentPlan.input_id}/edit/`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  //         },
  //         body: JSON.stringify(currentPlan)
  //       });
  //       if (!res.ok) throw new Error();
  //       newPlanData = await res.json();
  //     }

  //     const newPlans = [...plans, newPlanData];
  //     setPlans(newPlans);
  //     setCurrentIndex(newPlans.length - 1);
  //     toast.success("Đã tạo bản phác thảo mới!");
  //   } catch (err) {
  //     toast.error("Lỗi kết nối máy chủ");
  //   }
  // };
const handleEdit = async () => {
  // if (currentPlan.is_locked) {
  //   toast.error("Plan này đã được lưu cố định");
  //   return;
  // }
  if (!canShowEdit ) {
  toast.error("Không thể chỉnh sửa kế hoạch này");
  return;
}

  if (plans.length >= maxEdit) {
    toast.error(`Giới hạn ${maxEdit} lần chỉnh sửa`);
    return;
  }

  try {
    let newPlanData;

    /* =========================
       1. JSON SERVER MODE
    ========================= */
    if (MODE === "JSON_SERVER") {
      newPlanData = {
        ...currentPlan,
        schedule: currentPlan.schedule.map((d, i) =>
          i === 0
            ? { ...d, Lunch: { name: "Mock update 🍜" } }
            : d
        ),
      };
    }

    /* =========================
       2. REAL BACKEND MODE
    ========================= */
    else {
      newPlanData = await handleUpdate(
        currentPlan.input_id,
        currentPlan
      );
    }

    const newPlans = [...plans, newPlanData];
    setPlans(newPlans);
    setCurrentIndex(newPlans.length - 1);

    toast.success("Đã tạo bản chỉnh sửa mới!");

  } catch (err) {
    toast.error("Lỗi khi chỉnh sửa");
  }
};
 
// const handleSave = async () => {
//   try {
//     const lockedPlan = { ...currentPlan, is_locked: true };

//     /* =========================
//        JSON SERVER
//     ========================= */
//     if (MODE === "JSON_SERVER") {
//       console.log("Mock save:", lockedPlan);
//     }

//     /* =========================
//        REAL BACKEND
//     ========================= */
//     else {
//       await handleSave(lockedPlan);
//     }

//     updateHistoryStorage(lockedPlan, true);

//     toast.success("Đã chốt kế hoạch thành công!");
//     navigate("/history");

//   } catch (err) {
//     toast.error("Lưu thất bại");
//   }
// };
  
// const handleSave = async () => {
//   try {
//     const lockedPlan = {
//       ...currentPlan,
//       is_locked: true,
//     };

//     // =========================
//     // 1. SAVE (API or mock)
//     // =========================
//     if (MODE === "JSON_SERVER") {
//       console.log("Mock save:", lockedPlan);
//     } else {
//       await savePlanToServer(lockedPlan);
//     }

//     // =========================
//     // 2. UPDATE LOCAL STORAGE
//     // =========================
//     updateHistoryStorage(lockedPlan, true);

//     // =========================
//     // 3. NAVIGATE
//     // =========================
//     toast.success("Đã chốt kế hoạch thành công!");
//     navigate("/history");

//   } catch (err) {
//     console.error("handleSave error:", err);
//     toast.error("Lưu thất bại");
//   }
// };
const handleSave = async () => {
  try {
    const savedPlan = {
      ...currentPlan,
    };

    if (MODE === "JSON_SERVER") {
      console.log("Mock save:", savedPlan);
    } else {
      await savePlanToServer(savedPlan);
    }

    updateHistoryStorage(savedPlan, false);

    toast.success("Đã lưu kế hoạch thành công!");
    navigate("/history");

  } catch (err) {
    console.error("handleSave error:", err);
    toast.error("Lưu thất bại");
  }
};
const handleClose = () => {
    if (mode === "change" && !currentPlan.is_locked) {
      updateHistoryStorage(currentPlan, false);
      toast.info("Đã lưu lại các bản phác thảo vào lịch sử.");
    }
    navigate("/history");
  };

  const updatePlace = ({ dayIndex, field, newPlace }) => {
  setPlans(prevPlans => {
    const newPlans = [...prevPlans];

    const plan = { ...newPlans[currentIndex] };

    const newSchedule = plan.schedule.map((day, i) => {
      if (i !== dayIndex) return day;

      return {
        ...day,
        [field]: {
          ...day[field],
          ...newPlace
        }
      };
    });

    newPlans[currentIndex] = {
      ...plan,
      schedule: newSchedule
    };

    return newPlans;
  });
};
const today = new Date().toISOString().split("T")[0];
const end_day = currentPlan.input_data?.return_date;

// const isExpired = end_day && today > end_day;
const isExpired = currentPlan.input_data?.return_date
  ? new Date(currentPlan.input_data.return_date) < new Date()
  : false;

// const canEditGlobal =
//   mode === "change" &&
//   !currentPlan.is_locked &&
//   !isExpired;
// const today = new Date().toISOString().split("T")[0];
// const end_day = currentPlan.input_data?.return_date;

// const isExpired = end_day && today > end_day;

// const can_change =
//   mode === "change" &&
//   !isExpired;
// const canEditUI = isEditing && mode === "change" && !isExpired;
// const canShowEdit = mode === "change" && !isExpired && isEditing;
// const canShowEdit = isEditMode && !isExpired;
const canShowEdit =
  mode === "change" &&
  isEditing &&
  !isExpired;
const canShowSave = true; // luôn luôn hiện
  /* =====================================================
     FIXED PART: HOTEL + PLACE LOGIC (ĐÚNG HOÀN TOÀN)
  ===================================================== */

  const [hotelIndex, setHotelIndex] = useState(0);
  const hotels = currentPlan.hotels || [];
  const currentHotel = hotels[hotelIndex];

  const [placeIndex, setPlaceIndex] = useState({});

  const getIndex = (type, dayIdx) => {
    return placeIndex?.[`${type}_${dayIdx}`] ?? 0;
  };

  const changeIndex = (type, dayIdx, direction, max) => {
    const key = `${type}_${dayIdx}`;

    setPlaceIndex((prev) => {
      const current = prev[key] ?? 0;

      let next = current + direction;
      if (next < 0) next = 0;
      if (next > max - 1) next = max - 1;

      return {
        ...prev,
        [key]: next,
      };
    });
  };

  return (
    <div className="output-container">
      <div className="output-header">
        <button className="close-btn" onClick={handleClose}>✖</button>
      </div>

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
      </div>

      <div className="output-main">
        <div className="schedule-box">
          <h3 className="section-title">Lịch trình chi tiết</h3>

          {currentPlan.schedule.map((day, i) => {

            return (
              <div key={i} className="day-block">
                <h4>Ngày {day.Date}</h4>

                <ul className="day-details">
                  <li>
                    <strong>Ăn uống:</strong>
                    <ul>
                     
{/* <li className="item-row">
  <span>Sáng:</span>
  <RenderItem item={day.Breakfast} />
</li>

<li className="item-row">
  <span>Trưa:</span>
  <RenderItem item={day.Lunch} />
</li>

<li className="item-row">
  <span>Tối:</span>
  <RenderItem item={day.Dinner} />
</li> */}
                      <li className="item-row">
  <span>Sáng:</span>
  <RenderItem item={day.Breakfast} typeScope="food" canEdit={canShowEdit}/>
</li>

<li className="item-row">
  <span>Trưa:</span>
  <RenderItem item={day.Lunch} typeScope="food" canEdit={canShowEdit} />
</li>

<li className="item-row">
  <span>Tối:</span>
  <RenderItem item={day.Dinner} typeScope="food" canEdit={canShowEdit}/>
</li>
                
                    </ul>
                    
                  </li>

                 
                  <li>
  <strong>Tham quan:</strong>

  {day.Place && day.Place.length > 0 ? (
    <ul>
      {/* {day.Place?.map((place, idx) => (
  <RenderItem key={idx} item={place} />
))} */}
{day.Place?.map((place, idx) => (
  <RenderItem
    key={idx}
    item={place}
    typeScope="attraction" canEdit={canShowEdit}
  />
))}
    </ul>
  ) : (
    <p>Không có địa điểm</p>
  )}

</li>
                </ul>
              </div>
            );
          })}

         
{/* <button
  className="edit-btn"
  onClick={() => setIsEditing(true)}
>
  Chỉnh sửa
</button> */}
{mode === "change" && !isExpired && !isEditing && (
  <button
    className="edit-btn"
    onClick={() => setIsEditing(true)}
  >
    Chỉnh sửa
  </button>
)}
        </div>

        <div className="right-panel">
          <div className="summary-box">
            <h4>Thông tin chung</h4>
            <br />
            <div>
              <strong>Khách sạn:</strong> 
              {/* <RenderItem item={currentHotel} /> */}
 <RenderItem item={currentHotel} typeScope="hotel" canEdit={canShowEdit}/>
  

            </div>

            <div className="hotel-switch">
              <button onClick={() => setHotelIndex((prev) => Math.max(prev - 1, 0))}>
                ◀
              </button>

              <span>{hotelIndex + 1} / {hotels.length}</span>

              <button
                onClick={() =>
                  setHotelIndex((prev) => Math.min(prev + 1, hotels.length - 1))
                }
              >
                ▶
              </button>
            </div>
              <br />
            <div>
              <strong>Điểm chính:</strong> {currentPlan.Summary_info?.Main_location || "Chưa xác định"}
             
            </div>

            <h4 style={{ marginTop: "20px" }}>Dự toán chi phí</h4>
            <ul className="budget-list">
              <li>Ăn uống: {currentPlan.budget_breakdown?.food?.toLocaleString()} VNĐ</li>
              <li>Lưu trú: {currentPlan.budget_breakdown?.hotel?.toLocaleString()} VNĐ</li>
             
              <li>Khác: {currentPlan.budget_breakdown?.other?.toLocaleString()} VNĐ</li>
            </ul>
          </div>

          <div className="input-box locked">
              <h4>Yêu cầu ban đầu (🔒)</h4>

              {currentPlan.input_data?.budget && (
                <div>
                <br />
                  Ngân sách: {currentPlan.input_data.budget.toLocaleString()} VNĐ
                </div>
              )}

              {currentPlan.input_data?.num_people && (
                <div><br />Số người: {currentPlan.input_data.num_people}</div>
              )}

              
              {currentPlan.input_data?.departure_date && (
              <div><br />Ngày đi: {currentPlan.input_data.departure_date}</div>
            )}

            {currentPlan.input_data?.return_date && (
              <div><br />Ngày về: {currentPlan.input_data.return_date}</div>
            )}

            {currentPlan.input_data?.location && (
              <div><br />Địa điểm: {currentPlan.input_data.location}</div>
            )}
            </div>
        </div>
      </div>

      {/* {mode === "change" && !currentPlan.is_locked && (
        <div className="sticky-footer">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      )} */}
      {canShowSave  && (
  <div className="sticky-footer">
    <div className="sticky-footer">
  <button className="save-btn" onClick={handleSave}>
    Save
  </button>
</div>
  </div>
)}
    </div>
  );
};

const fakeEdit = (oldPlan) => {
  return {
    ...oldPlan,
     hotels: oldPlan.hotels || [],
    input_data: oldPlan.input_data, // 👈 THÊM DÒNG NÀY
    schedule: oldPlan.schedule.map((day, i) =>
      i === 0
        ? { ...day, Lunch: { name: `Món mới ${Math.floor(Math.random() * 100)} 🍲` } }
        : day
    ),
  };
};
export default MyTripOutput;