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
};

const api = {
  // -----------------------------------------------------------------------------
  // ------------------------------Hàm lấy History--------------------------------
  // -----------------------------------------------------------------------------
  getLocation: async () => {
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

  useEffect(() => {
    setLoading(true);

    try {
        const data = await api.getLocation();
        setHistoryData(data);
    } catch (err) {
      toast.error("Server error");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);


  return (
    <></>
  );
};

export default HistoryComponent;

