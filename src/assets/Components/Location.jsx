import { useEffect, useState, useRef } from "react";
import { authorizedFetch } from '../../../api'
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import './Location.css'
import Header from "./Header";

const MODE = "JSON_SERVER"; 
const JSON_API = "http://localhost:3001/places";

// const MODE = "REAL_BACKEND"
const REAL_API = {
    getLocations: "places/browse/",
    getHotel: "places/hotels/",
    getRestaurant: "places/restaurants/",
    getAttraction: "places/attractions/",
};

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
                const url = queryString ? `${REAL_API.getLocations}?${queryString}` : REAL_API.getLocations;

                const response = await authorizedFetch(url, { method: "GET" });
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
                let endpoint = "";
                switch (type) {
                    case 1: endpoint = REAL_API.getHotel; break;
                    case 2: endpoint = REAL_API.getRestaurant; break;
                    case 3: endpoint = REAL_API.getAttraction; break;
                    default:
                        console.error("Loại địa điểm (type) không hợp lệ:", type);
                        return;
                }
                const url = `${endpoint}${id}/`;
                const response = await authorizedFetch(url, { method: "GET" }); 

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

// --- COMPONENT HOA SEN ĐỂ DECOR CHỐNG TRỐNG TRẢI ---
const Lotus = ({ flip = false, scale = 1 }) => (
  <svg width={80*scale} height={70*scale} viewBox="0 0 80 70"
    style={{ transform: flip ? "scaleX(-1)" : undefined, display: "block" }}>
    <path d="M40 65 Q38 50 36 42" fill="none" stroke="#27ae60" strokeWidth="2"/>
    <path d="M40 65 Q42 50 44 42" fill="none" stroke="#27ae60" strokeWidth="2"/>
    <ellipse cx="25" cy="55" rx="14" ry="8" fill="#27ae60" opacity="0.7" transform="rotate(-25 25 55)"/>
    <ellipse cx="55" cy="55" rx="14" ry="8" fill="#27ae60" opacity="0.7" transform="rotate(25 55 55)"/>
    {[0,45,90,135,180,225,270,315].map((deg, i) => {
      const rad = deg * Math.PI / 180;
      return <ellipse key={i}
        cx={40 + 10*Math.sin(rad)} cy={38 - 10*Math.cos(rad)}
        rx="7" ry="14"
        fill={i < 4 ? "#f06292" : "#f48fb1"} opacity="0.88"
        transform={`rotate(${deg} ${40+10*Math.sin(rad)} ${38-10*Math.cos(rad)})`}/>;
    })}
    <circle cx="40" cy="38" r="7" fill="#ffd54f"/>
    <circle cx="40" cy="38" r="4" fill="#ffb300"/>
  </svg>
);


function LocationComponent() {
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationDataOriginal, setLocationDataOriginal] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mode, setMode] = useState(null);
    const [nameInput, setNameInput] = useState("");

    const navigate = useNavigate();
    const hasLoaded = useRef(false); 

    const scrollRefHotels = useRef(null);
    const scrollRefRestaurants = useRef(null);
    const scrollRefAttractions = useRef(null);

    const scroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === "left" ? -320 : 320;
            ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };
    // ---------------------------------------------

    useEffect(() => {
        if (hasLoaded.current) return; 
        hasLoaded.current = true;      
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            let data = await api.getLocations();

            if (MODE === "REAL_BACKEND") {
                data = [
                    ...(data.Hotels || []).map(i => ({ ...i, type: 1 })),
                    ...(data.Restaurants || []).map(i => ({ ...i, type: 2 })),
                    ...(data.Attractions || []).map(i => ({ ...i, type: 3 })),
                ];
            }

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

    const getAverageRating = (item) => {
        const reviews = item.comments || item.reviews || [];
        if (item.rating !== undefined && item.rating !== null) {
            return item.rating;
        }
        if (!reviews || reviews.length === 0) return 4.5;
        return (
            reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1);
    };

    const handleSearch = async (input = {}) => {
        setLoading(true);
        try {
            if (MODE === "REAL_BACKEND") {
                let data = await api.getLocations(input);
                data = [
                    ...(data.Hotels || []).map(i => ({ ...i, type: 1 })),
                    ...(data.Restaurants || []).map(i => ({ ...i, type: 2 })),
                    ...(data.Attractions || []).map(i => ({ ...i, type: 3 })),
                ];
                setLocationData(data);
            } else {
                let result = [...locationDataOriginal];
                const normalize = (str) => str?.toLowerCase().replaceAll(" ", "");

                if (input.name && input.name.trim() !== "") {
                    const keyword = normalize(input.name);
                    result = result.filter(item => item._name.includes(keyword));
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

    const resetSearch = () => {
        setMode(null);
        setIsMenuOpen(false);
        setNameInput("");
        setLocationData(locationDataOriginal);
    };

    const handleClick = (id, type) => {
        navigate(`/places/${id}`, {
            state: { id, type, from: "library" }
        });
    };

    const groupedData = {
        Hotels: locationData.filter(item => item.type === 1),
        Restaurants: locationData.filter(item => item.type === 2),
        Attractions: locationData.filter(item => item.type === 3),
    };

    const accommodationOptions = { 1: "Hotel", 2: "Motel", 3: "Homestay", 4: "Resort", 5: "Villa" };
    const foodOptions = { 1: "Meat", 2: "Seafood", 3: "Vegetarian", 4: "Family-style", 5: "Set meals", 6: "Hotpot" };
    const travelOptions = { 1: "Relax", 2: "Adventure", 3: "Food tour", 4: "Cultural", 5: "Playground", 6: "History", 7: "Thrill", 8: "Beach", 9: "Take picture" };
    
    const renderList = (list, title, ref) => {
        if (!list || list.length === 0) return null;

        return (
            <div className="location-section">
                <h2 className="section-title">{title}</h2>
                <div className="carousel-wrapper">
                    <button className="carousel-btn left" onClick={() => scroll(ref, "left")}>
                        &#10094;
                    </button>

                    <div className="carousel-track" ref={ref}>
                        {list.map(item => (
                            <div
                                key={item.id}
                                className="location-card"
                                onClick={() => handleClick(item.id, item.type)}
                            >
                                <div className="card-img-wrapper">
                                    <div className="rate-badge">⭐ {getAverageRating(item)}</div>
                                    <img src={item.image || "https://images.unsplash.com/photo-1542314831-c6a4d2706316?w=500&q=80"} alt={item.name} loading="lazy" />
                                </div>
                                <div className="card-info">
                                    <h3 className="card-name" title={item.name}>{item.name}</h3>
                                    <p className="card-place">📍 {item.address || "Đang cập nhật"}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn right" onClick={() => scroll(ref, "right")}>
                        &#10095;
                    </button>
                </div>
            </div>
        );
    };

    return (
    <>
        <Header />
        
        <div className="locations-container">
            <div className="location-hero-header">
                <div className="title-area">
                    <h1 className="page-main-title">Khám Phá Điểm Đến</h1>
                    <p className="page-subtitle">Tìm kiếm và lọc các khách sạn, nhà hàng, địa danh một cách dễ dàng.</p>
                </div>
            </div>
          
            {/* --- SEARCH SECTION (GỌI HỒN CSS) --- */}
            <div className="search-section"> 
                
                <div className="search-bar" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <span className="search-icon">🔍</span>
                    <span className="search-text">
                        {mode ? `Search by ${mode.replace("_", " ")}` : "Bạn đang tìm kiếm gì?"}
                    </span>
                    {mode && (
                        <button className="clear-btn" onClick={(e) => { e.stopPropagation(); resetSearch(); }}>✕</button>
                    )}
                </div>

                {isMenuOpen && (
                    <div className="search-dropdown">
                        <button onClick={() => { setMode("name"); setIsMenuOpen(false); }}>Search by Name</button>
                        <button onClick={() => { setMode("accommodation_type"); setIsMenuOpen(false); }}>Hotel Types</button>
                        <button onClick={() => { setMode("food_type"); setIsMenuOpen(false); }}>Food Types</button>
                        <button onClick={() => { setMode("travel_style"); setIsMenuOpen(false); }}>Travel Styles</button>
                    </div>
                )}

                <div className="search-control">
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

                    {mode && mode !== "name" && (
                        <div className="options-grid">
                            {Object.entries(
                                mode === "accommodation_type" ? accommodationOptions
                                : mode === "food_type" ? foodOptions : travelOptions
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

            {/* --- LIST KẾT QUẢ --- */}
            <div className="results-section">
                {renderList(groupedData.Hotels, "Hotels", scrollRefHotels)}
                {renderList(groupedData.Restaurants, "Restaurants", scrollRefRestaurants)}
                {renderList(groupedData.Attractions, "Attractions", scrollRefAttractions)}
            </div>
            
        </div>
    </>  
    );
}

export default LocationComponent;