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

// const JSON_API = "http://localhost:3001/location";

//Đình Khang đổi đường dẫn tại đây
const REAL_API = {
    getLocation: "places/browse/",
};

const api = {
  // -----------------------------------------------------------------------------
  // ---------------------------Hàm lấy RandomLocation----------------------------
  // -----------------------------------------------------------------------------
  // Hàm lấy dữ liệu
  getLocation: async (input = {}) => {
    if (MODE === "REAL_BACKEND") {
        setLoading(true); // Bắt đầu load

        try {
            // 1. Tạo chuỗi query từ object input
            const queryString = new URLSearchParams(input).toString();
            
            // 2. Nối vào URL (kiểm tra xem đã có dấu ? chưa)
            // Nếu như là lấy lần đầu thì không có input, những lần sau, khi search thì sẽ có input -> queryString sẽ không rỗng
            const urlWithParams = queryString 
            ? `${REAL_API.getLocation}?${queryString}` 
            : REAL_API.getLocation;

            const response = await authorizedFetch(urlWithParams, {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Dữ liệu nhận về: ", data.length);
                return data;
            }
        } catch (err) {
            console.error("Lỗi lấy dữ liệu:", err);
        }
    }
  },
}


function LocationComponent(){
  const [locationData, setlocationData] = useState([]);
  const [loading, setLoading] = useState(false);


    // Lấy dữ liệu ban đầu
    useEffect(() => {
        setLoading(true);

        try {
            const data = await api.getLocation();
            setlocationData(data);
        } catch (err) {
        toast.error("Server error");
        return false;
        } finally {
        setLoading(false);
        }
    }, []);


    // input ở đây có dạng {"key": value}. Các key bao gồm "travel_style", "food_type", "accommodation_type" và "name"
    // Chỉ lọc một cái
    function HandleClick(input = {}){
        setLoading(true);

        try {
            const data = await api.getLocation(input);
            setlocationData(data);
        } catch (err) {
        toast.error("Server error");
        return false;
        } finally {
        setLoading(false);
        }
    };
    /* Dữ liệu có dạng
    locationData (lần đầu có đủ 3 list)= {
        "Hotels": [
            {
            'id': string, 
            'name': string, 
            'address': string, 
            'rating': string, 
            'price_level': string
            },
            
            ......
        ],
        "Restaurants": [
            {
            'id': string, 
            'name': string, 
            'address': string, 
            'rating': string, 
            'price_level': string
            },
            
            ......
        ],
        "Attractions": [
            {
            'id': string, 
            'name': string, 
            'address': string, 
            'rating': string, 
            'price_level': string
            },
            
            ......
        ]
    }

    locationData (những lần sau chỉ 1 trong 4 list)= {
        "Hotels" hoặc "Restaurants" hoặc "Attractions" hoặc "Locations" = [
            {
            'id': string, 
            'name': string, 
            'address': string, 
            'rating': string, 
            'price_level': string
            },
            
            ......
        ]
    }
    */ 

// Hàm handleClick nhờ bà kiểm tra xem tui làm đúng không. 
// Tui đã làm useEffect để lấy dữ liệu mặc định rồi cho nó vào biến locationData rồi.
// Các thứ có thể lọc: "travel_style", "food_type", "accommodation_type" và "name". Xây dựng giao diện làm sao để mà nó biết 
// người dùng muốn tra cái gì do bà quyết định. 
// Việc còn lại bà cần làm là làm giao diện để nó tự động hiện ra từng object một và chỗ để search, cũng như kiểm tra các hàm trên

// Bà chuyên React hơn tui nên là bà nên kiểm tra các hàm xem có đúng í bà không, bà là người quyết định.
  return (
    <></>
  );
};

export default LocationComponent;

