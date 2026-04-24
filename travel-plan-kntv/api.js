const BASE_URL = 'http://localhost:8000/travel/';

export const authorizedFetch = async (endpoint, options = {}) => {
    let accessToken = localStorage.getItem('access_token');

    // Cấu hình mặc định: đính kèm Token và cho phép dùng Cookie
    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    options.headers = { ...defaultHeaders, ...options.headers };
    options.credentials = 'include'; // Quan trọng để gửi/nhận Cookie

    let response = await fetch(`${BASE_URL}${endpoint}`, options);

    // KIỂM TRA: Nếu lỗi 401 (Access Token hết hạn)
    if (response.status === 401) {
        console.log("Access token hết hạn, đang thử refresh...");

        // Gọi API refresh (Không cần gửi body vì Django đọc từ Cookie)
        const refreshRes = await fetch(`${BASE_URL}api/token/refresh/`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccessToken = data.access;

            // Lưu access token mới
            localStorage.setItem('access_token', newAccessToken);

            // Cập nhật lại header và THỰC THI LẠI request ban đầu
            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(`${BASE_URL}${endpoint}`, options);
        } else {
            // Nếu refresh cũng hỏng (hết hạn đăng nhập) -> Logout
            console.error("Refresh token cũng hết hạn. Vui lòng đăng nhập lại.");
            localStorage.removeItem('access_token');
            window.location.href = '/login'; 
        }
    }

    return response;
};