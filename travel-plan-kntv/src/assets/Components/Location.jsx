// import { useEffect, useState } from "react";
// import { authorizedFetch } from '../../../api'
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import './Location.css'
// import Header from "./Header";

// /* =========================================================
//    CONFIG
// ========================================================= */

// const MODE = "JSON_SERVER"; 

// const JSON_API = "http://localhost:3001/places";

// // const MODE = "REAL_BACKEND"
// const REAL_API = {
//     getLocations: "places/browse/",
//     getHotel: "places/hotels/",
//     getRestaurant: "places/restaurants/",
//     getAttraction: "places/attractions/",
// };

// /* =========================================================
//    API
// ========================================================= */

// const api = {
//     getLocations: async (input = {}) => {
//         try {
//             const query = {};

//             if (input.travel_style) query.travel_style = input.travel_style;
//             if (input.food_type) query.food_type = input.food_type;
//             if (input.accommodation_type) query.accommodation_type = input.accommodation_type;

//             // 🔥 CHỈ FETCH, KHÔNG SEARCH Ở BACKEND NỮA
//             const queryString = new URLSearchParams(query).toString();

//             if (MODE === "REAL_BACKEND") {
//                 // const url = queryString
//                 //     ? `${REAL_API.getLocations}?${queryString}`
//                 //     : REAL_API.getLocations;

//                 // const res = await authorizedFetch(url);
//                 // return await res.json();
//                 const urlWithParams = queryString 
//                 ? `${REAL_API.getLocations}?${queryString}` 
//                 : REAL_API.getLocations;

//                 const response = await authorizedFetch(urlWithParams, {
//                     method: "GET",
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Dữ liệu nhận về: ", data);
//                     return data;
//                 } else {
//                     console.error(`Lấy dữ liệu thất bại, status:`, response.status);
//                 }
//             } else {
//                 const url = queryString
//                     ? `${JSON_API}?${queryString}`
//                     : JSON_API;

//                 const res = await fetch(url);
//                 return await res.json();
//             }

//         } catch (err) {
//             console.error(err);
//             return [];
//         }
//     },

//     getDetail: async (id, type) => {
//         try {
//             if (MODE === "REAL_BACKEND") {
//                 // let endpoint = "";

//                 // switch (type) {
//                 //     case 1: endpoint = REAL_API.getHotel; break;
//                 //     case 2: endpoint = REAL_API.getRestaurant; break;
//                 //     case 3: endpoint = REAL_API.getAttraction; break;
//                 //     default: return null;
//                 // }

//                 // const res = await authorizedFetch(`${endpoint}${id}/`);
//                 // if (!res.ok) return null;
//                 // return await res.json();
//                  // 1. Xác định base path dựa trên type (1: Hotel, 2: Restaurant, 3: Attraction)
//                 let endpoint = "";
//                 switch (type) {
//                     case 1:
//                         endpoint = REAL_API.getHotel;
//                         break;
//                     case 2:
//                         endpoint = REAL_API.getRestaurant;
//                         break;
//                     case 3:
//                         endpoint = REAL_API.getAttraction;
//                         break;
//                     default:
//                         console.error("Loại địa điểm (type) không hợp lệ:", type);
//                         return;
//                 }

//                 // 2. Nối ID vào URL (Đảm bảo có dấu / ở cuối nếu backend Django yêu cầu)
//                 const url = `${endpoint}${id}/`;

//                 // 3. Gọi API với authorizedFetch
//                 const response = await authorizedFetch(url, {
//                     method: "GET",
//                 }); 

//                 if (response.ok) {
//                     const data = await response.json();
//                     console.log("Dữ liệu nhận về: ", data);
//                     return data;
//                 } else {
//                     console.error(`Lấy chi tiết thất bại, status:`, response.status);
//                 }
//             } else {
//                 const res = await fetch(`${JSON_API}/${id}`);
//                 if (!res.ok) return null;
//                 return await res.json();
//             }

//         } catch (err) {
//             console.error(err);
//             return null;
//         }
//     }
// };

// /* =========================================================
//    COMPONENT
// ========================================================= */

// function LocationComponent() {
//     const [locationData, setLocationData] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [mode, setMode] = useState(null);
//     const [nameInput, setNameInput] = useState("");

//     const navigate = useNavigate();

//     /* =========================
//        LOAD INIT
//     ========================= */
//     useEffect(() => {
//         loadData();
//     }, []);

//     const loadData = async () => {
//         setLoading(true);
//         try {
//             const data = await api.getLocations();
//             setLocationData(data);
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* =========================
//        SEARCH (🔥 FIX CHÍNH)
//     ========================= */
//     const handleSearch = async (input) => {
//         setLoading(true);
//         try {
//             const data = await api.getLocations(input);

//             let result = data;

//             // FIX SEARCH NAME Ở FRONTEND
//             if (input.name) {
//                 const normalize = (str) =>
//                     str.toLowerCase().replace(/\s+/g, '');

//                 result = data.filter(item =>
//                     normalize(item.name).includes(normalize(input.name))
//                 );
//             }

//             setLocationData(result);
//         } catch {
//             toast.error("Server error");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const resetSearch = () => {
//         setMode(null);
//         setIsMenuOpen(false);
//         setNameInput("");
//         loadData();
//     };

    
// // Lấy xong rồi mới truyền vào navigate để đến giao diện detail
//     // const handleNavigate = (id) => navigate(`/places/${id}`);
//     const HandleClick = async (id, type) => {
//     if (MODE === "JSON_SERVER") {
//         // nhanh cho fake backend
//         navigate(`/places/${id}`);
//         return;
//     }

//     // REAL_BACKEND → fetch detail thật
//     setLoading(true);
//     // try {
//     //     const data = await api.getDetail(id, type);

//     //     if (!data) {
//     //         toast.error("No detail found");
//     //         return;
//     //     }

//     //     // tuỳ bạn: lưu state hoặc navigate
//     //     navigate(`/places/${id}`, { state: data });

//     // } catch (err) {
//     //     toast.error("Server error");
//     // } finally {
//     //     setLoading(false);
//     // }
//      setLoading(true);

//         try {
//             const data = await api.getDetail(id, type);
//             setdetailData(data);
//         } catch (err) {
//             toast.error("Server error");
//             return false;
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* =========================
//        GROUP DATA (🔥 FIX SẠCH)
//     ========================= */
//     let groupedData = {};
//     if (MODE === "REAL_BACKEND"){
//         groupedData = {
//             // Duyệt qua mảng Hotels, giữ nguyên dữ liệu cũ (...item) và thêm type: 1
//             Hotels: locationData.Hotels?.map(item => ({ ...item, type: 1 })) || [],
            
//             // Thêm type: 2 cho Restaurants
//             Restaurants: locationData.Restaurants?.map(item => ({ ...item, type: 2 })) || [],
            
//             // Thêm type: 3 cho Attractions
//             Attractions: locationData.Attractions?.map(item => ({ ...item, type: 3 })) || []
//         };
//     } else {
//         groupedData = {
//             Hotels: locationData.filter(item => Number(item.type) === 1),
//             Restaurants: locationData.filter(item => Number(item.type) === 2),
//             Attractions: locationData.filter(item => Number(item.type) === 3),
//         };
//     }

//     /* =========================
//        OPTIONS
//     ========================= */
//     const accommodationOptions = { 1: "Hotel", 2: "Motel", 3: "Homestay", 4: "Resort", 5: "Villa" };
//     const foodOptions = { 1: "Meat", 2: "Seafood", 3: "Vegetarian", 4: "Family-style", 5: "Set meals", 6: "Hotpot" };
//     const travelOptions = { 1: "Relax", 2: "Adventure", 3: "Food tour", 4: "Cultural", 5: "Playground", 6: "History", 7: "Thrill", 8: "Beach", 9: "Take picture" };

//     /* =========================
//        RENDER LIST
//     ========================= */
//     // const renderList = (list) => {
//     //     if (!list || list.length === 0) {
//     //         return <p className="empty">No data</p>;
//     //     }

//     //     return (
//     //         <div className="list">
//     //             {list.map(item => (
//     //                 <div key={item.id} className="card" onClick={() => handleNavigate(item.id)}>
//     //                     <img src={item.image || "https://placehold.co/300x200"} alt={item.name} />
//     //                     <h3>{item.name}</h3>
//     //                     <p>{item.address}</p>
//     //                     <p>⭐ {item.rating}</p>
//     //                 </div>
//     //             ))}
//     //         </div>
//     //     );
//     // };
//     const renderList = (list) => {
//     if (!list || list.length === 0) {
//         return <p className="empty">No data</p>;
//     }

//     return (
//         <div className="list">
//             {list.map(item => (
//                 <div
//                     key={item.id}
//                     className="card"
//                     onClick={() => HandleClick(item.id, item.type)}
//                 >
//                     <img src={item.image || "https://placehold.co/300x200"} />
//                     <h3>{item.name}</h3>
//                     <p>{item.address}</p>
//                     <p>⭐ {item.rating}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };
//     return (
//         <div className="location-container">
//             <Header />

//             <div className="search-section">

//                 <div className="search-bar-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
//                     🔍 {mode ? `Category: ${mode}` : "What are you looking for?"}
//                     {mode && (
//                         <button onClick={(e) => { e.stopPropagation(); resetSearch(); }}>✕</button>
//                     )}
//                 </div>

//                 {isMenuOpen && (
//                     <div className="search-mode-menu">
//                         <button onClick={() => { setMode("name"); setIsMenuOpen(false); }}>Search by Name</button>
//                         <button onClick={() => { setMode("accommodation_type"); setIsMenuOpen(false); }}>Hotel Types</button>
//                         <button onClick={() => { setMode("food_type"); setIsMenuOpen(false); }}>Food Types</button>
//                         <button onClick={() => { setMode("travel_style"); setIsMenuOpen(false); }}>Travel Styles</button>
//                     </div>
//                 )}

//                 <div className="search-control-area">

//                     {mode === "name" && (
//                         <input
//                             className="search-input-field"
//                             autoFocus
//                             type="text"
//                             placeholder="Type a location name..."
//                             value={nameInput}
//                             onChange={(e) => setNameInput(e.target.value)}
//                             onKeyDown={(e) => {
//                                 if (e.key === "Enter") {
//                                     handleSearch({ name: nameInput });
//                                 }
//                             }}
//                         />
//                     )}

//                     {mode && mode !== "name" && (
//                         <div className="options-grid">
//                             {Object.entries(
//                                 mode === "accommodation_type" ? accommodationOptions :
//                                 mode === "food_type" ? foodOptions : travelOptions
//                             ).map(([k, v]) => (
//                                 <button
//                                     key={k}
//                                     onClick={() => handleSearch({ [mode]: Number(k) })}
//                                 >
//                                     {v}
//                                 </button>
//                             ))}
//                         </div>
//                     )}

//                 </div>
//             </div>

//             {loading && <p>Searching...</p>}

//             <div className="results-section">
//                 <h2>Hotels</h2>
//                 {renderList(groupedData.Hotels)}

//                 <h2>Restaurants</h2>
//                 {renderList(groupedData.Restaurants)}

//                 <h2>Attractions</h2>
//                 {renderList(groupedData.Attractions)}
//             </div>
//         </div>
//     );
// }

// export default LocationComponent;










import { useEffect, useState } from "react";
import { authorizedFetch } from '../../../api'
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import './Location.css'
import Header from "./Header";

/* =========================================================
   CONFIG
========================================================= */

const MODE = "JSON_SERVER"; 

const JSON_API = "http://localhost:3001/places";

// const MODE = "REAL_BACKEND"
const REAL_API = {
    getLocations: "places/browse/",
    getHotel: "places/hotels/",
    getRestaurant: "places/restaurants/",
    getAttraction: "places/attractions/",
};

/* =========================================================
   API
========================================================= */

const api = {
    getLocations: async (input = {}) => {
        try {
            if (MODE === "REAL_BACKEND") {
                const query = {};

                if (input.name) query.name = input.name;
                if (input.travel_style) query.travel_style = input.travel_style;
                if (input.food_type) query.food_type = input.food_type;
                if (input.accommodation_type) query.accommodation_type = input.accommodation_type;

                const queryString = new URLSearchParams(query).toString();

                const url = queryString
                    ? `${REAL_API.getLocations}?${queryString}`
                    : REAL_API.getLocations;

                const response = await authorizedFetch(url, {
                    method: "GET",
                });

                if (response.ok) {
                    return await response.json();
                }

            } else {
                const res = await fetch(JSON_API);
                return await res.json();
            }

        } catch (err) {
            console.error(err);
            return [];
        }
    },


    getDetail: async (id, type) => {
        try {
            if (MODE === "REAL_BACKEND") {
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
            } else {
                const res = await fetch(`${JSON_API}/${id}`);
                if (!res.ok) return null;
                return await res.json();
            }

        } catch (err) {
            console.error(err);
            return null;
        }
    }
};

/* =========================================================
   COMPONENT
========================================================= */

function LocationComponent() {
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationDataOriginal, setLocationDataOriginal] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [nameInput, setNameInput] = useState("");

    const navigate = useNavigate();

    /* =========================
       LOAD INIT
    ========================= */

    useEffect(() => {
        loadData();
    }, []);

    // const loadData = async () => {
    //     setLoading(true);
    //     try {
    //         let data = await api.getLocations();

    //         // ✅ FIX QUAN TRỌNG: flatten data backend → mảng chung
    //         if (MODE === "REAL_BACKEND") {
    //             data = [
    //                 ...(data.Hotels || []).map(i => ({ ...i, type: 1 })),
    //                 ...(data.Restaurants || []).map(i => ({ ...i, type: 2 })),
    //                 ...(data.Attractions || []).map(i => ({ ...i, type: 3 })),
    //             ];
    //         }

    //         // ✅ FIX: pre-normalize để search nhanh hơn
    //         data = data.map(item => ({
    //             ...item,
    //             _name: item.name?.toLowerCase().replaceAll(" ", "")
    //         }));

    //         setLocationData(data);
    //         setLocationDataOriginal(data);

    //     } finally {
    //         setLoading(false);
    //     }
    // };


    const loadData = async () => {
        setLoading(true);
        try {
            let data = await api.getLocations();

            // 🔥 FIX 2: flatten backend → mảng chung
            if (MODE === "REAL_BACKEND") {
                data = [
                    ...(data.Hotels || []).map(i => ({ ...i, type: 1 })),
                    ...(data.Restaurants || []).map(i => ({ ...i, type: 2 })),
                    ...(data.Attractions || []).map(i => ({ ...i, type: 3 })),
                ];
            }

            // 🔥 FIX 3: pre-normalize để search nhanh
            data = data.map(item => ({
                ...item,
                _name: item.name?.toLowerCase().replaceAll(" ", "")
            }));

            setLocationData(data);
            setLocationDataOriginal(data);

        } finally {
            setLoading(false);
        }
    };

    /* =========================
       SEARCH (🔥 FIX CHÍNH)
    ========================= */
 
const handleSearch = async (input = {}) => {
        setLoading(true);

        try {
            if (MODE === "REAL_BACKEND") {
                // ✅ gọi backend filter
                let data = await api.getLocations(input);

                data = [
                    ...(data.Hotels || []).map(i => ({ ...i, type: 1 })),
                    ...(data.Restaurants || []).map(i => ({ ...i, type: 2 })),
                    ...(data.Attractions || []).map(i => ({ ...i, type: 3 })),
                ];

                setLocationData(data);

            } else {
                // ✅ JSON SERVER filter local
                let result = [...locationDataOriginal];

                const normalize = (str) =>
                    str?.toLowerCase().replaceAll(" ", "");

                if (input.name && input.name.trim() !== "") {
                    const keyword = normalize(input.name);

                    result = result.filter(item =>
                        item._name.includes(keyword)
                    );
                }

                if (input.travel_style) {
                    result = result.filter(item => item.travel_style === input.travel_style);
                }

                if (input.food_type) {
                    result = result.filter(item => item.food_type === input.food_type);
                }

                if (input.accommodation_type) {
                    result = result.filter(item => item.accommodation_type === input.accommodation_type);
                }

                setLocationData(result);
            }

        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    // 🔥 FIX 5: reset KHÔNG gọi lại API
    const resetSearch = () => {
        setMode(null);
        setIsMenuOpen(false);
        setNameInput("");
        setLocationData(locationDataOriginal);
    };

    
// Lấy xong rồi mới truyền vào navigate để đến giao diện detail
    // const handleNavigate = (id) => navigate(`/places/${id}`);
    // const HandleClick = async (id, type) => {
    // if (MODE === "JSON_SERVER") {
    //     // nhanh cho fake backend
    //     navigate(`/places/${id}`);
    //     return;
    // }

    // // REAL_BACKEND → fetch detail thật
    // setLoading(true);
    // // try {
    // //     const data = await api.getDetail(id, type);

    // //     if (!data) {
    // //         toast.error("No detail found");
    // //         return;
    // //     }

    // //     // tuỳ bạn: lưu state hoặc navigate
    // //     navigate(`/places/${id}`, { state: data });

    // // } catch (err) {
    // //     toast.error("Server error");
    // // } finally {
    // //     setLoading(false);
    // // }
    //  setLoading(true);

    //     try {
    //         const data = await api.getDetail(id, type);
    //         setdetailData(data);
    //     } catch (err) {
    //         toast.error("Server error");
    //         return false;
    //     } finally {
    //         setLoading(false);
    //     }
    // };
const HandleClick = async (id, type) => { // ✅ FIX FULL
        setLoading(true);

        try {
            const data = await api.getDetail(id, type);

            if (!data) {
                toast.error("No detail found");
                return;
            }

            navigate(`/places/${id}`, {
                state: {
                    detail: data
                }
            });

        } catch {
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };
    /* =========================
       GROUP DATA (🔥 FIX SẠCH)
    ========================= */
    // let groupedData = {};
    // if (MODE === "REAL_BACKEND"){
    //     groupedData = {
    //         // Duyệt qua mảng Hotels, giữ nguyên dữ liệu cũ (...item) và thêm type: 1
    //         Hotels: locationData.Hotels?.map(item => ({ ...item, type: 1 })) || [],
            
    //         // Thêm type: 2 cho Restaurants
    //         Restaurants: locationData.Restaurants?.map(item => ({ ...item, type: 2 })) || [],
            
    //         // Thêm type: 3 cho Attractions
    //         Attractions: locationData.Attractions?.map(item => ({ ...item, type: 3 })) || []
    //     };
    // } else {
    //     groupedData = {
    //         Hotels: locationData.filter(item => Number(item.type) === 1),
    //         Restaurants: locationData.filter(item => Number(item.type) === 2),
    //         Attractions: locationData.filter(item => Number(item.type) === 3),
    //     };
    // }

    const groupedData = {
    Hotels: locationData.filter(item => item.type === 1),
    Restaurants: locationData.filter(item => item.type === 2),
    Attractions: locationData.filter(item => item.type === 3),
};

    /* =========================
       OPTIONS
    ========================= */
    const accommodationOptions = { 1: "Hotel", 2: "Motel", 3: "Homestay", 4: "Resort", 5: "Villa" };
    const foodOptions = { 1: "Meat", 2: "Seafood", 3: "Vegetarian", 4: "Family-style", 5: "Set meals", 6: "Hotpot" };
    const travelOptions = { 1: "Relax", 2: "Adventure", 3: "Food tour", 4: "Cultural", 5: "Playground", 6: "History", 7: "Thrill", 8: "Beach", 9: "Take picture" };

    /* =========================
       RENDER LIST
    ========================= */
    // const renderList = (list) => {
    //     if (!list || list.length === 0) {
    //         return <p className="empty">No data</p>;
    //     }

    //     return (
    //         <div className="list">
    //             {list.map(item => (
    //                 <div key={item.id} className="card" onClick={() => handleNavigate(item.id)}>
    //                     <img src={item.image || "https://placehold.co/300x200"} alt={item.name} />
    //                     <h3>{item.name}</h3>
    //                     <p>{item.address}</p>
    //                     <p>⭐ {item.rating}</p>
    //                 </div>
    //             ))}
    //         </div>
    //     );
    // };
    const renderList = (list) => {
    if (!list || list.length === 0) {
         return null;
    }

    return (
        <div className="list">
            {list.map(item => (
                <div
                    key={item.id}
                    className="card"
                    onClick={() => HandleClick(item.id, item.type)}
                >
                    <img src={item.image || "https://placehold.co/300x200"} />
                    <h3>{item.name}</h3>
                    <p>{item.address}</p>
                    <p>⭐ {item.rating}</p>
                </div>
            ))}
        </div>
    );
};
    return (
        <div className="location-container">
            <Header />

            {/* <div className="search-section">

                <div className="search-bar-trigger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    🔍 {mode ? `Category: ${mode}` : "What are you looking for?"}
                    {mode && (
                        <button onClick={(e) => { e.stopPropagation(); resetSearch(); }}>✕</button>
                    )}
                </div>

                {isMenuOpen && (
                    <div className="search-mode-menu">
                        <button onClick={() => { setMode("name"); setIsMenuOpen(false); }}>Search by Name</button>
                        <button onClick={() => { setMode("accommodation_type"); setIsMenuOpen(false); }}>Hotel Types</button>
                        <button onClick={() => { setMode("food_type"); setIsMenuOpen(false); }}>Food Types</button>
                        <button onClick={() => { setMode("travel_style"); setIsMenuOpen(false); }}>Travel Styles</button>
                    </div>
                )}

                <div className="search-control-area">

                    {mode === "name" && (
                        <input
                            className="search-input-field"
                            autoFocus
                            type="text"
                            placeholder="Type a location name..."
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch({ name: nameInput });
                                }
                            }}
                        />
                    )}

                    {mode && mode !== "name" && (
                        <div className="options-grid">
                            {Object.entries(
                                mode === "accommodation_type" ? accommodationOptions :
                                mode === "food_type" ? foodOptions : travelOptions
                            ).map(([k, v]) => (
                                <button
                                    key={k}
                                    onClick={() => handleSearch({ [mode]: Number(k) })}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    )}

                </div>
            </div>

            {loading && <p>Searching...</p>} */}
<div className="search-section">

    {/* SEARCH BAR */}
    <div className="search-bar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="search-icon">🔍</span>

        <span className="search-text">
            {mode ? `Search by ${mode.replace("_", " ")}` : "What are you looking for?"}
        </span>

        {mode && (
            <button
                className="clear-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    resetSearch();
                }}
            >
                ✕
            </button>
        )}
    </div>

    {/* DROPDOWN MENU */}
    {isMenuOpen && (
        <div className="search-dropdown">
            <button onClick={() => { setMode("name"); setIsMenuOpen(false); }}>
                Search by Name
            </button>

            <button onClick={() => { setMode("accommodation_type"); setIsMenuOpen(false); }}>
                Hotel Types
            </button>

            <button onClick={() => { setMode("food_type"); setIsMenuOpen(false); }}>
                Food Types
            </button>

            <button onClick={() => { setMode("travel_style"); setIsMenuOpen(false); }}>
                Travel Styles
            </button>
        </div>
    )}

    {/* CONTROL AREA */}
    <div className="search-control">

        {/* INPUT NAME */}
        {mode === "name" && (
            <input
                className="search-input"
                autoFocus
                type="text"
                placeholder="Type a location name and press Enter..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSearch({ name: nameInput });
                    }
                }}
            />
        )}

        {/* OPTIONS BUTTON */}
        {mode && mode !== "name" && (
            <div className="options-grid">
                {Object.entries(
                    mode === "accommodation_type"
                        ? accommodationOptions
                        : mode === "food_type"
                        ? foodOptions
                        : travelOptions
                ).map(([k, v]) => (
                    <button
                        key={k}
                        className="option-chip"
                        onClick={() => handleSearch({ [mode]: Number(k) })}
                    >
                        {v}
                    </button>
                ))}
            </div>
        )}

    </div>
</div>

{/* LOADING */}
{loading && <div className="loading">Searching...</div>}
            <div className="results-section">
                <h2>Hotels</h2>
                {renderList(groupedData.Hotels)}

                <h2>Restaurants</h2>
                {renderList(groupedData.Restaurants)}

                <h2>Attractions</h2>
                {renderList(groupedData.Attractions)}
            </div>
        </div>
    );
}

export default LocationComponent;