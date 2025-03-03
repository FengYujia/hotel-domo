export default function authHeader(commit) {
    return Object.entries(Object.assign({}, commit))
        . map(([key, value]) => `${key}=${value}`)
        . join('&');
}
