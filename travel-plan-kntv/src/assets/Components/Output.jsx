
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

  // const [plans, setPlans] = useState(() => {
  //   const initialData = state?.data;
  //   if (!initialData) return [];

  //   if (initialData.all_versions && initialData.all_versions.length > 0) {
  //     return initialData.all_versions;
  //   }

  //   return [{
  //     ...initialData,
  //     input_id: initialData.input_id || Date.now(),
  //     is_locked: initialData.is_locked ?? false,
  //   }];
  // });

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

      updateHistoryStorage(lockedPlan, true);

      toast.success("Đã chốt kế hoạch thành công!");
      navigate("/history");
    } catch (err) {
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

           
            const placeList = day.Place || [];
            const currentPlaceIndex = getIndex("place", i);
            const currentPlace = placeList[currentPlaceIndex];

            return (
              <div key={i} className="day-block">
                <h4>Ngày {day.Date}</h4>

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

                    <div className="switch-box">
                      <button
                        onClick={() =>
                          changeIndex("place", i, -1, placeList.length)
                        }
                        disabled={currentPlaceIndex === 0}
                      >
                        ◀
                      </button>

                      <span>
                        {currentPlace?.name || "Không có địa điểm"}
                      </span>

                      <button
                        onClick={() =>
                          changeIndex("place", i, 1, placeList.length)
                        }
                        disabled={currentPlaceIndex === placeList.length - 1}
                      >
                        ▶
                      </button>
                      <div className="surge-price">
                        ⚠️ Cuối tuần có tăng giá
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            );
          })}

          {mode === "change" && !currentPlan.is_locked && (
            <button className="edit-btn" onClick={handleEdit}>
              Chỉnh sửa 
            </button>
          )}
        </div>

        <div className="right-panel">
          <div className="summary-box">
            <h4>Thông tin chung</h4>

            <p>
              <strong>Khách sạn:</strong> {currentHotel?.name || "Không có dữ liệu"}
            </p>

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

            <p>
              <strong>Điểm chính:</strong> {currentPlan.Summary_info?.Main_location || "Chưa xác định"}
              {/* {currentPlan.Summary_info.Main_location} */}
            </p>

            <h4 style={{ marginTop: "20px" }}>Dự toán chi phí</h4>
            <ul className="budget-list">
              {/* <li>Ăn uống: {currentPlan.budget_breakdown.food}</li>
              <li>Lưu trú: {currentPlan.budget_breakdown.hotel}</li> */}
              {/* // Đề phòng budget_breakdown bị undefined */}
<li>Ăn uống: {currentPlan.budget_breakdown?.food?.toLocaleString()} VNĐ</li>
<li>Lưu trú: {currentPlan.budget_breakdown?.hotel?.toLocaleString()} VNĐ</li>
              {/* <li>Khác: {currentPlan.budget_breakdown.other}</li> */}
              <li>Khác: {currentPlan.budget_breakdown?.other?.toLocaleString()} VNĐ</li>
            </ul>
          </div>

          <div className="input-box locked">
            <h4>Yêu cầu ban đầu (🔒)</h4>
            <p>Ngân sách: {currentPlan.input_data?.budget?.toLocaleString()} VNĐ</p>
             {/* <li>Khác: {currentPlan.budget_breakdown?.other?.toLocaleString()} VNĐ</li> */}
            <p>Số người: {currentPlan.input_data?.num_people}</p>
            <p>Địa điểm: {currentPlan.input_data?.location}</p>
          </div>
        </div>
      </div>

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

// const fakeEdit = (oldPlan) => {
//   return {
//     ...oldPlan,
//     schedule: oldPlan.schedule.map((day, i) =>
//       i === 0
//         ? { ...day, Lunch: { name: `Món mới ${Math.floor(Math.random() * 100)} 🍲` } }
//         : day
//     ),
//   };
// };
const fakeEdit = (oldPlan) => {
  return {
    ...oldPlan,
    input_data: oldPlan.input_data, // 👈 THÊM DÒNG NÀY
    schedule: oldPlan.schedule.map((day, i) =>
      i === 0
        ? { ...day, Lunch: { name: `Món mới ${Math.floor(Math.random() * 100)} 🍲` } }
        : day
    ),
  };
};
export default MyTripOutput;