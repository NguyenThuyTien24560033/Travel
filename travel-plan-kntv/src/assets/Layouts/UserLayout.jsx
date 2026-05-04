import { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "sonner";
import { authorizedFetch } from '../../../api.js'

/* =========================================================
   PHẦN 1: CONTEXT (global user state)
========================================================= */

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

/* =========================================================
   PHẦN 2: API LAYER (CHỈ SỬA MODE)
========================================================= */


// const MODE = "JSON_SERVER"; 
// const JSON_API = "http://localhost:3001/users";


// Đình Khang đổi comment khi chạy backend thật
const MODE = "REAL_BACKEND";
const REAL_API = {
  login: "http://localhost:8000/travel/api/login/",
  register: "http://localhost:8000/travel/users/",
  // getUser: "http://localhost:8000/travel/users",
  // logout: "http://localhost:8000/travel/api/logout/",
  getUser: "users/", // Đổi để khớp với authorizedFetch (tự cộng BASE_URL)
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
      credentials: 'include',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) return { success: false };

    const data = await res.json();
    console.log(data.user, data.access);
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
//  logout: async () => {
//     if (MODE === "REAL_BACKEND") {
//       try {
//         await authorizedFetch(REAL_API.logout, { method: "POST" });
//       } catch (err) {
//         console.error("Logout API error:", err);
//       }
//     }
//     localStorage.clear();
//   },

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




//   getUser: async (token) => {
//     if (MODE === "JSON_SERVER") {
//       const user = JSON.parse(localStorage.getItem("user"));
//       return user;
//     }

//     const res = await fetch(REAL_API.getUser, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) return null;
//     return res.json();
//   },
// };

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

function UserLayout() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Load user khi app start
  useEffect(() => {
    const init = async () => {
      // const savedToken = localStorage.getItem("token");
      const savedToken = localStorage.getItem("access_token");

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      // const userData = await api.getUser(savedToken);
      const userData = await api.getUser();

      if (userData) {
        setUser(userData);
      }

      setLoading(false);
    };

    init();
  }, []);

  // 🔹 LOGIN
  // const login = async (email, password) => {
  //   setLoading(true);

  //   try {
  //     const result = await api.login(email, password);

  //     if (!result.success) {
  //       toast.error("Login failed");
  //       return false;
  //     }

  //     // localStorage.setItem("token", result.token);
  //     // localStorage.setItem("user", JSON.stringify(result.user));
  //     localStorage.setItem("access_token", result.token);
  //     localStorage.setItem("user", JSON.stringify(result.user));

  //     setUser(result.user);
  //     setToken(result.token);

  //     toast.success("Login success");
  //     return true;
  //   } catch (err) {
  //     toast.error("Server error");
  //     return false;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Trong UserLayout.jsx
const login = async (email, password) => {
  setLoading(true);
  try {
    const result = await api.login(email, password);
    if (!result.success) {
      toast.error("Login failed");
      return null; // Trả về null thay vì false
    }

    localStorage.setItem("access_token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    setUser(result.user);
    setToken(result.token);

    toast.success("Login success");
    return result.user; // Trả về object user để UserLogin sử dụng
  } catch (err) {
    toast.error("Server error");
    return null;
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

  return (
    <UserContext.Provider value={value}>
      {loading ? <div>Loading...</div> : <Outlet />}
    </UserContext.Provider>
  );
}

export default UserLayout;