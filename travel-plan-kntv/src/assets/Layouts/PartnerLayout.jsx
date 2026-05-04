import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api.js'
import PartnerSidebar from "../Components/PartnerSiderBar.jsx";

/* =========================================================
   PHẦN 1: CONTEXT (global user state)
========================================================= */

const PartnerContext = createContext();
export const usePartner = () => useContext(PartnerContext);

/* =========================================================
   PHẦN 2: API LAYER (CHỈ SỬA MODE)
========================================================= */

// const MODE = "JSON_SERVER"; 
// const JSON_API = "http://localhost:3001/users";

//Đình Khang đổi đường dẫn tại đây
const MODE = "REAL_BACKEND"; 
const REAL_API = {
    login: "http://localhost:8000/travel/api/login/",
    register: "http://localhost:8000/travel/users/",
    getUser: "users/", // Đổi để khớp với authorizedFetch (tự cộng BASE_URL)
    getLocation: "places/my-place/",
    logout: "api/logout/",
};


const api = {
    // 🔹 LOGIN
    login: async (email, password) => {
        try {
            const res = await fetch(REAL_API.login, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) return { success: false };

            const data = await res.json();

            return {
                success: true,
                user: data.user,
                token: data.access,
            };
        } catch (err) {
            console.error(err);
        }
    },

    // 🔹 REGISTER
    register: async (payload) => {
        try {
            const res = await fetch(REAL_API.register, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            return { success: res.ok };
        } catch (err) {
            console.error(err);
        }
    },

    // 🔹 LOGOUT
    logout: async () => {
        try {
            await authorizedFetch(REAL_API.logout, {
                method: "POST",
                credentials: 'include'
            });
        } catch (err) {
            console.error(err);
        }
        localStorage.clear();
    },

    // 🔹 GET LOCATION
    getLocation: async () => {
        try {
            const res = await authorizedFetch(REAL_API.getLocation, {
                method: "GET",
            });

            if (res.ok) {
                const data = await res.json();
                return data;
            }
        } catch (err) {
            console.error(err);
        }
    },
};

/* =========================================================
   PHẦN 4: LAYOUT
========================================================= */

function PartnerLayout() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [location, setLocation] = useState(null);     
    const [loading, setLoading] = useState(true);

    /* 🔹 First operation */
    useEffect(() => {
        const start = async () => {
            const savedToken = localStorage.getItem("access_token");
            const savedUser = JSON.parse(localStorage.getItem("user"));

            if (!savedToken || !savedUser) {
                setLoading(false);
                return;
            }

            const loc = await api.getLocation();
            setLocation(loc);

            setLoading(false);
        };

        start();
    }, []);

    /* 🔹 LOGIN */
    const login = async (email, password) => {
        setLoading(true);

        try {
            const result = await api.login(email, password);

            if (!result.success) return null;

            localStorage.setItem("access_token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setUser(result.user);

            const data = await api.getLocation();
            console.log("Dữ liệu địa điểm của tôi: ", data);
            setLocation(data);

            return result.user;
        } finally {
            setLoading(false);
        }
    };

    /* 🔹 LOGOUT */
    const logout = async () => {
        await api.logout();
        navigate("/"); // ✅ về homepage
    };

    /* 🔹 CONTEXT */
    const value = {
        user,
        location,
        setLocation,
        loading,
        login,
        logout,
    };

    /* 🔹 UI */
    if (loading) return <div>Loading...</div>;

    return (
        <PartnerContext.Provider value={value}>
        <div className="partner-layout" style={{ display: "flex", minHeight: "100vh" }}>

            {/* SIDEBAR */}
            <PartnerSidebar onLogout={logout} />

            {/* CONTENT */}
            {/* <div className="content">
            <Outlet />
            </div> */}
            <main style={{ flex: 1, padding: "20px", backgroundColor: "#fff" }}>
            <Outlet />
        </main>

        </div>
        </PartnerContext.Provider>
    );
}

export default PartnerLayout;




// 🔹 LOGIN
// login: async (email, password) => {
        // if (MODE === "JSON_SERVER") {
        //     const res = await fetch(`${JSON_API}?email=${email}&password=${password}`);
        //     const data = await res.json();

        //     if (data.length > 0) {
        //         return {
        //         success: true,
        //         user: data[0],
        //         token: "fake-token-" + data[0].id,
        //         };
        //     }
        //     return { success: false };
        // }

// 🔹 REGISTER
// register: async (payload) => {
//         if (MODE === "JSON_SERVER") {
//         const check = await fetch(`${JSON_API}?email=${payload.email}`);
//         const existing = await check.json();

//         if (existing.length > 0) {
//             return { success: false, message: "Email already exists" };
//         }

//         const res = await fetch(JSON_API, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ ...payload, role: "user" }),
//         });

//         return { success: res.ok };
//         }

// 🔹 GET LOCATION
// getLocation: async () => {
//         if (MODE === "JSON_SERVER") {
//         const user = JSON.parse(localStorage.getItem("user"));
//         return user?.places?.[0] || null;
//         }

// 🔹 GET USER
    // getUser: async () => {
    //   if (MODE === "JSON_SERVER") {
    //     return JSON.parse(localStorage.getItem("user"));
    //   }

    //   const res = await authorizedFetch(REAL_API.getUser);
    //   if (!res.ok) return null;
    //   return res.json();
    // },

// // ✅ lấy data từ JSON SERVER
//       setLocation(savedUser?.places?.[0] || null);
//       setDiscounts(savedUser?.discounts || []);