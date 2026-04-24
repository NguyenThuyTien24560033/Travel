// CẤP 1: Chỉ import 2 Layout chính
import UserLayout from '../Layouts/UserLayout.jsx'
import PartnerLayout from '../Layouts/PartnerLayout.jsx'

/**
 * Mảng Public_Layout dành cho User
 * Hiện tại chỉ để 1 trang mặc định để test khung
 */
export const Public_Layout = [
    {
        path: '/',
        element: <UserLayout />, 
        children: [
            // Sau này bạn sẽ thêm Home, Location... vào đây
            { path: '/', element: <div>Trang chủ User (Cấp 2)</div> },
        ]
    },
    {
        path: '/users',
        element: <div>Trang Login User (Không Layout)</div>
    }
];

/**
 * Mảng Private_Layout dành cho Partner
 */
export const Private_Layout = [
    {
        path: '/partner',
        element: <PartnerLayout />,
        children: [
            // Sau này bạn sẽ thêm Dashboard, Menu... vào đây
            { index: true, element: <div>Dashboard Partner (Cấp 2)</div> },
        ]
    },
    {
        path: '/partner/login',
        element: <div>Trang Login Partner (Không Layout)</div>
    }
];