import { useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api';
import "./Output.css";
import Header from '../Components/Header.jsx'

// const MODE = "JSON_SERVER";

const MODE = "REAL_BACKEND";
const REAL_API = {
    plan: "travel-output/",
};

const savePlanToServer = async (payload) => {
    try {
        const data = {
            "summary_info": payload.summary_info,
            "budget_breakdown": payload.budget_breakdown,
            "input_id": payload.input_id,
            "schedule": payload.schedule,
        };
        console.log("Dữ liệu save chuyển đi nè: ", data)
        // return;
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
            return await res.json();
        }
    } catch (err) {
        console.error(err);
    }
};

const TRAVEL_STYLE = [
    { label: "Relax", value: 1 }, { label: "Adventure", value: 2 },
    { label: "Food tour", value: 3 }, { label: "Cultural", value: 4 },
    { label: "Playground", value: 5 }, { label: "History", value: 6 },
    { label: "Thrill", value: 7 }, { label: "Beach", value: 8 },
    { label: "Take Picture", value: 9 },
];

const FOOD_TYPE = [
    { label: "Meat", value: 1 }, { label: "Seafood", value: 2 },
    { label: "Vegetarian", value: 3 }, { label: "Family-style", value: 4 },
    { label: "Set meal", value: 5 }, { label: "Hotpot", value: 6 },
];

const ACCOMMODATION = [
    { label: "Hotel", value: 1 }, { label: "Motel", value: 2 },
    { label: "Homestay", value: 3 }, { label: "Resort", value: 4 },
    { label: "Villa", value: 5 },
];

const FOOD_MAP = Object.fromEntries(FOOD_TYPE.map(i => [i.value, i.label]));
const HOTEL_MAP = Object.fromEntries(ACCOMMODATION.map(i => [i.value, i.label]));
const STYLE_MAP = Object.fromEntries(TRAVEL_STYLE.map(i => [i.value, i.label]));

const RenderItem = ({ item, typeScope }) => {
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
            </div>
            {item.tag?.length > 0 && (
                <div className="tag-list">
                    {item.tag.map((t, i) => (
                        <span key={i} className="tag">{getLabel(t)}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

const MyTripOutput = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [isDirty, setIsDirty] = useState(false);

    // const [plans, setPlans] = useState(() => {
    //     const initialData = state?.data;
    //     if (!initialData) return [];

    //     const base = {
    //         ...initialData,
    //         input_id: initialData.input_id || Date.now(),
    //         is_locked: initialData.is_locked ?? false,
    //         input: initialData.input || state?.input || {}
    //     };

    //     if (initialData.all_versions && initialData.all_versions.length > 0) {
    //         return initialData.all_versions;
    //     }
    //     return [base];
    // });

    const [plans, setPlans] = useState(() => {
    const initialData = state?.data;
    if (!initialData) return [];

    // Bước quan trọng: Map dữ liệu backend sang tên biến frontend dùng
    const normalizedData = {
        ...initialData,
        // Backend trả về 'attractions' -> Frontend dùng 'place_pool'
        place_pool: initialData.attractions || initialData.place_pool || [],
        // Backend trả về 'restaurants_breakfast' -> Frontend dùng 'breakfast_pool'
        breakfast_pool: initialData.restaurants_breakfast || initialData.breakfast_pool || [],
        // Backend trả về 'hotels' -> Frontend dùng 'hotel_pool'
        hotel_pool: initialData.hotels || initialData.hotel_pool || [],
        
        // Giữ các pool khác nếu có, hoặc tạo mảng rỗng để tránh crash
        lunch_pool: initialData.restaurants_lunch || initialData.lunch_pool || [],
        dinner_pool: initialData.restaurants_dinner || initialData.dinner_pool || []
    };

    const base = {
        ...normalizedData,
        input_id: initialData.input_id || Date.now(),
        is_locked: initialData.is_locked ?? false,
        input: initialData.input || state?.input || state?.data?.input || state?.input || {}
    };

    if (initialData.all_versions && initialData.all_versions.length > 0) {
        return initialData.all_versions;
    }
    return [base];
});

    const [currentIndex, setCurrentIndex] = useState(plans.length - 1);
    const mode = state?.mode || "change";
    const maxEdit = state?.maxEdit || 5;
    const currentPlan = plans[currentIndex];

    const usedSet = useMemo(() => {
        const set = new Set();
        if (!currentPlan) return set;
        currentPlan.schedule.forEach(day => {
            ["Breakfast", "Lunch", "Dinner"].forEach(meal => {
                if (day[meal]?.id) set.add(day[meal].id);
            });
            day.Place?.forEach(p => {
                if (p?.id) set.add(p.id);
            });
        });
        return set;
    }, [currentPlan]);

    const updateHistoryStorage = (planToSave, isFinalSave = false) => {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        const detailedData = isFinalSave
            ? { ...planToSave, is_locked: true, all_versions: null }
            : { ...planToSave, all_versions: plans };

        const summaryItem = {
            id: planToSave.input_id,
            created_at: new Date(),
            location: planToSave.summary_info?.main_location || "Unknown",
            is_locked: isFinalSave
        };

        const idx = history.findIndex((h) => h.id === summaryItem.id);
        if (idx !== -1) history[idx] = summaryItem;
        else history.push(summaryItem);

        localStorage.setItem("history", JSON.stringify(history));
        localStorage.setItem(`plan_${summaryItem.id}`, JSON.stringify(detailedData));
    };

    const handleSave = async () => {
        try {
            const savedPlan = { ...currentPlan };
            if (MODE !== "JSON_SERVER") {
                await savePlanToServer(savedPlan);
            }
            // return;
            updateHistoryStorage(savedPlan, false);
            toast.success("Đã lưu kế hoạch thành công!");
            navigate("/history");
        } catch (err) {
            toast.error("Lưu thất bại");
        }
    };

    const handleClose = () => {
        if (isDirty) {
            const ok = window.confirm("Bạn có thay đổi chưa lưu. Thoát?");
            if (!ok) return;
        }
        if (mode === "change" && !currentPlan.is_locked) {
            updateHistoryStorage(currentPlan, false);
        }
        navigate("/history");
    };

    const handleSwap = (dayIndex, field, poolKey) => {
    setPlans(prev => {
        const newPlans = [...prev];
        const plan = { ...newPlans[currentIndex] };
        
        // 1. Lấy đúng pool dữ liệu (lunch_pool hoặc dinner_pool)
        const pool = [...(plan[poolKey] || [])];
        const currentItem = plan.schedule?.[dayIndex]?.[field];

        // 2. Lọc: Lấy những cái trong pool mà CHƯA có trong lịch trình
        // HOẶC ít nhất là không trùng với cái hiện tại đang hiển thị
        const available = pool.filter(p => !usedSet.has(p.id));

        if (available.length === 0) {
            // Nếu không còn cái nào "mới" hoàn toàn, 
            // ta lấy cái bất kỳ trong pool miễn là khác cái hiện tại
            const fallbackAvailable = pool.filter(p => p.id !== currentItem?.id);
            
            if (fallbackAvailable.length === 0) {
                toast.error("Không còn lựa chọn nào khác trong danh sách");
                return prev;
            }
            
            // Đổi sang cái đầu tiên trong danh sách fallback
            return performUpdate(fallbackAvailable[0]);
        }

        return performUpdate(available[0]);

        function performUpdate(next) {
            // Logic cập nhật pool: 
            // Trả cái cũ (currentItem) về pool và lấy cái mới (next) ra khỏi pool
            let newPool = pool.filter(p => p.id !== next.id);
            if (currentItem && !newPool.find(p => p.id === currentItem.id)) {
                newPool.push(currentItem);
            }

            const newSchedule = plan.schedule.map((d, i) =>
                i === dayIndex ? { ...d, [field]: next } : d
            );

            newPlans[currentIndex] = { 
                ...plan, 
                [poolKey]: newPool, 
                schedule: newSchedule 
            };
            return newPlans;
        }
    });
    setIsDirty(true);
};
    const handleSwapHotel = () => {
        setPlans(prev => {
            const newPlans = [...prev];
            const plan = { ...newPlans[currentIndex] };
            const pool = [...(plan.hotel_pool || [])];
            const current = plan.hotels?.[0];

            if (!pool.length) {
                toast.error("Không còn khách sạn");
                return prev;
            }

            const next = pool[0];
            const exists = current && pool.some(p => p.id === current.id);
            const newPool = exists || !current ? pool : [...pool, current];
            const finalPool = newPool.filter(p => p.id !== next.id);

            const newHotels = [next]; 

            newPlans[currentIndex] = { ...plan, hotels: newHotels, hotel_pool: finalPool };
            return newPlans;
        });
        setIsDirty(true);
    };

    const handleSwapPlace = (dayIndex, placeIndex) => {
        setPlans(prev => {
            const newPlans = [...prev];
            const plan = { ...newPlans[currentIndex] };
            const pool = [...(plan.place_pool || [])];
            const currentPlaces = [...(plan.schedule[dayIndex].Place || [])];
            const currentItem = currentPlaces[placeIndex];

            const available = pool.filter(p => !usedSet.has(p.id));
            if (available.length === 0) {
                toast.error("Không còn địa điểm");
                return prev;
            }

            const next = available[0];
            const exists = currentItem && pool.some(p => p.id === currentItem.id);
            const newPool = exists || !currentItem ? pool : [...pool, currentItem];
            const finalPool = newPool.filter(p => p.id !== next.id);

            currentPlaces[placeIndex] = next;
            const newSchedule = plan.schedule.map((d, i) =>
                i === dayIndex ? { ...d, Place: currentPlaces } : d
            );

            newPlans[currentIndex] = { ...plan, place_pool: finalPool, schedule: newSchedule };
            return newPlans;
        });
        setIsDirty(true);
    };

    const isExpired = currentPlan?.input?.return_date
        ? new Date(currentPlan.input.return_date) < new Date()
        : false;
    const canShowEdit = mode === "change" && !isExpired;

    // Lấy hotel tùy thuộc vào mode
    let currentHotel;
    if (mode === "change")
        currentHotel = currentPlan?.hotels?.[0];
    else    
        currentHotel = currentPlan?.summary_info.hotel;

    if (!currentPlan) return <div className="no-data">No plan data available</div>;

    return (
    <>
        <Header />
    
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
                        Plan 
                    </button>
                ))}
            </div>

            <div className="output-main">
                <div className="schedule-box">
                    <h3 className="section-title">Lịch trình chi tiết</h3>
                    {currentPlan.schedule.map((day, i) => (
                        <div key={i} className="day-block">
                            <h4>Ngày {day.Date}</h4>
                            <ul className="day-details">
                                <li>
                                    <strong>Ăn uống:</strong>
                                    <ul>
                                        <li className="item-row">
                                            <span>Sáng:</span>
                                            <RenderItem item={day.Breakfast} typeScope="food" />
                                            {canShowEdit && (
                                                <button onClick={() => handleSwap(i, "Breakfast", "breakfast_pool")}>+</button>
                                            )}
                                        </li>
                                        <li className="item-row">
                                            <span>Trưa:</span>
                                            <RenderItem item={day.Lunch} typeScope="food" />
                                            {canShowEdit && (
                                                <button onClick={() => handleSwap(i, "Lunch", "lunch_pool")}>+</button>
                                            )}
                                        </li>
                                        <li className="item-row">
                                            <span>Tối:</span>
                                            <RenderItem item={day.Dinner} typeScope="food" />
                                            {canShowEdit && (
                                                <button onClick={() => handleSwap(i, "Dinner", "dinner_pool")}>+</button>
                                            )}
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <strong>Tham quan:</strong>
                                    {day.Place?.map((place, idx) => (
                                        <div key={idx} className="item-row">
                                            <RenderItem item={place} typeScope="attraction" />
                                            {canShowEdit && (
                                                <button onClick={() => handleSwapPlace(i, idx)}>+</button>
                                            )}
                                        </div>
                                    ))}
                                </li>
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="right-panel">
                    <div className="summary-box">
                        <h4>Thông tin chung</h4>
                        <br />
                        <div>
                            <strong>Khách sạn:</strong>
                            <RenderItem item={currentHotel} typeScope="hotel" />
                            {canShowEdit && (
                                <button onClick={handleSwapHotel}>+</button>
                            )}
                        </div>
                        <br />
                        <div>
                            <strong>Điểm chính:</strong> {currentPlan.summary_info?.main_location || "Chưa xác định"}
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
                        {currentPlan.input?.budget && <div><br />Ngân sách: {currentPlan.input.budget.toLocaleString()} VNĐ</div>}
                        {currentPlan.input?.num_people && <div><br />Số người: {currentPlan.input.num_people}</div>}
                        {currentPlan.input?.departure_date && (
              <div><br />Ngày đi: {currentPlan.input.departure_date}</div>
            )}

            {currentPlan.input?.return_date && (
              <div><br />Ngày về: {currentPlan.input.return_date}</div>
            )}
                        {currentPlan.input?.location && <div><br />Địa điểm: {currentPlan.input.location}</div>}
                    </div>


                    
                </div>
            </div>

            {canShowEdit && (
                <div className="sticky-footer">
                    <button className="save-btn" onClick={handleSave}>Save</button>
                </div>
            )}
        </div>
    </>
    );
};

export default MyTripOutput;