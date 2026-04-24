import './App.css'; // Import CSS thuần
import { Route, Routes } from 'react-router-dom'
import { Public_Layout, Private_Layout } from './assets/Routes'

function App() {
    return (
        /* Sửa từ {style.app} thành "app" */
        <div className="app"> 
            <div className="body">
                <Routes>
                    {/* Render mảng Public cho User */}
                    {Public_Layout.map((layout, index) => (
                        <Route key={index} path={layout.path} element={layout.element}>
                            {layout.children.map((child, idx) => (
                                <Route key={idx} path={child.path} element={child.element} />
                            ))}
                        </Route>
                    ))}

                    {/* Render mảng Private cho Partner */}
                    {Private_Layout.map((layout, index) => (
                        <Route key={index} path={layout.path} element={layout.element}>
                            {layout.children.map((child, idx) => (
                                <Route key={idx} path={child.path} element={child.element} />
                            ))}
                        </Route>
                    ))}
                </Routes>
            </div>
        </div>
    )
}

export default App;