export default function (response) {
    if (response.code === 200) {
    } else if (
        response.code === 400 ||
        response.code === 401 ||
        response.code === 402 ||
        response.code === 403) {
        localStorage.removeItem('user');
        // 登出
        window.toLogin();
    }
    return response;
}
