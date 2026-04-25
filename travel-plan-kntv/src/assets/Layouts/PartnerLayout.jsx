import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
// import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api.js'
// import { Navigate } from "react-router-dom";
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
// Đình Khang đổi comment khi chạy backend thật
const MODE = "REAL_BACKEND"; 

// const JSON_API = "http://localhost:3001/users";

//Đình Khang đổi đường dẫn tại đây
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
    localStorage.setItem("access_token", data.access);

    await this.getLocation();

    return {
      success: true,
      user: data.user,
      token: data.access,
    };
  },

  // 🔹 REGISTER
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

  // 🔹 LOGOUT
  logout: async () => {
    if (MODE === "REAL_BACKEND") {
      try {
        await authorizedFetch(REAL_API.logout, {
          method: "POST",
          credentials: 'include'
        });
      } catch (err) {
        console.error(err);
      }
    }
    localStorage.clear();
  },

  // 🔹 GET LOCATION
  getLocation: async () => {
    if (MODE === "JSON_SERVER") {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.locations?.[0] || null;
    }

    try {
      const res = await authorizedFetch(REAL_API.getLocation);

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {
      console.error(err);
    }
  },

  // 🔹 GET USER
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
   PHẦN 4: LAYOUT
========================================================= */

function PartnerLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState(null);      // ✅ FIX
  const [discounts, setDiscounts] = useState([]);      // ✅ FIX
  const [loading, setLoading] = useState(true);

  /* 🔹 INIT */
  useEffect(() => {
    const init = async () => {
      const savedToken = localStorage.getItem("access_token");
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (!savedToken || !savedUser) {
        setLoading(false);
        return;
      }

      setUser(savedUser);
      setToken(savedToken);

      // ✅ lấy data từ JSON SERVER
      setLocation(savedUser?.locations?.[0] || null);
      setDiscounts(savedUser?.discounts || []);

      // backend thì gọi API
      if (MODE === "REAL_BACKEND") {
        const loc = await api.getLocation();
        setLocation(loc);
      }

      setLoading(false);
    };

    init();
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
      setToken(result.token);

      // ✅ SET NGAY
      setLocation(result.user?.locations?.[0] || null);
      setDiscounts(result.user?.discounts || []);

      return result.user;
    } finally {
      setLoading(false);
    }
  };

  /* 🔹 LOGOUT */
  const logout = async () => {
    await api.logout();
    setUser(null);
    setToken(null);
    navigate("/"); // ✅ về homepage
  };

  /* 🔹 CONTEXT */
  const value = {
    user,
    token,
    location,   // ✅
    discounts,  // ✅
    setUser,
    loading,
    isAuthenticated: !!user,
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