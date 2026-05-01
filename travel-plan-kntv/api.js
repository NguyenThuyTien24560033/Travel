const BASE_URL = '/travel/';
let isRefreshing = false;
let refreshPromise = null;


export const authorizedFetch = async (endpoint, options = {}) => {
    let accessToken = localStorage.getItem('access_token');

    // Cấu hình mặc định: đính kèm Token và cho phép dùng Cookie
    const defaultHeaders = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
    };

    options.headers = { ...defaultHeaders, ...options.headers };
    options.credentials = 'include'; // Quan trọng để gửi/nhận Cookie

    console.log(`${BASE_URL}${endpoint}`, options);
    let response = await fetch(`${BASE_URL}${endpoint}`, options);

    // KIỂM TRA: Nếu lỗi 401 (Access Token hết hạn)
    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;

            refreshPromise = fetch(`${BASE_URL}api/token/refresh/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json();
            })
            .then(data => {
                localStorage.setItem('access_token', data.access);
                return data.access;
            })
            .finally(() => {
                isRefreshing = false;
            });
        }

        try {
            const newAccessToken = await refreshPromise;

            options.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return fetch(`${BASE_URL}${endpoint}`, options);
        } catch (err) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
    }

    return response;
};