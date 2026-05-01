
import RolePage from '../Components/RoleModel.jsx';
import { Outlet } from 'react-router-dom';

//User
import UserLayout from '../Layouts/UserLayout.jsx'
import HomePage from '../Components/Home.jsx'
import UserLogin from '../Components/UserLogin.jsx'
import UserProfile from '../../pages/User/UserProfile.jsx';

//Function chính
import MyTripInput from '../Components/MyTrip.jsx';
import MyTripOutput from '../Components/Output.jsx';
import HistoryComponent from '../Components/History.jsx';

//Location
import LocationComponent from '../Components/Location.jsx';
import LocationDetail from '../../pages/User/LocationDetail.jsx';
import CommentPage from '../../pages/User/Comment.jsx';


//Partner
import PartnerLayout from '../Layouts/PartnerLayout.jsx'
import PartnerProfile from '../Components/PartnerProfile.jsx';
import PartnerLogin from '../Components/PartnerLogin.jsx';
import DashBoard from '../../pages/Partner/dashBoard.jsx';
import PartnerMenu from '../../pages/Partner/Menu.jsx';
import PartnerDetail from '../../pages/Partner/PartnerDetail.jsx';

export const Public_Layout = [
  { 
    path: '/', 
    element: <UserLayout />,
    children: [
      { path: "", element: <HomePage /> }, // ✅ trang chủ

      { path: "role", element: <RolePage /> }, // 🔥 chọn role

      { path: "users", element: <UserLogin /> },
      { path: "profile", element: <UserProfile /> },

      { path: "my-trip", element: <MyTripInput /> },
      { path: "my-trip/output", element: <MyTripOutput /> },
      { path: "history", element: <HistoryComponent /> },

      { path: "places", element: <LocationComponent /> },
      { path: "places/:id", element: <LocationDetail /> },
      { path: "/places/:id/comments", element: <CommentPage /> },
      
     
    ] 
  },
];

export const Private_Layout = [
  {
    path: "/partner",
    element: <PartnerLayout />,
    children: [
      { path: "login", element: <PartnerLogin /> }, // ✅ THÊM
      { path: "dashboard", element: <DashBoard /> },
      { path: "detail", element: <PartnerDetail /> },
      // { path: "menu", element: <PartnerMenu /> },
      // { path: "room", element: {} },
      // { path: "discount", element: {} },
      { path: "profile", element: <PartnerProfile /> },
      // { path: "comment", element: {} },
    ],
  },
];