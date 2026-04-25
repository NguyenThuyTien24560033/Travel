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
      }
    }
  },
}


function HistoryComponent(){
  const [historyData, setHistoryData] = useState([]);
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
  /* Dữ liệu có dạng
  historyData = [
    {
    "id": string,
    "created_at": date,
    "location": string,
    },
    
    ..........
  ]
  */ 


  // Tui chỉ mới lấy dữ liệu mặc định rồi cho nó vào biến historyData thôi. Hàm handleClick để vào kế hoạch chi tiết thì tui sẽ 
  // làm sau

  return (
    <></>
  );
};

export default HistoryComponent;

