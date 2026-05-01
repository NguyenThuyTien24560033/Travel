import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api'
import "./MyTrip.css";

/* =========================
   MODE
========================= */
// Đình Khang nhớ đổi trạng thái nhé
const MODE = "JSON_SERVER";
// const MODE = "REAL_BACKEND";

//Đình Khang thêm path vào đây
const REAL_API = {
  plan: "plan/",
};

/* =========================
   OPTIONS (NUMBER ONLY)
========================= */
const AREAS = [
  { label: "Đà Lạt", value: 4 },
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
  );
};

/* =========================
   FAKE DATA
========================= */
// const fakeData = (input) => ({
//   Summary_info: {
//     Hotel: { name: "Dalat Palace Hotel" },
//     Main_location: input.area === 1 ? "Đà Lạt" : "Nha Trang",
//   },

//   budget_breakdown: {
//     food: 300000,
//     hotel: 500000,
//     other: 200000,
//   },

//   schedule: [
//     {
//       Date: input.departure_date,
//       Breakfast: { name: "Bánh mì xíu mại" },
//       Lunch: { name: "Cơm niêu" },
//       Dinner: { name: "Lẩu gà lá é" },
//       Place: [
//         { name: "Hồ Xuân Hương" },
//         { name: "Chợ Đà Lạt" },
//       ],
//     },
//     {
//       Date: input.return_date,
//       Breakfast: { name: "Phở" },
//       Lunch: { name: "Bún bò" },
//       Dinner: { name: "BBQ" },
//       Place: [
//         { name: "LangBiang" },
//         { name: "Quảng trường Lâm Viên" },
//       ],
//     },
//   ],

//   input_data: input,
// });
/* =========================
   FAKE DATA (UPDATED FROM IMAGE)
========================= */
const fakeData = (input) => {
  // Hàm bổ trợ tạo object địa điểm ăn uống/tham quan giống ảnh
  const createPlace = (name, tags = [1, 2]) => ({
    id: Math.random().toString(16).slice(2, 26), // Tạo id giả 24 ký tự
    name: name,
    img: null,
    has_surge_price: false,
    tag: tags,
  });

  return {
    Summary_info: {
      Hotel: {
        id: "69ead2dd25ee2ea9a979b0d8",
        name: "Hotel Colline",
        has_surge_price: false,
      },
      Main_location: input.area == 4 ? "Thành phố Đà Lạt" : "Nha Trang",
      attractions: [
        { name: "Hồ Xuân Hương", id: "attr_1" },
        { name: "Chợ Đà Lạt", id: "attr_2" },
      ],
    },

    budget_breakdown: {
      food: 1400000,
      hotel: 1200000,
      other: 1200000,
    },

    can_change: true,
    input_id: 3,
    
    // Các mảng bổ trợ (trong ảnh có nhưng đang rỗng hoặc chứa list)
    hotels: [
        { id: "h1", name: "Hotel Colline" },
        { id: "h2", name: "Dalat Palace" }
    ],
    restaurants_breakfast: [],
    restaurants_lunch: [],
    restaurants_dinner: [],

    schedule: [
      {
        Date: input.departure_date || "2026-04-30",
        Breakfast: createPlace("Bánh Canh Xuân An", [5, 2]),
        Lunch: createPlace("Hải Sản Phố Biển", [2, 6]),
        Dinner: createPlace("Sashimi Garden", [1, 3]),
        Place: [
          createPlace("Quảng trường Lâm Viên"),
          createPlace("Dinh Bảo Đại"),
        ],
      },
      {
        Date: "2026-05-01",
        Breakfast: createPlace("Bánh mì xíu mại"),
        Lunch: createPlace("Cơm niêu Thuận Gia"),
        Dinner: createPlace("Lẩu gà lá é Tao Ngộ"),
        Place: [
          createPlace("Thung lũng Tình Yêu"),
          createPlace("LangBiang"),
        ],
      },
      {
        Date: input.return_date || "2026-05-02",
        Breakfast: createPlace("Phở Thìn"),
        Lunch: createPlace("Bún bò bốc khói"),
        Dinner: createPlace("Tiệc nướng BBQ"),
        Place: [
          createPlace("Chùa Linh Phước"),
          createPlace("Thác Datanla"),
        ],
      },
    ],

    // input_data: input,
    input_data: {
  budget: input.budget,
  num_people: input.num_people,
  area: input.area,
  departure_date: input.departure_date,
  return_date: input.return_date,
  location: input.location,
}
  };
};
export default MyTripInput;