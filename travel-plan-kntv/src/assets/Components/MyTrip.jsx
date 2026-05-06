import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api'
import "./MyTrip.css";
import Header from "./Header";


/* =========================
   MODE
========================= */
// Đình Khang nhớ đổi trạng thái nhé
// const MODE = "JSON_SERVER";
const MODE = "REAL_BACKEND";

//Đình Khang thêm path vào đây
const REAL_API = {
  plan: "plan/",
};

/* =========================
   OPTIONS (NUMBER ONLY)
========================= */
const AREAS = [
  { label: "Đà Lạt", value: 12 },
  { label: "Nha Trang", value: 2 },
];

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

/* ========================= */

const MyTripInput = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    budget: "",
    num_people: 1,
    area: "",
    departure_date: "",
    return_date: "",

    percentage_hotel: 30,
    percentage_restaurant: 35,
    percentage_attraction: 30, // =95

    location: "",

    travel_style: [],
    food_type: [],
    accommodation_type: [],
  });

  /* =========================
     INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleMultiSelect = (name, value) => {
    const arr = form[name];

    const newArr = arr.includes(value)
      ? arr.filter((v) => v !== value)
      : [...arr, value];

    setForm({
      ...form,
      [name]: newArr,
    });
  };

  /* =========================
     VALIDATE
  ========================= */
  const validate = () => {
    const {
      budget,
      num_people,
      area,
      departure_date,
      return_date,
      percentage_hotel,
      percentage_restaurant,
      percentage_attraction,
    } = form;

    if (!budget || !num_people || !area || !departure_date || !return_date) {
      toast.error("Thiếu thông tin bắt buộc");
      return false;
    }

    const total =
      Number(percentage_hotel) +
      Number(percentage_restaurant) +
      Number(percentage_attraction);

    if (total !== 95) {
      toast.error("Tổng % phải = 95%");
      return false;
    }

    if (
      percentage_hotel < 20 ||
      percentage_restaurant < 20 ||
      percentage_attraction < 20
    ) {
      toast.error("Mỗi mục phải ≥ 20%");
      return false;
    }

    return true;
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      budget: Number(form.budget),
      num_people: Number(form.num_people),
      area: Number(form.area),
      departure_date: form.departure_date,
      return_date: form.return_date,

      percentage_hotel: Number(form.percentage_hotel),
      percentage_restaurant: Number(form.percentage_restaurant),
      percentage_attraction: Number(form.percentage_attraction),

      location: form.location || undefined,
      travel_style: form.travel_style,
      food_type: form.food_type,
      accommodation_type: form.accommodation_type,
    };

    console.log("Dữ liệu gửi đi nè: ", payload);

    try {
      /* ================= JSON SERVER ================= */
      if (MODE === "JSON_SERVER") {
        console.log("FAKE SEND:", payload);

        navigate("/my-trip/output", {
          state: {
            input: payload,
            mode: "change",
            version: 1,
            maxEdit: 5,
            data: fakeData(payload),
          },
        });

        return;
      }

      /* ================= REAL BACKEND ================= */
      // const res = await fetch(REAL_API.plan, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      //   },
      //   body: JSON.stringify(payload),
      // });
      const res = await authorizedFetch(REAL_API.plan, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      console.log("Dữ liệu nhận về nè: ", data)
      navigate("/my-trip/output", {
        state: {
          input: payload,
          data,
          mode: "change",
          version: 1,
          maxEdit: 5,
        },
      });
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gửi plan");
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <>
    <Header />
    
    <div className="trip-container">
      <div className="trip-card">
        <h2 className="trip-title">Plan Your Trip</h2>

        {/* BASIC */}
        <div className="trip-group">
          <input
            className="trip-input-field"
            name="budget"
            placeholder="Budget (VND)"
            onChange={handleChange}
          />

          <input
            className="trip-input-field"
            name="num_people"
            type="number"
            placeholder="People"
            onChange={handleChange}
          />

          <select
            className="trip-select"
            name="area"
            onChange={handleChange}
          >
            <option value="">Select area</option>
            {AREAS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>

          <div className="trip-date">
            <input
              className="trip-input-field"
              type="date"
              name="departure_date"
              onChange={handleChange}
            />

            <input
              className="trip-input-field"
              type="date"
              name="return_date"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* BUDGET */}
        <div className="trip-group">
          <h3 className="trip-subtitle">Budget Allocation (%)</h3>

          <div className="trip-grid-3">
            <input
              className="trip-input-field"
              name="percentage_hotel"
              type="number"
              placeholder="Hotel %"
              onChange={handleChange}
            />

            <input
              className="trip-input-field"
              name="percentage_restaurant"
              type="number"
              placeholder="Food %"
              onChange={handleChange}
            />

            <input
              className="trip-input-field"
              name="percentage_attraction"
              type="number"
              placeholder="Attraction %"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* OPTIONAL */}
        <div className="trip-group">
          <input
            className="trip-input-field"
            name="location"
            placeholder="Custom location (optional)"
            onChange={handleChange}
          />
        </div>

        {/* MULTI SELECT */}
        <div className="trip-group">
          <h3 className="trip-subtitle">Travel Style</h3>
          <div className="trip-tags">
            {TRAVEL_STYLE.map((i) => (
              <button
                type="button"
                key={i.value}
                className={`trip-tag ${
                  form.travel_style.includes(i.value) ? "active" : ""
                }`}
                onClick={() =>
                  handleMultiSelect("travel_style", i.value)
                }
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        <div className="trip-group">
          <h3 className="trip-subtitle">Food Type</h3>
          <div className="trip-tags">
            {FOOD_TYPE.map((i) => (
              <button
                type="button"
                key={i.value}
                className={`trip-tag ${
                  form.food_type.includes(i.value) ? "active" : ""
                }`}
                onClick={() =>
                  handleMultiSelect("food_type", i.value)
                }
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        <div className="trip-group">
          <h3 className="trip-subtitle">Accommodation</h3>
          <div className="trip-tags">
            {ACCOMMODATION.map((i) => (
              <button
                type="button"
                key={i.value}
                className={`trip-tag ${
                  form.accommodation_type.includes(i.value)
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleMultiSelect(
                    "accommodation_type",
                    i.value
                  )
                }
              >
                {i.label}
              </button>
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button className="trip-submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
    </>
  );
};


/* =========================
   FAKE DATA (UPDATED FROM IMAGE)
========================= */

// const fakeData = (input) => {
//   return {
//     Summary_info: {
//       Main_location: input.area == 4 ? "Thành phố Đà Lạt" : "Nha Trang",
//     },

//     budget_breakdown: {
//       food: 1400000,
//       hotel: 1200000,
//       other: 1200000,
//     },

//     can_change: true,
//     input_id: input.input_id || 3,
//     is_locked: false,

//     // 1. Dữ liệu Hotels (Key: hotels) - Khớp ảnh image_9317f5.png
//     hotels: [
//       { id: "69ead2de25ee2ea9a979b0e5", name: "Yolo Camping House", has_surge_price: false, img: null, tag: [3] },
//       { id: "69ead2dd25ee2ea9a979b0db", name: "Đà Lạt Wind Homestay", has_surge_price: false, img: null, tag: [3] },
//       { id: "69ead2de25ee2ea9a979b0e2", name: "The Shelter Homestay", has_surge_price: true, img: null, tag: [3] },
//       { id: "69ead2de25ee2ea9a979b0e8", name: "Nhà Nàng Homestay", has_surge_price: false, img: null, tag: [3] },
//       { id: "69ead2df25ee2ea9a979b0ea", name: "Motel Minh Hải", has_surge_price: false, img: null, tag: [2] },
//     ],

//     // 2. Dữ liệu Breakfast (Key: restaurants_breakfast) - Khớp ảnh image_931813.png
//     restaurants_breakfast: [
//       { id: "69f193172fa735b1cfd932f6", name: "Mì Gia Vĩnh Lợi", has_surge_price: false, img: null, tag: [5] },
//       { id: "69f193172fa735b1cfd932f2", name: "Bánh Ướt Lòng Gà Long", has_surge_price: false, img: null, tag: [5] },
//       { id: "69f193162fa735b1cfd932e6", name: "Gia Gia Dimsum", has_surge_price: false, img: null, tag: [5] },
//       { id: "69f193162fa735b1cfd932ea", name: "Tiệm Mì Tàu Cao", has_surge_price: false, img: null, tag: [5] },
//       { id: "69f193162fa735b1cfd932e8", name: "Bánh Mì Xíu Mại Ri", has_surge_price: false, img: null, tag: [5] },
//     ],

//     // 2. Lunch Pool (Đã bổ sung)
//     restaurants_lunch: [
//       { id: "69f193182fa735b1cfd933a1", name: "Cơm Niêu Thuận Gia", has_surge_price: true, img: null, tag: [2, 6] },
//       { id: "69f193182fa735b1cfd933a5", name: "Lẩu Cá Tầm Chu Gia", has_surge_price: false, img: null, tag: [2] },
//       { id: "69f193182fa735b1cfd933a9", name: "Gà Nướng cơm lam Ayun", has_surge_price: false, img: null, tag: [1, 2] },
//       { id: "69f193192fa735b1cfd933b2", name: "Tiệm Cơm Hồi Đó", has_surge_price: false, img: null, tag: [2] },
//       { id: "69f193192fa735b1cfd933b8", name: "Bếp 1985", has_surge_price: false, img: null, tag: [2] },
//     ],

//     // 3. Dinner Pool (Đã bổ sung)
//     restaurants_dinner: [
//       { id: "69f193202fa735b1cfd944c1", name: "Lẩu Gà Lá É Tao Ngộ", has_surge_price: true, img: null, tag: [6] },
//       { id: "69f193202fa735b1cfd944c5", name: "Buffet Rau Leguda", has_surge_price: false, img: null, tag: [1, 6] },
//       { id: "69f193212fa735b1cfd944ca", name: "Nướng Ngói Cu Đức", has_surge_price: false, img: null, tag: [3] },
//       { id: "69f193212fa735b1cfd944d2", name: "Túi Mơ To Garden Dinner", has_surge_price: true, img: null, tag: [1, 3] },
//       { id: "69f193222fa735b1cfd944d8", name: "Sashimi Garden", has_surge_price: false, img: null, tag: [1] },
//     ],
//     // 3. Dữ liệu Attractions (Key: attractions) - Khớp ảnh image_931832.png
//     attractions: [
//       { id: "69ead571744ada25b7bfab29", name: "Chợ Đêm Đà Lạt", has_surge_price: false, img: null, tag: [3, 9] },
//       { id: "69ead571744ada25b7bfab2c", name: "Nhà thờ Con Gà", has_surge_price: false, img: null, tag: [4] },
//       { id: "69ead571744ada25b7bfab2b", name: "Dinh III Bảo Đại", has_surge_price: false, img: null, tag: [6] },
//       { id: "69ead572744ada25b7bfab34", name: "Thiền viện Trúc Lâm", has_surge_price: false, img: null, tag: [4] },
//       { id: "69ead573744ada25b7bfab36", name: "Hồ Tuyền Lâm", has_surge_price: false, img: null, tag: [8] },
//       { id: "69ead572744ada25b7bfab30", name: "Chùa Linh Phước", has_surge_price: false, img: null, tag: [6] },
//     ],

//     // // Mock thêm lunch và dinner vì backend chưa thấy trong ảnh
//     // restaurants_lunch: [],
//     // restaurants_dinner: [],

//     schedule: [
//       {
//         Date: input.departure_date || "2026-05-06",
//         // Lấy thử phần tử đầu tiên của các mảng trên làm mặc định
//         Breakfast: { id: "69f193172fa735b1cfd932f6", name: "Mì Gia Vĩnh Lợi", has_surge_price: false, tag: [5] },
//         Lunch: { id: "mock_l1", name: "Cơm Niêu", has_surge_price: true, tag: [4] },
//         Dinner: { id: "mock_d1", name: "Lẩu Gà Lá É", has_surge_price: false, tag: [6] },
//         Place: [
//           { id: "69ead571744ada25b7bfab29", name: "Chợ Đêm Đà Lạt", has_surge_price: false, tag: [3, 9] },
//           { id: "69ead571744ada25b7bfab2c", name: "Nhà thờ Con Gà", has_surge_price: false, tag: [4] },
//         ],
//       }
//     ],

//     input_data: {
//       budget: input.budget || 5000000,
//       num_people: input.num_people || 2,
//       area: input.area || 4,
//       departure_date: input.departure_date || "2026-04-30",
//       return_date: input.return_date || "2026-05-02",
//       location: input.location || "Đà Lạt",
//     }
//   };
// };
const fakeData = (input) => {
  return {
    Summary_info: {
      main_location: input.area === 4 ? "Thành phố Đà Lạt" : "Nha Trang",
    },

    budget_breakdown: {
      food: 1400000,
      hotel: 1200000,
      other: 1200000,
    },

    can_change: true,
    input_id: input.input_id || 3,
    is_locked: false,

    // 1. Dữ liệu Hotels (Key: hotels)
    hotels: [
      { id: "69ead2de25ee2ea9a979b0e5", name: "Yolo Camping House", has_surge_price: false, img: null, tag: [3] },
      { id: "69ead2dd25ee2ea9a979b0db", name: "Đà Lạt Wind Homestay", has_surge_price: false, img: null, tag: [3] },
      { id: "69ead2de25ee2ea9a979b0e2", name: "The Shelter Homestay", has_surge_price: true, img: null, tag: [3] },
      { id: "69ead2de25ee2ea9a979b0e8", name: "Nhà Nàng Homestay", has_surge_price: false, img: null, tag: [3] },
      { id: "69ead2df25ee2ea9a979b0ea", name: "Motel Minh Hải", has_surge_price: false, img: null, tag: [2] },
    ],

    // 2. Breakfast Pool (Key: restaurants_breakfast)
    restaurants_breakfast: [
      { id: "69f193172fa735b1cfd932f6", name: "Mì Gia Vĩnh Lợi", has_surge_price: false, img: null, tag: [5] },
      { id: "69f193172fa735b1cfd932f2", name: "Bánh Ướt Lòng Gà Long", has_surge_price: false, img: null, tag: [5] },
      { id: "69f193162fa735b1cfd932e6", name: "Gia Gia Dimsum", has_surge_price: false, img: null, tag: [5] },
      { id: "69f193162fa735b1cfd932ea", name: "Tiệm Mì Tàu Cao", has_surge_price: false, img: null, tag: [5] },
      { id: "69f193162fa735b1cfd932e8", name: "Bánh Mì Xíu Mại Ri", has_surge_price: false, img: null, tag: [5] },
    ],

    // 3. Lunch Pool (Key: restaurants_lunch)
    restaurants_lunch: [
      { id: "69f193182fa735b1cfd933a1", name: "Cơm Niêu Thuận Gia", has_surge_price: true, img: null, tag: [2, 6] },
      { id: "69f193182fa735b1cfd933a5", name: "Lẩu Cá Tầm Chu Gia", has_surge_price: false, img: null, tag: [2] },
      { id: "69f193182fa735b1cfd933a9", name: "Gà Nướng cơm lam Ayun", has_surge_price: false, img: null, tag: [1, 2] },
      { id: "69f193192fa735b1cfd933b2", name: "Tiệm Cơm Hồi Đó", has_surge_price: false, img: null, tag: [2] },
      { id: "69f193192fa735b1cfd933b8", name: "Bếp 1985", has_surge_price: false, img: null, tag: [2] },
    ],

    // 4. Dinner Pool (Key: restaurants_dinner)
    restaurants_dinner: [
      { id: "69f193202fa735b1cfd944c1", name: "Lẩu Gà Lá É Tao Ngộ", has_surge_price: true, img: null, tag: [6] },
      { id: "69f193202fa735b1cfd944c5", name: "Buffet Rau Leguda", has_surge_price: false, img: null, tag: [1, 6] },
      { id: "69f193212fa735b1cfd944ca", name: "Nướng Ngói Cu Đức", has_surge_price: false, img: null, tag: [3] },
      { id: "69f193212fa735b1cfd944d2", name: "Túi Mơ To Garden Dinner", has_surge_price: true, img: null, tag: [1, 3] },
      { id: "69f193222fa735b1cfd944d8", name: "Sashimi Garden", has_surge_price: false, img: null, tag: [1] },
    ],

    // 5. Dữ liệu Attractions (Key: attractions)
    attractions: [
      { id: "69ead571744ada25b7bfab29", name: "Chợ Đêm Đà Lạt", has_surge_price: false, img: null, tag: [3, 9] },
      { id: "69ead571744ada25b7bfab2c", name: "Nhà thờ Con Gà", has_surge_price: false, img: null, tag: [4] },
      { id: "69ead571744ada25b7bfab2b", name: "Dinh III Bảo Đại", has_surge_price: false, img: null, tag: [6] },
      { id: "69ead572744ada25b7bfab34", name: "Thiền viện Trúc Lâm", has_surge_price: false, img: null, tag: [4] },
      { id: "69ead573744ada25b7bfab36", name: "Hồ Tuyền Lâm", has_surge_price: false, img: null, tag: [8] },
      { id: "69ead572744ada25b7bfab30", name: "Chùa Linh Phước", has_surge_price: false, img: null, tag: [6] },
    ],

    // 6. Schedule (Lịch trình chi tiết)
    schedule: [
      {
        Date: input.departure_date || "2026-05-06",
        // Đồng bộ ID với pool bên trên để tránh lỗi "Không còn lựa chọn"
        Breakfast: { id: "69f193172fa735b1cfd932f6", name: "Mì Gia Vĩnh Lợi", has_surge_price: false, tag: [5] },
        Lunch: { id: "69f193182fa735b1cfd933a1", name: "Cơm Niêu Thuận Gia", has_surge_price: true, tag: [2, 6] },
        Dinner: { id: "69f193202fa735b1cfd944c1", name: "Lẩu Gà Lá É Tao Ngộ", has_surge_price: true, tag: [6] },
        Place: [
          { id: "69ead571744ada25b7bfab29", name: "Chợ Đêm Đà Lạt", has_surge_price: false, tag: [3, 9] },
          { id: "69ead571744ada25b7bfab2c", name: "Nhà thờ Con Gà", has_surge_price: false, tag: [4] },
        ],
      },
      {
        Date: input.departure_date || "2026-05-06",
        // Đồng bộ ID với pool bên trên để tránh lỗi "Không còn lựa chọn"
        Breakfast: { id: "69f193172fa735b1cfd932f5", name: "Cá", has_surge_price: false, tag: [5] },
        Lunch: { id: "69f193182fa735b1cfd933a2", name: " Gia", has_surge_price: true, tag: [2, 6] },
        Dinner: { id: "69f193202fa735b1cfd944e1", name: "Lẩu Gà", has_surge_price: false, tag: [6] },
        Place: [
          { id: "69ead571744ada25b7bfab19", name: "Chợ Đ", has_surge_price: false, tag: [3, 9] },
          { id: "69ead571744ada25b7bfab3c", name: " Con Gà", has_surge_price: false, tag: [4] },
        ],
      }
    ],

    input_data: {
      budget: input.budget || 5000000,
      num_people: input.num_people || 2,
      area: input.area || 4,
      departure_date: input.departure_date || "2026-04-30",
      return_date: input.return_date || "2026-05-02",
      location: input.location || "Đà Lạt",
    }
  };
};
export default MyTripInput;