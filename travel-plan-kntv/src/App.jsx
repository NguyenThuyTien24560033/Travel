// import './App.css'; // Import CSS thuần
// import { Route, Routes } from 'react-router-dom'
// import { Public_Layout, Private_Layout } from '../src/assets/Routes/routes.jsx'

// function App() {
//     return (
//         /* Sửa từ {style.app} thành "app" */
//         <div className="app"> 
//             <div className="body">
//                 <Routes>
//                     {/* Render mảng Public cho User */}
//                     {Public_Layout.map((layout, index) => (
//                         <Route key={index} path={layout.path} element={layout.element}>
//                             {layout.children.map((child, idx) => (
//                                 <Route key={idx} path={child.path} element={child.element} />
//                             ))}
//                         </Route>
//                     ))}

//                     {/* Render mảng Private cho Partner */}
//                     {Private_Layout.map((layout, index) => (
//                         <Route key={index} path={layout.path} element={layout.element}>
//                             {layout.children.map((child, idx) => (
//                                 <Route key={idx} path={child.path} element={child.element} />
//                             ))}
//                         </Route>
//                     ))}
//                 </Routes>
//             </div>
//         </div>
//     )
// }

// export default App;


import './App.css'; 
import { Route, Routes } from 'react-router-dom';
// Lưu ý: Tớ chỉnh lại đường dẫn cho gọn, cậu kiểm tra lại xem có đúng vị trí file không nhé
import { Public_Layout, Private_Layout } from './assets/Routes/routes.jsx';

function App() {
    return (
        <div className="app"> 
            <div className="body">
                <Routes>
                    {/* 1. Render các Route dành cho người dùng (Public) */}
                    {Public_Layout?.map((layout, index) => (
                        <Route key={`public-${index}`} path={layout.path} element={layout.element}>
                            {/* Dấu ?. giúp tránh lỗi nếu một Layout không có children */}
                            {layout.children?.map((child, idx) => (
                                <Route 
                                    key={`public-child-${idx}`} 
                                    path={child.path} 
                                    element={child.element} 
                                />
                            ))}
                        </Route>
                    ))}

                    {/* 2. Render các Route dành cho đối tác (Private) */}
                    {Private_Layout?.map((layout, index) => (
                        <Route key={`private-${index}`} path={layout.path} element={layout.element}>
                            {/* Tương tự, kiểm tra an toàn cho mảng children */}
                            {layout.children?.map((child, idx) => (
                                <Route 
                                    key={`private-child-${idx}`} 
                                    path={child.path} 
                                    element={child.element} 
                                />
                            ))}
                        </Route>
                    ))}
                </Routes>
            </div>
        </div>
    );
}

export default App;