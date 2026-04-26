import { useEffect, useState } from "react";
import { authorizedFetch } from '../../../api'

/* =========================================================
   PHẦN 1: CONTEXT (global user state)
========================================================= */


/* =========================================================
   PHẦN 2: API LAYER (CHỈ SỬA MODE)
========================================================= */

// const MODE = "JSON_SERVER"; 
// Đình Khang đổi comment khi chạy backend thật
const MODE = "REAL_BACKEND"; 

// const JSON_API = "http://localhost:3001/history";

//Đình Khang đổi đường dẫn tại đây
const REAL_API = {
    getHistory: "history/",
    getPlan: "plan/",
    // Nếu là lấy xem thì chỉ plan/ còn nếu lấy và sửa thì là plan/<str:plan_id>/edit/
};

const api = {
  // -----------------------------------------------------------------------------
  // ------------------------------Hàm lấy History--------------------------------
  // -----------------------------------------------------------------------------
  getHistory: async () => {
    if (MODE === "REAL_BACKEND") {
      setLoading(true); // Bắt đầu load
      try {
        const response = await authorizedFetch(REAL_API.getHistory, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          
          console.log("History get: ", data.length);
          
          return data; 
        } else {
          console.error("Lấy History thất bại, status:", response.status);
        }
      } catch (err) {
        console.error("Lỗi kết nối API getHistory:", err);
      } finally {
        setLoading(false); // Đảm bảo tắt loading dù thành công hay lỗi
      }
    }
  },


  // Nếu change là false thì chỉ có xem, nếu nó là true thì là chỉnh sửa kế hoạch cũ 
  getPlan: async (id, change = false) => {
    if (MODE === "REAL_BACKEND") {
      setLoading(true); // Bắt đầu load
      try {
        // 1. Xác định base path dựa trên biến change
        // Nếu change = true: plan/id/edit, ngược lại: plan/id/
        const basePath = change 
          ? `${REAL_API.getPlan}${id}/edit/` 
          : `${REAL_API.getPlan}${id}/`;

        // 2. Xử lý query string (đề phòng muốn truyền thêm gì đó, tạm thời thì không)
        // Nếu hàm này không nhận thêm object 'input', ta có thể để mặc định là rỗng
        const input = {}; // Hoặc truyền từ tham số nếu cần
        const queryString = new URLSearchParams(input).toString();

        // 3. Nối vào URL
        const urlWithParams = queryString 
          ? `${basePath}?${queryString}` 
          : basePath;

        const response = await authorizedFetch(urlWithParams, {
          method: "GET",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Plan get: ", data);
          return data;
        } else {
          console.error("Lấy plan thất bại, status:", response.status);
        }
      } catch (err) {
        console.error("Lỗi kết nối API getPlan:", err);
      } finally {
        setLoading(false); // Đảm bảo tắt loading dù thành công hay lỗi
      }
    }
  },
}


function HistoryComponent(){
  const [historyData, setHistoryData] = useState([]);
  const [PlanData, setPlanData] = useState([]);  
  const [loading, setLoading] = useState(false);


    // Lấy dữ liệu ban đầu
    useEffect(() => {
      setLoading(true);

      try {
          const data = await api.getHistory();
          setHistoryData(data);
      } catch (err) {
        toast.error("Server error");
        return false;
      } finally {
        setLoading(false);
      }
    }, []);


    // Hàm xem lại hoặc chỉnh sửa kế hoạch cũ tùy thuộc vào tham số change (false là chỉ xem) 
    // Tui chỉ làm đường dẫn để lấy dữ liệu và lưu vào PlanData thôi, hiển thị nó như thế nào sẽ do bà làm
    function HandleClick(id, change = false){
        setLoading(true);

        try {
            const data = await api.getPlan(id, change);
            setPlanData(data);
        } catch (err) {
        toast.error("Server error");
        return false;
        } finally {
        setLoading(false);
        }
    }
  /* Dữ liệu có dạng
  historyData = [
    {
    "id": string,
    "created_at": date,
    "location": string,
    },
    
    ..........
  ]

  Mỗi Obj bên dưới có dạng: {
    "name": string, 
    "id": string,
    "has_surge_price": boolen,
    "tag" hoặc "cuisine_types" hoặc "room_types": list,
    "img": "rỗng"
  }
  
  PlanData (chỉ xem) = {
    “Summary_info”: {
		  “Hotel”: obj,
		  “Main_location”: string,
    },
    "budget_breakdown": {
      "food": string,
      "hotel": string,
      "other": string
    },
    "schedule": [
      {
      "Date": date,
      "Breakfast": obj,
      "Lunch": obj,
      "Dinner": obj,
      "Place": [obj1, obj2]
      },
      
      ………….
    ],
    “input_data”: {
      "budget": int,
      "num_people": 2, 
      "area": id, (chỗ này tui sẽ làm hàm lấy địa điểm sau)
      "departure_date": "2026-05-20", 
      "return_date": "2026-05-23", 
      "percentage_hotel": 40, 
      "percentage_restaurant": 40, 
      "percentage_attraction": 20,
      "location": "Đà Lạt", 
      "travel_style": [1, 3], 
      "food_type": [2, 5, 8], 
      "accommodation_type": [1], 
    }
  }

  PlanData (có thể sửa): {cấu trúc i như gói dữ liệu nhận về sau khi nhập input nhưng có thêm cái trường input_data như trên}


  */ 


  // Tui chỉ mới lấy dữ liệu mặc định rồi cho nó vào biến historyData thôi. Hàm handleClick để vào xem hoặc sửa kế hoạch 
  // thì tui cũng đã làm nhưng vẫn cần bà đọc để xem có sai logic gì không cũng như nắm cho rõ cấu trúc dữ liệu
  // Việc còn lại bà cần làm là làm giao diện để nó tự động hiện ra từng object một, kết nối hàm HandleClick vào từng 
  // object lịch sử để nhận data chi tiết khi người dùng click vào. Cũng như nghỉ cách truyền dữ liệu đến trang ouput

  // Bà chuyên React hơn tui nên là bà nên kiểm tra các hàm xem có đúng í bà không, bà là người quyết định.
  return (
    <></>
  );
};

export default HistoryComponent;

