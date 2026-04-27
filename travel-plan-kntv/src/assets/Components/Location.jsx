// import { useEffect, useState } from "react";
// import { authorizedFetch } from '../../../api'

// /* =========================================================
//    PHẦN 1: CONTEXT (global user state)
// ========================================================= */


// /* =========================================================
//    PHẦN 2: API LAYER (CHỈ SỬA MODE)
// ========================================================= */

// // const MODE = "JSON_SERVER"; 
// // Đình Khang đổi comment khi chạy backend thật
// const MODE = "REAL_BACKEND"; 

// // const JSON_API = "http://localhost:3001/location";

// //Đình Khang đổi đường dẫn tại đây
// const REAL_API = {
//     getLocation: "places/browse/",
// };

// const api = {
//   // -----------------------------------------------------------------------------
//   // ---------------------------Hàm lấy RandomLocation----------------------------
//   // -----------------------------------------------------------------------------
//   // Hàm lấy dữ liệu
//   getLocation: async (input = {}) => {
//     if (MODE === "REAL_BACKEND") {
//         setLoading(true); // Bắt đầu load

//         try {
//             // 1. Tạo chuỗi query từ object input
//             const queryString = new URLSearchParams(input).toString();
            
//             // 2. Nối vào URL (kiểm tra xem đã có dấu ? chưa)
//             // Nếu như là lấy lần đầu thì không có input, những lần sau, khi search thì sẽ có input -> queryString sẽ không rỗng
//             const urlWithParams = queryString 
//             ? `${REAL_API.getLocation}?${queryString}` 
//             : REAL_API.getLocation;

//             const response = await authorizedFetch(urlWithParams, {
//                 method: "GET",
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 console.log("Dữ liệu nhận về: ", data.length);
//                 return data;
//             }
//         } catch (err) {
//             console.error("Lỗi lấy dữ liệu:", err);
//         }
//     }
//   },
// }


// function LocationComponent(){
//   const [locationData, setlocationData] = useState([]);
//   const [loading, setLoading] = useState(false);


//     // Lấy dữ liệu ban đầu
//     useEffect(() => {
//         setLoading(true);

//         try {
//             const data = await api.getLocation();
//             setlocationData(data);
//         } catch (err) {
//         toast.error("Server error");
//         return false;
//         } finally {
//         setLoading(false);
//         }
//     }, []);


//     // input ở đây có dạng {"key": value}. Các key bao gồm "travel_style", "food_type", "accommodation_type" và "name"
//     // Chỉ lọc một cái
//     function HandleClick(input = {}){
//         setLoading(true);

//         try {
//             const data = await api.getLocation(input);
//             setlocationData(data);
//         } catch (err) {
//         toast.error("Server error");
//         return false;
//         } finally {
//         setLoading(false);
//         }
//     };
//     /* Dữ liệu có dạng
//     locationData (lần đầu có đủ 3 list)= {
//         "Hotels": [
//             {
//             'id': string, 
//             'name': string, 
//             'address': string, 
//             'rating': string, 
//             'price_level': string
//             },
            
//             ......
//         ],
//         "Restaurants": [
//             {
//             'id': string, 
//             'name': string, 
//             'address': string, 
//             'rating': string, 
//             'price_level': string
//             },
            
//             ......
//         ],
//         "Attractions": [
//             {
//             'id': string, 
//             'name': string, 
//             'address': string, 
//             'rating': string, 
//             'price_level': string
//             },
            
//             ......
//         ]
//     }

//     locationData (những lần sau chỉ 1 trong 4 list)= {
//         "Hotels" hoặc "Restaurants" hoặc "Attractions" hoặc "Locations" = [
//             {
//             'id': string, 
//             'name': string, 
//             'address': string, 
//             'rating': string, 
//             'price_level': string
//             },
            
//             ......
//         ]
//     }
//     */ 

// // Hàm handleClick nhờ bà kiểm tra xem tui làm đúng không. 
// // Tui đã làm useEffect để lấy dữ liệu mặc định rồi cho nó vào biến locationData rồi.
// // Các thứ có thể lọc: "travel_style", "food_type", "accommodation_type" và "name". Xây dựng giao diện làm sao để mà nó biết 
// // người dùng muốn tra cái gì do bà quyết định. 
// // Việc còn lại bà cần làm là làm giao diện để nó tự động hiện ra từng object một và chỗ để search, cũng như kiểm tra các hàm trên

// // Bà chuyên React hơn tui nên là bà nên kiểm tra các hàm xem có đúng í bà không, bà là người quyết định.
//   return (
//     <></>
//   );
// };

// export default LocationComponent;



import { useEffect, useState } from "react";
import { authorizedFetch } from "../../../api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import './Location.css'

/* =========================================================
   PHẦN 2: API LAYER (CHỈ SỬA MODE)
========================================================= */

const MODE = "JSON_SERVER"; 
// Đình Khang đổi comment khi chạy backend thật
// const MODE = "REAL_BACKEND"; 

const JSON_API = "http://localhost:3001/locations";

//Đình Khang đổi đường dẫn tại đây
const REAL_API = {
    getLocations: "places/browse/",
    getHotel: "places/hotels/",
    getRestaurant: "places/restaurants/",
    getAttraction: "places/attractions/",
};

const api = {
  // -----------------------------------------------------------------------------
  // ---------------------------Hàm lấy RandomLocation----------------------------
  // -----------------------------------------------------------------------------
    // Hàm lấy dữ liệu
    getLocations: async (input = {}) => {
        if (MODE === "REAL_BACKEND") {
            setLoading(true); // Bắt đầu load

            try {
                // 1. Tạo chuỗi query từ object input
                const queryString = new URLSearchParams(input).toString();
                
                // 2. Nối vào URL (kiểm tra xem đã có dấu ? chưa)
                // Nếu như là lấy lần đầu thì không có input, những lần sau, khi search thì sẽ có input -> queryString sẽ không rỗng
                const urlWithParams = queryString 
                ? `${REAL_API.getLocations}?${queryString}` 
                : REAL_API.getLocations;

                const response = await authorizedFetch(urlWithParams, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dữ liệu nhận về: ", data.length);
                    return data;
                } else {
                    console.error(`Lấy dữ liệu thất bại, status:`, response.status);
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu: ", err);
            }
        }

        //Json server
        else {
            try {
                const response = await fetch(JSON_API);
                let data = await response.json();

                // Logic lọc dữ liệu giả lập cho giống Backend thật
                if (input.type) {
                    data = data.filter(item => item.type === input.type);
                }
                if (input.name) {
                    data = data.filter(item => 
                        item.name.toLowerCase().includes(input.name.toLowerCase())
                    );
                }
                return data;
            } catch (err) {
                console.error("Lỗi JSON Server:", err);
            }
        }
    },
   


    getDetail: async (id, type) => {
        if (MODE === "REAL_BACKEND") {
            setLoading(true); // Bắt đầu load

            try {
                // 1. Xác định base path dựa trên type (1: Hotel, 2: Restaurant, 3: Attraction)
                let endpoint = "";
                switch (type) {
                    case 1:
                        endpoint = REAL_API.getHotel;
                        break;
                    case 2:
                        endpoint = REAL_API.getRestaurant;
                        break;
                    case 3:
                        endpoint = REAL_API.getAttraction;
                        break;
                    default:
                        console.error("Loại địa điểm (type) không hợp lệ:", type);
                        return;
                }

                // 2. Nối ID vào URL (Đảm bảo có dấu / ở cuối nếu backend Django yêu cầu)
                const url = `${endpoint}${id}/`;

                // 3. Gọi API với authorizedFetch
                const response = await authorizedFetch(url, {
                    method: "GET",
                }); 

                if (response.ok) {
                    const data = await response.json();
                    console.log("Dữ liệu nhận về: ", data);
                    return data;
                } else {
                    console.error(`Lấy chi tiết thất bại, status:`, response.status);
                }
            } catch (err) {
                console.error("Lỗi lấy dữ liệu: ", err);
            }
        }
        else {
                    // Xử lý cho JSON Server khi xem chi tiết
                    const response = await fetch(`${JSON_API}/${id}`);
                    return await response.json();
                }
            }
        };


function LocationComponent(){
  const [locationData, setlocationData] = useState([]);
  const [detailData, setdetailData] = useState([]);
  const [loading, setLoading] = useState(false);


    // Lấy dữ liệu ban đầu
    // useEffect(() => {
    //     setLoading(true);

    //     try {
    //         const data = await api.getLocations();
    //         setlocationData(data);
    //     } catch (err) {
    //     toast.error("Server error");
    //     return false;
    //     } finally {
    //     setLoading(false);
    //     }
    // }, []);

useEffect(() => {
    const loadData = async () => {
        setLoading(true);

        try {
            const data = await api.getLocations();
            setlocationData(data);
        } catch (err) {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    loadData();
}, []);
    // input ở đây có dạng {"key": value}. Các key bao gồm "travel_style", "food_type", "accommodation_type" và "name"
    // Chỉ lọc một cái
    // function HandleSearch(input = {}){
    //     setLoading(true);

    //     try {
    //         const data = await api.getLocation(input);
    //         setlocationData(data);
    //     } catch (err) {
    //         toast.error("Server error");
    //         return false;
    //     } finally {
    //         setLoading(false);
    //     }
    // };
const HandleSearch = async (input = {}) => {
    setLoading(true);

    try {
        const data = await api.getLocations(input); // ⚠️ sửa luôn lỗi 3
        setlocationData(data);
    } catch (err) {
        toast.error("Server error");
    } finally {
        setLoading(false);
    }
};
    // Hàm lấy thông tin dựa vào id và dựa vào type để biết dùng đường dẫn nào
    const HandleClick = async (id, type) => {
        setLoading(true);

        try {
            const data = await api.getDetail(id, type);
            setdetailData(data);
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

    locationData (những lần sau chỉ 1 trong 4 trường hợp)= {
        "Hotels" hoặc "Restaurants" hoặc "Attractions" hoặc cả 3 i như trên (khi search bằng name)= [
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

    thông tin chi tiết của một địa điểm
    detailData = { nó dài quá nên bà chịu khó vào file docx xem nha }
    */ 

// Hàm handleSearch và HandleClick nhờ bà kiểm tra xem tui làm đúng không. 

// Tui đã làm useEffect để lấy dữ liệu mặc định rồi cho nó vào biến locationData rồi, khi in ra thì nhớ gắn cho nó cái cờ để biết 
// nó là loại hình địa điểm nào để mà còn search id. Cái cờ đó sẽ là type = 1 (hotel) hoặc 2 (restaurant) hoặc 3 (attraction)

// Các thứ có thể lọc: "travel_style", "food_type", "accommodation_type" và "name". Xây dựng giao diện làm sao để mà nó biết 
// người dùng muốn tra cái gì do bà quyết định. 

// Việc còn lại bà cần làm là làm giao diện để nó tự động hiện ra từng object một và chỗ để search, cũng như kiểm tra các hàm trên

// Bà chuyên React hơn tui nên là bà nên kiểm tra các hàm xem có đúng í bà không, bà là người quyết định.
  return (
    <></>
  );
};

export default function Location() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

//   const load = async (filter = {}) => {
//     setLoading(true);
//     try {
//       const res = await api.getLocation(filter);
//       setData(res);
//     } catch {
//       toast.error("Error");
//     } finally {
//       setLoading(false);
//     }
//   };
const load = async (filter = {}) => {
  setLoading(true);
  try {
    const res = await api.getLocations(filter); // ✅ FIX
    setData(res || []);
  } catch {
    toast.error("Error");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{ padding: 20 }}>
      <h2>Locations</h2>

      <button onClick={() => load({ type: "Hotels" })}>Hotels</button>
      <button onClick={() => load({ type: "Restaurants" })}>Restaurants</button>
      <button onClick={() => load({ type: "Attractions" })}>Attractions</button>
      <button onClick={() => load({})}>All</button>

      {loading && <p>Loading...</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/locations/${item.id}`)}
            style={{ border: "1px solid #ddd", padding: 10, cursor: "pointer" }}
          >
            <img src={item.image} width="100%" />
            <h3>{item.name}</h3>
            <p>{item.address}</p>
            <p>⭐ {item.rating}</p>
            <p>{item.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
