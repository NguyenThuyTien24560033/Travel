// CẤP 1: Chỉ import 2 Layout chính

//User
import UserLayout from '../Layouts/UserLayout.jsx'
import HomePage from '../Components/Home.jsx'
import UserLogin from '../Components/UserLogin.jsx'
import UserProfile from '../../pages/User/UserProfile.jsx';

//Partner
// import PartnerLayout from '../Layouts/PartnerLayout.jsx'
// import Dashboard from './pages/dashBoard/dashBoard.jsx'

export const Public_Layout = [
    { 
        path: '/', 
        element: <UserLayout />, // Layout bọc ngoài
        children: [
            { path: "", element: <HomePage /> }, // Trang chủ hiện ở chỗ <Outlet />
            // { path: "locations", element: <Locations /> },
             { path: "users", element: <UserLogin /> },
             { path: "profile", element: <UserProfile /> },
        ] 
    },
];

export const Private_Layout = [
    // Sau này làm Partner thì mở ra
    /*
    { 
        path: '/partner', 
        element: <PartnerLayout />, 
        children: [
            { path: "dashboard", element: <Dashboard /> },
        ] 
    },
    */
];