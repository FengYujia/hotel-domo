import axios from 'axios';
import formatter from './core/formatter';
import paramsFormatter from './core/params-formatter';
import headers from './core/auth-header';

export default {
    login: async function (commit = {}) {
        const resp = await axios.post('/api/manager/login', commit);
        return formatter(resp.data);
    },
    my: async function (commit = {}) {
        const resp = await axios.get('/api/manager/my', commit, headers());
        return formatter(resp.data);
    },
    reservationList: async function (commit = {}) {
        const query = paramsFormatter(commit);
        const resp = await axios.get('/api/manager/reservationList?' + query, headers());
        return formatter(resp.data);
    },
    updateReservation: async function (commit = {}) {
        const resp = await axios.post('/api/manager/updateReservation', commit, headers());
        return formatter(resp.data);
    },
    guestList: async function (commit = {}) {
        const query = paramsFormatter(commit);
        const resp = await axios.get('/api/manager/guestList?' + query, headers());
        return formatter(resp.data);
    }
};
