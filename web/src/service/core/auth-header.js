export default function authHeader() {
    // 获取token
    let user = JSON.parse(localStorage.getItem('user'));
    let lang = localStorage.getItem('lang');
    const headers = {};
    headers.headers = {};
    headers.headers.lang = lang;
    if (user && user.token) {
        headers.headers['token'] = user.token;
    }
    return headers;
}
