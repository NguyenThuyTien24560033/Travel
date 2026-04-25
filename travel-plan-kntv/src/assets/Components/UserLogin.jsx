// import { useState } from "react";
// import { useUser } from '../Layouts/UserLayout.jsx'
// import { useNavigate } from "react-router-dom";

// const UserLogin = () => {
//   const { login, register, loading } = useUser();
//   const navigate = useNavigate();

//   const [isLogin, setIsLogin] = useState(true);

//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // 🔹 VALIDATE
//   const validate = () => {
//     if (!email.includes("@")) {
//       alert("Email không hợp lệ");
//       return false;
//     }

//     if (password.length < 6) {
//       alert("Password phải >= 6 ký tự");
//       return false;
//     }

//     if (!isLogin && username.trim().length < 3) {
//       alert("Username phải >= 3 ký tự");
//       return false;
//     }

//     return true;
//   };

//   // 🔹 SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validate()) return;

//     if (isLogin) {
//       const success = await login(email, password);

//       if (success) {
//         navigate("/");
//       }
//     } else {
//       const success = await register({
//         email,
//         username: username.trim(),
//         password,
//       });

//       if (success) {
//         alert("Đăng ký thành công!");
//         setIsLogin(true);

//         // reset form
//         setUsername("");
//         setEmail("");
//         setPassword("");
//       }
//     }
//   };


//   return (
//     <div className="login-container">
//       <h2>{isLogin ? "Login" : "Register"}</h2>

//       <form onSubmit={handleSubmit}>
//         {/* USERNAME (chỉ khi register) */}
//         {!isLogin && (
//           <input
//             type="text"
//             placeholder="Username"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//         )}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Processing..." : isLogin ? "Login" : "Register"}
//         </button>
//       </form>

//       <p>
//         {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
//         <span
//           style={{ color: "blue", cursor: "pointer", marginLeft: 5 }}
//           onClick={() => setIsLogin(!isLogin)}
//         >
//           {isLogin ? "Đăng ký" : "Đăng nhập"}
//         </span>
//       </p>
//     </div>
//   );
// };

// export default UserLogin;

import { useState } from "react";
import { useUser } from "../Layouts/UserLayout.jsx";
import { useNavigate } from "react-router-dom";

const UserLogin = () => {
  const { login, register, loading, user } = useUser();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔹 VALIDATE
  const validate = () => {
    if (!email.includes("@")) {
      alert("Email không hợp lệ");
      return false;
    }

    if (password.length < 6) {
      alert("Password phải >= 6 ký tự");
      return false;
    }

    if (!isLogin && username.trim().length < 3) {
      alert("Username phải >= 3 ký tự");
      return false;
    }

    return true;
  };

  // 🔹 SUBMIT
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     // LOGIN
//     if (isLogin) {
//       const success = await login(email, password);

//       if (success) {
//         // đợi user từ context update
//         setTimeout(() => {
//           const role = user?.role;

//           if (role === "partner") {
//             navigate("/partner");
//           } else {
//             navigate("/");
//           }
//         }, 100);
//       }

//       return;
//     }

//     // REGISTER
//     const success = await register({
//       email,
//       username: username.trim(),
//       password,
//     });

//     if (success) {
//       alert("Đăng ký thành công!");
//       setIsLogin(true);

//       setUsername("");
//       setEmail("");
//       setPassword("");
//     }
//   };

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validate()) return;

//   if (isLogin) {
//     // Gọi login từ UserLayout context
//     const loggedInUser = await login(email, password); 

//     if (loggedInUser) {
//       // Kiểm tra role trả về từ Backend/Json-server
//       if (loggedInUser.role === "partner") {
//         navigate("/partner"); // Khớp với path trong Private_Layout
//       } else {
//         navigate("/"); // Về trang chủ user
//       }
//     } else {
//       alert("Đăng nhập thất bại!");
//     }
//   }
// };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  if (isLogin) {
    const loggedUser = await login(email, password); // Bây giờ nó trả về object user

    if (loggedUser) {
      if (loggedUser.role === "partner") {
        navigate("/partner"); // Chuyển sang route của partner
      } else {
        navigate("/"); 
      }
    }
  }
};
  return (
    <div className="login-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p>
        {isLogin ? "Chưa có tài khoản?" : "Đã có tài khoản?"}
        <span
          style={{ color: "blue", cursor: "pointer", marginLeft: 5 }}
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Đăng ký" : "Đăng nhập"}
        </span>
      </p>
    </div>
  );
};

export default UserLogin;