import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api.js'
import { Navigate } from "react-router-dom";
import PartnerSidebar from "../Components/PartnerSiderBar.jsx";

/* =========================================================
   PHẦN 1: CONTEXT (global user state)
========================================================= */

const PartnerContext = createContext();
export const usePartner = () => useContext(PartnerContext);

/* =========================================================
   PHẦN 2: API LAYER (CHỈ SỬA MODE)
========================================================= */

const MODE = "JSON_SERVER"; 
// Đình Khang đổi comment khi chạy backend thật
// const MODE = "REAL_BACKEND"; 

const JSON_API = "http://localhost:3001/users";

//Đình Khang đổi đường dẫn tại đây
const REAL_API = {
  login: "http://localhost:8000/travel/api/login/",
  register: "http://localhost:8000/travel/users/",
  getUser: "users/", // Đổi để khớp với authorizedFetch (tự cộng BASE_URL)
  getLocation: "places/my-place/",
  logout: "api/logout/",
};

const api = {
  // -----------------------------------------------------------------------------
  // ---------------------------------Hàm login-----------------------------------
  // -----------------------------------------------------------------------------
  login: async (email, password) => {
    if (MODE === "JSON_SERVER") {
      const res = await fetch(`${JSON_API}?email=${email}&password=${password}`);
      const data = await res.json();

      if (data.length > 0) {
        return {
          success: true,
          user: data[0],
          token: "fake-token-" + data[0].id,
        };
      }
      return { success: false };
    }

    const res = await fetch(REAL_API.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return { success: false };

    const data = await res.json();
    console.log(data.user, data.access);

    // BƯỚC QUAN TRỌNG: Lưu token vào localStorage TRƯỚC 
    // để authorizedFetch có token sử dụng ngay lập tức
    localStorage.setItem("access_token", data.access);

    // Gọi hàm getLocation ngay tại đây
    // Dùng await để đảm bảo lấy xong data mới hoàn tất login
    await this.getLocation();

    return {
      success: true,
      user: data.user,
      token: data.access,
    };
  },



  // -----------------------------------------------------------------------------
  // -------------------------------Hàm đăng kí-----------------------------------
  // -----------------------------------------------------------------------------
  register: async (payload) => {
    if (MODE === "JSON_SERVER") {
      const check = await fetch(`${JSON_API}?email=${payload.email}`);
      const existing = await check.json();

      if (existing.length > 0) {
        return { success: false, message: "Email already exists" };
      }

      const res = await fetch(JSON_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, role: "user" }),
      });

      return { success: res.ok };
    }

    const res = await fetch(REAL_API.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return { success: res.ok };
  },



  // -----------------------------------------------------------------------------
  // ---------------------------------Hàm logout----------------------------------
  // -----------------------------------------------------------------------------
  logout: async () => {
    if (MODE === "REAL_BACKEND") {
      try {
        await authorizedFetch(REAL_API.logout, { 
            method: "POST",
            credentials: 'include' // CỰC KỲ QUAN TRỌNG
        });
      } catch (err) {
        console.error("Logout API error:", err);
      }
    }
    localStorage.clear();
  },



  // -----------------------------------------------------------------------------
  // -----------------------------Hàm lấy location--------------------------------
  // -----------------------------------------------------------------------------
  getLocation: async () => {
    if (MODE === "REAL_BACKEND") {
        try {
        const response = await authorizedFetch(REAL_API.getLocation, {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.json();
            
            // Lưu object vào localStorage
            localStorage.setItem("user_location", JSON.stringify(data));
            
            console.log("Location saved:", data);
            return data; 
        } else {
            console.error("Lấy Location thất bại, status:", response.status);
        }
        } catch (err) {
        console.error("Lỗi kết nối API getLocation:", err);
        }
    }
  },




getUser: async () => {
    if (MODE === "JSON_SERVER") {
      return JSON.parse(localStorage.getItem("user"));
    }

    const res = await authorizedFetch(REAL_API.getUser);
    if (!res.ok) return null;
    return res.json();
  },
};

/* =========================================================
   PHẦN 3: USER LAYOUT (TRUNG TÂM DATA)
========================================================= */

function PartnerLayout() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user khi app start
//   useEffect(() => {
//     const init = async () => {
//       // const savedToken = localStorage.getItem("token");
//       const savedToken = localStorage.getItem("access_token");

//       if (!savedToken) {
//         setLoading(false);
//         return;
//       }

//       setToken(savedToken);

//       // const userData = await api.getUser(savedToken);
//       const userData = await api.getUser();

//       if (userData) {
//         setUser(userData);
//       }

//       setLoading(false);
//     };

//     init();
//   }, []);
useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access_token");
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!token || !savedUser) {
        setLoading(false);
        return;
      }

      // ✅ restore ngay
      setUser(savedUser);

      // ✅ fetch thêm data
      const locationData = await api.getLocation();
      setLocation(locationData);

      setLoading(false);
    };

    init();
  }, []);

  // 🔹 LOGIN
//   const login = async (email, password) => {
//     setLoading(true);

//     try {
//       const result = await api.login(email, password);

//       if (!result.success) {
//         toast.error("Login failed");
//         return false;
//       }

//       // localStorage.setItem("token", result.token);
//       // localStorage.setItem("user", JSON.stringify(result.user));
//       localStorage.setItem("access_token", result.token);
//       localStorage.setItem("user", JSON.stringify(result.user));

//       setUser(result.user);
//       setToken(result.token);

//       toast.success("Login success");
//       return true;
//     } catch (err) {
//       toast.error("Server error");
//       return false;
//     } finally {
//       setLoading(false);
//     }
//   };

      const login = async (email, password) => {
    setLoading(true);

    try {
      const result = await api.login(email, password);

      if (!result.success) return null; // ❌ CHANGED (thay vì false)

      localStorage.setItem("access_token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setUser(result.user);
      setToken(result.token);

      return result.user; // ✅ CHANGED (QUAN TRỌNG)
    } finally {
      setLoading(false);
    }
  };

  // 🔹 REGISTER
  const register = async (payload) => {
    setLoading(true);

    try {
      const result = await api.register(payload);

      if (!result.success) {
        toast.error(result.message || "Register failed");
        return false;
      }

      toast.success("Register success");
      return true;
    } catch {
      toast.error("Server error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 LOGOUT
  // const logout = () => {
  //   localStorage.clear();
  //   setUser(null);
  //   setToken(null);
  //   toast.success("Logged out");
  // };
  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    token,
    setUser,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

// if (loading) return <div>Loading...</div>;

//   if (!user || user.role !== "partner") {
//     return <Navigate to="/users" replace />;
//   }

//   // ✅ RETURN CUỐI
//   return (
//     <PartnerContext.Provider value={value}>
//       <Outlet />
//     </PartnerContext.Provider>
//   );
return (
  <PartnerContext.Provider value={value}>
    <div className="partner-layout">

      {/* SIDEBAR */}
      <PartnerSidebar onLogout={logout} />

      {/*  CONTENT */}
      <div className="content">
        <Outlet />
      </div>

    </div>
  </PartnerContext.Provider>
);
}
export default PartnerLayout;